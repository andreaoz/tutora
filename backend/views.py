from django.shortcuts import render,redirect
from datetime import date, timedelta
from django.db.models import Count
from .models import *
from django.contrib import messages
from django.contrib.auth.hashers import check_password
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User


def home(request):
    return render(request,"home.html")

def teacher_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            teacher = Teacher.objects.get(email=email)
            if check_password(password, teacher.password):
                # Guardar sesión (opcional)
                request.session['teacher_id'] = teacher.id
                return redirect('tutoringsteacher')  # Cambia esto a donde quieras redirigir
            else:
                messages.error(request, 'Wrong password')
        except Teacher.DoesNotExist:
            messages.error(request, 'Wrong email')

    return render(request, 'teacher_login.html')

@login_required
def tutoring_list_teacher(request):
    tutorings = Tutoring.objects.all()
    return render(request, 'tutoring_list_teacher.html', {'tutorings': tutorings})

from django.shortcuts import render, redirect
from django.contrib import messages # Asegúrate de importar messages

@login_required
def new_tutoring(request):
    if request.method == 'POST':
        course = request.POST.get('course')
        tutoring_date = request.POST.get('tutoring_date')
        classroom = request.POST.get('classroom')
        semester = request.POST.get('semester')
        teacher = None

        # Obtenemos el maestro desde el usuario loggeado
        try:
            teacher = request.user.teacher  # Asume que User tiene OneToOne con Teacher
        except Teacher.DoesNotExist:
            print("Error: El usuario loggeado no tiene un objeto Teacher asociado.")
            messages.error(request, "Tu cuenta no está asociada a un perfil de profesor.")
            # Solución: Redirigir a una URL, por ejemplo, 'some_error_page' o a la misma página
            return redirect(request, 'new_tutoring.html') # Reemplaza 'some_error_page' con la URL adecuada

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