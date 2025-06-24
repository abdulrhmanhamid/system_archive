
from AppMain.decorators import employee_login_required



##
from django.shortcuts import render
from .models import Export
from .models import Import  



@employee_login_required
def Binder(request):
    
    return render(request, 'AppOfDocuments/files_main/binder/AddBinder.html')
@employee_login_required

def ManageBinder(request):
    return render(request, 'AppOfDocuments/files_main/binder/ManageBinder.html')

#دالة الخاصه مشروع تخرج
@employee_login_required
def AddProject(request):
    return render(request, 'AppOfDocuments/files_main/file_add_project/add_project.html')

@employee_login_required
def ManageProject(request):
    return render(request, 'AppOfDocuments/files_main/file_add_project/manage_project.html')

@employee_login_required
def editProject(request):
    return render(request, 'AppOfDocuments/files_main/file_add_project/editprojecd.html')



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import GraduationProjects
import json

@csrf_exempt
def graduation_projects_api(request, project_id=None):
    if request.method == 'GET':
        # جلب جميع المشاريع أو مشروع محدد
        if project_id:
            try:
                project = GraduationProjects.objects.get(project_id=project_id)
                data = {
                    'project_id': project.project_id,
                    'project_name': project.project_name,
                    'students_count': project.students_count,
                    'group_names': project.group_names,
                    'supervisor_name': project.supervisor_name,
                    'delivery_date': project.delivery_date.strftime('%Y-%m-%d') if project.delivery_date else None,
                    'employee': project.employee_id
                }
                return JsonResponse(data)
            except GraduationProjects.DoesNotExist:
                return JsonResponse({'error': 'Project not found'}, status=404)
        else:
            projects = GraduationProjects.objects.all()
            data = list(projects.values(
                'project_id', 'project_name', 'students_count', 
                'group_names', 'supervisor_name', 'delivery_date'
            ))
            return JsonResponse(data, safe=False)
    
    elif request.method == 'POST':  # إضافة هذا الجزء للإضافة
        try:
            data = json.loads(request.body)
            
            # تحقق من الحقول المطلوبة
            if not data.get('project_name') or not data.get('students_count'):
                return JsonResponse({'error': 'Project name and students count are required'}, status=400)
            
            project = GraduationProjects(
                project_name=data['project_name'],
                students_count=data['students_count'],
                group_names=data.get('group_names', ''),
                supervisor_name=data.get('supervisor_name', ''),
                delivery_date=data.get('delivery_date'),
                employee_id=data.get('employee_id')  # تأكد من إرسال هذا الحقل إذا كان مطلوبًا
            )
            project.save()
            
            return JsonResponse({
                'status': 'success',
                'project_id': project.project_id,
                'message': 'تمت إضافة المشروع بنجاح'
            }, status=201)
            
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'DELETE':
        try:
            project = GraduationProjects.objects.get(project_id=project_id)
            project.delete()
            return JsonResponse({'status': 'success'})
        except GraduationProjects.DoesNotExist:
            return JsonResponse({'error': 'Project not found'}, status=404)
    
    elif request.method == 'PUT':
        try:
            project = GraduationProjects.objects.get(project_id=project_id)
            data = json.loads(request.body)
            
            project.project_name = data.get('project_name', project.project_name)
            project.students_count = data.get('students_count', project.students_count)
            project.group_names = data.get('group_names', project.group_names)
            project.supervisor_name = data.get('supervisor_name', project.supervisor_name)
            project.delivery_date = data.get('delivery_date', project.delivery_date)
            
            project.save()
            return JsonResponse({'status': 'success', 'project_id': project.project_id})
        except GraduationProjects.DoesNotExist:
            return JsonResponse({'error': 'Project not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@employee_login_required
def manage_project_view(request):
    return render(request, 'AppOfDocuments/files_main/file_add_project/manageproject.html')



@employee_login_required
def edit_project_view(request, project_id):
    return render(request, 'AppOfDocuments/files_main/file_add_project/editprojecd.html', {'project_id': project_id})



#اسامه---------------------------------



# Create your views here.

@employee_login_required
def documents_home(request):
    return render(request, 'AppOfDocuments/index.html')


employee_login_required
def add_imports(request):
    return render(request, 'AppOfDocuments/files_main/import/add_imports.html')
employee_login_required
@employee_login_required
def manage_imports(request):
    imports = Import.objects.all()
    return render(request, 'AppOfDocuments/files_main/import/manageimport.html',{'imports': imports})

employee_login_required
def EditeImport(request):
    return render(request, 'AppOfDocuments/files_main/import/edite_import.html')
employee_login_required
def scanner_page(request):
    return render(request, 'AppOfDocuments/files_main/import/scanner_page.html')

employee_login_required
def Binder(request):
    return render(request, 'AppOfDocuments/files_main/binder/AddBinder.html')
employee_login_required
def ManageBinder(request):
    return render(request, 'AppOfDocuments/files_main/binder/ManageBinder.html')

#دالة الخاصه مشروع تخرج
employee_login_required
def AddProject(request):
    return render(request, 'AppOfDocuments/files_main/file_add_project/add_project.html')
employee_login_required
def ManageProject(request):
    return render(request, 'AppOfDocuments/files_main/file_add_project/manage_project.html')
employee_login_required
def editProject(request):
    return render(request, 'AppOfDocuments/files_main/file_add_project/editprojecd.html')

#الدوال الحاصه في  الصادر
employee_login_required
def EddExport(request):
    return render(request, 'AppOfDocuments/files_main/export/add_export.html')
employee_login_required
def manage_export(request):
    exports = Export.objects.all()
    return render(request, 'AppOfDocuments/files_main/export/manage_export.html', {'exports': exports})




employee_login_required
def edite_export(request, export_id):
    # يمكنك لاحقًا تعبئة هذا المحتوى لتعديل سجل الصادر
    return render(request, 'AppOfDocuments/edite_export.html', {'export_id': export_id})

#دالة اضافة الصادر   
import base64
from django.utils.dateparse import parse_date
from .models import Export, Employee  # تأكد من استيراد Employee
from django.views.decorators.http import require_POST
import os

from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from base64 import b64decode
@csrf_exempt
@employee_login_required
def save_export(request):
    if request.method == 'POST':
        # تحقق من وجود الموظف في الجلسة
        employee_id = request.session.get('employee_id')
        if not employee_id:
            return JsonResponse({"error": "الموظف غير مسجل الدخول"}, status=401)

        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return JsonResponse({"error": "الموظف غير موجود"}, status=404)

        data = json.loads(request.body)

        # حذف محتويات المجلدات دون حذف المجلد نفسه
        folders = [
            os.path.join('C:/system_archive/project/word'),
            os.path.join('C:/system_archive/project/word_images'),
            os.path.join('C:/system_archive/project/pdf'),
        ]
        for folder in folders:
            for filename in os.listdir(folder):
                file_path = os.path.join(folder, filename)
                if os.path.isfile(file_path):
                    try:
                        os.remove(file_path)
                    except Exception as e:
                        print(f"خطأ عند حذف {file_path}: {e}")

        # حفظ البيانات مع ربطها بالموظف
        image_data = data.get("export_image", "").split(',')[1]
        image_bytes = b64decode(image_data)

        Export.objects.create(
            employee=employee,  # ربط الموظف
            document_title=data.get("document_title"),
            recipient=data.get("recipient"),
            export_date=data.get("export_date"),
            notes=data.get("notes"),
            export_image=image_bytes
        )

        return JsonResponse({"message": "تم الحفظ وربط بالسجل الوظيفي"}, status=200)

    return JsonResponse({"error": "طريقة غير مسموحة"}, status=405)



#   دالة عرض صورة الصادر   
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
employee_login_required
def view_export_image(request, export_id):
    export = get_object_or_404(Export, id=export_id)
    if export.export_image:
        return HttpResponse(export.export_image, content_type="image/jpeg")
    return HttpResponse("لا توجد صورة", status=404)

#  دالة حذف الصادر 
from django.shortcuts import get_object_or_404, redirect

@employee_login_required
def delete_export(request, export_id):
    if request.method == 'POST':
        export = get_object_or_404(Export, id=export_id)
        export.delete()
        return redirect('manage_exports')  # عدّل الاسم حسب صفحة عرض الصادر
    else:
        return redirect('manage_exports')

# دالة تعديل الصادر 
import base64
import re
from django.shortcuts import render, get_object_or_404, redirect
from .models import Export
from django.core.files.base import ContentFile

@employee_login_required
def edite_export(request, export_id):
    export = get_object_or_404(Export, id=export_id)

    if request.method == 'POST':
        export.document_title = request.POST.get('document_title')
        export.recipient = request.POST.get('recipient')
        export.export_date = request.POST.get('export_date')
        export.notes = request.POST.get('notes')

        # معالجة صورة الـ canvas المرسلة كـ base64 من الحقل المخفي
        canvas_data = request.POST.get('canvas_image_data')
        if canvas_data:
            # canvas_data شكلها: data:image/png;base64,iVBORw0KGgoAAAANS...
            format, imgstr = canvas_data.split(';base64,')  # فصل البيانات
            img_data = base64.b64decode(imgstr)
            export.export_image = img_data
        # إذا لم ترسل canvas_data، نتحقق من رفع ملف صورة جديد
        elif 'export_image' in request.FILES:
            export.export_image = request.FILES['export_image'].read()

        export.save()
        return redirect('manage_exports')

    return render(request, 'AppOfDocuments/files_main/export/edite_export.html', {'export': export})

#دالة الاسكنر 
import io
import pythoncom
import win32com.client
from PIL import Image

@employee_login_required
@csrf_exempt
def scan_with_wia(request):
    try:
        pythoncom.CoInitialize()
        device_manager = win32com.client.Dispatch("WIA.DeviceManager")
        devices = device_manager.DeviceInfos

        if devices.Count == 0:
            return JsonResponse({'error': 'لا يوجد ماسح ضوئي متصل'}, status=400)

        # اختر أول جهاز
        scanner = devices.Item(1).Connect()

        # إعدادات السحب
        common_dialog = win32com.client.Dispatch("WIA.CommonDialog")
        image = common_dialog.ShowAcquireImage(
            DeviceType=1,  # 1 = ماسح ضوئي
            Intent=1,      # صورة ملونة
            FormatID="{B96B3CAB-0728-11D3-9D7B-0000F81EF32E}",  # BMP
            AlwaysSelectDevice=False,
            UseCommonUI=False,
            CancelError=True
        )

        # تحويل الصورة إلى base64
        image_data = image.FileData.BinaryData
        stream = io.BytesIO(image_data)
        pil_image = Image.open(stream).convert("RGB")

        img_buffer = io.BytesIO()
        pil_image.save(img_buffer, format="PNG")
        img_base64 = base64.b64encode(img_buffer.getvalue()).decode("utf-8")

        return JsonResponse({'image': img_base64})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



#دالة اظافة وارد 
@employee_login_required
@csrf_exempt
def save_import(request):
    if request.method == 'POST':
        try:
            # ✅ جلب الموظف من الجلسة
            employee_id = request.session.get('employee_id')
            if not employee_id:
                return JsonResponse({'status': 'error', 'message': 'الموظف غير مسجل الدخول'}, status=401)

            try:
                employee = Employee.objects.get(id=employee_id)
            except Employee.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'الموظف غير موجود'}, status=404)

            data = json.loads(request.body)

            image_data = data.get('image', '')
            title = data.get('title', '')
            sender = data.get('sender', '')
            date_str = data.get('date', '')
            notes = data.get('notes', '')

            if not all([image_data, title, sender, date_str]):
                return JsonResponse({'status': 'error', 'message': 'جميع الحقول مطلوبة'}, status=400)

            if not image_data.startswith('data:image'):
                return JsonResponse({'status': 'error', 'message': 'تنسيق الصورة غير صحيح'}, status=400)

            format, imgstr = image_data.split(';base64,')
            img_bytes = base64.b64decode(imgstr)

            try:
                import_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({'status': 'error', 'message': 'تنسيق التاريخ غير صحيح'}, status=400)

            record = Import.objects.create(
                employee=employee,
                document_title=title,
                sender=sender,
                import_date=import_date,
                notes=notes,
                import_image=img_bytes
            )

            return JsonResponse({'status': 'success', 'id': record.id})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'الطريقة غير مدعومة'}, status=405)




