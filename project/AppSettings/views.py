from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import SystemSettings
from .utils import render_with_settings  # ✅ استيراد الدالة الموحدة
from AppMain.decorators import employee_login_required

import json

# AppSettings/views.py
from django.contrib.auth.models import User

# --------------------------- كود معلومات النظام
@employee_login_required
@csrf_exempt
def save_system_settings(request):
    if request.method == 'POST':
        settings, _ = SystemSettings.objects.get_or_create(id=1)
        settings.system_name = request.POST.get("system_name", "")
        settings.language = request.POST.get("language", "ar")
        settings.timezone = request.POST.get("timezone", "Asia/Riyadh")

        # إذا تم تحميل صورة جديدة
        if 'logo' in request.FILES:
            settings.logo = request.FILES['logo']

        settings.save()
        return JsonResponse({'success': True, 'message': 'تم الحفظ بنجاح'})

    elif request.method == 'GET':
        try:
            settings = SystemSettings.objects.get(id=1)
            return JsonResponse({
                'system_name': settings.system_name,
                'language': settings.language,
                'timezone': settings.timezone,
                'logo': settings.logo.url if settings.logo else None,  # ✅ تصحيح هنا
            })
        except SystemSettings.DoesNotExist:
            return JsonResponse({
                'system_name': '',
                'language': 'ar',
                'timezone': 'Asia/Riyadh',
                'logo': None,
            })
# --------------------------- كود إعدادات الاتصال
@employee_login_required

