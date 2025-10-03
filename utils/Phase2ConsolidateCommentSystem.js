// ... existing code ...

// Merge comment grouping functions
// Extract comment HTML templates
// Centralize comment event handling

/**
 * Date Formatter Module
 * Utility functions for formatting dates and times consistently across the application
 */

/**
 * Format date in a human-readable format
 * @param {Date|string} date - Date object or date string
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format time in a human-readable format
 * @param {Date|string} date - Date object or date string
 * @returns {string} - Formatted time string
 */
function formatTime(date) {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - Date object or date string
 * @returns {string} - Relative time string
 */
function formatRelativeTime(date) {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return formatDate(d);
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
    const d = new Date(timestamp);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    
    if (isToday) {
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } else {
        return d.toLocaleDateString('en-US', {
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatDate,
        formatTime,
        formatRelativeTime,
        groupCommentsByDateAndUser,
        formatCommentTimestamp,
        getCurrentTimestamp,
        parseDate
    };
} else {
    window.DateFormatter = {
        formatDate,
        formatTime,
        formatRelativeTime,
        groupCommentsByDateAndUser,
        formatCommentTimestamp,
        getCurrentTimestamp,
        parseDate
    };
}
// ... existing code ...