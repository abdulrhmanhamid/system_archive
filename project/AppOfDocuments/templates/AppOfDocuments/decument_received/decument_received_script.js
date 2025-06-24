// Global variables
const currentSection = "current"
const documents = [
  {
    id: "001",
    title: "أمر إداري رقم 123",
    type: "أمر إداري",
    date: "2023/12/15",
    user: "أحمد محمد",
    status: "مفعل",
    statusClass: "success",
  },
  {
    id: "002",
    title: "تقرير شهري",
    type: "تقرير",
    date: "2023/12/14",
    user: "فاطمة علي",
    status: "قيد المراجعة",
    statusClass: "warning",
  },
  {
    id: "003",
    title: "مراسلة رسمية",
    type: "مراسلة",
    date: "2023/12/13",
    user: "محمد خالد",
    status: "مفعل",
    statusClass: "success",
  },
]
const formData = {}

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", () => {
  window.archiveSystem = new ArchiveSystem()
})

// Modern JavaScript with ES6+ features
class ArchiveSystem {
  constructor() {
    this.currentView = "add-document"
    this.documents = this.loadDocuments()
    this.currentPage = 1
    this.itemsPerPage = 10
    this.searchTerm = ""
    this.selectedFiles = []

    this.init()
  }

  // Initialize the system
  init() {
    this.showLoadingScreen()
    this.setupEventListeners()
    this.loadInitialData()

    // Hide loading screen after initialization
    setTimeout(() => {
      this.hideLoadingScreen()
    }, 2000)
  }

  // Loading screen management
  showLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen")
    loadingScreen.classList.remove("hidden")
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen")
    loadingScreen.classList.add("hidden")

