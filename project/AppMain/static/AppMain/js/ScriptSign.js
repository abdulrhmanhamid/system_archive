// 

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const employeeIdInput = document.getElementById('employeeId');
    const passwordInput = document.getElementById('password');

    // عند تحميل الصفحة يتم التركيز على الرقم الوظيفي
    if (employeeIdInput) {
        employeeIdInput.focus();
    }

    // التحقق عند إرسال النموذج
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            const employeeId = employeeIdInput.value.trim();
            const password = passwordInput.value.trim();

            if (!employeeId || !password) {
                e.preventDefault(); // منع إرسال النموذج في حال النقص
                showAlert('الرجاء إدخال الرقم الوظيفي وكلمة المرور');
            }
        });
    }

    // تحسين واجهة المستخدم
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.style.backgroundColor = '#ffffff';
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.style.backgroundColor = '#f8f9fa';
            }
        });
    });
});

// عرض تنبيه للمستخدم
function showAlert(message, type = 'danger') {
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const form = document.getElementById('loginForm');
    form.insertAdjacentElement('afterend', alertDiv);

    setTimeout(() => {
        alertDiv.classList.remove('show');
    }, 3000);
}
