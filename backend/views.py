from django.shortcuts import render,redirect,get_object_or_404
import datetime
from django.utils.timezone import now
from django.utils import timezone
from django.db.models import Count
from .models import *
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import never_cache
import json

current_tz = timezone.get_current_timezone()
print(current_tz)

#TEACHERS VIEWS

@csrf_exempt
def teacher_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            teacher = Teacher.objects.get(email=email)
            user = teacher.user

            # Autenticar con username (email)
            user = authenticate(request, username=user.username, password=password)

            if user is not None:
                login(request, user)  # Django maneja la sesión
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False, 'error': 'Wrong password.'}, status=400)

        except Teacher.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Unregistered email.'}, status=404)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

@never_cache
@login_required
def teacher_logout(request):
    logout(request)
    data = {"userName": ""}  # Return empty username
    return JsonResponse(data)

@login_required
def dashboard(request):
    print("Usuario loggeado:", request.user)
    print("ID del usuario:", request.user.id)

    today = datetime.date.today()
    teacher = Teacher.objects.get(user=request.user)

    tutorings_today = Tutoring.objects.filter(tutoring_date=today,teacher=teacher)
    tutorings_future = Tutoring.objects.filter(tutoring_date__gt=today,teacher=teacher)

    data = {
            'teacher': {
                'id': teacher.id,
                'name': teacher.name,  
                'last_name' : teacher.last_name,
                'profile_pic': teacher.profile_image.url if teacher.profile_image else None,
            },
            'tutorings_today': [
                {
                    'id': t.id,
                    'course': t.course,
                    'date' : t.tutoring_date.strftime('%d/%m/%Y'),
                    'time': t.tutoring_time.strftime('%H:%M'),
                    'classroom' : t.classroom,
                    'semester' : t.semester,
                    'students' : t.current_students_count,
                    'spots' : t.spots_left,
                }
                for t in tutorings_today
            ],
            'tutorings_future': [
                {
                    'id': t.id,
                    'course': t.course,
                    'date' : t.tutoring_date.strftime('%d/%m/%Y'),
                    'time': t.tutoring_time.strftime('%H:%M'),
                    'classroom' : t.classroom,
                    'semester' : t.semester,
                    'students' : t.current_students_count,
                    'spots' : t.spots_left,
                }
                for t in tutorings_future
            ]
        }
    
    return JsonResponse(data)

@login_required
def past_tutorings(request):

    today = datetime.date.today()
    #teacher = Teacher.objects.get(user=request.user)
    past_tutorings = Tutoring.objects.filter(tutoring_date__lt=today).order_by('-tutoring_date')

    data = {
        'past_tutorings':[
            {
                'id' : t.id,
                'course': t.course,
                'teacher': {
                    'name': t.teacher.name,
                    'last_name': t.teacher.last_name
                },
                'date' : t.tutoring_date.strftime('%d/%m/%Y'),
                'time' : t.tutoring_time.strftime('%H:%M'),
                'classroom' : t.classroom,
                'semester' : t.semester,
                'students' : t.current_students_count,
            }
            for t in past_tutorings
        ]
    }

    print("Number of tutorings:", past_tutorings.count)
    return JsonResponse(data)

