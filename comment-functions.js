/**
 * Comment Functions Module
 * Handles comment functionality, user interactions, and form validation
 * 
 * @deprecated This module is being replaced by utils/comment-system.js
 * New code should use the consolidated comment system from utils/comment-system.js
 */

// Import the new consolidated comment system
// Note: In a browser environment, these functions will be available globally
// after the script is loaded. In Node.js, use require().

/**
 * Add a comment to a project
 * @param {string} projectId - The ID of the project
 * @param {HTMLElement} textarea - The textarea element containing the comment
 * @deprecated Use addComment from utils/comment-system.js instead
 */
async function addComment(projectId, textarea) {
    console.warn('addComment from comment-functions.js is deprecated. Use addComment from utils/comment-system.js instead.');
    
    try {
        // Delegate to the new consolidated comment system
        if (typeof addCommentFromUtils !== 'undefined') {
            return await addCommentFromUtils(projectId, textarea);
        }
        
        // Fallback to the old implementation if the new one is not available
        const commentText = sanitizeInput(textarea.value.trim());
        const projectCard = textarea.closest('.project-card');
        const nicknameInput = projectCard?.querySelector(`[id*="nickname"]`) || document.getElementById(`nickname_${projectId}`);
        const nickname = sanitizeInput(nicknameInput?.textContent?.trim() || nicknameInput?.value?.trim() || '');
        
        // Validation
        if (!commentText) {
            alert('Please enter a comment');
            return;
        }
        
        if (commentText.length > APP_CONFIG.VALIDATION.MAX_COMMENT_LENGTH) {
            alert(`Comment must not exceed ${APP_CONFIG.VALIDATION.MAX_COMMENT_LENGTH} characters`);
            return;
        }
        
        // Rate limiting check
        const now = Date.now();
        if (now - rateLimitTracker.lastCommentTime < APP_CONFIG.RATE_LIMITING.COMMENT_COOLDOWN) {
            const remainingTime = APP_CONFIG.RATE_LIMITING.COMMENT_COOLDOWN - (now - rateLimitTracker.lastCommentTime);
            alert(`Please wait ${Math.ceil(remainingTime / 1000)} seconds before commenting again.`);
            return;
        }
        
        // Update session nickname if changed
        if (nickname && nickname !== userSession.nickname) {
            await userSession.setNickname(nickname);
        }
        
        const comment = {
            author: nickname,
            stamp: userSession.stamp,
            text: commentText,
            timestamp: new Date().toISOString()
        };
        
        const comments = await userSession.storage.getItem(`comments.${projectId}`) || [];
        comments.push(comment);
        await userSession.storage.setItem(`comments.${projectId}`, comments);
        
        // Log comment activity with enhanced details
        await userSession.logActivity('comment_added', {
            projectId: projectId,
            commentLength: commentText.length,
            hasNickname: !!nickname,
            nickname: nickname,
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        });
        
        // Update rate limit tracker
        rateLimitTracker.lastCommentTime = Date.now();
        
        // Update comments display without full reload
        const commentsContainer = document.getElementById(`comments_${projectId}`);
        if (commentsContainer) {
            commentsContainer.innerHTML = comments.map(comment => createCommentHTML(comment)).join('');
        }
        
        // Clear form and reset textarea height
        textarea.value = '';
        textarea.style.height = 'auto';
        
        // Update comment count in stats
        const card = document.getElementById(`comments_${projectId}`).closest('.project-card');
        if (card) {
            const commentStat = card.querySelector('.stat:nth-child(2)');
            if (commentStat) {
                commentStat.textContent = `💬 ${comments.length}`;
            }
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        alert('Failed to add comment. Please try again.');
    }
}

/**
 * Show author tooltip with user information
 * @param {Event} event - The mouse event
 * @param {string} author - The author's name
 * @param {string} stamp - The user's stamp
 * @deprecated Use showAuthorTooltip from utils/comment-system.js instead
 */
async function showAuthorTooltip(event, author, stamp) {
    console.warn('showAuthorTooltip from comment-functions.js is deprecated. Use showAuthorTooltip from utils/comment-system.js instead.');
    
    try {
        // Delegate to the new consolidated comment system
        if (typeof showAuthorTooltipFromUtils !== 'undefined') {
            return await showAuthorTooltipFromUtils(event.target, author, stamp, event);
        }
        
        // Fallback to the old implementation
        const allUsers = await userSession.storage.getItem('users.allUsers') || [];
        const user = allUsers.find(u => u.stamp === stamp);
        
        const tooltip = document.getElementById('authorTooltip');
        let content = `User: ${author}#${stamp}`;
        
        if (user && user.details) {
            if (user.details.email) content += `<br>Email: ${user.details.email}`;
            if (user.details.phone) content += `<br>Phone: ${user.details.phone}`;
            if (user.details.wallet) content += `<br>Wallet: ${user.details.wallet}`;
        }
        
        tooltip.innerHTML = content;
        tooltip.style.display = 'block';
        tooltip.style.left = event.pageX + 10 + 'px';
        tooltip.style.top = event.pageY + 10 + 'px';
        
        setTimeout(() => tooltip.style.display = 'none', 3000);
    } catch (error) {
        console.error('Error showing author tooltip:', error);
    }
}

/**
 * Show author information (alias for showAuthorTooltip)
 * @param {Event} event - The mouse event
 * @param {string} author - The author's name
 * @param {string} stamp - The user's stamp
 * @deprecated Use showAuthorTooltip from utils/comment-system.js instead
 */
function showAuthorInfo(event, author, stamp) {
    console.warn('showAuthorInfo from comment-functions.js is deprecated. Use showAuthorTooltip from utils/comment-system.js instead.');
    showAuthorTooltip(event, author, stamp);
}

/**
 * Handle nickname input changes
 * @param {HTMLElement} element - The nickname input element
 * @param {string} projectId - The project ID
 * @deprecated Use handleNicknameInput from utils/comment-system.js instead
 */
function handleNicknameInput(element, projectId) {
    console.warn('handleNicknameInput from comment-functions.js is deprecated. Use handleNicknameInput from utils/comment-system.js instead.');
    
    try {
        // Delegate to the new consolidated comment system
        if (typeof handleNicknameInputFromUtils !== 'undefined') {
            return handleNicknameInputFromUtils(element, projectId);
        }
        
        // Fallback to the old implementation
        if (element.textContent.trim() === '') {
            element.classList.add('placeholder');
        } else {
            element.classList.remove('placeholder');
        }
    } catch (error) {
        console.error('Error handling nickname input:', error);
    }
}

/**
 * Handle nickname keydown events
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} projectId - The project ID
 * @deprecated Use handleNicknameKeydown from utils/comment-system.js instead
 */
function handleNicknameKeydown(event, projectId) {
    console.warn('handleNicknameKeydown from comment-functions.js is deprecated. Use handleNicknameKeydown from utils/comment-system.js instead.');
    
    try {
        // Delegate to the new consolidated comment system
        if (typeof handleNicknameKeydownFromUtils !== 'undefined') {
            return handleNicknameKeydownFromUtils(event, event.target, projectId);
        }
        
        // Fallback to the old implementation
        if (event.key === 'Enter') {
            event.preventDefault();
            const commentTextarea = document.getElementById(`comment_${projectId}`);
            if (commentTextarea) {
                commentTextarea.focus();
            }
        }
    } catch (error) {
        console.error('Error handling nickname keydown:', error);
    }
}

/**
 * Handle comment textarea keydown events
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} projectId - The project ID
 * @deprecated Use handleCommentKeydown from utils/comment-system.js instead
 */
function handleCommentKeydown(event, projectId) {
    console.warn('handleCommentKeydown from comment-functions.js is deprecated. Use handleCommentKeydown from utils/comment-system.js instead.');
    
    try {
        // Delegate to the new consolidated comment system
        if (typeof handleCommentKeydownFromUtils !== 'undefined') {
            return handleCommentKeydownFromUtils(event, projectId, event.target);
        }
        
        // Fallback to the old implementation
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const textarea = event.target;
            addComment(projectId, textarea);
        }
    } catch (error) {
        console.error('Error handling comment keydown:', error);
    }
}

