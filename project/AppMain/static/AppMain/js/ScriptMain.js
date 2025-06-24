// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar navigation
    initSidebar();
    
    // Initialize statistics counters
    initStatCounters();
    
    // Load system information
    loadSystemInfo();
    
    // Login button click handler
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    
    // Also trigger login on Enter key
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleLogin();
            }
        });
    }
    
    // Focus on username input when page loads
    if (usernameInput) {
        usernameInput.focus();
    }
   
    initStatCounters();
    // Handle form inputs for better UX
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        // Change background color on focus
        input.addEventListener('focus', function() {
            this.style.backgroundColor = '#ffffff';
        });
        
        // Restore background if empty on blur
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.style.backgroundColor = '#f8f9fa';
            }
        });
    });
});

// Initialize sidebar navigation
function initSidebar() {
    const navItems = document.querySelectorAll('.sidebar-menu .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the menu item text
            const menuText = this.querySelector('span').textContent;
            
            // Handle navigation (in a real app, this would navigate to different pages)
            handleNavigation(menuText);
        });
    });
}


// Initialize statistics counters with animation
function initStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const targetValue = parseInt(stat.textContent);
        animateCounter(stat, 0, targetValue, 1500);
    });
}

// Animate counter from start to end value
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Load system information
// async function loadSystemInfo() {
//     const systemInfoContent = document.querySelector('.system-info-content');
    
//     // عرض حالة التحميل
//     systemInfoContent.innerHTML = `
//         <div class="text-center py-4">
//             <div class="spinner-border text-primary" role="status"></div>
//             <p class="mt-2">جاري جلب بيانات النظام...</p>
//         </div>`;

//     try {
//         // URL الصحيح حسب ما ذكرت
//         const response = await fetch('http://127.0.0.1:8000/app/system-info/', {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json'
//             },
//             credentials: 'same-origin' // للأمان إذا كنت تستخدم جلسات
//         });

//         if (!response.ok) {
//             throw new Error(`خطأ في الاستجابة: ${response.status}`);
//         }

//         const data = await response.json();

//         // بناء واجهة البيانات
//         systemInfoContent.innerHTML = `
//             <div class="table-responsive">
//                 <table class="table table-bordered">
//                     <tbody>
//                         <tr><th>إصدار النظام</th><td>${data.version}</td></tr>
//                         <tr><th>آخر تحديث</th><td>${data.lastUpdate}</td></tr>
//                         <tr><th>حالة الخادم</th>
//                             <td><span class="badge bg-success">${data.serverStatus}</span></td>
//                         </tr>
//                         <tr><th>حالة قاعدة البيانات</th>
//                             <td><span class="badge bg-success">${data.databaseStatus}</span></td>
//                         </tr>
//                         <tr><th>المساحة المستخدمة</th>
//                             <td>
//                                 <div class="progress">
//                                     <div class="progress-bar" 
//                                          style="width: ${data.storageUsed}">
//                                         ${data.storageUsed}
//                                     </div>
//                                 </div>
//                             </td>
//                         </tr>
//                         <tr><th>نظام التشغيل</th><td>${data.systemDetails.os}</td></tr>
//                         <tr><th>إصدار بايثون</th><td>${data.systemDetails.pythonVersion}</td></tr>
//                     </tbody>
//                 </table>
//             </div>`;

//     } catch (error) {
//         systemInfoContent.innerHTML = `
//             <div class="alert alert-danger">
//                 <i class="fas fa-exclamation-circle"></i>
//                 فشل في جلب البيانات: ${error.message}
//                 <button onclick="loadSystemInfo()" class="btn btn-sm btn-primary mt-2">
//                     إعادة المحاولة
//                 </button>
//             </div>`;
//         console.error('تفاصيل الخطأ:', error);
//     }
// }
async function loadSystemInfo() {
    const systemInfoContent = document.querySelector('.system-info-content');

    // عرض حالة التحميل (اختياري)
    if (systemInfoContent) {
        systemInfoContent.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2">جاري جلب بيانات النظام...</p>
            </div>`;
    }

    try {
        const response = await fetch('/app/system-info/', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        });

        if (!response.ok) {
            throw new Error(`خطأ في الاستجابة: ${response.status}`);
        }

        const data = await response.json();

        // ✅ تحديث العدادات في الصفحة
        document.getElementById('export-count').textContent = data.exportCount;
        document.getElementById('import-count').textContent = data.importCount;
        document.getElementById('total-documents').textContent = data.totalDocuments;

        // ✅ شغل الأنيميشن بعد تعيين القيم
        initStatCounters();

        // ✅ بناء جدول معلومات النظام (إذا كان موجود في الصفحة)
        if (systemInfoContent) {
            systemInfoContent.innerHTML = `
                <div class="table-responsive">
                    <table class="table table-bordered">
                        <tbody>
                            <tr><th>إصدار النظام</th><td>${data.version}</td></tr>
                            <tr><th>آخر تحديث</th><td>${data.lastUpdate}</td></tr>
                            <tr><th>حالة الخادم</th>
                                <td><span class="badge bg-success">${data.serverStatus}</span></td>
                            </tr>
                            <tr><th>حالة قاعدة البيانات</th>
                                <td><span class="badge bg-success">${data.databaseStatus}</span></td>
                            </tr>
                            <tr><th>المساحة المستخدمة</th>
                                <td>
                                    <div class="progress">
                                        <div class="progress-bar" 
                                             style="width: ${data.storageUsed}">
                                            ${data.storageUsed}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr><th>نظام التشغيل</th><td>${data.systemDetails.os}</td></tr>
                            <tr><th>إصدار بايثون</th><td>${data.systemDetails.pythonVersion}</td></tr>
                        </tbody>
                    </table>
                </div>`;
        }

    } catch (error) {
        if (systemInfoContent) {
            systemInfoContent.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    فشل في جلب البيانات: ${error.message}
                    <button onclick="loadSystemInfo()" class="btn btn-sm btn-primary mt-2">
                        إعادة المحاولة
                    </button>
                </div>`;
        }
        console.error('تفاصيل الخطأ:', error);
    }
}

// تشغيل الوظيفة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', loadSystemInfo);

// handleLogin داله   


function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    
    // Basic validation
    if (!username || !password) {
        showAlert('يرجى إدخال اسم المستخدم وكلمة المرور');
        return;
    }
    
    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> جاري تسجيل الدخول...';
    
    // Simulate API call (replace with actual authentication)
    setTimeout(() => {
        // For demo purposes, accept any login
        loginSuccessful();
        
        // Reset button state
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'تسجيل الدخول';
    }, 2000);
}

// Handle successful login
function loginSuccessful() {
    // Show success message
    showAlert('تم تسجيل الدخول بنجاح', 'success');
    
    // Redirect to dashboard (in a real app)
    setTimeout(() => {
        // window.location.href = 'dashboard.html';
        // For demo, just reload the page
        alert('في التطبيق الحقيقي، سيتم توجيهك إلى لوحة التحكم');
    }, 1500);
}

// Show alert message
function showAlert(message, type = 'danger') {
    // Remove any existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show text-center`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Insert alert before the form
    const form = document.getElementById('loginForm');
    form.parentNode.insertBefore(alertDiv, form);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
        const bsAlert = new window.bootstrap.Alert(alertDiv);
        bsAlert.close();
    }, 3000);
}

// Show message to user
function showMessage(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.id = toastId;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Initialize and show toast
    const bsToast = new window.bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        this.remove();
    });
}

