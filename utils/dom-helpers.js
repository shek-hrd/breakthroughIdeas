/**
 * DOM Helpers Module
 * Utility functions for DOM manipulation, event handling, and UI interactions
 */

/**
 * Show validation errors in the UI
 * @param {HTMLElement} container - Container element to display errors
 * @param {Array} errors - Array of error messages
 */
function showValidationErrors(container, errors) {
    if (!container) return;
    
    // Remove existing validation errors
    const existingErrors = container.querySelector('.validation-errors');
    if (existingErrors) {
        existingErrors.remove();
    }
    
    if (errors.length === 0) return;
    
    const errorHTML = generateValidationErrorHTML(errors);
    container.insertAdjacentHTML('afterbegin', errorHTML);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const errorDiv = container.querySelector('.validation-errors');
        if (errorDiv) {
            errorDiv.remove();
        }
    }, 5000);
}

/**
 * Auto-resize textarea based on content
 * @param {HTMLTextAreaElement} textarea - Textarea element to resize
 */
function autoResizeTextarea(textarea) {
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    
    // Add event listener if not already added
    if (!textarea.dataset.autoResize) {
        textarea.dataset.autoResize = 'true';
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        });
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    if (typeof text !== 'string') return text;
    
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} - Generated unique ID
 */
function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function to limit execution frequency
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
 * Throttle function to limit execution frequency
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

/**
 * Add event listener with automatic cleanup
 * @param {HTMLElement} element - Element to add listener to
 * @param {string} event - Event name
 * @param {Function} handler - Event handler function
 * @returns {Function} - Cleanup function to remove the listener
 */
function addEventListenerWithCleanup(element, event, handler) {
    if (!element || !event || !handler) return () => {};
    
    element.addEventListener(event, handler);
    
    return () => {
        element.removeEventListener(event, handler);
    };
}

/**
 * Show loading state on button
 * @param {HTMLButtonElement} button - Button element
 * @param {boolean} isLoading - Whether to show loading state
 */
function setButtonLoadingState(button, isLoading) {
    if (!button) return;
    
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.textContent = 'Loading...';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || button.textContent;
    }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Message type ('success', 'error', 'warning', 'info')
 * @param {number} duration - Duration to show message in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = generateNotificationHTML(message, type);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, duration);
}

/**
 * Smooth scroll to element
 * @param {HTMLElement} element - Element to scroll to
 * @param {number} offset - Optional offset from top
 */
function smoothScrollTo(element, offset = 0) {
    if (!element) return;
    
    const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
    const scrollPosition = elementTop - offset;
    
    window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
    });
}

/**
 * Get element by selector with error handling
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element to search within (default: document)
 * @returns {HTMLElement|null} - Found element or null
 */
function getElement(selector, parent = document) {
    try {
        return parent.querySelector(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return null;
    }
}

/**
 * Get elements by selector with error handling
 * @param {string} selector - CSS selector
 * @param {HTMLElement} parent - Parent element to search within (default: document)
 * @returns {NodeList} - Found elements (empty NodeList if error)
 */
function getElements(selector, parent = document) {
    try {
        return parent.querySelectorAll(selector);
    } catch (error) {
        console.warn(`Invalid selector: ${selector}`, error);
        return document.querySelectorAll(''); // Return empty NodeList
    }
}

/**
 * Create element with attributes and children
 * @param {string} tagName - HTML tag name
 * @param {Object} attributes - Attributes to set
 * @param {Array} children - Child elements or text
 * @returns {HTMLElement} - Created element
 */
function createElement(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName);
    
    // Set attributes
    Object.keys(attributes).forEach(key => {
        if (key === 'className') {
            element.className = attributes[key];
        } else if (key === 'style' && typeof attributes[key] === 'object') {
            Object.assign(element.style, attributes[key]);
        } else {
            element.setAttribute(key, attributes[key]);
        }
    });
    
    // Add children
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else if (child instanceof HTMLElement) {
            element.appendChild(child);
        }
    });
    
    return element;
}

/**
 * Generate validation error HTML (helper function)
 * @param {Array} errors - Array of error messages
 * @returns {string} - Generated HTML string
 */
function generateValidationErrorHTML(errors) {
    if (errors.length === 0) return '';
    
    return `
        <div class="validation-errors" style="
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 4px;
            padding: 10px;
            margin: 10px 0;
            color: #c33;
        ">
            <ul style="margin: 5px 0; padding-left: 20px;">
                ${errors.map(error => `<li>${escapeHtml(error)}</li>`).join('')}
            </ul>
        </div>
    `;
}

/**
 * Generate notification HTML (helper function)
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'warning', 'info')
 * @returns {string} - Generated HTML
 */
function generateNotificationHTML(message, type = 'info') {
    const typeStyles = {
        success: { bg: '#d4edda', border: '#c3e6cb', color: '#155724' },
        error: { bg: '#f8d7da', border: '#f5c6cb', color: '#721c24' },
        warning: { bg: '#fff3cd', border: '#ffeeba', color: '#856404' },
        info: { bg: '#d1ecf1', border: '#bee5eb', color: '#0c5460' }
    };
    
    const style = typeStyles[type] || typeStyles.info;
    
    return `
        <div class="notification notification-${type}" style="
            background: ${style.bg};
            border: 1px solid ${style.border};
            color: ${style.color};
            border-radius: 4px;
            padding: 12px;
            margin: 10px 0;
            position: relative;
        ">
            <span class="notification-message">${escapeHtml(message)}</span>
            <button class="notification-close" onclick="this.parentElement.remove()" 
                    style="position: absolute; right: 8px; top: 8px; background: none; border: none; 
                           color: inherit; font-size: 18px; cursor: pointer;">×</button>
        </div>
    `;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showValidationErrors,
        autoResizeTextarea,
        escapeHtml,
        generateId,
        debounce,
        throttle,
        sanitizeInput,
        addEventListenerWithCleanup,
        setButtonLoadingState,
        showNotification,
        smoothScrollTo,
        getElement,
        getElements,
        createElement,
        generateValidationErrorHTML,
        generateNotificationHTML
    };
} else {
    window.DOMHelpers = {
        showValidationErrors,
        autoResizeTextarea,
        escapeHtml,
        generateId,
        debounce,
        throttle,
        sanitizeInput,
        addEventListenerWithCleanup,
        setButtonLoadingState,
        showNotification,
        smoothScrollTo,
        getElement,
        getElements,
        createElement,
        generateValidationErrorHTML,
        generateNotificationHTML
    };
}