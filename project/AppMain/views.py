#from django.shortcuts import render

# Create your views here.

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from .decorators import employee_login_required
def home(request):
    return render(request, 'AppMain/home.html')




from django.utils import timezone
from AppOfDocuments.models import Export, Import
Export.objects.count()  # هل يرجع 0؟
Import.objects.count()

def index_sign(request):
    request.session.flush()  # إنهاء أي جلسة سابقة
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        try:
            employee = Employee.objects.get(username=username)

            if employee.password == password:  # مقارنة مباشرة
                # تخزين بيانات الجلسة
                request.session['employee_id'] = employee.id
                request.session['employee_name'] = employee.full_name
                # داخل دالة index_sign بعد التحقق من كلمة المرور
                request.session['employee_role'] = employee.role

                  # 🕒 تحديد مدة الجلسة (15 دقيقة)
                request.session.set_expiry(900)  # 900 ثانية = 15 دقيقة


                # ✅ سجل وقت الدخول
                request.session['last_activity'] = timezone.now().isoformat()

                return redirect('main_index')
            else:
                messages.error(request, 'كلمة المرور غير صحيحة')
        except Employee.DoesNotExist:
            messages.error(request, 'الموظف غير موجود')

    return render(request, 'AppMain/sign/index.html')

@employee_login_required

def main_index(request):
     export_count = Export.objects.count()
     import_count = Import.objects.count()
     total_documents = export_count + import_count

     employee_name = request.session.get('employee_name', 'موظف')
     return render(request, 'AppMain/main/index.html',{'employee_name': employee_name})


import os
import platform
import psutil
from django.http import JsonResponse
from django.conf import settings
import datetime
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt

def system_info_api(request):
    try:
        # حساب مساحة التخزين
        disk_usage = psutil.disk_usage(settings.ARCHIVE_ROOT)
        storage_used = f"{round(disk_usage.percent)}%"

        # قاعدة البيانات
        db_status = "متصل"
        try:
            from django.db import connection
            connection.ensure_connection()
        except Exception:
            db_status = "غير متصل"

        # ✅ الإحصائيات الجديدة
        export_count = Export.objects.count()
        import_count = Import.objects.count()
        total_documents = export_count + import_count

        # البيانات النهائية
        response_data = {
            "version": "1.0.0",
            "lastUpdate": datetime.datetime.now().strftime("%Y-%m-%d"),
            "serverStatus": "متصل",
            "databaseStatus": db_status,
            "storageUsed": storage_used,
            "systemDetails": {
                "os": platform.system(),
                "pythonVersion": platform.python_version(),
                "cpuUsage": f"{psutil.cpu_percent()}%"
            },
            # ✅ إضافة الإحصائيات هنا
            "exportCount": export_count,
            "importCount": import_count,
            "totalDocuments": total_documents
        }

        return JsonResponse(response_data)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



from AppOfDocuments.models import Employee

def forgot_password(request):
    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        phone_number = request.POST.get('phone_number')
        username = request.POST.get('username')
        new_password = request.POST.get('new_password')

        try:
            employee = Employee.objects.get(
                full_name=full_name,
                phone_number=phone_number,
                username=username
            )

            # تحديث كلمة المرور
            employee.password = new_password
            employee.save(update_fields=['password'])

            return redirect('/app/')  # ✅ الانتقال إلى صفحة تسجيل الدخول

        except Employee.DoesNotExist:
            return render(request, 'AppMain/sign/forgot_password.html', {
                'error': 'المعلومات غير صحيحة، يرجى التحقق.'
            })

    return render(request, 'AppMain/sign/forgot_password.html')