@csrf_exempt
def test_connection(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            server = data.get('server')
            database = data.get('database')
            port = data.get('port')
            user = data.get('user')
            password = data.get('password')

            if all([server, database, port, user, password]):
                if server.lower() == 'localhost':
                    return JsonResponse({'success': True, 'message': 'تم الاتصال بنجاح'})
                else:
                    return JsonResponse({'success': False, 'message': 'فشل الاتصال بالسيرفر'}, status=400)
            else:
                return JsonResponse({'success': False, 'message': 'يجب ملء جميع الحقول'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'طريقة الطلب غير مدعومة'}, status=405)

# --------------------------- Views مع إعدادات النظام

@employee_login_required
def preservative(request):
    return render_with_settings(request, 'baseSetting.html')

@employee_login_required
def index_add_user_form(request):
    return render_with_settings(request, 'AppSettings/add user form/add user.html')

@employee_login_required
def index_backup_ui(request):
    return render_with_settings(request, 'AppSettings/backup_ui/backup.html')

from AppOfDocuments.models import Employee
from django.db.models import Q


@employee_login_required
def user_management(request):
    search_query = request.GET.get('search', '')
    
    employees = Employee.objects.all()

    if search_query:
        employees = employees.filter(
            Q(username__icontains=search_query) |
            Q(full_name__icontains=search_query) |
            Q(phone_number__icontains=search_query) |
            Q(role__icontains=search_query)
        )
    
    context = {
        'users': employees,  # نستخدم نفس الاسم المستخدم في القالب
        'search_query': search_query
    }
    return render(request, 'AppSettings/User_management/user_management.html', context)

def delete_users(request):
    if request.method == 'POST':
        ids = request.POST.get('user_ids', '')
        if ids:
            user_ids = ids.split(',')
            Employee.objects.filter(id__in=user_ids).delete()
            messages.success(request, 'تم حذف المستخدمين بنجاح.')
        else:
            messages.warning(request, 'لم يتم تحديد أي مستخدم للحذف.')
    return redirect('AppSettings:user_management')

@employee_login_required
def change_password(request):
    return render_with_settings(request, 'AppSettings/change password/change password.html')

@employee_login_required
def connection_settings(request):
    return render_with_settings(request, 'AppSettings/connection settings/connection.html')


@employee_login_required
def security_ui(request):
    return render_with_settings(request, 'AppSettings/security/security.html')

@employee_login_required
def stamp_settings(request):
    return render_with_settings(request, 'AppSettings/stamp settings/stamp settings.html')

@employee_login_required
def system_information(request):
    return render_with_settings(request, 'AppSettings/system information/system information.html')

def add_stamp(request):
    return render_with_settings(request, 'AppSettings/stamp/addstamp.html')




# اظافة مستخدم 
from django.contrib.auth.models import User, Group
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password

@employee_login_required
def add_user_view(request):
    
    return render(request, 'AppSettings/add_user_form/add_user.html')


@employee_login_required
def add_user_submit(request):
    if request.method == "POST":
        full_name = request.POST.get("full_name")
        phone_number = request.POST.get("phone_number")
        username = request.POST.get("username")
        password1 = request.POST.get("password1")
        # password2 = request.POST.get("password2")
        role = request.POST.get("role")
        mang = request.POST.get("mang")

        # if password1 != password2:
        #     messages.error(request, "كلمتا المرور غير متطابقتين")
        #     return redirect("AppSettings:add_user")

        # التحقق من وجود اسم المستخدم مسبقًا
        if Employee.objects.filter(username=username).exists():
            messages.error(request, "اسم المستخدم موجود مسبقاً")
            return redirect("AppSettings:add_user")

        # حفظ المستخدم
        employee = Employee(
            full_name=full_name,
            phone_number=phone_number,
            username=username,
            password=password1,  # ⚠️ في الإنتاج يجب تشفير كلمة المرور!
            role=role,
            mang=mang
        )
        employee.save()

        messages.success(request, "تم إضافة المستخدم بنجاح")
        return redirect("AppSettings:add_user")

    return redirect("AppSettings:add_user")












# كود خاص في تعديل المستخدم 
from django.shortcuts import get_object_or_404


# def edit_user_view(request):
#     return render(request, 'AppSettings/edit_user/edit_user.html')


@employee_login_required
def edit_user(request, user_id):
    employee = get_object_or_404(Employee, id=user_id)
    return render(request, 'AppSettings/edit_user/edit_user.html', {'user': employee})


from django.contrib import messages
from django.shortcuts import redirect

def edit_user_submit(request, user_id):
    employee = get_object_or_404(Employee, id=user_id)

    if request.method == 'POST':
        full_name = request.POST.get('full_name')
        phone_number = request.POST.get("phone_number")
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        # password2 = request.POST.get('password2')
        role = request.POST.get('role')
        mang = request.POST.get('mang')

       
        employee.full_name = full_name
        employee.phone_number = phone_number

        employee.username = username
        employee.role = role
        if mang == "inactive":
            employee.password = ''  # اعتبر المستخدم غير نشط إذا لم يكن لديه كلمة مرور

        employee.save()
        messages.success(request, 'تم تعديل المستخدم بنجاح')
        return redirect('AppSettings:user_management')





from AppOfDocuments.models import Employee  # حسب اسم الموديل لديك

def change_password(request):
    if 'employee_id' not in request.session:
        return redirect('index_sign')  # إعادة التوجيه إذا لم يسجل الدخول

    if request.method == 'POST':
        current = request.POST.get('current_password')
        new = request.POST.get('new_password')
        confirm = request.POST.get('confirm_password')

        try:
            employee = Employee.objects.get(id=request.session['employee_id'])

            if employee.password != current:
                messages.error(request, 'كلمة المرور الحالية غير صحيحة.')
            elif new != confirm:
                messages.error(request, 'كلمتا المرور الجديدتان غير متطابقتين.')
            else:
                employee.password = new
                employee.save()
                messages.success(request, 'تم تغيير كلمة المرور بنجاح.')
                return redirect('index_sign')

        except Employee.DoesNotExist:
            messages.error(request, 'حدث خطأ: المستخدم غير موجود.')

    return render(request, 'AppSettings/change password/change password.html')



# داله النسخة الاحتياطية
import subprocess
import os
import datetime
from django.http import FileResponse, HttpResponse
from django.conf import settings
from django.contrib.auth.decorators import login_required

@employee_login_required

def download_backup(request):
    # جلب إعدادات قاعدة البيانات من settings.py
    db_settings = settings.DATABASES['default']
    db_name = db_settings['NAME']
    db_user = db_settings['USER']
    db_password = db_settings['PASSWORD']
    db_host = db_settings.get('HOST', 'localhost')
    db_port = db_settings.get('PORT', '5432')

    # اسم الملف ومسار الحفظ المؤقت
    file_name = f"backup_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.sql"
    file_path = os.path.join(settings.BASE_DIR, 'backups', file_name)

    # إنشاء مجلد النسخ الاحتياطي إن لم يكن موجود
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    try:
        # مسار أداة pg_dump (إذا وضعتها داخل المشروع مثلاً داخل backup_tools)
        pg_dump_path = os.path.join(settings.BASE_DIR, 'backup_tools', 'pg_dump.exe')

        # تنفيذ الأمر باستخدام subprocess
        subprocess.run(
           [
               pg_dump_path,
               '-U', db_user,
               '-h', db_host,
               '-p', db_port,
               '-d', db_name,
               '--data-only',         # ✅ فقط البيانات، بدون إنشاء الجداول
               '--inserts',           # ✅ بصيغة INSERT بدلاً من COPY
               '-f', file_path
           ],
           check=True,
           env={**os.environ, 'PGPASSWORD': db_password}
       )

        return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_name)

    except Exception as e:
        return HttpResponse(f'حدث خطأ أثناء أخذ النسخة الاحتياطية: {str(e)}')


#-------------
# views.py
from .scheduler import start
start()





from .models import BackupSetting
import os

