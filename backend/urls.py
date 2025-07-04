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
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),

    #Using routes
    path('backend/', include('backend.routes')),
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),

    #path('tutoringsstudent/', views.tutoring_list_student, name='tutoringsstudent'),
    #path('tutoringreservation/<int:tutoring_id>/', views.tutoring_reservation, name='tutoringreservation'),
    path('reservationconfirmation/<str:reservation_id>/', views.reservation_confirmation, name='reservationconfirmation'),
    #path('cancel_reservation/', views.cancel_reservation, name='cancel_reservation'),
    
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
