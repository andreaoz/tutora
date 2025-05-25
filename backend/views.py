from django.shortcuts import render,redirect,get_object_or_404
from datetime import date, timedelta
from django.db.models import Count
from .models import *
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.conf import settings
from django.contrib.auth.hashers import make_password

def home(request):
    return render(request,"home.html")

def teacher_login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            teacher = Teacher.objects.get(email=email)
            user = teacher.user  # accedemos al User vinculado

            # Autenticar con username (email)
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
def teacher_logout(request):
    request.session.flush()
    return redirect('login')

@login_required
def tutoring_list_teacher(request):
    print("Usuario loggeado:", request.user)
    print("ID del usuario:", request.user.id)
    teacher = Teacher.objects.get(user=request.user)
    tutorings = Tutoring.objects.filter(teacher=teacher)

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

        try:
            teacher = Teacher.objects.get(user=request.user)
            print("¡Maestro encontrado manualmente!", teacher)

        except AttributeError:
            print("Error: El usuario loggeado no tiene un objeto Teacher asociado.")
            messages.error(request, "Tu cuenta no está asociada a un perfil de profesor.")
            return render(request, 'new_tutoring.html') 

        if all([course, tutoring_date, classroom, semester]) and teacher:
            Tutoring.objects.create(
                course=course,
                tutoring_date=tutoring_date,
                classroom=classroom,
                semester=semester,
                teacher=teacher
            )
            print("¡Tutoring guardado exitosamente!")
            #messages.success(request, "Asesoría guardada exitosamente.") # Mensaje de éxito
            return redirect('tutoringsteacher')
        else:
            print("Error: Faltan datos o el profesor no está asociado.") # Para depuración
            messages.error(request, "Por favor, completa todos los campos para crear la asesoría.") # Mensaje de error para el usuario
            return render(request, 'new_tutoring.html') # Renderiza la misma página con el formulario


    return render(request, 'new_tutoring.html')

def tutoring_list_student(request):
    print("Usuario loggeado:", request.user)
    tutorings = Tutoring.objects.all()
    return render(request, 'tutoring_list_student.html', {'tutorings': tutorings})

def tutoring_reservation(request, tutoring_id):
    tutoring = get_object_or_404(Tutoring, id=tutoring_id)

    if request.method == 'POST':
        name = request.POST.get('name')
        last_name = request.POST.get('last_name')
        semester = request.POST.get('semester')
        group = request.POST.get('group')
        email = request.POST.get('email')

        # Puedes evitar duplicados buscando por email (o nombre+grupo si lo prefieres)
        student, created = Student.objects.get_or_create(
            email=email,
            defaults={
                'name': name,
                'last_name': last_name,
                'semester': semester,
                'group': group
            }
        )

        # Crear la reserva
        reservation = Reservation.objects.create(
            student=student,
            teacher=tutoring.teacher,
            tutoring=tutoring
        )


        #messages.success(request, '¡Reserva realizada con éxito!')
        return redirect('reservationconfirmation',reservation_id=reservation.id)  # o donde quieras llevar al alumno

    return render(request, 'student_registration.html', {'tutoring': tutoring})

def reservation_confirmation(request, reservation_id):
    reservation = get_object_or_404(Reservation, id=reservation_id)
    tutoring = reservation.tutoring
    student = reservation.student
    teacher = reservation.teacher

    return render(request, 'reservation_confirmation.html', {
        'reservation': reservation,
        'tutoring': tutoring,
        'student': student,
        'teacher': teacher,
    })

def teacher_signup(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        password = request.POST.get('password')
        school_password = request.POST.get('school_password')  # contraseña secreta

        if school_password != settings.SCHOOL_PASSWORD:
            messages.error(request, 'Invalid school password.')
            return render(request, 'teacher_signup.html')

        # Verifica que el correo no esté ya registrado
        if User.objects.filter(username=email).exists():
            messages.error(request, 'Email already registered.')
            return render(request, 'teacher_signup.html')
        
        # Crear el usuario Django
        user = User.objects.create_user(
            username=email,
            password=password,
        )

        # Guarda el nuevo maestro
        Teacher.objects.create(
            user=user,
            name=name,
            last_name=last_name,
            email=email,
            password=make_password(password)
        )
        messages.success(request, 'Account created successfully. Please log in.')
        return redirect('login')

    return render(request, 'teacher_signup.html')