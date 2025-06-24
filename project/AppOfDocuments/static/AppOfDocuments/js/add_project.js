function addUser() {
  alert("تم الضغط على زر إضافة مستخدم جديد (وظيفة تجريبية)");
}

function editUser() {
  alert("تم الضغط على زر تعديل (وظيفة تجريبية)");
}

function deleteUser() {
  alert("تم الضغط على زر حذف (وظيفة تجريبية)");
}
function VewMannigProject(){
  document.getElementById("vew").innerHTML=mannig_project.html
}

function searchUser(query) {
  console.log("يتم البحث عن:", query);
  // لاحقًا يمكن تصفية الجدول ديناميكيًا
}


document.querySelector(".user-form").addEventListener("submit", function(event) {
  event.preventDefault();
  alert("تم حفظ المستخدم (وظيفة تجريبية)");
});

document.querySelector(".cancel").addEventListener("click", function() {
  alert("تم إلغاء العملية (وظيفة تجريبية)");
});

document.getElementById('projectForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const formData = {
      project_name: document.getElementById('project_name').value,
      students_count: document.getElementById('students_count').value,
      group_names: document.getElementById('group_names').value,
      supervisor_name: document.getElementById('supervisor_name').value,
      delivery_date: document.getElementById('delivery_date').value,
      csrfmiddlewaretoken: document.querySelector('[name=csrfmiddlewaretoken]').value
  };

  fetch('/documents/graduation-projects/', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': formData.csrfmiddlewaretoken
      },
      body: JSON.stringify(formData)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      alert('تم حفظ المشروع بنجاح!');
      window.location.href = '/documents/manageproject/'; // توجيه إلى صفحة العرض
  })
  .catch(error => {
      console.error('Error:', error);
      alert('حدث خطأ أثناء الحفظ: ' + error.message);
  });
});