@csrf_exempt
@login_required
def add_tutoring(request):
    # Find user first
    print("Usuario loggeado:", request.user)
    print("ID del usuario:", request.user.id)
    print("¿Está autenticado?", request.user.is_authenticated)
    
    try:
        teacher = Teacher.objects.get(user=request.user)
        print("¡Maestro encontrado manualmente!", teacher)

    except Teacher.DoesNotExist:
        teacher = None
        print("Error: El usuario loggeado no tiene un objeto Teacher asociado.")
        return JsonResponse({'success': False, 'error': 'No teacher found.'}, status=400)

    if request.method == 'POST':
        try: 
            data = json.loads(request.body)

            course = data.get('course')
            tutoring_date = data.get('tutoring_date')
            tutoring_time = data.get('tutoring_time')
            classroom = data.get('classroom')
            semester = data.get('semester')
            max_students = int(data['max_students'])

            #saves new tutoring
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
                return JsonResponse({'success': True, 'message': 'Tutoring added successfully.'})
            
            else:
                return JsonResponse({'success': False, 'error': 'Complete all data to add tutoring.'}, status=400)

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500) 

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def teacher_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            name = data.get('name')
            last_name = data.get('last_name')
            email = data.get('email')
            password = data.get('password')
            school_password = data.get('school_password')  # contraseña secreta

            if school_password != settings.SCHOOL_PASSWORD:
                return JsonResponse({'success': False, 'error': 'Invalid school password.'}, status=400)

            # Verifica que el correo no esté ya registrado
            if User.objects.filter(username=email).exists():
                return JsonResponse({'success': False, 'error': 'Email already registered.'}, status=400)

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
            return JsonResponse({'success': True, 'message': 'Account created successfully.'})

        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
        
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@login_required
def attendance_list(request, tutoring_id):
    tutoring = get_object_or_404(Tutoring, id=tutoring_id)
    reservations = Reservation.objects.filter(tutoring=tutoring).select_related('student')
    teacher = Teacher.objects.get(user=request.user)

    data = {
        'tutoring_reservations':[
            {   
                'attendance': r.present,
                'student': {
                    'name' : r.student.name,
                    'last_name': r.student.last_name,
                    'group': r.student.group,
                    'semester' : r.student.semester,
                    'email' : r.student.email
                },
                'tutoring' : {
                    'course' : r.tutoring.course,
                    'teacher' : {
                        'name' : r.teacher.name,
                        'last_name' : r.teacher.last_name
                    },
                    'tutoring_date' : r.tutoring.tutoring_date,
                    'tutoring_time' : r.tutoring.tutoring_time.strftime('%H:%M')
                },
            }
            for r in reservations
        ]
    }

    return JsonResponse(data)

@login_required
def student_list(request):

    today = datetime.date.today()
    past_reservations = Reservation.objects.filter(tutoring__tutoring_date__lt=today).order_by('-tutoring__tutoring_date')

    data = {
        'past_reservations':[
            {
                'id' : r.id,
                'student' : {
                    'name': r.student.name,
                    'last_name': r.student.last_name
                },
                'tutoring' : {
                    'course': r.tutoring.course,
                    'teacher': {
                        'name': r.teacher.name,
                        'last_name': r.teacher.last_name,
                    },
                    'tutoring_date' : r.tutoring.tutoring_date.strftime('%d/%m/%Y'),
                    'tutoring_time' : r.tutoring.tutoring_time.strftime('%H:%M'),
                    'classroom' : r.tutoring.classroom,
                    'semester' : r.tutoring.semester,
                },

            }
            for r in past_reservations
        ]
    }

    print("Number of tutorings:", past_reservations.count())
    return JsonResponse(data)


# STUDENTS VIEWS

def tutoring_calendar(request):
    print("Usuario loggeado:", request.user)
    today = datetime.date.today()
    print("Today: ", today)
    
    # Función para obtener solo días laborales (lunes a viernes)
    def get_weekdays_range(start_date, days=7):
        weekdays = []
        current_date = start_date
        while len(weekdays) < days:
            # 0=lunes, 1=martes, ..., 6=domingo
            if current_date.weekday() < 5:  # Solo lunes a viernes (0-4)
                weekdays.append(current_date)
            current_date += datetime.timedelta(days=1)
        
        return weekdays
  
    
    # Obtener los próximos 7 días laborales
    weekdays = get_weekdays_range(today, 7)
    next_week_end = weekdays[-1] if weekdays else today
    
    # Filtrar asesorías solo para días laborales
    tutorings_queryset = Tutoring.objects.filter(
        tutoring_date__gte=today,
        tutoring_date__lte=next_week_end,
        tutoring_date__week_day__in=[2, 3, 4, 5, 6]  # Lunes=2, Viernes=6 en Django
    ).order_by('tutoring_date', 'tutoring_time')
    
    
    def serialize_tutoring(tutoring):
        return {
            'id': tutoring.id,
            'course': tutoring.course,
            'tutoring_date': tutoring.tutoring_date.isoformat(),
            'tutoring_time': tutoring.tutoring_time.strftime('%H:%M'),
            'classroom': tutoring.classroom,
            'semester': tutoring.semester,
            'max_students': tutoring.max_students,
            'teacher': {
                'id': tutoring.teacher.id,
                'name': tutoring.teacher.name,
                'last_name': tutoring.teacher.last_name,
                'email': tutoring.teacher.email,
            }
        }
    
    # Organizar asesorías por fecha
    tutorings_by_date = {}
    for tutoring in tutorings_queryset:
        date_key = tutoring.tutoring_date.isoformat()
        
        if date_key not in tutorings_by_date:
            tutorings_by_date[date_key] = []
        tutorings_by_date[date_key].append(serialize_tutoring(tutoring))
    
    data = {
        'weekdays': [date.isoformat() for date in weekdays],
        'tutorings_by_date': tutorings_by_date,
    }
    
    return JsonResponse(data, safe=False)

