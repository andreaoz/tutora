"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from . import views



urlpatterns = [
    path('admin/', admin.site.urls),
    path('',views.home,name="home"),
    path('login/', views.teacher_login, name='login'),
    path('signup/', views.teacher_signup, name='signup'),
    path('logout/', views.teacher_logout, name='logout'),
    path('tutoringsteacher/', views.tutoring_list_teacher, name='tutoringsteacher'),
    path('tutoringsstudent/', views.tutoring_list_student, name='tutoringsstudent'),
    path('newtutoring/', views.new_tutoring, name='newtutoring'),
    path('tutoringreservation/<int:tutoring_id>/', views.tutoring_reservation, name='tutoringreservation'),
    path('reservationconfirmation/<int:reservation_id>/', views.reservation_confirmation, name='reservationconfirmation'),


]
