window.addEventListener("DOMContentLoaded", async function () {
  const languageSelect = document.getElementById("language");
  const timezoneSelect = document.getElementById("timezone");
  const nameInput = document.getElementById("system_name");

  try {
    const res = await fetch("/appsettings/api/system-settings/");
    const data = await res.json();

    if (languageSelect && data.language) languageSelect.value = data.language;
    if (timezoneSelect && data.timezone) timezoneSelect.value = data.timezone;
    if (nameInput && data.system_name) nameInput.value = data.system_name;
  } catch (err) {
    console.error("فشل تحميل إعدادات النظام:", err);
  }
});

document.getElementById("system-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  try {
    const response = await fetch("/appsettings/api/system-settings/", {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken")
      },
      body: formData
    });

    const result = await response.json();
    if (response.ok && result.success) {
      alert("✅ " + result.message);

      // ✅ تحديث الشعار مباشرة إذا تم رفعه
      if (result.logo_url) {
        document.getElementById("logoImage").src = result.logo_url;
      }

    } else {
      alert("❌ " + (result.message || "فشل حفظ البيانات"));
    }
  } catch (error) {
    alert("❌ حدث خطأ أثناء الإرسال:\n" + error.message);
  }
});

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
