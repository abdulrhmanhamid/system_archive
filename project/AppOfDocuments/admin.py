from django.contrib import admin

# Register your models here.

from .models import Employee


from .models import GraduationProjects

@admin.register(GraduationProjects)
class GraduationProjectsAdmin(admin.ModelAdmin):
    list_display = ('project_id', 'project_name', 'students_count', 'supervisor_name', 'delivery_date', 'employee')
    list_filter = ('delivery_date', 'employee')
    search_fields = ('project_name', 'supervisor_name', 'group_names')
    ordering = ('project_id',)


#  ربط جدول الوارد مع واجهة admin 
from django.contrib import admin
from .models import Import

class ImportAdmin(admin.ModelAdmin):
    # الحقول التي تظهر في قائمة الوارد
    list_display = ('document_title', 'sender', 'import_date', 'employee', 'date_time')
    
    # إضافة حقل البحث (يمكن البحث بناءً على هذه الحقول)
    search_fields = ('document_title', 'sender', 'employee__name', 'notes')
    
    # فلترة النتائج حسب التاريخ أو المرسل
    list_filter = ('import_date', 'sender', 'employee')
    
    # تقسيم نموذج الإضافة/التعديل إلى أقسام
    fieldsets = (
        (None, {
            'fields': ('document_title', 'sender', 'import_date', 'employee')
        }),
        ('تفاصيل إضافية', {
            'fields': ('notes', 'import_image'),
            'classes': ('collapse',)  # يجعل القسم قابل للطي
        }),
    )
    
    # التاريخ والوقت (auto_now_add) لا يجب أن يكون قابل للتعديل
    readonly_fields = ('date_time',)

# تسجيل النموذج مع التخصيص

    # الحقول التي تريد عرضها في قائمة الوارد
    # list_display = ('document_title', 'employee', 'sender', 'import_date', 'date_time')
    
    # إضافة فلتر للبحث
    # search_fields = ('document_title', 'sender', 'employee__name')  # إذا كان لديك حقل name في نموذج Employee
    
    # فلتر حسب التاريخ
    # list_filter = ('import_date', 'date_time')
    
    # تقسيم النموذج إلى أقسام في صفحة التعديل
    fieldsets = (
        (None, {
            'fields': ('document_title', 'employee', 'sender')
        }),
        ('التفاصيل الإضافية', {
            'fields': ('import_date', 'notes', 'import_image'),
            'classes': ('collapse',)  # لجعل هذا القسم قابل للطي
        }),
    )

# تسجيل النموذج مع كلاس Admin المخصص
admin.site.register(Import, ImportAdmin)





@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ['id', 'full_name', 'username', 'role', 'mang']








