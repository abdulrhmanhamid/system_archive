// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar navigation
    initSidebar();
    
    // Initialize statistics counters
    initStatCounters();
    
    // Initialize storage progress bar
    initStorageProgress();
    
    // Add event listeners for stat boxes to show details
    document.querySelectorAll('.stat-box').forEach(box => {
        box.addEventListener('click', function() {
            const statType = this.querySelector('.stat-label').textContent;
            const statValue = this.querySelector('.stat-value').textContent;
            
            showToast(`تفاصيل ${statType}: ${statValue}`, 'primary');
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
/*
// Handle navigation based on menu item

*/
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

// Initialize storage progress bar
function initStorageProgress() {
    const progressBar = document.querySelector('.storage-progress .progress-bar');
    const currentWidth = progressBar.style.width;
    
    // Reset width to 0
    progressBar.style.width = '0%';
    
    // Animate width to target value
    setTimeout(() => {
        progressBar.style.transition = 'width 1.5s ease-in-out';
        progressBar.style.width = currentWidth;
    }, 300);
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 start-0 p-3';
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