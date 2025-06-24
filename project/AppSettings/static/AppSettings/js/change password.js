function resetForm() {
  document.getElementById("current-password").value = "";
  document.getElementById("new-password").value = "";
  document.getElementById("confirm-password").value = "";
}

function savePassword() {
  const current = document.getElementById("current-password").value;
  const newPass = document.getElementById("new-password").value;
  const confirm = document.getElementById("confirm-password").value;

  if (!current || !newPass || !confirm) {
      alert("يرجى ملء جميع الحقول");
      return;
  }

  if (newPass !== confirm) {
      alert("كلمات المرور غير متطابقة");
      return;
  }

  // هنا يمكن إرسال البيانات إلى الخادم
  alert("تم حفظ كلمة المرور بنجاح!");
}
