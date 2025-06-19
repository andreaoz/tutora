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
    path(route='past_tutorings', view=views.past_tutorings, name='past_tutorings'),
    path('attendance_list/<int:tutoring_id>', views.attendance_list, name='attendance_list'),
    path(route='cancel_reservation', view=views.cancel_reservation, name='cancel_reservation'),
    path(route='student_list', view=views.student_list, name='student_list'),
    path(route='tutoring_calendar', view=views.tutoring_calendar, name='tutoring_calendar'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
