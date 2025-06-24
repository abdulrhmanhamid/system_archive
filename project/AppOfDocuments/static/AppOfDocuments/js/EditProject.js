document.addEventListener('DOMContentLoaded', function() {
  // جلب project_id من URL
  const urlParts = window.location.pathname.split('/');
  const projectId = urlParts[urlParts.length - 2];
  document.getElementById('project_id').value = projectId;

  // جلب بيانات المشروع من API
  fetch(`/documents/graduation-projects/${projectId}/`)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          // تعبئة النموذج بالبيانات
          document.getElementById('project_name').value = data.project_name || '';
          document.getElementById('students_count').value = data.students_count || '';
          document.getElementById('group_names').value = data.group_names || '';
          document.getElementById('supervisor_name').value = data.supervisor_name || '';
          document.getElementById('delivery_date').value = data.delivery_date || '';
      })
      .catch(error => {
          console.error('Error:', error);
          alert('حدث خطأ أثناء جلب بيانات المشروع');
      });

  // معالجة إرسال النموذج
  document.getElementById('editProjectForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = {
          project_name: document.getElementById('project_name').value,
          students_count: document.getElementById('students_count').value,
          group_names: document.getElementById('group_names').value,
          supervisor_name: document.getElementById('supervisor_name').value,
          delivery_date: document.getElementById('delivery_date').value,
          csrfmiddlewaretoken: document.querySelector('[name=csrfmiddlewaretoken]').value
      };

      fetch(`/documents/graduation-projects/${projectId}/`, {
          method: 'PUT',
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
          alert('تم تعديل المشروع بنجاح!');
          window.location.href = '/documents/manageproject/';
      })
      .catch(error => {
          console.error('Error:', error);
          alert('حدث خطأ أثناء التعديل: ' + error.message);
      });
  });
});