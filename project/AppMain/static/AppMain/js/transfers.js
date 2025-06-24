function showMessage(msg) {
    console.log(msg);
    alert(msg);  // يمكنك تعديل هذا لإظهار Toast بدلًا من alert
}

function handleNavigation(menuItem) {
    switch (menuItem.trim()) {
        case 'الرئيسية':
            window.location.href = '/app/main/';
            break;

        case 'الوثائق':
            
            window.location.href = '/documents/';
            break;
        case 'الإعدادات':
        window.location.href = '/appsettings/system information/';
        break;

        case 'الوارد':
            
            window.location.href = '/documents/add_imports/';
            break;
        case 'مشاريع تخرج':
            
            window.location.href = '/documents/addproject/';
            break;

        case 'الصادر':
            
            window.location.href = '/documents/add_export/';
            break;

        case 'الحافظة':
            
            window.location.href = '/documents/binder/';
            break;
        case 'الإطارات الجاهزة':
            
            window.location.href = '/documents/Add_frame_export/';
            break;

        case 'تسجيل خروج':
            if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                
                setTimeout(() => {
                    window.location.href = '/app/';
                }, 1000);
            }
            break;

        case 'تراجع':
            window.history.back();
            break;

        default:
            
    }
}
