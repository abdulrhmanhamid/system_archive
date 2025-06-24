# from apscheduler.schedulers.background import BackgroundScheduler
# from .models import BackupSetting
# import subprocess
# from django.utils import timezone

# def scheduled_backup():
#     setting = BackupSetting.objects.first()
#     if not setting:
#         return

#     # نفذ نسخة احتياطية
#     try:
#         output_path = f"backups/auto_backup_{timezone.now().strftime('%Y%m%d_%H%M%S')}.sql"
#         subprocess.run([
#             'C:\\system_archive\\project\\backup_tools\\pg_dump.exe',
#             '-U', 'postgres',
#             '-h', 'localhost',
#             '-p', '5432',
#             '-d', 'db.archive',
#             '-f', output_path
#         ], check=True)

#         setting.status = 'success'
#         setting.last_backup = timezone.now()
#         setting.save()
#     except:
#         setting.status = 'failed'
#         setting.save()

# def start():
#     scheduler = BackgroundScheduler()
#     scheduler.add_job(scheduled_backup, 'interval', days=1)
#     scheduler.start()




from apscheduler.schedulers.background import BackgroundScheduler
from .models import BackupSetting
import subprocess
from django.utils import timezone

def scheduled_backup():
    setting = BackupSetting.objects.first()
    if not setting:
        return

    # نفذ نسخة احتياطية
    try:
        output_path = f"backups/auto_backup_{timezone.now().strftime('%Y%m%d_%H%M%S')}.sql"
        subprocess.run([
            'C:\\system_archive\\project\\backup_tools\\pg_dump.exe',
            '-U', 'postgres',
            '-h', 'localhost',
            '-p', '5432',
            '-d', 'db.archive',
            '--data-only',            # ✅ لا نريد إنشاء الجداول
            '--inserts',              # ✅ نستخدم INSERT بدلاً من COPY
            '-f', output_path
        ], check=True, env={'PGPASSWORD': 'كلمة_المرور_الخاصة_بك'})

        setting.status = 'success'
        setting.last_backup = timezone.now()
        setting.save()
    except:
        setting.status = 'failed'
        setting.save()

def start():
    scheduler = BackgroundScheduler()
    scheduler.add_job(scheduled_backup, 'interval', days=1)
    scheduler.start()
