from django.shortcuts import render,redirect,get_object_or_404
import datetime
from django.utils.timezone import now
from django.utils import timezone
from django.db.models import Count
from .models import *
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.conf import settings
from django.contrib.auth.hashers import make_password

current_tz = timezone.get_current_timezone()
print(current_tz)

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
    today = datetime.date.today()
    teacher = Teacher.objects.get(user=request.user)

    tutorings_today = Tutoring.objects.filter(tutoring_date=today,teacher=teacher)
    tutorings_future = Tutoring.objects.filter(tutoring_date__gt=today,teacher=teacher)

    return render(request, 'tutoring_list_teacher.html', {
        'teacher': teacher,
        'tutorings_today': tutorings_today,
        'tutorings_future': tutorings_future,
        })

@login_required
def tutoring_past_teacher(request):
    today = datetime.date.today()
    teacher = Teacher.objects.get(user=request.user)
    tutorings_past = Tutoring.objects.filter(teacher=teacher, tutoring_date__lt=today).order_by('-tutoring_date')

    return render(request, 'tutoring_past_teacher.html', {
        'tutorings_past': tutorings_past,
        'teacher': teacher,
    })

@login_required
def new_tutoring(request):
    print("Usuario loggeado:", request.user)
    print("ID del usuario:", request.user.id)
    print("¿Está autenticado?", request.user.is_authenticated)

    # Obtener el maestro al inicio
    try:
        teacher = Teacher.objects.get(user=request.user)
        print("¡Maestro encontrado manualmente!", teacher)
    except Teacher.DoesNotExist:
        teacher = None
        print("Error: El usuario loggeado no tiene un objeto Teacher asociado.")
        messages.error(request, "Tu cuenta no está asociada a un perfil de profesor.")
        return render(request, 'new_tutoring.html')

    if request.method == 'POST':
        course = request.POST.get('course')
        tutoring_date = request.POST.get('tutoring_date')
        tutoring_time = request.POST.get('tutoring_time')
        classroom = request.POST.get('classroom')
        semester = request.POST.get('semester')
        max_students = int(request.POST['max_students'])


        if all([course, tutoring_date, tutoring_time, classroom, semester, max_students]) and teacher:
            Tutoring.objects.create(
                course=course,
                tutoring_date=tutoring_date,
                tutoring_time=tutoring_time,
                classroom=classroom,
                semester=semester,
                max_students=max_students,
                teacher=teacher
            )
            print("¡Tutoring guardado exitosamente!")
            #messages.success(request, "Tutoring created successfully.")
            return redirect('tutoringsteacher')
        else:
            print("Error: Faltan datos o el profesor no está asociado.")
            messages.error(request, "Por favor, completa todos los campos para crear la asesoría.")

    # Aquí teacher siempre está definido (o se ha hecho un return antes)
    return render(request, 'new_tutoring.html', {'teacher': teacher})

def student_options(request):
    return render(request,"student_options.html")

def tutoring_list_student(request):
    print("Usuario loggeado:", request.user)
    today = datetime.date.today()
    next_week = today + datetime.timedelta(days=7)

    tutorings_today = Tutoring.objects.filter(tutoring_date=today)
    tutorings_future = Tutoring.objects.filter(tutoring_date__gt=today, tutoring_date__lte=next_week)
    
    #teacher = Teacher.objects.all()
    return render(request, 'tutoring_list_student.html', {
        'tutorings_today': tutorings_today,
        'tutorings_future': tutorings_future,
        })

def tutoring_reservation(request, tutoring_id):
    tutoring = get_object_or_404(Tutoring, id=tutoring_id)

    if tutoring.spots_left <= 0:
        messages.error(request, "Sorry, no spots left in this tutoring.")
        return redirect('tutoringsstudent')

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

def cancel_reservation(request):
    context = {}

    if request.method == 'POST':
        if 'reservation_id' in request.POST:
            reservation_id = request.POST.get('reservation_id')
            try:
                reservation = Reservation.objects.get(id=reservation_id)
                context['reservation'] = reservation
            except Reservation.DoesNotExist:
                context['error'] = "Reservación no encontrada."

        elif 'confirm_cancel' in request.POST:
            reservation_id = request.POST.get('confirm_cancel')
            try:
                reservation = Reservation.objects.get(id=reservation_id)
                now = timezone.now() #con timezone

                # Combina fecha y hora de la tutoría
                tutoring_datetime = datetime.datetime.combine(
                    reservation.tutoring.tutoring_date,
                    reservation.tutoring.tutoring_time
                )

                # Asegura que esté en el mismo timezone
                tutoring_datetime = timezone.make_aware(tutoring_datetime, timezone.get_current_timezone())
                
                # convertir a aware usando la zona horaria local configurada en Django
                aware_now = timezone.make_aware(datetime.datetime.now(), timezone.get_current_timezone())

                print("Hora actual (timezone.now()):", now)
                print("Hora de la tutoría (tutoring_datetime):", tutoring_datetime)
                print("Diferencia:", tutoring_datetime - now)
                print("Hora local (sin timezone):", aware_now)

                # Verifica si faltan más de 2 horas
                if aware_now > tutoring_datetime:
                    context['error'] = f"No puedes cancelar la reservación #{reservation_id} porque la tutoría ya pasó."
                    context['reservation'] = reservation
                elif tutoring_datetime - aware_now < datetime.timedelta(hours=2):
                    context['error'] = f"No puedes cancelar la reservación #{reservation_id} porque faltan menos de 2 horas para la tutoría."
                    context['reservation'] = reservation
                else:
                    reservation.delete()
                    context['success'] = f"La reservación #{reservation_id} ha sido cancelada exitosamente."
            except Reservation.DoesNotExist:
                context['error'] = "La reservación ya no existe o ya fue cancelada."

    return render(request, 'cancel_form.html', context)

@login_required
def attendance_list(request, tutoring_id):
    tutoring = get_object_or_404(Tutoring, id=tutoring_id)
    reservations = Reservation.objects.filter(tutoring=tutoring).select_related('student')
    teacher = Teacher.objects.get(user=request.user)

    return render(request, 'attendance_list.html', {
        'tutoring': tutoring,
        'reservations': reservations,
        'teacher': teacher,
    })

