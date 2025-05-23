from django.shortcuts import render,redirect
from datetime import date, timedelta
from django.db.models import Count
from .models import *
from django.contrib import messages
from django.contrib.auth.hashers import check_password


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
                return redirect('login')  # Cambia esto a donde quieras redirigir
            else:
                messages.error(request, 'Wrong password')
        except Teacher.DoesNotExist:
            messages.error(request, 'Wrong email')

    return render(request, 'teacher_login.html')