employee_login_required
def view_import_image(request, import_id):
    import_record = get_object_or_404(Import, id=import_id)
    if import_record.import_image:
        return HttpResponse(import_record.import_image, content_type='image/png')
    else:
        # صورة افتراضية أو رسالة خطأ
        return HttpResponse("لا توجد صورة", status=404)

#دالة حذف الوارد   
from django.http import HttpResponse, HttpResponseNotAllowed

@employee_login_required
def delete_import(request, import_id):
    if request.method == 'POST':
        import_record = get_object_or_404(Import, id=import_id)
        import_record.delete()
        return HttpResponse(status=200)  # ترجع OK
    else:
        return HttpResponseNotAllowed(['POST'])
    
from django.shortcuts import render, get_object_or_404, redirect
from .models import Import  # تأكد أن هذا هو اسم الموديل الصحيح

@employee_login_required
def edite_import(request, import_id):
    imp = get_object_or_404(Import, id=import_id)

    if request.method == 'POST':
        imp.document_title = request.POST.get('document_title')
        imp.sender = request.POST.get('sender')
        imp.import_date = request.POST.get('import_date')
        imp.notes = request.POST.get('notes')

        # لا حاجة للتعامل مع الصورة الآن
    image_data_url = request.POST.get('canvas_image_data')
    if image_data_url:
        header, encoded = image_data_url.split(",", 1)
        imp.import_image = base64.b64decode(encoded)


        imp.save()
        return redirect('manage_imports')  # تأكد أن هذا الاسم معرف في urls.py

    return render(request, 'AppOfDocuments/files_main/import/edite_import.html', {'import': imp})





