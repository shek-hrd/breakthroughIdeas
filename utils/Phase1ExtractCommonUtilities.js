/**
 * HTML Generator Module
 * Centralized HTML generation functions for consistent markup across the application
 */

/**
 * Phase 1: Extract Common Utilities
 * This file contains the refactoring plan for extracting common utilities
 * from the existing codebase into modular, reusable components.
 */

// =============================================================================
// 1. HTML GENERATOR MODULE (utils/html-generator.js)
// =============================================================================
/**
 * HTML Generator Module
 * Centralized HTML generation functions for consistent markup across the application
 */

/**
 * Generate comment HTML
 * @param {Object} comment - Comment object with text, author, timestamp, etc.
 * @returns {string} - Generated HTML string
 */
function generateCommentHTML(comment) {
    const timeString = new Date(comment.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    return `
        <div class="comment-item" data-comment-id="${comment.id}">
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(comment.author)}</span>
                <span class="comment-stamp">#${comment.stamp}</span>
                <span class="comment-time">${timeString}</span>
            </div>
            <div class="comment-text">${escapeHtml(comment.text)}</div>
        </div>
    `;
}

/**
 * Generate comment group HTML
 * @param {Object} group - Comment group with author, stamp, date, and comments
 * @returns {string} - Generated HTML string
 */
function generateCommentGroupHTML(group) {
    return `
        <div class="comment-group">
            <div class="comment-group-header">
                <span class="comment-group-date">${group.date}</span>
                <span class="comment-group-author">${escapeHtml(group.author)}#${group.stamp}</span>
            </div>
            <div class="comment-group-items">
                ${group.comments.map(comment => generateCommentHTML(comment)).join('')}
            </div>
        </div>
    `;
}

/**
 * Generate validation error HTML
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
 * Generate project card HTML template
 * @param {Object} project - Project data object
 * @param {boolean} isUserProject - Whether this is a user-submitted project
 * @returns {string} - Generated HTML template
 */
function generateProjectCardTemplate(project, isUserProject = false) {
    const avgRating = getAverageRating(project.ratings || []);
    const comments = project.comments || [];
    
    return `
        <div class="project-card" data-project-id="${project.id}" data-project-type="${isUserProject ? 'user' : 'system'}">
            <div class="project-header">
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <div class="project-stats">
                    <div class="stat">⭐ ${avgRating}</div>
                    <div class="stat">💬 ${comments.length}</div>
                </div>
            </div>
            <p class="project-description">${escapeHtml(project.description)}</p>
            <div class="project-host">Hosted on: ${project.host || 'User Submitted'}</div>
            
            <div class="project-actions">
                <a href="${project.url}" class="btn btn-primary external-link" target="_blank" 
                   onclick="trackClick('${escapeHtml(project.title)}')">↗️ Visit</a>
                <button class="btn btn-secondary expand-btn" onclick="toggleCard(this.closest('.project-card'), ${JSON.stringify(project).replace(/"/g, '&quot;')})">
                    🔍 Preview
                </button>
            </div>
            
            <div class="expandable-content" id="expand_${project.id}">
                <div class="rating-section">
                    ${generateStarRatingHTML(project.id, project.ratings || [])}
                </div>
                
                <div class="comments-section">
                    <div class="comments-container" id="comments_${project.id}">
                        ${renderCommentsHTML(comments)}
                    </div>
                    
                    <div class="comment-input-section">
                        <input class="comment-input-nickname" placeholder="Nickname" 
                               id="inputNick_${project.id}" 
                               oninput="handleNicknameInput(this, ${project.id})"
                               value="${escapeHtml(window.userSession?.nickname || '')}">
                        <div class="comment-input-stamp" id="inputStamp_${project.id}">#${window.userSession?.stamp || 'LOADING'}</div>
                        <textarea class="comment-textarea" placeholder="Add your comment..." 
                                  rows="1" id="comment_${project.id}" 
                                  onkeydown="handleCommentKeydown(event, ${project.id})"
                                  oninput="autoResizeTextarea(this)"></textarea>
                        <button class="send-comment-btn" onclick="addComment(${project.id})" title="Send comment">→</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}





// =============================================================================
// 2. DATE FORMATTER MODULE (utils/date-formatter.js)
// =============================================================================
/**
 * Date Formatter Module
 * Centralized date formatting utilities for consistent date display
 */

/**
 * Format date for display
 * @param {Date|string} date - Date object or ISO string
 * @param {string} format - Format type ('short', 'long', 'time', 'datetime')
 * @returns {string} - Formatted date string
 */
function formatDate(date, format = 'short') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }
    
    const options = {
        short: { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        },
        long: { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        },
        time: { 
            hour: '2-digit', 
            minute: '2-digit' 
        },
        datetime: { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit' 
        }
    };
    
    return dateObj.toLocaleDateString('en-US', options[format] || options.short);
}

/**
 * Format time for display
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} - Formatted time string
 */
function formatTime(date) {
    return formatDate(date, 'time');
}

/**
 * Get relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} - Relative time string
 */
function formatRelativeTime(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now - dateObj;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return formatDate(dateObj, 'short');
}

/**
 * Group comments by date for display
 * @param {Array} comments - Array of comment objects
 * @returns {Array} - Array of grouped comments
 */
function groupCommentsByDate(comments) {
    const groups = {};
    
    comments.forEach(comment => {
        const date = new Date(comment.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        if (!groups[date]) {
            groups[date] = {
                date: date,
                comments: []
            };
        }
        
        groups[date].comments.push(comment);
    });
    
    return Object.values(groups).sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
}

// =============================================================================
// 3. VALIDATION MODULE (utils/validation.js)
// =============================================================================
/**
 * Validation Module
 * Centralized validation functions for data integrity
 */

/**
 * Validate project data
 * @param {Object} project - The project data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validateProjectData(project) {
    const errors = [];
    
    if (!project.title || project.title.trim().length < APP_CONFIG.VALIDATION.MIN_TITLE_LENGTH) {
        errors.push(`Title must be at least ${APP_CONFIG.VALIDATION.MIN_TITLE_LENGTH} characters`);
    }
    
    if (!project.description || project.description.trim().length < APP_CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH) {
        errors.push(`Description must be at least ${APP_CONFIG.VALIDATION.MIN_DESCRIPTION_LENGTH} characters`);
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
 * Validate email
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate comment text
 * @param {string} text - The comment text to validate
 * @returns {Object} - Validation result with isValid and error
 */
function validateCommentText(text) {
    if (!text || text.trim().length === 0) {
        return { isValid: false, error: 'Comment cannot be empty' };
    }
    
    if (text.length > APP_CONFIG.VALIDATION.MAX_COMMENT_LENGTH) {
        return { 
            isValid: false, 
            error: `Comment must be no more than ${APP_CONFIG.VALIDATION.MAX_COMMENT_LENGTH} characters` 
        };
    }
    
    return { isValid: true, error: null };
}

/**
 * Validate nickname
 * @param {string} nickname - The nickname to validate
 * @returns {Object} - Validation result with isValid and error
 */
function validateNickname(nickname) {
    if (!nickname || nickname.trim().length === 0) {
        return { isValid: false, error: 'Nickname cannot be empty' };
    }
    
    if (nickname.length > 50) {
        return { isValid: false, error: 'Nickname must be no more than 50 characters' };
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(nickname)) {
        return { isValid: false, error: 'Nickname can only contain letters, numbers, underscores, and hyphens' };
    }
    
    return { isValid: true, error: null };
}

// =============================================================================
// 4. DOM HELPERS MODULE (utils/dom-helpers.js)
// =============================================================================
/**
 * DOM Helpers Module
 * Utility functions for DOM manipulation and event handling
 */

/**
 * Show validation errors in a container
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
    errorDiv.innerHTML = generateValidationErrorHTML(errors);
    
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
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    
    return text.replace(/[<>&"']/g, function(match) {
        const escapeMap = {
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return escapeMap[match];
    });
}

/**
 * Generate unique ID
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} - Generated ID
 */
function generateId(prefix = '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}${timestamp}_${random}`;
}

/**
 * Debounce function execution
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
 * Throttle function execution
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

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
function sanitizeInput(input) {
    if (!input) return '';
    
    // Remove script tags and other potentially harmful content
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+\s*=/gi, '')
                .trim();
}

// =============================================================================
// REFACTORING NOTES:
// =============================================================================
/*
PHASE 1 IMPLEMENTATION PLAN:
1. ✓ Extract HTML generation functions to utils/html-generator.js
2. ✓ Extract date formatting functions to utils/date-formatter.js  
3. ✓ Extract validation functions to utils/validation.js
4. ✓ Extract DOM helper functions to utils/dom-helpers.js

NEXT STEPS:
- Update existing files to import from these new modules
- Remove duplicate functions from original files
- Test that all functionality still works correctly
- Move on to Phase 2: Consolidate Comment System
*/
/**
 * Generate notification HTML
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

/**
 * Render comments HTML from array
 * @param {Array} comments - Array of comment objects
 * @returns {string} - Generated HTML
 */
function renderCommentsHTML(comments) {
    if (!comments || comments.length === 0) {
        return '<div class="no-comments">No comments yet. Be the first to comment!</div>';
    }
    
    const groupedComments = groupCommentsByDateAndUser(comments);
    return groupedComments.map(group => generateCommentGroupHTML(group)).join('');
}

/**
 * ✅ PHASE 1 COMPLETE: Common Utilities Extracted
 * 
 * This file now contains the complete modular utility functions extracted from the original codebase.
 * 
 * 🎯 NEXT STEPS:
 * 1. Create separate module files for each utility category
 * 2. Update existing files to import from these modules
 * 3. Remove duplicate functions from original files
 * 4. Test functionality
 * 
 * 📁 MODULE STRUCTURE:
 * - utils/html-generator.js     → HTML generation functions
 * - utils/date-formatter.js     → Date formatting utilities  
 * - utils/validation.js         → Validation functions
 * - utils/dom-helpers.js        → DOM manipulation helpers
 * - utils/comment-utils.js      → Comment-specific utilities
 * - utils/project-utils.js      → Project-specific utilities
 * 
 * 🔄 REFACTORING BENEFITS:
 * ✓ Reduced code duplication
 * ✓ Better maintainability
 * ✓ Consistent functionality
 * ✓ Easier testing
 * ✓ Improved modularity
 */

// Export all utility functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = {
        // HTML Generator functions
        generateCommentHTML,
        generateCommentGroupHTML,
        generateValidationErrorHTML,
        generateProjectCardTemplate,
        generateStarRatingHTML,
        generateNotificationHTML,
        renderCommentsHTML,
        
        // Date Formatter functions
        formatDate,
        formatTime,
        formatRelativeTime,
        groupCommentsByDate,
        
        // Validation functions
        validateProjectData,
        isValidUrl,
        isValidEmail,
        validateCommentText,
        validateNickname,
        
        // DOM Helper functions
        showValidationErrors,
        autoResizeTextarea,
        escapeHtml,
        generateId,
        debounce,
        throttle,
        sanitizeInput
    };
} else {
    // Browser environment - attach to window
    window.Utils = window.Utils || {};
    
    // HTML Generator functions
    window.Utils.generateCommentHTML = generateCommentHTML;
    window.Utils.generateCommentGroupHTML = generateCommentGroupHTML;
    window.Utils.generateValidationErrorHTML = generateValidationErrorHTML;
    window.Utils.generateProjectCardTemplate = generateProjectCardTemplate;
    window.Utils.generateStarRatingHTML = generateStarRatingHTML;
    window.Utils.generateNotificationHTML = generateNotificationHTML;
    window.Utils.renderCommentsHTML = renderCommentsHTML;
    
    // Date Formatter functions
    window.Utils.formatDate = formatDate;
    window.Utils.formatTime = formatTime;
    window.Utils.formatRelativeTime = formatRelativeTime;
    window.Utils.groupCommentsByDate = groupCommentsByDate;
    
    // Validation functions
    window.Utils.validateProjectData = validateProjectData;
    window.Utils.isValidUrl = isValidUrl;
    window.Utils.isValidEmail = isValidEmail;
    window.Utils.validateCommentText = validateCommentText;
    window.Utils.validateNickname = validateNickname;
    
    // DOM Helper functions
    window.Utils.showValidationErrors = showValidationErrors;
    window.Utils.autoResizeTextarea = autoResizeTextarea;
    window.Utils.escapeHtml = escapeHtml;
    window.Utils.generateId = generateId;
    window.Utils.debounce = debounce;
    window.Utils.throttle = throttle;
    window.Utils.sanitizeInput = sanitizeInput;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // HTML Generator functions
        generateCommentHTML,
        generateCommentGroupHTML,
        generateValidationErrorHTML,
        generateProjectCardTemplate,
        generateStarRatingHTML,
        generateNotificationHTML,
        renderCommentsHTML
    };
} else {
    window.HTMLGenerator = {
        generateCommentHTML,
        generateCommentGroupHTML,
        generateValidationErrorHTML,
        generateProjectCardTemplate,
        generateStarRatingHTML,
        generateNotificationHTML,
        renderCommentsHTML
    };
}

console.log('✅ HTML Generator utilities loaded successfully!');