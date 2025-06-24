document.addEventListener("DOMContentLoaded", () => {
    // Get references to elements
    const initialView = document.getElementById("initialView")
    const detailedView = document.getElementById("detailedView")
    const toggleViewBtn = document.getElementById("toggleViewBtn")
    const appContent = document.querySelector(".app-content")
  
    // Logo upload elements
    const logoContainer = document.getElementById("logoContainer")
    const logoImage = document.getElementById("logoImage")
    const logoUploadModal = new window.bootstrap.Modal(document.getElementById("logoUploadModal"))
    const logoUpload = document.getElementById("logoUpload")
    const logoPreview = document.getElementById("logoPreview")
    const saveLogo = document.getElementById("saveLogo")
  
    // Mobile sidebar elements
    const sidebar = document.querySelector(".sidebar")
  
    // Create enhanced mobile toggle button
    const toggleButton = document.createElement("button")
    toggleButton.className = "sidebar-toggle btn btn-link d-lg-none"
    toggleButton.innerHTML = '<i class="fas fa-bars"></i>'
    toggleButton.setAttribute("aria-label", "فتح/إغلاق القائمة")
    toggleButton.setAttribute("aria-expanded", "false")
  
    // Add toggle button to header
    const headerDiv = document.querySelector(".app-header .d-flex")
    if (headerDiv) {
        headerDiv.insertBefore(toggleButton, headerDiv.firstChild)
    }
  
    // Enhanced sidebar toggle functionality
    const toggleSidebar = (show) => {
        const isShowing = show !== undefined ? show : !sidebar.classList.contains("show")
        
        sidebar.classList.toggle("show", isShowing)
        if (appContent) {
            appContent.classList.toggle("sidebar-collapsed", !isShowing)
        }
        
        const icon = toggleButton.querySelector("i")
        if (isShowing) {
            icon.className = "fas fa-times"
            toggleButton.setAttribute("aria-label", "إغلاق القائمة")
            toggleButton.setAttribute("aria-expanded", "true")
        } else {
            icon.className = "fas fa-bars"
            toggleButton.setAttribute("aria-label", "فتح القائمة")
            toggleButton.setAttribute("aria-expanded", "false")
        }
        
        // Save state in localStorage
        localStorage.setItem("sidebarState", isShowing ? "expanded" : "collapsed")
    }
  
    // Toggle sidebar on button click
    toggleButton.addEventListener("click", () => toggleSidebar())
  
    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 991.98) {
            if (!sidebar.contains(e.target) && !toggleButton.contains(e.target) && sidebar.classList.contains("show")) {
                toggleSidebar(false)
            }
        }
    })
  
    // Handle window resize with debounce
    let resizeTimeout
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 991.98) {
                // Desktop view - sidebar always visible
                toggleSidebar(true)
                toggleButton.classList.add("d-none")
            } else {
                // Mobile view - show toggle button
                toggleButton.classList.remove("d-none")
            }
        }, 100)
    })
  
    // Initialize sidebar state
    const initializeSidebar = () => {
        if (window.innerWidth > 991.98) {
            // Desktop - sidebar expanded by default
            const savedState = localStorage.getItem("sidebarState")
            toggleSidebar(savedState !== "collapsed")
            toggleButton.classList.add("d-none")
        } else {
            // Mobile - sidebar collapsed by default
            toggleSidebar(false)
            toggleButton.classList.remove("d-none")
        }
    }
  
    // Add smooth transition
    if (sidebar) {
        sidebar.style.transition = "transform 0.3s ease-in-out"
    }
    if (appContent) {
        appContent.style.transition = "margin-left 0.3s ease-in-out"
    }
  
    // Initialize on page load
    initializeSidebar()
  
    // Enhanced touch support for mobile
    let touchStartX = 0
    let touchEndX = 0
    
    document.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX
    }, {passive: true})
  
    document.addEventListener("touchend", (e) => {
        if (window.innerWidth > 991.98) return
        
        touchEndX = e.changedTouches[0].screenX
        const threshold = 50
        
        if (touchStartX - touchEndX > threshold) {
            // Swipe left to close
            if (sidebar.classList.contains("show")) {
                toggleSidebar(false)
            }
        } else if (touchEndX - touchStartX > threshold) {
            // Swipe right to open
            if (!sidebar.classList.contains("show")) {
                toggleSidebar(true)
            }
        }
    }, {passive: true})
  
    // باقي الكود الأصلي بدون تغيير (وظائف رفع الشعار، البحث، عرض الجداول، إلخ)
    // Logo upload functionality
    let selectedLogoFile = null
  
    // Multiple ways to trigger logo upload
    function openLogoUpload() {
      logoPreview.src = logoImage.src
      logoUploadModal.show()
    }
  
    // Click on logo container to open upload modal
    if (logoContainer) {
      logoContainer.addEventListener("click", openLogoUpload)
    }
  
    // Click on logo image to open upload modal (backup)
    if (logoImage) {
      logoImage.addEventListener("click", openLogoUpload)
    }
  
    // Create browse files button functionality
    const browseButton = document.createElement("button")
    browseButton.type = "button"
    browseButton.className = "btn btn-outline-primary btn-sm mt-2"
    browseButton.innerHTML = '<i class="fas fa-folder-open"></i> تصفح الملفات'
    browseButton.id = "browseFiles"
  
    // Add browse button after file input
    if (logoUpload && logoUpload.parentNode) {
      logoUpload.parentNode.appendChild(browseButton)
    }
  
    // Browse button click handler
    if (browseButton) {
      browseButton.addEventListener("click", () => {
        logoUpload.click()
      })
    }
  
    // Handle file selection in modal
    if (logoUpload) {
      logoUpload.addEventListener("change", (e) => {
        const file = e.target.files[0]
        if (file) {
          // Validate file type
          if (!file.type.startsWith("image/")) {
            window.showMessage("يرجى اختيار ملف صورة صحيح", "error")
            logoUpload.value = ""
            return
          }
  
          // Validate file size (2MB max)
          if (file.size > 2 * 1024 * 1024) {
            window.showMessage("حجم الملف كبير جداً. يرجى اختيار صورة أصغر من 2 ميجابايت", "error")
            logoUpload.value = ""
            return
          }
  
          selectedLogoFile = file
  
          // Show preview
          const reader = new FileReader()
          reader.onload = (e) => {
            logoPreview.src = e.target.result
            window.showMessage("تم اختيار الصورة بنجاح", "success")
          }
          reader.readAsDataURL(file)
        }
      })
    }
  
    // Save logo
    if (saveLogo) {
      saveLogo.addEventListener("click", () => {
        if (selectedLogoFile) {
          // Show loading state
          saveLogo.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...'
          saveLogo.disabled = true
  
          // Simulate saving process
          setTimeout(() => {
            const reader = new FileReader()
            reader.onload = (e) => {
              logoImage.src = e.target.result
              localStorage.setItem("systemLogo", e.target.result)
              window.showMessage("تم حفظ الشعار بنجاح!", "success")
              saveLogo.innerHTML = "حفظ الشعار"
              saveLogo.disabled = false
              logoUploadModal.hide()
              logoUpload.value = ""
              selectedLogoFile = null
            }
            reader.readAsDataURL(selectedLogoFile)
          }, 1500)
        } else {
          window.showMessage("يرجى اختيار صورة أولاً", "warning")
        }
      })
    }
  
    // Load saved logo on page load
    const savedLogo = localStorage.getItem("systemLogo")
    if (savedLogo && logoImage) {
      logoImage.src = savedLogo
    }
  
    // Reset modal when closed
    const logoModal = document.getElementById("logoUploadModal")
    if (logoModal) {
      logoModal.addEventListener("hidden.bs.modal", () => {
        if (logoUpload) logoUpload.value = ""
        selectedLogoFile = null
        if (saveLogo) {
          saveLogo.innerHTML = "حفظ الشعار"
          saveLogo.disabled = false
        }
      })
    }
  
    // Toggle between views
    if (toggleViewBtn) {
      toggleViewBtn.addEventListener("click", () => {
        if (initialView && detailedView) {
          if (initialView.style.display !== "none") {
            initialView.style.display = "none"
            detailedView.style.display = "block"
            toggleViewBtn.textContent = " تراجع"
          } else {
            initialView.style.display = "block"
            detailedView.style.display = "none"
            toggleViewBtn.textContent = "عرض التفاصيل"
          }
        }
      })
    }
  
    // Simulate search functionality
    const searchInput = document.querySelector(".form-control")
    const searchButton = document.querySelector(".btn-outline-secondary")
  
    if (searchButton) {
      searchButton.addEventListener("click", () => {
        performSearch(searchInput?.value || "")
      })
    }
  
    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          performSearch(searchInput.value)
        }
      })
    }
  
    function performSearch(query) {
      if (query.trim() !== "") {
        if (initialView && detailedView && toggleViewBtn) {
          initialView.style.display = "none"
          detailedView.style.display = "block"
          toggleViewBtn.textContent = "تراجع"
        }
        console.log("Searching for:", query)
        window.showMessage(`جاري البحث عن: ${query}`, "info")
      }
    }
  
    // Add sample data to the table
    function populateSampleData() {
      const tbody = detailedView?.querySelector("tbody")
  
      if (!tbody) return
  
      tbody.innerHTML = ""
  
      const sampleData = [
        { id: 1, user: "أحمد", date: "2023/05/15", file: "تقرير.pdf" },
        { id: 2, user: "محمد", date: "2023/05/14", file: "مستند.docx" },
        { id: 3, user: "فاطمة", date: "2023/05/13", file: "جدول.xlsx" },
        { id: 4, user: "عمر", date: "2023/05/12", file: "عرض.pptx" },
        { id: 5, user: "خالد", date: "2023/05/11", file: "صورة.jpg" },
      ]
  
      sampleData.forEach((item) => {
        const row = document.createElement("tr")
        row.innerHTML = `
                  <td>${item.id}</td>
                  <td>${item.user}</td>
                  <td>${item.date}</td>
                  <td>${item.file}</td>
                  <td>
                      <button class="btn btn-sm btn-primary view-file-btn">عرض</button>
                  </td>
              `
        tbody.appendChild(row)
      })
  
      const viewButtons = tbody.querySelectorAll(".view-file-btn")
      viewButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const row = this.closest("tr")
          const fileName = row.cells[3].textContent
          window.showMessage(`عرض الملف: ${fileName}`, "info")
  
          if (initialView && detailedView && toggleViewBtn) {
            initialView.style.display = "block"
            detailedView.style.display = "none"
            toggleViewBtn.textContent = "عرض التفاصيل"
          }
        })
      })
    }
  
    populateSampleData()
  
    // Message display function
    window.showMessage = function showMessage(message, type = "info") {
      const existingToasts = document.querySelectorAll(".toast-container")
      existingToasts.forEach((toast) => toast.remove())
  
      const toastContainer = document.createElement("div")
      toastContainer.className = "toast-container"
  
      const alertClass = type === "error" ? "danger" : type
      const toast = document.createElement("div")
      toast.className = `alert alert-${alertClass} alert-dismissible fade show`
      toast.style.minWidth = "300px"
      toast.style.maxWidth = "400px"
      toast.style.wordWrap = "break-word"
      toast.innerHTML = `
              <div class="d-flex align-items-center">
                  <i class="fas fa-${getIconForType(type)} me-2"></i>
                  <span>${message}</span>
              </div>
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          `
  
      toastContainer.appendChild(toast)
      document.body.appendChild(toastContainer)
  
      setTimeout(() => {
        if (toastContainer.parentNode) {
          toastContainer.remove()
        }
      }, 4000)
    }
  
    function getIconForType(type) {
      switch (type) {
        case "success":
          return "check-circle"
        case "error":
        case "danger":
          return "exclamation-triangle"
        case "warning":
          return "exclamation-circle"
        case "info":
          return "info-circle"
        default:
          return "info-circle"
      }
    }
  
    // Add keyboard navigation for accessibility
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (sidebar.classList.contains("show")) {
          toggleSidebar(false)
          toggleButton.focus()
        }
      }
    })
  
    // Add visual feedback for logo interaction
    if (logoContainer) {
      logoContainer.addEventListener("mouseenter", () => {
        logoContainer.style.transform = "scale(1.02)"
      })
  
      logoContainer.addEventListener("mouseleave", () => {
        logoContainer.style.transform = "scale(1)"
      })
    }
  
    console.log("نظام الأرشيف تم تحميله بنجاح")
})
  
// Handle navigation based on menu item
function handleNavigation(menuItem) {
    console.log(`Navigating to: ${menuItem}`)
  
    switch (menuItem) {
      case "الرئيسية":
        window.showMessage("أنت في الصفحة الرئيسية", "info")
        break
      case "الوثائق":
        window.showMessage("جاري الانتقال إلى صفحة الوثائق...", "info")
        break
      case "الصادر":
        window.showMessage("جاري فتح صفحة الصادر...", "info")
        break
      case "الوارد":
        window.showMessage("جاري فتح الوارد...", "info")
        break
      case "مشاريع تخرج":
        window.showMessage("جاري فتح صفحة مشاريع تخرج...", "info")
        break
      case " الحافظة":
        window.showMessage("جاري فتح صفحة الحافظة ...", "info")
        break
      case "الإطارات الجاهزة":
        window.showMessage("جاري فتح صفحة الإطارات الجاهزة...", "info")
        break
      case "تسجيل خروج":
        if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
          window.showMessage("جاري تسجيل الخروج...", "info")
        }
        break
      case "تراجع":
        window.history.back()
        break
    }
}