#دوال خاصه في الاطارات الصادرة

employee_login_required
def AddFramExport(request):
    return render(request, 'AppOfDocuments/files_main/frams_exports/addfram_export.html')

employee_login_required
def ManageFramExport(request):
    return render(request, 'AppOfDocuments/files_main/frams_exports/manage_fram_export.html')



from django.conf import settings
import json
@employee_login_required
@csrf_exempt
def upload_word(request):
    if request.method == 'POST' and request.FILES.get('word_file'):
        word_file = request.FILES['word_file']
        file_name = word_file.name

        # حفظ مؤقت في مجلد media/temp
        temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, file_name)

        with open(temp_path, 'wb+') as dest:
            for chunk in word_file.chunks():
                dest.write(chunk)

        return JsonResponse({'success': True, 'file_name': file_name})

    return JsonResponse({'success': False}, status=400)

@employee_login_required
@csrf_exempt
def save_word_to_disk(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        file_name = data.get('file_name')

        if not file_name:
            return JsonResponse({'success': False, 'error': 'No file name provided'})

        temp_path = os.path.join(settings.MEDIA_ROOT, 'temp', file_name)
        if not os.path.exists(temp_path):
            return JsonResponse({'success': False, 'error': 'File does not exist'})

        save_path = os.path.join('E:\\', file_name)  # المسار النهائي في القرص E:

        try:
            with open(temp_path, 'rb') as src:
                with open(save_path, 'wb') as dst:
                    dst.write(src.read())
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

    return JsonResponse({'success': False}, status=400)



from .models import ReadyTemplate
from django.utils import timezone
@employee_login_required
def save_frame_template(request):
    if request.method == 'POST':
        title = request.POST.get('document_title')
        notes = request.POST.get('notes')
        word_file = request.FILES.get('word_file')

        # تعيين الموظف افتراضيًا إلى المستخدم رقم 1
        employee_id = 1

        ReadyTemplate.objects.create(
            document_title=title,
            notes=notes,
            word_file=word_file.read(),  # حفظ ملف الورد في قاعدة البيانات
            employee_id=employee_id,
            date_time=timezone.now()
        )
        return redirect('/documents/Add_frame_export/')

    return redirect('/documents/Add_frame_export/')

from .models import ReadyTemplate
from django.http import FileResponse
import os
@employee_login_required
def manage_frame_templates(request):
    templates = ReadyTemplate.objects.all()
    return render(request, 'AppOfDocuments/files_main/frams_exports/manage_fram_export.html', {
        'templates': templates
    })
    
 
import tempfile
from .models import ReadyTemplate
@employee_login_required
def open_word_template(request, template_id):
    try:
        template = ReadyTemplate.objects.get(id=template_id)
    except ReadyTemplate.DoesNotExist:
        return HttpResponse("الملف غير موجود", status=404)

    if not template.word_file:
        return HttpResponse("الملف غير متوفر", status=404)

    # حفظ الملف مؤقتًا على القرص
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, f"template_{template.id}.docx")

    with open(temp_path, 'wb') as f:
        f.write(template.word_file.tobytes())

    # فتح الملف باستخدام Microsoft Word
    try:
        os.startfile(temp_path)  # فقط على Windows
    except Exception as e:
        return HttpResponse(f"فشل في فتح الملف: {str(e)}", status=500)

    # إرجاع استجابة بدون محتوى حتى لا ينتقل المستخدم
    return HttpResponse(status=204)

