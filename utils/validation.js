/**
 * Validation Module
 * Comprehensive validation functions for project data, comments, forms, and security
 */

/**
 * Validate project data
 * @param {Object} projectData - Project data to validate
 * @returns {Object} - Validation result with isValid and errors
 */
function validateProjectData(projectData) {
    const errors = [];
    
    if (!projectData) {
        errors.push('Project data is required');
        return { isValid: false, errors };
    }
    
    // Validate title
    if (!projectData.title || typeof projectData.title !== 'string') {
        errors.push('Project title is required');
    } else if (projectData.title.trim().length < 3) {
        errors.push('Project title must be at least 3 characters long');
    } else if (projectData.title.length > 100) {
        errors.push('Project title must not exceed 100 characters');
    }
    
    // Validate description
    if (!projectData.description || typeof projectData.description !== 'string') {
        errors.push('Project description is required');
    } else if (projectData.description.trim().length < 10) {
        errors.push('Project description must be at least 10 characters long');
    } else if (projectData.description.length > 1000) {
        errors.push('Project description must not exceed 1000 characters');
    }
    
    // Validate URL if provided
    if (projectData.url && !isValidUrl(projectData.url)) {
        errors.push('Invalid project URL format');
    }
    
    // Validate image URL if provided
    if (projectData.imageUrl && !isValidUrl(projectData.imageUrl)) {
        errors.push('Invalid image URL format');
    }
    
    // Validate tags if provided
    if (projectData.tags && !Array.isArray(projectData.tags)) {
        errors.push('Tags must be an array');
    } else if (projectData.tags && projectData.tags.length > 10) {
        errors.push('Maximum 10 tags allowed');
    }
    
    return { isValid: errors.length === 0, errors };
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
function isValidUrl(url) {
    if (typeof url !== 'string') return false;
    
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validate comment text
 * @param {string} text - Comment text to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with isValid and errors
 */
function validateCommentText(text, options = {}) {
    const errors = [];
    const {
        minLength = 1,
        maxLength = 1000,
        allowEmpty = false,
        blockProfanity = false,
        maxLines = 50
    } = options;
    
    if (typeof text !== 'string') {
        errors.push('Comment must be text');
        return { isValid: false, errors };
    }
    
    const trimmedText = text.trim();
    
    if (!allowEmpty && trimmedText.length === 0) {
        errors.push('Comment cannot be empty');
    }
    
    if (trimmedText.length < minLength) {
        errors.push(`Comment must be at least ${minLength} characters long`);
    }
    
    if (trimmedText.length > maxLength) {
        errors.push(`Comment must not exceed ${maxLength} characters`);
    }
    
    // Check line count
    const lines = trimmedText.split('\n');
    if (lines.length > maxLines) {
        errors.push(`Comment must not exceed ${maxLines} lines`);
    }
    
    // Check for excessive caps
    const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
    if (capsRatio > 0.5 && text.length > 10) {
        errors.push('Please avoid excessive use of capital letters');
    }
    
    // Check for excessive repetition
    const words = trimmedText.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const wordCounts = {};
    words.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    const hasExcessiveRepetition = Object.values(wordCounts).some(count => count > 5);
    if (hasExcessiveRepetition && words.length > 10) {
        errors.push('Please avoid excessive repetition of words');
    }
    
    return { isValid: errors.length === 0, errors };
}

/**
 * Validate nickname
 * @param {string} nickname - Nickname to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with isValid and errors
 */
function validateNickname(nickname, options = {}) {
    const errors = [];
    const {
        minLength = 2,
        maxLength = 30,
        allowSpecialChars = false,
        reservedNames = ['admin', 'moderator', 'system']
    } = options;
    
    if (typeof nickname !== 'string') {
        errors.push('Nickname must be text');
        return { isValid: false, errors };
    }
    
    const trimmedNickname = nickname.trim();
    
    if (trimmedNickname.length < minLength) {
        errors.push(`Nickname must be at least ${minLength} characters long`);
    }
    
    if (trimmedNickname.length > maxLength) {
        errors.push(`Nickname must not exceed ${maxLength} characters`);
    }
    
    if (!allowSpecialChars && !/^[a-zA-Z0-9_-]+$/.test(trimmedNickname)) {
        errors.push('Nickname can only contain letters, numbers, hyphens, and underscores');
    }
    
    if (reservedNames.includes(trimmedNickname.toLowerCase())) {
        errors.push('This nickname is reserved');
    }
    
    // Check for excessive repetition of characters
    if (/(.)\1{4,}/.test(trimmedNickname)) {
        errors.push('Nickname cannot contain excessive repetition of characters');
    }
    
    return { isValid: errors.length === 0, errors };
}

/**
 * Validate rating
 * @param {number} rating - Rating to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with isValid and errors
 */
function validateRating(rating, options = {}) {
    const errors = [];
    const {
        min = 1,
        max = 5,
        allowZero = false
    } = options;
    
    if (typeof rating !== 'number' && typeof rating !== 'string') {
        errors.push('Rating must be a number');
        return { isValid: false, errors };
    }
    
    const numRating = Number(rating);
    
    if (isNaN(numRating)) {
        errors.push('Rating must be a valid number');
    } else if (!allowZero && numRating === 0) {
        errors.push('Rating cannot be zero');
    } else if (numRating < min) {
        errors.push(`Rating must be at least ${min}`);
    } else if (numRating > max) {
        errors.push(`Rating must not exceed ${max}`);
    } else if (!Number.isInteger(numRating)) {
        errors.push('Rating must be a whole number');
    }
    
    return { isValid: errors.length === 0, errors };
}

/**
 * Sanitize input to prevent XSS
 * @param {string} input - Input to sanitize
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
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with isValid and errors
 */
function validateFileUpload(file, options = {}) {
    const errors = [];
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        maxWidth = 2000,
        maxHeight = 2000
    } = options;
    
    if (!file) {
        errors.push('File is required');
        return { isValid: false, errors };
    }
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
        errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    
    // Validate file size
    if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
        errors.push(`File size must not exceed ${maxSizeMB}MB`);
    }
    
    // Validate image dimensions if it's an image
    if (file.type.startsWith('image/')) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                if (img.width > maxWidth || img.height > maxHeight) {
                    errors.push(`Image dimensions must not exceed ${maxWidth}x${maxHeight}px`);
                }
                resolve({ isValid: errors.length === 0, errors });
            };
            img.onerror = () => {
                errors.push('Invalid image file');
                resolve({ isValid: false, errors });
            };
            img.src = URL.createObjectURL(file);
        });
    }
    
    return { isValid: errors.length === 0, errors };
}

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @param {Object} validationRules - Validation rules for each field
 * @returns {Object} - Validation result with isValid and errors
 */
