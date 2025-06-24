// متغير لتخزين المشاريع
let projectsData = [];

// تحميل المشاريع عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
});

// دالة جلب المشاريع من السيرفر
function loadProjects() {
    fetch('/documents/graduation-projects/')
        .then(response => response.json())
        .then(data => {
            projectsData = data;
            renderProjectsTable(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('حدث خطأ أثناء جلب البيانات');
        });
}

// دالة عرض المشاريع في الجدول
function renderProjectsTable(projects) {
    const tableBody = document.getElementById("projectsTable");
    tableBody.innerHTML = "";

    projects.forEach((project, index) => {
        const row = `
            <tr data-id="${project.project_id}">
                <td>${project.project_id}</td>
                <td>${project.project_name}</td>
                <td>${project.students_count}</td>
                <td>${project.group_names || ''}</td>
                <td>${project.supervisor_name || ''}</td>
                <td>${project.delivery_date || ''}</td>
                <td class="radio-cell">
                    <input type="radio" name="selectProject" value="${project.project_id}">
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// دالة البحث
document.getElementById("searchInput").addEventListener("input", function() {
    const keyword = this.value.trim().toLowerCase();
    const filteredProjects = projectsData.filter(project => {
        return (
            (project.project_name && project.project_name.toLowerCase().includes(keyword)) ||
            (project.supervisor_name && project.supervisor_name.toLowerCase().includes(keyword)) ||
            (project.group_names && project.group_names.toLowerCase().includes(keyword))
        );
    });
    renderProjectsTable(filteredProjects);
});

// دالة الحذف
function deleteProject() {
    const selectedId = document.querySelector('input[name="selectProject"]:checked')?.value;
    if (!selectedId) {
        alert("الرجاء اختيار مشروع للحذف");
        return;
    }

    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) {
        return;
    }

    fetch(`/documents/graduation-projects/${selectedId}/`, {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert("تم حذف المشروع بنجاح");
            loadProjects(); // إعادة تحميل البيانات
        } else {
            throw new Error('فشل في حذف المشروع');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}

// دالة التعديل
function editProject() {
    const selectedId = document.querySelector('input[name="selectProject"]:checked')?.value;
    if (!selectedId) {
        alert("الرجاء اختيار مشروع للتعديل");
        return;
    }
    window.location.href = `/documents/editproject/${selectedId}/`;
}

// دالة مساعدة للحصول على cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}