from django.contrib import messages
from django.http import HttpResponse, HttpResponseNotAllowed
@employee_login_required
def delete_frame_template(request, template_id):
    if request.method == "POST":
        template = get_object_or_404(ReadyTemplate, id=template_id)
        template.delete()
        return HttpResponse("تم الحذف")
    return HttpResponseNotAllowed(['POST'])
@employee_login_required
def edit_frame_template(request, template_id):
    # يمكنك هنا عرض نموذج التعديل والتعامل معه حسب الطريقة المعتادة في Django
    pass


# 
from .models import ReadyTemplate
@employee_login_required
def search_templates(request):
    query = request.GET.get('q', '')
    results = ReadyTemplate.objects.filter(document_title__icontains=query).values('id', 'document_title')[:10]
    return JsonResponse(list(results), safe=False)


@employee_login_required
def download_word(request, template_id):
    from .models import ReadyTemplate
    import os

    template = ReadyTemplate.objects.get(id=template_id)
    filename = template.document_title.replace(" ", "_") + ".docx"
    word_path = os.path.join("word", filename)

    # اكتب الملف على القرص
    with open(word_path, "wb") as f:
        f.write(template.word_file)

    # افتح الملف في Word
    os.startfile(os.path.abspath(word_path))

    # أعد صفحة HTML تغلق نفسها بعد 2 ثانية
    html = f"""
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>فتح ملف Word</title>
      <script>
        // انتظر 2 ثانية ثم اغلق النافذة
        setTimeout(function() {{
          window.close();
        }}, 2000);
      </script>
    </head>
    <body style="font-family: Tahoma, sans-serif; text-align: center; padding-top: 50px;">
      <h2>✅ جاري فتح ملف Word...</h2>
      <p>سيتم إغلاق هذه النافذة تلقائيًا بعد لحظات.</p>
    </body>
    </html>
    """
    return HttpResponse(html)

