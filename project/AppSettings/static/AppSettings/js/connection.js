document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("connection-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // التقاط القيم من الحقول
        const server = document.getElementById("server").value;
        const database = document.getElementById("database").value;
        const port = document.getElementById("port").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const connectionType = document.querySelector('input[name="connection"]:checked').value;

        // إرسال البيانات إلى السيرفر
        try {
            const response = await fetch("/appsettings/api/test_connection/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": getCookie("csrftoken")
                },
                body: JSON.stringify({
                    type: connectionType,
                    server: server,
                    database: database,
                    port: port,
                    user: username,
                    password: password
                })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                alert("✅ " + result.message);
            } else {
                alert("❌ " + result.message);
            }
        } catch (error) {
            alert("🚫 حدث خطأ أثناء الاتصال بالسيرفر:\n" + error.message);
        }
    });

    document.querySelector(".cancel").addEventListener("click", () => {
        if (confirm("هل تريد إلغاء العملية؟")) {
            document.getElementById("connection-form").reset();
        }
    });

    // دالة للحصول على CSRF Token من الكوكيز
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + "=")) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