function validateFormData(formData, validationRules) {
    const errors = {};
    
    if (!formData || !validationRules) {
        return { isValid: false, errors: { general: ['Form data and validation rules are required'] } };
    }
    
    Object.keys(validationRules).forEach(field => {
        const rules = validationRules[field];
        const value = formData[field];
        const fieldErrors = [];
        
        // Required validation
        if (rules.required && (!value || value.toString().trim().length === 0)) {
            fieldErrors.push(`${field} is required`);
        }
        
        // Type validation
        if (rules.type && value) {
            switch (rules.type) {
                case 'email':
                    if (!isValidEmail(value)) {
                        fieldErrors.push(`${field} must be a valid email address`);
                    }
                    break;
                case 'url':
                    if (!isValidUrl(value)) {
                        fieldErrors.push(`${field} must be a valid URL`);
                    }
                    break;
                case 'number':
                    if (isNaN(Number(value))) {
                        fieldErrors.push(`${field} must be a number`);
                    }
                    break;
            }
        }
        
        // Length validation
        if (rules.minLength && value && value.toString().length < rules.minLength) {
            fieldErrors.push(`${field} must be at least ${rules.minLength} characters`);
        }
        
        if (rules.maxLength && value && value.toString().length > rules.maxLength) {
            fieldErrors.push(`${field} must not exceed ${rules.maxLength} characters`);
        }
        
        // Pattern validation
        if (rules.pattern && value && !rules.pattern.test(value)) {
            fieldErrors.push(`${field} format is invalid`);
        }
        
        if (fieldErrors.length > 0) {
            errors[field] = fieldErrors;
        }
    });
    
    return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result with isValid, errors, and strength score
 */
function validatePasswordStrength(password, options = {}) {
    const errors = [];
    const {
        minLength = 8,
        requireUppercase = true,
        requireLowercase = true,
        requireNumbers = true,
        requireSpecialChars = true,
        minScore = 3
    } = options;
    
    if (typeof password !== 'string') {
        errors.push('Password must be text');
        return { isValid: false, errors, score: 0 };
    }
    
    let score = 0;
    
    // Length check
    if (password.length < minLength) {
        errors.push(`Password must be at least ${minLength} characters long`);
    } else {
        score++;
    }
    
    // Uppercase check
    if (requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    } else if (requireUppercase) {
        score++;
    }
    
    // Lowercase check
    if (requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    } else if (requireLowercase) {
        score++;
    }
    
    // Numbers check
    if (requireNumbers && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    } else if (requireNumbers) {
        score++;
    }
    
    // Special characters check
    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    } else if (requireSpecialChars) {
        score++;
    }
    
    // Additional scoring
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    
    const isValid = score >= minScore;
    
    return { isValid, errors, score };
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
        validateFileUpload,
        validateFormData,
        validatePasswordStrength
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
        validateFileUpload,
        validateFormData,
        validatePasswordStrength
    };
}