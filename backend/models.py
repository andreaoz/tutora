from django.db import models
from django.contrib.auth.hashers import make_password

class Teacher(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100)
    password = models.CharField(max_length=128)

    def save(self, *args, **kwargs):
    # Solo encripta si la contraseña no está ya encriptada
        if not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.id)

class Student(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    semester = models.CharField(max_length=2)
    group = models.CharField(max_length=2)
    email = models.EmailField(max_length=100)

    def __str__(self):
        return str(self.id)

class Tutoring(models.Model):
    id = models.AutoField(primary_key=True)
    course = models.CharField(max_length=100)
    tutoring_date = models.DateField()
    classroom = models.CharField(max_length=20)
    semester = models.CharField(max_length=2)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE,related_name='tutorings')

    def __str__(self):
        return str(self.id)
    
class Reservation(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE,related_name='reservations')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE,related_name='reservations')
    tutoring = models.ForeignKey(Tutoring, on_delete=models.CASCADE,related_name='reservations')
    reservation_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return str(self.id)
