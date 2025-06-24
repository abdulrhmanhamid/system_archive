from django.db import models

# class Employee(models.Model):
#     full_name = models.CharField(max_length=255)
#     phone_number = models.CharField(max_length=20)
#     username = models.CharField(max_length=100, unique=True)
#     password = models.TextField()
#     role = models.CharField(max_length=50)
#     mang = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, db_column='mang_id')

#     def __str__(self):
#         return self.username
   

class Employee(models.Model):
    class Meta:
        db_table = 'employees'
        managed = False
    id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    username = models.CharField(max_length=100, unique=True)
    password = models.TextField()
    role = models.CharField(max_length=50)
    #manage المدير
    mang = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, db_column='mang_id')

     # خصائص إضافية مطلوبة لـ login
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    def get_username(self):
        return self.username

    def __str__(self):
        return self.username


class Export(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.DO_NOTHING, db_column='employee_id')
    document_title = models.CharField(max_length=255)
    recipient = models.CharField(max_length=255)
    export_date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    export_image = models.BinaryField(blank=True, null=True)
    date_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'exports'
        managed = True

    def __str__(self):
        return self.document_title



class Import(models.Model):
    employee = models.ForeignKey(Employee,  on_delete=models.DO_NOTHING, db_column='employee_id')
    document_title = models.CharField(max_length=255)
    sender = models.CharField(max_length=255)
    import_date = models.DateField()
    notes = models.TextField(null=True, blank=True)
    import_image = models.BinaryField(null=True, blank=True, editable=True)  # أضف editable=True
    date_time = models.DateTimeField(auto_now_add=True)

    class Meta:
      db_table = 'imports'
      managed = False

    def __str__(self):
      return self.document_title
    




class GraduationProjects(models.Model):
    project_id = models.AutoField(primary_key=True)
    students_count = models.IntegerField()
    project_name = models.CharField(max_length=255)
    group_names = models.TextField(blank=True, null=True)
    supervisor_name = models.CharField(max_length=255, blank=True, null=True)
    delivery_date = models.DateField(blank=True, null=True)
    employee = models.ForeignKey(Employee, models.DO_NOTHING, blank=True, null=True)

    class Meta:
     managed = True
     db_table = 'graduation_projects'


# جدول الحافظة
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class clipboard(models.Model):
    employee = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, verbose_name="المستخدم")
    safe_image = models.ImageField(upload_to='clipboard/', blank=True, null=True, verbose_name="صورة الحافظة")
    date_time = models.DateTimeField(auto_now_add=True, verbose_name="تاريخ الإنشاء")

    class Meta:
        managed = False  # لأن الجدول موجود مسبقاً
        db_table = 'clipboard'
        verbose_name = "حافظة"
        verbose_name_plural = "الحافظات"

    def __str__(self):
        return f"حافظة {self.id} - {self.employee}"
    








#اسامه


#  جدول الاطارات الجاهزة 
class ReadyTemplate(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.DO_NOTHING, db_column='employee_id')
    document_title = models.CharField(max_length=255)
    notes = models.TextField(blank=True, null=True)
    word_file = models.BinaryField()
    date_time = models.DateTimeField(auto_now_add=True)

    class Meta:
      db_table = 'ready_templates'
      managed = False
      
    def __str__(self):
        return self.document_title



class Stamps(models.Model):
    id = models.AutoField(primary_key=True)
    employee= models.ForeignKey(Employee, on_delete=models.DO_NOTHING, db_column='employee_id')
    stamp_type = models.CharField(max_length=100)
    stamp_image =  models.BinaryField(blank=True, null=True)
    class Meta:
     managed = True
     db_table = 'stamps'