import subprocess
@employee_login_required
def get_word_image(request):
    title = request.GET.get('title', '').strip()
    if not title:
        return JsonResponse({"success": False, "error": "العنوان فارغ"})

    word_dir = r"C:\system_archive\project\word"
    pdf_dir = os.path.join(settings.MEDIA_ROOT, "pdf")
    img_dir = os.path.join(settings.MEDIA_ROOT, "word_images")

    os.makedirs(pdf_dir, exist_ok=True)
    os.makedirs(img_dir, exist_ok=True)

    word_filename = f"{title}.docx"
    word_path = os.path.join(word_dir, word_filename)

    if not os.path.exists(word_path):
        return JsonResponse({"success": False, "error": "ملف Word غير موجود"})

    # تحويل Word إلى PDF باستخدام soffice (LibreOffice)
    try:
        subprocess.run([
            r"C:\Program Files\LibreOffice\program\soffice.exe", "--headless", "--convert-to", "pdf",
            "--outdir", pdf_dir, word_path
        ], check=True)
    except Exception as e:
        return JsonResponse({"success": False, "error": f"خطأ في تحويل Word إلى PDF: {str(e)}"})

    pdf_path = os.path.join(pdf_dir, f"{title}.pdf")

    if not os.path.exists(pdf_path):
        return JsonResponse({"success": False, "error": "ملف PDF لم يتم إنشاؤه"})

    # تحويل PDF إلى صورة
    try:
        from pdf2image import convert_from_path
        poppler_path = r"C:\Release-24.08.0-0\poppler-24.08.0\Library\bin"  # عدل حسب مكان تثبيت poppler عندك
        images = convert_from_path(pdf_path, dpi=150, first_page=1, last_page=1, poppler_path=poppler_path)
        img_path = os.path.join(img_dir, f"{title}.png")
        images[0].save(img_path, 'PNG')
    except Exception as e:
        return JsonResponse({"success": False, "error": f"خطأ في تحويل PDF إلى صورة: {str(e)}"})

    image_url = settings.MEDIA_URL + f"word_images/{title}.png"
    return JsonResponse({"success": True, "image_url": image_url})