/**
 * Group comments by date and user for better organization
 * @param {Array} comments - Array of comment objects
 * @returns {Object} Grouped comments
 * @deprecated Use groupCommentsByDateAndUser from utils/date-formater.js or utils/html-generator.js instead
 */
function groupCommentsByDateAndUser(comments) {
    console.warn('groupCommentsByDateAndUser from comment-functions.js is deprecated. Use groupCommentsByDateAndUser from utils/date-formater.js or utils/html-generator.js instead.');
    
    try {
        // Delegate to utility function if available
        if (typeof window.groupCommentsByDateAndUser !== 'undefined') {
            return window.groupCommentsByDateAndUser(comments);
        }
        
        // Fallback implementation
        const grouped = {};
        
        comments.forEach(comment => {
            const date = new Date(comment.timestamp).toDateString();
            const key = `${date}_${comment.author}_${comment.stamp}`;
            
            if (!grouped[key]) {
                grouped[key] = {
                    date,
                    author: comment.author,
                    stamp: comment.stamp,
                    comments: []
                };
            }
            
            grouped[key].comments.push(comment);
        });
        
        return grouped;
    } catch (error) {
        console.error('Error grouping comments:', error);
        return {};
    }
}

/**
 * Create HTML for a single comment
 * @param {Object} comment - The comment object
 * @returns {string} HTML string for the comment
 * @deprecated Use generateCommentHTML from utils/html-generator.js instead
 */
function createCommentHTML(comment) {
    console.warn('createCommentHTML from comment-functions.js is deprecated. Use generateCommentHTML from utils/html-generator.js instead.');
    
    try {
        // Delegate to utility function if available
        if (typeof window.generateCommentHTML !== 'undefined') {
            return window.generateCommentHTML(comment);
        }
        
        // Fallback implementation
        const timestamp = new Date(comment.timestamp);
        const timeString = timestamp.toLocaleTimeString();
        
        return `
            <div class="comment">
                <div class="comment-header">
                    <span class="comment-author" 
                          onmouseover="showAuthorInfo(event, '${comment.author}', '${comment.stamp}')"
                          style="cursor: pointer;">
                        ${comment.author}#${comment.stamp}
                    </span>
                    <span class="comment-time">${timeString}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
            </div>
        `;
    } catch (error) {
        console.error('Error creating comment HTML:', error);
        return '<div class="comment error">Error displaying comment</div>';
    }
}

