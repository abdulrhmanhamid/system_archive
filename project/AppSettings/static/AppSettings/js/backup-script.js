
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("backupForm");
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        alert("تم حفظ إعدادات النسخة الاحتياطية بنجاح.");
    });
});