# داله خاصة في احصائيات عدد الوثائق 

@employee_login_required
def dashboard_view(request):
    import_count = Import.objects.count()
    export_count = Export.objects.count()
    graduation_count = GraduationProjects.objects.count()
    ready_leave_count = 50  # عدل حسب المطلوب أو استبدله بنموذج حقيقي

    context = {
        'import_count': int(import_count),
        'export_count': int(export_count),
        'graduation_count': int(graduation_count),
        'ready_leave_count': int(ready_leave_count),
    }

    context = {
        'import_count': import_count,
        'export_count': export_count,
        'graduation_count': graduation_count,
        'ready_leave_count': ready_leave_count,
    }
    
    return render(request, 'AppOfDocuments/index.html', context)













from .models import Stamps

def add_import_view(request):
    stamp = Stamps.objects.filter(stamp_type="وارد").first()

    stamp_base64 = None
    if stamp and stamp.stamp_image:
        image_data = base64.b64encode(stamp.stamp_image).decode('utf-8')
        # نفترض أنها PNG أو يمكنك التحقق
        stamp_base64 = f"data:image/png;base64,{image_data}"

    return render(request, 'add_import.html', {
        'stamp_base64': stamp_base64,
    })

def add_export_view(request):
    stamp_type = "صادر"

    # معالجة أفضل للبحث
    stamp = Stamps.objects.filter(stamp_type__iexact=stamp_type.strip()).first()

    if stamp and stamp.stamp_image:
        image_data = base64.b64encode(stamp.stamp_image).decode('utf-8')
        stamp_base64 = f"data:image/png;base64,{image_data}"
        message = None
    else:
        stamp_base64 = ""
        message = f"يرجى رفع ختم من نوع {stamp_type}"

    return render(request, 'add_export.html', {
        'stamp_base64': stamp_base64,
        'stamp_warning': message,
    })


def add_import_view(request):
    
    stamp_type = "وارد"  # النوع المطلوب

    stamp = Stamps.objects.filter(stamp_type=stamp_type).first()

    if stamp and stamp.stamp_image:
        image_data = base64.b64encode(stamp.stamp_image).decode('utf-8')
        stamp_base64 = f"data:image/png;base64,{image_data}"
        message = None
    else:
        stamp_base64 = ""
        message = f"يرجى رفع ختم من نوع {stamp_type}"

    return render(request, 'add_import.html', {
        'stamp_base64': stamp_base64,
        'stamp_warning': message,
    })
