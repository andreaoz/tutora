from django.contrib import admin
from .models import Teacher, Student, Tutoring, Reservation

class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id','name','last_name','email', 'avatar')

class TutoringAdmin(admin.ModelAdmin):
    list_display = ('id','course','tutoring_date', 'tutoring_time', 'classroom','semester','teacher_name','max_students')

    def teacher_name(self,obj):
        return f"{obj.teacher.name} {obj.teacher.last_name}"
    teacher_name.short_description = 'Teacher'

class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'reservation_date', 'tutoring_id', 'course','tutoring_date','teacher_name','student_name','present')

    def course(self,obj):
        return f"{obj.tutoring.course}"
    course.short_description = "Course"

    def tutoring_id(self,obj):
        return f"{obj.tutoring.id}"
    tutoring_id.short_description = "Tutoring id"

    def tutoring_date(self,obj):
        return f"{obj.tutoring.tutoring_date}"
    tutoring_date.short_description = "Tutoring Date"

    def teacher_name(self,obj):
        return f"{obj.teacher.name} {obj.teacher.last_name}"
    teacher_name.short_description = 'Teacher'

    def student_name(self,obj):
        return f"{obj.student.name} {obj.student.last_name}"
    student_name.short_description = 'Student'

class StudentAdmin(admin.ModelAdmin):
    list_display = ('id','name','last_name','semester','group','email')


admin.site.register(Teacher,TeacherAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Tutoring, TutoringAdmin)
admin.site.register(Reservation, ReservationAdmin)