/**
 * Render grouped comments
 * @param {Object} groupedComments - Grouped comments object
 * @returns {string} HTML string for grouped comments
 * @deprecated Use renderCommentsHTML from utils/html-generator.js instead
 */
function renderGroupedComments(groupedComments) {
    console.warn('renderGroupedComments from comment-functions.js is deprecated. Use renderCommentsHTML from utils/html-generator.js instead.');
    
    try {
        // Delegate to utility function if available
        if (typeof window.renderCommentsHTML !== 'undefined') {
            return window.renderCommentsHTML(groupedComments);
        }
        
        // Fallback implementation
        return Object.values(groupedComments)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(group => {
                const date = new Date(group.date).toLocaleDateString();
                return `
                    <div class="comment-group">
                        <div class="comment-group-header">
                            <span class="comment-group-date">${date}</span>
                            <span class="comment-group-author">${group.author}#${group.stamp}</span>
                        </div>
                        ${group.comments.map(comment => createCommentHTML(comment)).join('')}
                    </div>
                `;
            }).join('');
    } catch (error) {
        console.error('Error rendering grouped comments:', error);
        return '<div class="comment-error">Error displaying comments</div>';
    }
}

/**
 * Initialize comment input event handlers
 * @deprecated Use initializeCommentEvents from utils/comment-system.js instead
 */
function initializeCommentEvents() {
    console.warn('initializeCommentEvents from comment-functions.js is deprecated. Use initializeCommentEvents from utils/comment-system.js instead.');
    
    try {
        // Delegate to the new consolidated comment system
        if (typeof initializeCommentEventsFromUtils !== 'undefined') {
            return initializeCommentEventsFromUtils();
        }
        
        // Fallback implementation
        // Nickname input handler
        const nicknameInput = document.getElementById('userNick');
        if (nicknameInput) {
            nicknameInput.addEventListener('input', function() {
                const nickname = this.value.trim();
                if (nickname) {
                    UserSession.updateNickname(nickname);
                }
            });
        }
        
        // Comment input handler
        const commentInput = document.getElementById('commentText');
        if (commentInput) {
            commentInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    const projectId = this.closest('.project-card')?.dataset.projectId;
                    if (projectId) {
                        addComment(projectId);
                    }
                }
            });
            
            // Auto-resize textarea
            commentInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        }
    } catch (error) {
        console.error('Error initializing comment events:', error);
    }
}

/**
 * Migration helper to check if the new comment system is available
 * @returns {boolean} True if the new comment system is loaded
 */
function isNewCommentSystemAvailable() {
    return typeof addCommentFromUtils !== 'undefined' &&
           typeof displayComments !== 'undefined' &&
           typeof showAuthorTooltipFromUtils !== 'undefined';
}

/**
 * Migration helper to get a function from the new comment system
 * @param {string} functionName - Name of the function to get
 * @returns {Function|null} The function if available, null otherwise
 */
function getNewCommentFunction(functionName) {
    const functionMap = {
        'addComment': 'addCommentFromUtils',
        'displayComments': 'displayComments',
        'showAuthorTooltip': 'showAuthorTooltipFromUtils',
        'handleNicknameInput': 'handleNicknameInputFromUtils',
        'handleCommentKeydown': 'handleCommentKeydownFromUtils',
        'handleNicknameKeydown': 'handleNicknameKeydownFromUtils',
        'initializeCommentEvents': 'initializeCommentEventsFromUtils'
    };
    
    const newFunctionName = functionMap[functionName];
    if (newFunctionName && typeof window[newFunctionName] !== 'undefined') {
        return window[newFunctionName];
    }
    
    return null;
}

/**
 * Migration helper to redirect to the new comment system
 * @param {string} functionName - Name of the function to redirect
 * @param {...any} args - Arguments to pass to the function
 * @returns {any} Result from the new function
 */
function redirectToNewSystem(functionName, ...args) {
    const newFunction = getNewCommentFunction(functionName);
    if (newFunction) {
        console.log(`Redirecting ${functionName} to new comment system`);
        return newFunction(...args);
    }
    
    console.warn(`New ${functionName} not available, using legacy implementation`);
    return null;
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Legacy functions (deprecated)
        addComment,
        displayComments,
        showAuthorTooltip,
        showAuthorInfo,
        handleNicknameInput,
        handleNicknameKeydown,
        handleCommentKeydown,
        groupCommentsByDateAndUser,
        renderGroupedComments,
        createCommentHTML,
        initializeCommentEvents,
        
        // Migration helpers
        isNewCommentSystemAvailable,
        getNewCommentFunction,
        redirectToNewSystem
    };
}