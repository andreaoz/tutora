from django.contrib import admin
from .models import Teacher, Student, Tutoring, Reservation

class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id','name','last_name','email')

class TutoringAdmin(admin.ModelAdmin):
    list_display = ('id','course','tutoring_date','classroom','semester','teacher_name')

    def teacher_name(self,obj):
        return f"{obj.teacher.name} {obj.teacher.last_name}"
    teacher_name.short_description = 'Teacher'

admin.site.register(Teacher,TeacherAdmin)
admin.site.register(Student)
admin.site.register(Tutoring, TutoringAdmin)
admin.site.register(Reservation)


