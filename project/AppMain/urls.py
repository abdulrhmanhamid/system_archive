from django.urls import path,include
from . import views  # تأكد من وجود views.py في مجلد AppMain

urlpatterns = [
    
    # أضف مساراتك هنا مثلاً:
    #path('', views.home, name='home'),
    path('', views.index_sign, name='index_sign'),
    path('main/', views.main_index, name='main_index'),
    path('system-info/', views.system_info_api, name='system-info-api'),
    path('documents/', include('AppOfDocuments.urls')),
    path('forgot-password/', views.forgot_password, name='forgot_password'),


]