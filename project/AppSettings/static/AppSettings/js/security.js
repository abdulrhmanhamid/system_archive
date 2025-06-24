
function confirmSecuritySettings() {
    const msg = "هل أنت متأكد من حفظ إعدادات الأمان؟";
    if (confirm(msg)) {
        alert("تم حفظ الإعدادات بنجاح.");
    } else {
        alert("تم إلغاء العملية.");
    }
}
