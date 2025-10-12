/**
 * Common JavaScript functions for the blog admin dashboard
 */

// Global variables
let currentToast = null;

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCommonFeatures();
});

/**
 * Initialize common features across all pages
 */
function initializeCommonFeatures() {
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize confirmation dialogs
    initializeConfirmationDialogs();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize auto-save functionality
    initializeAutoSave();
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success', duration = 3000) {
    // Remove existing toast if any
    if (currentToast) {
        currentToast.remove();
    }

    // Create toast element
    const toastHtml = `
        <div class="toast align-items-center text-white bg-${type} border-0 alert-floating" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    // Add to page
    document.body.insertAdjacentHTML('beforeend', toastHtml);
    currentToast = document.querySelector('.toast:last-child');

    // Initialize and show toast
    const toast = new bootstrap.Toast(currentToast, {
        autohide: true,
        delay: duration
    });
    toast.show();

    // Clean up after toast is hidden
    currentToast.addEventListener('hidden.bs.toast', function() {
        currentToast.remove();
        currentToast = null;
    });
}

/**
 * Initialize confirmation dialogs for dangerous actions
 */
function initializeConfirmationDialogs() {
    // Add confirmation to delete buttons
    document.addEventListener('click', function(e) {
        if (e.target.matches('[data-action="delete"]') || 
            e.target.closest('[data-action="delete"]')) {
            
            const element = e.target.matches('[data-action="delete"]') ? 
                           e.target : e.target.closest('[data-action="delete"]');
            
            const confirmMessage = element.getAttribute('data-confirm') || 
                                 'Bạn có chắc chắn muốn xóa item này?';
            
            if (!confirm(confirmMessage)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    // Add real-time validation to forms
    const forms = document.querySelectorAll('form[data-validate="true"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                showToast('Vui lòng kiểm tra lại thông tin form!', 'danger');
            }
            form.classList.add('was-validated');
        });

        // Real-time validation for inputs
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                }
            });
        });
    });
}

/**
 * Initialize auto-save functionality
 */
function initializeAutoSave() {
    const autoSaveForms = document.querySelectorAll('form[data-autosave="true"]');
    
    autoSaveForms.forEach(form => {
        const inputs = form.querySelectorAll('input, select, textarea');
        let autoSaveTimer;
        
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                clearTimeout(autoSaveTimer);
                autoSaveTimer = setTimeout(() => {
                    saveFormData(form);
                }, 2000); // Auto-save after 2 seconds of inactivity
            });
        });
    });
}

/**
 * Save form data to localStorage
 */
function saveFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    const formId = form.id || 'default-form';
    localStorage.setItem(`autosave-${formId}`, JSON.stringify(data));
    
    showToast('Đã tự động lưu!', 'info', 1000);
}

/**
 * Load form data from localStorage
 */
function loadFormData(formId) {
    const savedData = localStorage.getItem(`autosave-${formId}`);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        const form = document.getElementById(formId);
        
        if (form) {
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    input.value = data[key];
                }
            });
            
            showToast('Đã khôi phục dữ liệu đã lưu!', 'info');
        }
    }
}

/**
 * Clear saved form data
 */
function clearFormData(formId) {
    localStorage.removeItem(`autosave-${formId}`);
}

/**
 * Format date for display
 */
function formatDate(date, format = 'dd/mm/yyyy') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    
    switch (format) {
        case 'dd/mm/yyyy':
            return `${day}/${month}/${year}`;
        case 'yyyy-mm-dd':
            return `${year}-${month}-${day}`;
        case 'dd/mm/yyyy hh:mm':
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        default:
            return d.toLocaleDateString();
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 */
function checkPasswordStrength(password) {
    const strength = {
        score: 0,
        feedback: []
    };
    
    if (password.length >= 8) {
        strength.score += 1;
    } else {
        strength.feedback.push('Ít nhất 8 ký tự');
    }
    
    if (/[a-z]/.test(password)) {
        strength.score += 1;
    } else {
        strength.feedback.push('Có chữ thường');
    }
    
    if (/[A-Z]/.test(password)) {
        strength.score += 1;
    } else {
        strength.feedback.push('Có chữ hoa');
    }
    
    if (/[0-9]/.test(password)) {
        strength.score += 1;
    } else {
        strength.feedback.push('Có số');
    }
    
    if (/[^a-zA-Z0-9]/.test(password)) {
        strength.score += 1;
    } else {
        strength.feedback.push('Có ký tự đặc biệt');
    }
    
    return strength;
}

/**
 * Debounce function for search inputs
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show loading spinner on button
 */
function showButtonLoading(button, text = 'Đang xử lý...') {
    const originalText = button.innerHTML;
    button.setAttribute('data-original-text', originalText);
    button.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ${text}
    `;
    button.disabled = true;
}

/**
 * Hide loading spinner on button
 */
function hideButtonLoading(button) {
    const originalText = button.getAttribute('data-original-text');
    if (originalText) {
        button.innerHTML = originalText;
    }
    button.disabled = false;
}

/**
 * AJAX helper function
 */
function makeRequest(url, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    };
    
    const config = { ...defaultOptions, ...options };
    
    return fetch(url, config)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Request failed:', error);
            showToast('Có lỗi xảy ra khi xử lý yêu cầu!', 'danger');
            throw error;
        });
}

/**
 * Export data as CSV
 */
function exportToCSV(data, filename = 'export.csv') {
    const csvContent = data.map(row => 
        row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

/**
 * Initialize page-specific functionality
 */
function initializePage(pageName) {
    switch (pageName) {
        case 'posts':
            initializePostsPage();
            break;
        case 'users':
            initializeUsersPage();
            break;
        case 'categories':
            initializeCategoriesPage();
            break;
        case 'comments':
            initializeCommentsPage();
            break;
        default:
            console.log(`No specific initialization for page: ${pageName}`);
    }
}

// Page-specific initialization functions
function initializePostsPage() {
    console.log('Initializing posts page...');
    // Add posts-specific functionality here
}

function initializeUsersPage() {
    console.log('Initializing users page...');
    // Add users-specific functionality here
}

function initializeCategoriesPage() {
    console.log('Initializing categories page...');
    // Add categories-specific functionality here
}

function initializeCommentsPage() {
    console.log('Initializing comments page...');
    // Add comments-specific functionality here
}