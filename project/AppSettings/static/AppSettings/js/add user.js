function addUser() {
  alert("تم الضغط على زر إضافة مستخدم جديد (وظيفة تجريبية)");
}

function editUser() {
  alert("تم الضغط على زر تعديل (وظيفة تجريبية)");
}

function deleteUser() {
  alert("تم الضغط على زر حذف (وظيفة تجريبية)");
}

function searchUser(query) {
  console.log("يتم البحث عن:", query);
  // لاحقًا يمكن تصفية الجدول ديناميكيًا
}



document.querySelector(".cancel").addEventListener("click", function() {
  alert("تم إلغاء العملية (وظيفة تجريبية)");
});