    // Remove loading screen from DOM after animation
    setTimeout(() => {
      loadingScreen.remove()
    }, 500)
  }

  // Setup all event listeners
  setupEventListeners() {
    // Navigation
    this.setupNavigation()

    // Form handling
    this.setupFormHandling()

    // File upload
    this.setupFileUpload()

    // Search and filter
    this.setupSearchAndFilter()

    // Mobile menu
    this.setupMobileMenu()

    // Modal
    this.setupModal()

    // Keyboard shortcuts
    this.setupKeyboardShortcuts()

    // Window events
    this.setupWindowEvents()
  }

  // Navigation setup
  setupNavigation() {
    const navLinks = document.querySelectorAll(".nav-link[data-view]")

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const view = link.dataset.view
        this.switchView(view)
        this.updateActiveNavLink(link)

        // Close mobile menu if open
        this.closeMobileMenu()
      })
    })
  }

  // Form handling setup
  setupFormHandling() {
    const documentForm = document.getElementById("documentForm")

    if (documentForm) {
      documentForm.addEventListener("submit", (e) => {
        e.preventDefault()
        this.handleFormSubmit(e)
      })

      // Real-time validation
      const inputs = documentForm.querySelectorAll(".form-control")
      inputs.forEach((input) => {
        input.addEventListener("input", () => this.validateInput(input))
        input.addEventListener("blur", () => this.validateInput(input))
      })
    }
  }

  // File upload setup
  setupFileUpload() {
    const fileUploadArea = document.getElementById("fileUploadArea")
    const fileInput = document.getElementById("fileInput")

    if (fileUploadArea && fileInput) {
      // Click to upload
      fileUploadArea.addEventListener("click", () => {
        fileInput.click()
      })

      // File input change
      fileInput.addEventListener("change", (e) => {
        this.handleFileSelect(e.target.files)
      })

      // Drag and drop
      fileUploadArea.addEventListener("dragover", (e) => {
        e.preventDefault()
        fileUploadArea.classList.add("dragover")
      })

      fileUploadArea.addEventListener("dragleave", () => {
        fileUploadArea.classList.remove("dragover")
      })

      fileUploadArea.addEventListener("drop", (e) => {
        e.preventDefault()
        fileUploadArea.classList.remove("dragover")
        this.handleFileSelect(e.dataTransfer.files)
      })
    }
  }

  // Search and filter setup
  setupSearchAndFilter() {
    const searchInput = document.getElementById("searchInput")
    const filterBtn = document.getElementById("filterBtn")

    if (searchInput) {
      // Debounced search
      let searchTimeout
      searchInput.addEventListener("input", (e) => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
          this.searchTerm = e.target.value
          this.filterDocuments()
        }, 300)
      })
    }

    if (filterBtn) {
      filterBtn.addEventListener("click", () => {
        this.showFilterModal()
      })
    }
  }

  // Mobile menu setup
  setupMobileMenu() {
    const mobileMenuToggle = document.getElementById("mobileMenuToggle")
    const sidebar = document.getElementById("sidebar")

    if (mobileMenuToggle) {
      mobileMenuToggle.addEventListener("click", () => {
        this.toggleMobileMenu()
      })
    }

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        this.closeMobileMenu()
      }
    })
  }

  // Modal setup
  setupModal() {
    const modal = document.getElementById("documentModal")
    const modalClose = document.getElementById("modalClose")

    if (modalClose) {
      modalClose.addEventListener("click", () => {
        this.closeModal()
      })
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal()
        }
      })
    }
  }

  // Keyboard shortcuts setup
  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      // Ctrl+S to save
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault()
        const form = document.getElementById("documentForm")
        if (form && this.currentView === "add-document") {
          form.dispatchEvent(new Event("submit"))
        }
      }

      // Escape to close modal/menu
      if (e.key === "Escape") {
        this.closeModal()
        this.closeMobileMenu()
      }

      // Ctrl+F to focus search
      if (e.ctrlKey && e.key === "f" && this.currentView === "document-list") {
        e.preventDefault()
        const searchInput = document.getElementById("searchInput")
        if (searchInput) {
          searchInput.focus()
        }
      }
    })
  }

  // Window events setup
  setupWindowEvents() {
    // Resize handler
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        this.closeMobileMenu()
      }
    })

    // Before unload warning for unsaved changes
    window.addEventListener("beforeunload", (e) => {
      const form = document.getElementById("documentForm")
      if (form && this.hasUnsavedChanges(form)) {
        e.preventDefault()
        e.returnValue = "لديك تغييرات غير محفوظة. هل أنت متأكد من المغادرة؟"
      }
    })
  }

  // Load initial data
  loadInitialData() {
    this.populateDocumentsTable()
    this.updateDocumentStats()
  }

  // Switch between views
  switchView(viewName) {
    // Hide all views
    const views = document.querySelectorAll(".view-container")
    views.forEach((view) => {
      view.classList.remove("active")
    })

    // Show target view
    const targetView = document.getElementById(viewName)
    if (targetView) {
      targetView.classList.add("active")
      this.currentView = viewName

      // Load view-specific data
      this.loadViewData(viewName)
    }
  }

  // Update active navigation link
  updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.classList.remove("active")
    })
    activeLink.classList.add("active")
  }

  // Load view-specific data
  loadViewData(viewName) {
    switch (viewName) {
      case "document-list":
        this.populateDocumentsTable()
        break
      case "add-document":
        this.resetForm()
        break
      default:
        console.log(`Loading data for ${viewName}`)
    }
  }

  // Handle form submission
  async handleFormSubmit(e) {
    const form = e.target
    const submitBtn = form.querySelector(".btn-save")

    // Show loading state
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...'
    submitBtn.disabled = true

    try {
      // Collect form data
      const formData = new FormData(form)
      const documentData = this.collectFormData(formData)

      // Validate data
      if (!this.validateFormData(documentData)) {
        throw new Error("بيانات غير صحيحة")
      }

      // Simulate API call
      await this.saveDocument(documentData)

      // Success
      this.showNotification("تم حفظ الوثيقة بنجاح", "success")
      this.resetForm()
      this.updateDocumentStats()
    } catch (error) {
      this.showNotification(error.message || "حدث خطأ أثناء الحفظ", "error")
    } finally {
      // Reset button
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false
    }
  }

  // Collect form data
  collectFormData(formData) {
    const data = {
      id: this.generateDocumentId(),
      title: formData.get("title"),
      sender: formData.get("sender"),
      receiveDate: formData.get("receiveDate"),
      documentNumber: formData.get("documentNumber"),
      documentSize: formData.get("documentSize"),
      notes: formData.get("notes"),
      files: this.selectedFiles,
      createdAt: new Date().toISOString(),
      status: "جديد",
      user: "أحمد محمد",
    }

    return data
  }

  // Validate form data
  validateFormData(data) {
    const requiredFields = ["title", "sender", "receiveDate"]

    for (const field of requiredFields) {
      if (!data[field] || data[field].trim() === "") {
        this.showNotification(`الحقل "${this.getFieldLabel(field)}" مطلوب`, "warning")
        return false
      }
    }

    return true
  }

  // Get field label in Arabic
  getFieldLabel(fieldName) {
    const labels = {
      title: "العنوان",
      sender: "الجهة المرسلة",
      receiveDate: "تاريخ الاستلام",
    }
    return labels[fieldName] || fieldName
  }

  // Save document (simulate API call)
  async saveDocument(documentData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Add to documents array
          this.documents.unshift(documentData)

          // Save to localStorage
          this.saveDocuments()

          resolve(documentData)
        } catch (error) {
          reject(error)
        }
      }, 1500)
    })
  }

  // Generate document ID
  generateDocumentId() {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `DOC-${timestamp}-${random}`
  }

  // Reset form
  resetForm() {
    const form = document.getElementById("documentForm")
    if (form) {
      form.reset()

      // Set current date
      const dateInput = form.querySelector('input[type="date"]')
      if (dateInput) {
        dateInput.value = new Date().toISOString().split("T")[0]
      }

      // Clear file selection
      this.selectedFiles = []
      this.updateFilePreview()

      // Remove validation classes
      const inputs = form.querySelectorAll(".form-control")
      inputs.forEach((input) => {
        input.classList.remove("is-valid", "is-invalid")
      })
    }
  }

  // Validate input
  validateInput(input) {
    const value = input.value.trim()

    // Remove existing validation classes
    input.classList.remove("is-valid", "is-invalid")

    // Check if required
    if (input.hasAttribute("required")) {
      if (value === "") {
        input.classList.add("is-invalid")
        return false
      }
    }

    // Specific validations
    if (input.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        input.classList.add("is-invalid")
        return false
      }
    }

    if (value) {
      input.classList.add("is-valid")
    }

    return true
  }

  // Handle file selection
  handleFileSelect(files) {
    const fileArray = Array.from(files)

    // Validate files
    const validFiles = fileArray.filter((file) => this.validateFile(file))

    if (validFiles.length !== fileArray.length) {
      this.showNotification("بعض الملفات غير مدعومة", "warning")
    }

    // Add to selected files
    this.selectedFiles = [...this.selectedFiles, ...validFiles]

    // Update preview
    this.updateFilePreview()

    // Update document preview
    this.updateDocumentPreview()
  }

  // Validate file
  validateFile(file) {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ]

    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      this.showNotification(`نوع الملف ${file.name} غير مدعوم`, "warning")
      return false
    }

    if (file.size > maxSize) {
      this.showNotification(`حجم الملف ${file.name} كبير جداً`, "warning")
      return false
    }

    return true
  }

  // Update file preview
  updateFilePreview() {
    const filePreview = document.getElementById("filePreview")

    if (this.selectedFiles.length === 0) {
      filePreview.classList.remove("show")
      return
    }

    filePreview.classList.add("show")
    filePreview.innerHTML = this.selectedFiles
      .map(
        (file, index) => `
      <div class="file-item">
        <div class="file-info">
          <i class="fas fa-${this.getFileIcon(file.type)}"></i>
          <span class="file-name">${file.name}</span>
          <span class="file-size">(${this.formatFileSize(file.size)})</span>
        </div>
        <button type="button" class="file-remove" onclick="archiveSystem.removeFile(${index})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `,
      )
      .join("")
  }

  // Remove file
  removeFile(index) {
    this.selectedFiles.splice(index, 1)
    this.updateFilePreview()
    this.updateDocumentPreview()
  }

  // Get file icon
  getFileIcon(mimeType) {
    if (mimeType.includes("pdf")) return "file-pdf"
    if (mimeType.includes("word")) return "file-word"
    if (mimeType.includes("image")) return "file-image"
    return "file"
  }

  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Update document preview
  updateDocumentPreview() {
    const documentPreview = document.getElementById("documentPreview")

    if (this.selectedFiles.length === 0) {
      documentPreview.innerHTML = `
        <div class="preview-placeholder">
          <i class="fas fa-file-alt"></i>
          <p>الصورة</p>
          <small>لا توجد وثيقة للمعاينة</small>
        </div>
      `
      return
    }

    const firstFile = this.selectedFiles[0]

    if (firstFile.type.includes("image")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        documentPreview.innerHTML = `
          <img src="${e.target.result}" alt="معاينة الوثيقة" style="max-width: 100%; max-height: 100%; object-fit: contain;">
        `
      }
      reader.readAsDataURL(firstFile)
    } else {
      documentPreview.innerHTML = `
        <div class="preview-placeholder">
          <i class="fas fa-${this.getFileIcon(firstFile.type)}"></i>
          <p>${firstFile.name}</p>
          <small>معاينة الملف</small>
        </div>
      `
    }
  }

  // Populate documents table
  populateDocumentsTable() {
    const tableBody = document.getElementById("documentsTableBody")
    if (!tableBody) return

    const filteredDocs = this.getFilteredDocuments()
    const paginatedDocs = this.getPaginatedDocuments(filteredDocs)

    if (paginatedDocs.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            <div class="empty-state">
              <i class="fas fa-inbox fa-3x mb-3"></i>
              <p>لا توجد وثائق</p>
            </div>
          </td>
        </tr>
      `
      return
    }

    tableBody.innerHTML = paginatedDocs
      .map(
        (doc) => `
      <tr>
        <td>${doc.documentNumber || doc.id}</td>
        <td>${doc.title}</td>
        <td>${this.getDocumentType(doc)}</td>
        <td>${this.formatDate(doc.receiveDate || doc.createdAt)}</td>
        <td>${doc.user}</td>
        <td><span class="badge ${this.getStatusClass(doc.status)}">${doc.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn-action-small" onclick="archiveSystem.viewDocument('${doc.id}')" title="عرض">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-action-small" onclick="archiveSystem.editDocument('${doc.id}')" title="تعديل">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action-small" onclick="archiveSystem.deleteDocument('${doc.id}')" title="حذف">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `,
      )
      .join("")

    this.updatePagination(filteredDocs.length)
  }

  // Get filtered documents
  getFilteredDocuments() {
    let filtered = [...this.documents]

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase()
      filtered = filtered.filter(
        (doc) =>
          doc.title.toLowerCase().includes(term) ||
          doc.sender.toLowerCase().includes(term) ||
          doc.documentNumber?.toLowerCase().includes(term) ||
          doc.user.toLowerCase().includes(term),
      )
    }

    return filtered
  }

  // Get paginated documents
  getPaginatedDocuments(documents) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return documents.slice(startIndex, endIndex)
  }

  // Update pagination
  updatePagination(totalItems) {
    const pagination = document.getElementById("pagination")
    if (!pagination) return

    const totalPages = Math.ceil(totalItems / this.itemsPerPage)

    if (totalPages <= 1) {
      pagination.innerHTML = ""
      return
    }

    let paginationHTML = ""

    // Previous button
    paginationHTML += `
      <button class="page-btn ${this.currentPage === 1 ? "disabled" : ""}" 
              onclick="archiveSystem.goToPage(${this.currentPage - 1})" 
              ${this.currentPage === 1 ? "disabled" : ""}>
        <i class="fas fa-chevron-right"></i>
      </button>
    `

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
        paginationHTML += `
          <button class="page-btn ${i === this.currentPage ? "active" : ""}" 
                  onclick="archiveSystem.goToPage(${i})">
            ${i}
          </button>
        `
      } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
        paginationHTML += '<span class="page-dots">...</span>'
      }
    }

    // Next button
    paginationHTML += `
      <button class="page-btn ${this.currentPage === totalPages ? "disabled" : ""}" 
              onclick="archiveSystem.goToPage(${this.currentPage + 1})" 
              ${this.currentPage === totalPages ? "disabled" : ""}>
        <i class="fas fa-chevron-left"></i>
      </button>
    `

    pagination.innerHTML = paginationHTML
  }

  // Go to page
  goToPage(page) {
    const totalPages = Math.ceil(this.getFilteredDocuments().length / this.itemsPerPage)

    if (page < 1 || page > totalPages) return

    this.currentPage = page
    this.populateDocumentsTable()
  }

  // Filter documents
  filterDocuments() {
    this.currentPage = 1
    this.populateDocumentsTable()
  }

  // Get document type
  getDocumentType(doc) {
    if (doc.files && doc.files.length > 0) {
      const file = doc.files[0]
      if (file.type.includes("pdf")) return "PDF"
      if (file.type.includes("word")) return "Word"
      if (file.type.includes("image")) return "صورة"
    }
    return "وثيقة"
  }

  // Format date
  formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString("ar-SA")
  }

  // Get status class
  getStatusClass(status) {
    const statusClasses = {
      جديد: "badge-info",
      مفعل: "badge-success",
      "قيد المراجعة": "badge-warning",
      مؤرشف: "badge-secondary",
      محذوف: "badge-danger",
    }
    return statusClasses[status] || "badge-secondary"
  }

  // Document actions
  viewDocument(id) {
    const doc = this.documents.find((d) => d.id === id)
    if (!doc) return

    this.showDocumentModal(doc)
  }

  editDocument(id) {
    const doc = this.documents.find((d) => d.id === id)
    if (!doc) return

    // Switch to add document view
    this.switchView("add-document")
    this.updateActiveNavLink(document.querySelector('[data-view="add-document"]'))

    // Populate form with document data
    this.populateFormWithDocument(doc)

    this.showNotification(`تحرير الوثيقة: ${doc.title}`, "info")
  }

  deleteDocument(id) {
    const doc = this.documents.find((d) => d.id === id)
    if (!doc) return

    if (confirm(`هل أنت متأكد من حذف الوثيقة: ${doc.title}؟`)) {
      this.documents = this.documents.filter((d) => d.id !== id)
      this.saveDocuments()
      this.populateDocumentsTable()
      this.updateDocumentStats()
      this.showNotification("تم حذف الوثيقة بنجاح", "success")
    }
  }

  // Show document modal
  showDocumentModal(doc) {
    const modal = document.getElementById("documentModal")
    const modalBody = document.getElementById("modalBody")

    modalBody.innerHTML = `
      <div class="document-details">
        <div class="detail-row">
          <strong>العنوان:</strong>
          <span>${doc.title}</span>
        </div>
        <div class="detail-row">
          <strong>الجهة المرسلة:</strong>
          <span>${doc.sender}</span>
        </div>
        <div class="detail-row">
          <strong>تاريخ الاستلام:</strong>
          <span>${this.formatDate(doc.receiveDate)}</span>
        </div>
        <div class="detail-row">
          <strong>رقم الوثيقة:</strong>
          <span>${doc.documentNumber || "غير محدد"}</span>
        </div>
        <div class="detail-row">
          <strong>حجم الوثيقة:</strong>
          <span>${doc.documentSize || "غير محدد"}</span>
        </div>
        <div class="detail-row">
          <strong>الملاحظات:</strong>
          <span>${doc.notes || "لا توجد ملاحظات"}</span>
        </div>
        <div class="detail-row">
          <strong>الحالة:</strong>
          <span class="badge ${this.getStatusClass(doc.status)}">${doc.status}</span>
        </div>
        <div class="detail-row">
          <strong>تاريخ الإنشاء:</strong>
          <span>${this.formatDate(doc.createdAt)}</span>
        </div>
        ${
          doc.files && doc.files.length > 0
            ? `
          <div class="detail-row">
            <strong>الملفات المرفقة:</strong>
            <div class="attached-files">
              ${doc.files
                .map(
                  (file) => `
                <div class="file-item">
                  <i class="fas fa-${this.getFileIcon(file.type)}"></i>
                  <span>${file.name}</span>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
      </div>
    `

    modal.classList.add("show")
  }

  // Populate form with document data
  populateFormWithDocument(doc) {
    const form = document.getElementById("documentForm")
    if (!form) return

    form.querySelector('[name="title"]').value = doc.title || ""
    form.querySelector('[name="sender"]').value = doc.sender || ""
    form.querySelector('[name="receiveDate"]').value = doc.receiveDate || ""
    form.querySelector('[name="documentNumber"]').value = doc.documentNumber || ""
    form.querySelector('[name="documentSize"]').value = doc.documentSize || ""
    form.querySelector('[name="notes"]').value = doc.notes || ""

    // Set selected files if any
    if (doc.files && doc.files.length > 0) {
      this.selectedFiles = [...doc.files]
      this.updateFilePreview()
      this.updateDocumentPreview()
    }
  }

  // Mobile menu functions
  toggleMobileMenu() {
    const sidebar = document.getElementById("sidebar")
    sidebar.classList.toggle("show")
  }

  closeMobileMenu() {
    const sidebar = document.getElementById("sidebar")
    sidebar.classList.remove("show")
  }

  // Modal functions
  closeModal() {
    const modal = document.getElementById("documentModal")
    modal.classList.remove("show")
  }

  // Show notification
  showNotification(message, type = "info", duration = 5000) {
    const container = document.getElementById("notificationContainer")
    const notification = document.createElement("div")

    const icons = {
      success: "check-circle",
      error: "exclamation-circle",
      warning: "exclamation-triangle",
      info: "info-circle",
    }

    notification.className = `notification ${type}`
    notification.innerHTML = `
      <div class="notification-icon">
        <i class="fas fa-${icons[type]}"></i>
      </div>
      <div class="notification-content">
        <h6>${this.getNotificationTitle(type)}</h6>
        <p>${message}</p>
      </div>
      <button class="notification-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `

    container.appendChild(notification)

    // Auto remove
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove()
      }
    }, duration)
  }

  // Get notification title
  getNotificationTitle(type) {
    const titles = {
      success: "نجح",
      error: "خطأ",
      warning: "تحذير",
      info: "إشعار",
    }
    return titles[type] || "إشعار"
  }

  // Update document stats
  updateDocumentStats() {
    // This would update any statistics displays
    console.log(`إجمالي الوثائق: ${this.documents.length}`)
  }

  // Check for unsaved changes
  hasUnsavedChanges(form) {
    const inputs = form.querySelectorAll(".form-control")
    return Array.from(inputs).some((input) => input.value.trim() !== "")
  }

  // Load documents from localStorage
  loadDocuments() {
    try {
      const saved = localStorage.getItem("archiveDocuments")
      return saved ? JSON.parse(saved) : this.getDefaultDocuments()
    } catch (error) {
      console.error("Error loading documents:", error)
      return this.getDefaultDocuments()
    }
  }

  // Save documents to localStorage
  saveDocuments() {
    try {
      localStorage.setItem("archiveDocuments", JSON.stringify(this.documents))
    } catch (error) {
      console.error("Error saving documents:", error)
    }
  }

  // Get default documents
  getDefaultDocuments() {
    return [
      {
        id: "DOC-001",
        title: "أمر إداري رقم 123",
        sender: "وزارة التعليم",
        receiveDate: "2023-12-15",
        documentNumber: "ADM-123",
        documentSize: "2 صفحات",
        notes: "أمر إداري خاص بتنظيم العمل",
        status: "مفعل",
        user: "أحمد محمد",
        createdAt: "2023-12-15T10:00:00Z",
        files: [],
      },
      {
        id: "DOC-002",
        title: "تقرير شهري ديسمبر",
        sender: "إدارة الموارد البشرية",
        receiveDate: "2023-12-14",
        documentNumber: "RPT-202312",
        documentSize: "15 صفحة",
        notes: "تقرير شهري عن الأنشطة والإنجازات",
        status: "قيد المراجعة",
        user: "فاطمة علي",
        createdAt: "2023-12-14T14:30:00Z",
        files: [],
      },
      {
        id: "DOC-003",
        title: "مراسلة رسمية",
        sender: "الجامعة المحلية",
        receiveDate: "2023-12-13",
        documentNumber: "COR-456",
        documentSize: "1 صفحة",
        notes: "مراسلة رسمية بخصوص التعاون",
        status: "مؤرشف",
        user: "محمد خالد",
        createdAt: "2023-12-13T09:15:00Z",
        files: [],
      },
    ]
  }

  // Show filter modal (placeholder)
  showFilterModal() {
    this.showNotification("ميزة الفلترة المتقدمة قيد التطوير", "info")
  }

  // Export functionality
  exportDocuments(format = "excel") {
    this.showNotification(`تصدير البيانات بصيغة ${format} قيد التطوير`, "info")
  }

  // Print functionality
  printDocuments() {
    window.print()
  }

  // Backup functionality
  backupData() {
    const data = {
      documents: this.documents,
      timestamp: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `archive-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    this.showNotification("تم إنشاء نسخة احتياطية بنجاح", "success")
  }

  // Restore functionality
  restoreData(file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.documents && Array.isArray(data.documents)) {
          this.documents = data.documents
          this.saveDocuments()
          this.populateDocumentsTable()
          this.updateDocumentStats()
          this.showNotification("تم استعادة البيانات بنجاح", "success")
        } else {
          throw new Error("تنسيق الملف غير صحيح")
        }
      } catch (error) {
        this.showNotification("خطأ في استعادة البيانات: " + error.message, "error")
      }
    }
    reader.readAsText(file)
  }
}

// Add CSS for additional components
const additionalCSS = `
.badge {
  padding: 0.5rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success { background: linear-gradient(135deg, #27ae60 0%, #229954 100%); color: white; }
.badge-warning { background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); color: white; }
.badge-info { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); color: white; }
.badge-secondary { background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%); color: white; }
.badge-danger { background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; }

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action-small {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  background: #f8f9fa;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.btn-action-small:hover {
  background: var(--primary-blue);
  color: white;
  transform: translateY(-1px);
}

.page-btn {
  padding: 0.5rem 0.75rem;
  border: 2px solid var(--border-color);
  background: white;
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  margin: 0 0.25rem;
}

.page-btn:hover:not(.disabled) {
  border-color: var(--primary-blue);
  color: var(--primary-blue);
}

.page-btn.active {
  background: var(--primary-blue);
  border-color: var(--primary-blue);
  color: white;
}

.page-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-dots {
  padding: 0.5rem;
  color: var(--text-secondary);
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-name {
  font-weight: 500;
}

.file-size {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.file-remove {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: var(--transition);
}

.file-remove:hover {
  background: #e74c3c;
  color: white;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f3f4;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row strong {
  color: var(--text-primary);
  min-width: 120px;
}

.attached-files {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.empty-state {
  padding: 3rem 2rem;
  color: var(--text-secondary);
}

.empty-state i {
  opacity: 0.5;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .page-btn {
    padding: 0.5rem;
    margin: 0 0.125rem;
  }
}
`

// Inject additional CSS
const style = document.createElement("style")
style.textContent = additionalCSS
document.head.appendChild(style)
