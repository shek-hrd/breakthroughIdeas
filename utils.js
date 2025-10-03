
/**
 * Utility Functions Module
 * Contains helper functions for validation, UI manipulation, and general utilities
 */

/**
 * Validate project data
 * @param {Object} project - The project data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validateProjectData(project) {
    const errors = [];
    
    if (!project.title || project.title.trim().length < 3) {
        errors.push('Title must be at least 3 characters');
    }
    
    if (!project.description || project.description.trim().length < 10) {
        errors.push('Description must be at least 10 characters');
    }
    
    if (!project.tags || !Array.isArray(project.tags) || project.tags.length === 0) {
        errors.push('At least one tag is required');
    }
    
    if (project.tags && project.tags.length > 10) {
        errors.push('Maximum 10 tags allowed');
    }
    
    if (project.link && !isValidUrl(project.link)) {
        errors.push('Project link must be a valid URL');
    }
    
    if (project.demo && !isValidUrl(project.demo)) {
        errors.push('Demo link must be a valid URL');
    }
    
    if (project.github && !isValidUrl(project.github)) {
        errors.push('GitHub link must be a valid URL');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid URL
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Show validation errors
 * @param {Array} errors - Array of error messages
 * @param {HTMLElement} container - Container to display errors
 */
function showValidationErrors(errors, container) {
    if (!container) return;
    
    // Clear existing errors
    const existingErrors = container.querySelector('.validation-errors');
    if (existingErrors) {
        existingErrors.remove();
    }
    
    if (errors.length === 0) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'validation-errors';
    errorDiv.style.cssText = `
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 4px;
        padding: 10px;
        margin: 10px 0;
        color: #c33;
    `;
    
    const errorList = document.createElement('ul');
    errorList.style.margin = '5px 0';
    errorList.style.paddingLeft = '20px';
    
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        errorList.appendChild(li);
    });
    
    errorDiv.appendChild(errorList);
    container.appendChild(errorDiv);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

/**
 * Auto-resize textarea based on content
 * @param {HTMLElement} textarea - The textarea element
 */
function autoResizeTextarea(textarea) {
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
    });
}

/**
 * Track click events
 * @param {Event} event - The click event
 * @param {string} elementType - Type of element clicked
 */
function trackClick(event, elementType) {
    const target = event.target;
    const timestamp = new Date().toISOString();
    
    const clickData = {
        elementType: elementType,
        elementId: target.id,
        elementClass: target.className,
        elementText: target.textContent?.substring(0, 50),
        timestamp: timestamp,
        coordinates: {
            x: event.clientX,
            y: event.clientY
        }
    };
    
    // Store click data
    const clicks = JSON.parse(localStorage.getItem('clickTracking') || '[]');
    clicks.push(clickData);
    
    // Keep only last 100 clicks
    if (clicks.length > 100) {
        clicks.splice(0, clicks.length - 100);
    }
    
    localStorage.setItem('clickTracking', JSON.stringify(clicks));
}

/**
 * Copy text to clipboard
 * @param {string} text - The text to copy
 * @returns {Promise<boolean>} - True if successful
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            return fallbackCopyText(text);
        }
    } catch (error) {
        console.error('Failed to copy text:', error);
        return fallbackCopyText(text);
    }
}

/**
 * Fallback method for copying text
 * @param {string} text - The text to copy
 * @returns {boolean} - True if successful
 */
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (error) {
        console.error('Fallback copy failed:', error);
        document.body.removeChild(textArea);
        return false;
    }
}

/**
 * Show copy success notification
 * @param {HTMLElement} element - Element to show notification near
 */
function showCopySuccess(element) {
    if (!element) return;
    
    const notification = document.createElement('div');
    notification.textContent = 'Copied!';
    notification.style.cssText = `
        position: absolute;
        background: #4CAF50;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const rect = element.getBoundingClientRect();
    notification.style.left = (rect.right + 10) + 'px';
    notification.style.top = rect.top + 'px';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 1500);
}

/**
 * Format date for display
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return d.toLocaleDateString();
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - The text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} - Unique ID
 */
function generateId(prefix = '') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
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
 * Sanitize input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized input string
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>"'&]/g, function(match) {
        const entityMap = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '&': '&amp;'
        };
        return entityMap[match];
    });
}

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateProjectData,
        isValidUrl,
        showValidationErrors,
        autoResizeTextarea,
        trackClick,
        copyToClipboard,
        fallbackCopyText,
        showCopySuccess,
        formatDate,
        escapeHtml,
        generateId,
        debounce,
        throttle
    };
}