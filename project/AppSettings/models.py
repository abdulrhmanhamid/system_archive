from django.db import models

# Create your models here.
# from django.db import models



class SystemSettings(models.Model):
    system_name = models.CharField(max_length=255, verbose_name="اسم النظام", default="نظام الأرشيف")
    language = models.CharField(max_length=10, choices=[('ar', 'العربية'), ('en', 'English')], default='ar')
    timezone = models.CharField(max_length=100, default='Asia/Riyadh')
    logo = models.ImageField(upload_to='logos/', blank=True, null=True, verbose_name="شعار النظام")

    def __str__(self):
        return self.system_name or "الإعدادات"
    


# models.py

from django.db import models

class BackupSetting(models.Model):
    SCHEDULE_CHOICES = [
        ('daily', 'كل يوم'),
        ('weekly', 'كل أسبوع'),
        ('monthly', 'كل شهر'),
    ]

    schedule = models.CharField(max_length=10, choices=SCHEDULE_CHOICES, default='daily')
    last_backup = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('success', 'تمت بنجاح'),
        ('pending', 'قيد التنفيذ'),
        ('failed', 'فشلت العملية')
    ], default='pending')

    def __str__(self):
        return f"نسخة احتياطية - {self.schedule}"
