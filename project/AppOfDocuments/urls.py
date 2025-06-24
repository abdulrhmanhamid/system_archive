

from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard_view, name='dashboard'),  # عدل هذا

    

    path('binder/', views.Binder, name='binder'),
    path('managebinder/', views.ManageBinder, name='binder'),
    path('addproject/', views.AddProject, name='addproject'),
    path('manageproject/', views.ManageProject, name='manageproject'),
    path('editproject/', views.editProject, name='editproject'),


   ##
    path('graduation-projects/', views.graduation_projects_api, name='graduation_projects_api'),
    path('graduation-projects/<int:project_id>/', views.graduation_projects_api, name='graduation_project_detail'),
    path('manageproject/', views.manage_project_view, name='manage_project'),
    path('editproject/<int:project_id>/', views.edit_project_view, name='edit_project'),



   

#  خاص في الوارد اسامه

    path('', views.documents_home, name='documents'),
    path('add_imports/', views.add_imports, name='add_imports'),
    path('manageimport/', views.manage_imports, name='manage_imports'),
    path('save_import/', views.save_import, name='save_import'),
    path('scanner_page/', views.scanner_page, name='scanner_page'),
    path('scan_now/', views.scan_with_wia, name='scan_now'),
    path('view_import_image/<int:import_id>/', views.view_import_image, name='view_import_image'),
    path('delete_import/<int:import_id>/', views.delete_import, name='delete_import'),
    path('edite_import/<int:import_id>/', views.edite_import, name='edite_import'),


    #urls الحاصه في  الصادر
    path('add_export/', views.EddExport, name='add_export'),
    path('manage_exports/', views.manage_export, name='manage_exports'),
    path('manage_export/', views.manage_export),  # لدعم الرابط بدون "s"
    path('save_export/', views.save_export, name='save_export'), 
    path('view_export_image/<int:export_id>/', views.view_export_image, name='view_export_image'),
    path('edite_export/<int:export_id>/', views.edite_export, name='edite_export'),
    path('delete_export/<int:export_id>/', views.delete_export, name='delete_export'),
     


     
    path('Add_frame_export/', views.AddFramExport, name='Add_frame_export'),
    path('manage_fram_export/', views.ManageFramExport, name='manage_fram_export'),

        
       
    path('upload_word/', views.upload_word, name='upload_word'),
    path('save_word_to_disk/', views.save_word_to_disk, name='save_word_to_disk'),
    path('save_frame_template/', views.save_frame_template, name='save_frame_template'),
    path('manage_frame_templates/', views.manage_frame_templates, name='manage_frame_templates'),
    path('open_template/<int:template_id>/', views.open_word_template, name='open_word_template'),
    path('delete_frame_template/<int:template_id>/', views.delete_frame_template, name='delete_frame_template'),
    path('edit_frame_template/<int:template_id>/', views.edit_frame_template, name='edit_frame_template'),
    path('search_templates/', views.search_templates, name='search_templates'),
    path('download_word/<int:template_id>/', views.download_word, name='download_word'),
    path('get_word_image/', views.get_word_image, name='get_word_image'),

    ]
