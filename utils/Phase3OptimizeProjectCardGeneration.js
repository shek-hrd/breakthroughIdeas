// Break down createProjectCard() into smaller functions
// Extract template literals into reusable components
// Implement virtual DOM or template caching

// Create: utils/validation.js
/**
 * Validation Module
 * Comprehensive validation functions for user inputs and data integrity
 */

/**
 * Validate project data
 * @param {Object} project - Project object to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
function validateProjectData(project) {
    const errors = [];
    
    if (!project.title || project.title.trim().length === 0) {
        errors.push('Project title is required');
    } else if (project.title.length > VALIDATION.TITLE_MAX_LENGTH) {
        errors.push(`Title must be ${VALIDATION.TITLE_MAX_LENGTH} characters or less`);
    }
    
    if (!project.description || project.description.trim().length === 0) {
        errors.push('Project description is required');
    } else if (project.description.length > VALIDATION.DESC_MAX_LENGTH) {
        errors.push(`Description must be ${VALIDATION.DESC_MAX_LENGTH} characters or less`);
    }
    
    if (project.tags && !Array.isArray(project.tags)) {
        errors.push('Tags must be an array');
    }
    
    if (project.github && !isValidUrl(project.github)) {
        errors.push('GitHub URL must be a valid URL');
    }
    
    if (project.demo && !isValidUrl(project.demo)) {
        errors.push('Demo URL must be a valid URL');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Validate URL
 * @param {string} url - URL string to validate
 * @returns {boolean} - True if valid URL
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate comment text
 * @param {string} text - Comment text to validate
 * @returns {Object} - Validation result with isValid boolean and error message
 */
function validateCommentText(text) {
    if (!text || text.trim().length === 0) {
        return {
            isValid: false,
            error: 'Comment text is required'
        };
    }
    
    if (text.length > VALIDATION.COMMENT_MAX_LENGTH) {
        return {
            isValid: false,
            error: `Comment must be ${VALIDATION.COMMENT_MAX_LENGTH} characters or less`
        };
    }
    
    return {
        isValid: true,
        error: null
    };
}

/**
 * Validate nickname
 * @param {string} nickname - Nickname to validate
 * @returns {Object} - Validation result with isValid boolean and error message
 */
function validateNickname(nickname) {
    if (!nickname || nickname.trim().length === 0) {
        return {
            isValid: false,
            error: 'Nickname is required'
        };
    }
    
    if (nickname.length > 50) {
        return {
            isValid: false,
            error: 'Nickname must be 50 characters or less'
        };
    }
    
    // Check for invalid characters
    const invalidChars = /[<>\"'&]/;
    if (invalidChars.test(nickname)) {
        return {
            isValid: false,
            error: 'Nickname contains invalid characters'
        };
    }
    
    return {
        isValid: true,
        error: null
    };
}

/**
 * Validate rating value
 * @param {number} rating - Rating value to validate
 * @returns {Object} - Validation result with isValid boolean and error message
 */
function validateRating(rating) {
    if (typeof rating !== 'number' || isNaN(rating)) {
        return {
            isValid: false,
            error: 'Rating must be a number'
        };
    }
    
    if (rating < 1 || rating > 5) {
        return {
            isValid: false,
            error: 'Rating must be between 1 and 5'
        };
    }
    
    return {
        isValid: true,
        error: null
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
 * Validate file upload
 * @param {File} file - File object to validate
 * @param {Object} options - Validation options (maxSize, allowedTypes)
 * @returns {Object} - Validation result with isValid boolean and error message
 */
function validateFileUpload(file, options = {}) {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'] } = options;
    
    if (!file) {
        return {
            isValid: false,
            error: 'File is required'
        };
    }
    
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: `File size must be ${maxSize / (1024 * 1024)}MB or less`
        };
    }
    
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'File type not allowed'
        };
    }
    
    return {
        isValid: true,
        error: null
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateProjectData,
        isValidUrl,
        isValidEmail,
        validateCommentText,
        validateNickname,
        validateRating,
        sanitizeInput,
        validateFileUpload
    };
} else {
    window.Validation = {
        validateProjectData,
        isValidUrl,
        isValidEmail,
        validateCommentText,
        validateNickname,
        validateRating,
        sanitizeInput,
        validateFileUpload
    };
}