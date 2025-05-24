from django.shortcuts import render,redirect
from datetime import date, timedelta
from django.db.models import Count
from .models import *
from django.contrib import messages
from django.contrib.auth.hashers import check_password
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login


def home(request):
    return render(request,"home.html")

def teacher_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            teacher = Teacher.objects.get(email=email)
            user = teacher.user  # accedemos al User vinculado

            # Autenticar con username (que en tu caso parece ser el correo)
            user = authenticate(request, username=user.username, password=password)

            if user is not None:
                login(request, user)  # ahora sí: Django maneja la sesión
                return redirect('tutoringsteacher')
            else:
                messages.error(request, 'Email o contraseña incorrectos')

        except Teacher.DoesNotExist:
            messages.error(request, 'Correo no registrado')

    return render(request, 'teacher_login.html')

@login_required
def tutoring_list_teacher(request):
    print("Usuario loggeado:", request.user)
    print("ID del usuario:", request.user.id)
    tutorings = Tutoring.objects.all()
    return render(request, 'tutoring_list_teacher.html', {'tutorings': tutorings})

@login_required
def new_tutoring(request):
    print("Usuario loggeado:", request.user)
    print("ID del usuario:", request.user.id)
    print("¿Está autenticado?", request.user.is_authenticated)

    if request.method == 'POST':
        course = request.POST.get('course')
        tutoring_date = request.POST.get('tutoring_date')
        classroom = request.POST.get('classroom')
        semester = request.POST.get('semester')
        teacher = None

        # Obtenemos el maestro desde el usuario loggeado
        try:
            #teacher = request.user.teacher_profile  # Asume que User tiene OneToOne con Teacher
            teacher = Teacher.objects.get(user=request.user)
            print("¡Maestro encontrado manualmente!", teacher)
        except AttributeError:
            print("Error: El usuario loggeado no tiene un objeto Teacher asociado.")
            messages.error(request, "Tu cuenta no está asociada a un perfil de profesor.")
            # Solución: Redirigir a una URL, por ejemplo, 'some_error_page' o a la misma página
            return render(request, 'new_tutoring.html') # Reemplaza 'some_error_page' con la URL adecuada

        if all([course, tutoring_date, classroom, semester]) and teacher:
            Tutoring.objects.create(
                course=course,
                tutoring_date=tutoring_date,
                classroom=classroom,
                semester=semester,
                teacher=teacher
            )
            print("¡Tutoring guardado exitosamente!")
            messages.success(request, "Asesoría guardada exitosamente.") # Mensaje de éxito
            return redirect('tutoringsteacher')
        else:
            print("Error: Faltan datos o el profesor no está asociado.") # Para depuración
            messages.error(request, "Por favor, completa todos los campos para crear la asesoría.") # Mensaje de error para el usuario
            return render(request, 'new_tutoring.html') # Renderiza la misma página con el formulario


    return render(request, 'new_tutoring.html')