@csrf_exempt
def tutoring_reservation(request, tutoring_id):
    tutoring = get_object_or_404(Tutoring, id=tutoring_id)

    if request.method == 'GET':
        # Devolver los detalles de la tutoría
        return JsonResponse({
            "id": tutoring.id,
            "course": tutoring.course,
            "teacher": {
                "name": tutoring.teacher.name,
                "last_name": tutoring.teacher.last_name
            },
            "tutoring_date": tutoring.tutoring_date, # Asegúrate de que este campo exista o ajusta el nombre
            "tutoring_time": tutoring.tutoring_time, # Asegúrate de que este campo exista o ajusta el nombre
            "classroom": tutoring.classroom, # Asegúrate de que este campo exista o ajusta el nombre
            "spots_left": tutoring.spots_left
        })
    
    if tutoring.spots_left <= 0:
        return JsonResponse({"error": "No spots left in this tutoring."}, status=400)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            name = data.get('name')
            last_name = data.get('last_name')
            semester = data.get('semester')
            group = data.get('group')
            email = data.get('email')

            if not all([name, last_name, semester, group, email]):
                return JsonResponse({"error": "Missing fields."}, status=400)
            
            # saves new student 
            student, created = Student.objects.get_or_create(
                email=email,
                defaults={
                    'name': name,
                    'last_name': last_name,
                    'semester': semester,
                    'group': group
                }
            )

            # saves new reservation
            reservation = Reservation.objects.create(
                student=student,
                teacher=tutoring.teacher,
                tutoring=tutoring
            )

            return JsonResponse({
                "message": "Reservation successful",
                "reservation_id": reservation.id,
                "student": {
                    "name": student.name,
                    "last_name": student.last_name,
                    "email": student.email
                },
                "tutoring": {
                    "id": tutoring.id,
                    "course": tutoring.course,
                    "teacher": tutoring.teacher.name
                }
            }, status=201)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON format."}, status=400)
        

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

@csrf_exempt
def cancel_reservation(request):
    if request.method == 'GET':
        reservation_id = request.GET.get('reservation_id')
        if reservation_id:
            try:
                reservation = Reservation.objects.select_related('student', 'tutoring', 'teacher').get(id=reservation_id)
                return JsonResponse({
                    'reservation': {
                        'id': reservation.id,
                        'student': f'{reservation.student.name} {reservation.student.last_name}',
                        'course': reservation.tutoring.course,
                        'teacher': str(reservation.teacher),
                        'classroom': reservation.tutoring.classroom,
                        'reservation_date': str(reservation.reservation_date),
                        'tutoring_time': str(reservation.tutoring.tutoring_time),
                    }
                })
            except Reservation.DoesNotExist:
                return JsonResponse({'error': 'Reservation not found.'}, status=404)
        else:
            return JsonResponse({'error': 'Missing reservation_id'}, status=400)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        if 'confirm_cancel' in data:
            reservation_id = data['confirm_cancel']
            try:
                reservation = Reservation.objects.get(id=reservation_id)
                reservation.delete()
                return JsonResponse({'success': f'Reservation #{reservation_id} has been cancelled.'})
            except Reservation.DoesNotExist:
                return JsonResponse({'error': 'Reservation no longer exists or was already cancelled.'}, status=404)

    return JsonResponse({'error': 'Unsupported method'}, status=405)

