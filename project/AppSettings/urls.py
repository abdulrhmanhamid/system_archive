
from django.urls import path
from . import views 
from .views import test_connection
from .views import save_system_settings
# app_name = "appsettings"
from .views import download_backup
app_name = 'system_archive'

urlpatterns = [
path('', views.preservative, name='preservative'),   
path('add user form/', views.index_add_user_form, name='index_add_user_form'),
path('backup/', views.index_backup_ui, name='index_backup_ui'),

path('user_management/', views.user_management, name='user_management'),
path('delete_users/', views.delete_users, name='delete_users'),


path('change password/', views.change_password, name='change password'),
path('connection settings/', views.connection_settings, name='connection settings'),
path('security/', views.security_ui, name='security'),
path('stamp settings/', views.stamp_settings, name='stamp settings'),
path('system information/', views.system_information, name='system information'),
path('api/test_connection/', test_connection, name='test_connection'),#الاتصال محلي
path('api/system-settings/', save_system_settings, name='save_system_settings'),#اعدادات معلومات النظام

path('add_user/', views.add_user_view, name='add_user'),
path('add_user_submit/', views.add_user_submit, name='add_user_submit'),
  
path('edit_user/<int:user_id>/', views.edit_user, name='edit_user'),
path('edit_user_submit/<int:user_id>/', views.edit_user_submit, name='edit_user_submit'),


path('change-password/', views.change_password, name='change_password'),


path('backup/', views.index_backup_ui, name='backup_ui'),
path('backup_download/', download_backup, name='download_backup'),
path('restore-backup/', views.restore_backup, name='restore_backup'),
path('update-backup-settings/', views.update_backup_settings, name='update_backup_settings'),



# خاص في الختم 
   path('add_stamp/', views.add_stamp, name='add_stamp'),
    path('save_stamp/', views.save_stamp, name='save_stamp'),       
    path('manage_stamp/', views.manage_stamp, name='manage_stamp'),
    path('edit_stamp/<int:stamp_id>/', views.edit_stamp, name='edit_stamp'),
    path('delete_stamp/<int:stamp_id>/', views.delete_stamp, name='delete_stamp'),
    path('show_stamp/<int:stamp_id>/', views.show_stamp_image, name='show_stamp_image'),

   ]