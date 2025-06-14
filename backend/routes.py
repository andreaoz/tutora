from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'backend'
urlpatterns = [
    path(route='login', view=views.teacher_login, name='login'),
    path(route='dashboard', view=views.dashboard, name='dashboard'),
    path(route='logout', view=views.teacher_logout, name='logout'),
    path(route='signup', view=views.teacher_signup, name='signup'),
    path(route='add_tutoring', view=views.add_tutoring, name='add_tutoring'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