def modify_sql_file(path):
    """
    تعدّل ملف SQL لإضافة 'ON CONFLICT DO NOTHING' لكل جملة INSERT
    لتفادي التكرار عند استرجاع البيانات.
    """
    modified_lines = []
    with open(path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip().startswith('INSERT INTO'):
                # نضيف ON CONFLICT DO NOTHING لكل أمر إدخال
                new_line = line.rstrip().rstrip(';') + ' ON CONFLICT DO NOTHING;\n'
                modified_lines.append(new_line)
            else:
                modified_lines.append(line)

    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(modified_lines)


def restore_backup(request):
    if request.method == 'POST':
        file = request.FILES.get('backup_file')
        path = os.path.join(settings.BASE_DIR, 'restores', file.name)

        # إنشاء مجلد restores إذا غير موجود
        os.makedirs(os.path.dirname(path), exist_ok=True)

        # حفظ الملف في مجلد restores
        with open(path, 'wb+') as dest:
            for chunk in file.chunks():
                dest.write(chunk)

        try:
            # ✨ تعديل الملف لتفادي تكرار البيانات
            modify_sql_file(path)

            # إعدادات قاعدة البيانات
            db_settings = settings.DATABASES['default']
            db_name = db_settings['NAME']
            db_user = db_settings['USER']
            db_password = db_settings['PASSWORD']

            command = [
                'C:\\Program Files\\PostgreSQL\\17\\bin\\psql.exe',
                '-U', db_user,
                '-d', db_name,
                '-f', path
            ]

            # تمرير كلمة السر من خلال متغير بيئة آمن
            env = os.environ.copy()
            env['PGPASSWORD'] = db_password

            subprocess.run(command, check=True, env=env)

            # تحديث حالة النسخ الاحتياطي في قاعدة البيانات
            setting = BackupSetting.objects.first()
            setting.status = 'success'
            setting.save()

        except Exception as e:
            if 'setting' in locals():
                setting.status = 'failed'
                setting.save()
            return HttpResponse(f"فشل الاسترجاع: {str(e)}")

        return redirect('AppSettings:backup_ui')




def update_backup_settings(request):
    if request.method == 'POST':
        schedule = request.POST.get('schedule')
        # هنا تخزن الإعداد في قاعدة البيانات أو ملف حسب تصميمك
        # مثال بسيط للتجربة فقط:
        print(f"تم اختيار الجدولة: {schedule}")
        messages.success(request, 'تم تحديث إعدادات النسخة الاحتياطية.')
    return redirect('AppSettings:index_backup_ui')








#----------------- خاص في الختم 
import base64
from AppOfDocuments.models import Stamps  
from django.core.files.base import ContentFile

@csrf_exempt
def save_stamp(request):
 if request.method == 'POST':
        data = json.loads(request.body)
        stamp_type = data.get('stamp_type')
        image_data = data.get('stamp_image')

        if not (stamp_type and image_data):
            return JsonResponse({'status': 'error', 'message': 'بيانات ناقصة'}, status=400)

        try:
            # استخراج بيانات الصورة من base64
            format, imgstr = image_data.split(';base64,')
            binary_data = base64.b64decode(imgstr)

            # حفظ البيانات
            stamp = Stamps()
            stamp.stamp_type = stamp_type
            stamp.stamp_image = binary_data  # ✅ BinaryField
            stamp.save()

            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

        return JsonResponse({'status': 'error'}, status=400)
@csrf_exempt
def manage_stamp(request):
    stamps = Stamps.objects.all()
    return render(request, 'AppSettings/stamp/manage_stamp.html', {'stamps': stamps})

# documents/views.py


def edit_stamp(request, stamp_id):
    stamp = get_object_or_404(Stamps, pk=stamp_id)

    if request.method == 'POST':
        # تحديث نوع الختم
        stamp_type = request.POST.get('stamp_type')
        if stamp_type:
            stamp.stamp_type = stamp_type

        # تحديث الصورة إن وُجدت
        if 'stamp_image' in request.FILES:
            image_file = request.FILES['stamp_image']
            stamp.stamp_image = image_file.read()  # حفظ الصورة كـ bytes في BinaryField

        # حفظ التعديلات
        stamp.save()
        return redirect('AppSettings/stamp/manage_stamp/')  # توجيه بعد الحفظ

    # في حالة GET، عرض النموذج
    image_base64 = None
    if stamp.stamp_image:
        image_base64 = base64.b64encode(stamp.stamp_image).decode('utf-8')

    context = {
        'stamp': stamp,
        'image_base64': image_base64,
    }

    return render(request, 'AppSettings/stamp/edit_stamp.html', context)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
@employee_login_required
@csrf_exempt  
def delete_stamp(request, stamp_id):
    if request.method == 'POST':
        try:
            stamp = Stamps.objects.get(id=stamp_id)
            stamp.delete()
            return JsonResponse({'success': True})
        except Stamps.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'الختم غير موجود'})
    return JsonResponse({'success': False, 'error': 'طلب غير صالح'}, status=400)



from django.shortcuts import render, get_object_or_404

@employee_login_required
def show_stamp_image(request, stamp_id):
    stamp = get_object_or_404(Stamps, pk=stamp_id)

    image_base64 = None
    if stamp.stamp_image:
        image_base64 = base64.b64encode(stamp.stamp_image).decode('utf-8')

    return render(request, 'AppSettings/stamp/show_image.html', {
        'image_base64': image_base64
    })




