/**
 * Date Formatter Module
 * Centralized date formatting utilities for consistent date display across the application
 */

/**
 * Format date for display
 * @param {Date|string} date - Date object or ISO string
 * @param {string} format - Format type ('short', 'long', 'time', 'datetime', 'relative')
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
    
    if (format === 'relative') {
        return formatRelativeTime(dateObj);
    }
    
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
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
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

/**
 * Group comments by date and user for better organization
 * @param {Array} comments - Array of comment objects
 * @returns {Array} - Array of grouped comment objects
 */
function groupCommentsByDateAndUser(comments) {
    const groups = {};
    
    comments.forEach(comment => {
        const date = formatDate(comment.timestamp);
        const key = `${date}-${comment.author}-${comment.stamp}`;
        
        if (!groups[key]) {
            groups[key] = {
                date: date,
                author: comment.author,
                stamp: comment.stamp,
                comments: []
            };
        }
        
        groups[key].comments.push(comment);
    });
    
    return Object.values(groups).sort((a, b) => {
        // Sort by date first, then by author/stamp
        const dateCompare = new Date(b.date) - new Date(a.date);
        if (dateCompare !== 0) return dateCompare;
        return a.author.localeCompare(b.author);
    });
}

/**
 * Format timestamp for display in comments
 * @param {Date|string} timestamp - Timestamp to format
 * @returns {string} - Formatted timestamp string
 */
function formatCommentTimestamp(timestamp) {
    const dateObj = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const today = new Date();
    const isToday = dateObj.toDateString() === today.toDateString();
    
    if (isToday) {
        return dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        return dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

/**
 * Get current timestamp in ISO format
 * @returns {string} - ISO timestamp string
 */
function getCurrentTimestamp() {
    return new Date().toISOString();
}

/**
 * Parse and validate date string
 * @param {string} dateString - Date string to parse
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
function parseDate(dateString) {
    try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    } catch (error) {
        return null;
    }
}

/**
 * Check if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if date is today
 */
function isToday(date) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return dateObj.toDateString() === today.toDateString();
}

/**
 * Check if a date is within the last N days
 * @param {Date|string} date - Date to check
 * @param {number} days - Number of days
 * @returns {boolean} - True if date is within the last N days
 */
function isWithinDays(date, days) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now - dateObj;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return diffDays <= days && diffDays >= 0;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatTime,
        formatRelativeTime,
        groupCommentsByDate,
        groupCommentsByDateAndUser,
        formatCommentTimestamp,
        getCurrentTimestamp,
        parseDate,
        isToday,
        isWithinDays
    };
} else {
    window.DateFormatter = {
        formatDate,
        formatTime,
        formatRelativeTime,
        groupCommentsByDate,
        groupCommentsByDateAndUser,
        formatCommentTimestamp,
        getCurrentTimestamp,
        parseDate,
        isToday,
        isWithinDays
    };
}