/**
 * Comment Functions Module
 * Handles comment functionality, user interactions, and form validation
 */

// Comment Functions
// Functions for handling comment operations, validation, and display

/**
 * Add a comment to a project
 * @param {string} projectId - The ID of the project
 * @param {HTMLElement} textarea - The textarea element containing the comment
 */
async function addComment(projectId, textarea) {
    try {
        const commentText = sanitizeInput(textarea.value.trim());
        const nicknameInput = document.getElementById(`nickname_${projectId}`);
        const nickname = sanitizeInput(nicknameInput.textContent.trim());
        
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
        
        // Clear form
        textarea.value = '';
        
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
 */
async function showAuthorTooltip(event, author, stamp) {
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
}

/**
 * Show author information (alias for showAuthorTooltip)
 * @param {Event} event - The mouse event
 * @param {string} author - The author's name
 * @param {string} stamp - The user's stamp
 */
function showAuthorInfo(event, author, stamp) {
    showAuthorTooltip(event, author, stamp);
}

/**
 * Handle nickname input changes
 * @param {HTMLElement} element - The nickname input element
 * @param {string} projectId - The project ID
 */
function handleNicknameInput(element, projectId) {
    if (element.textContent.trim() === '') {
        element.classList.add('placeholder');
    } else {
        element.classList.remove('placeholder');
    }
}

/**
 * Handle nickname keydown events
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} projectId - The project ID
 */
function handleNicknameKeydown(event, projectId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const commentTextarea = document.getElementById(`comment_${projectId}`);
        if (commentTextarea) {
            commentTextarea.focus();
        }
    }
}

/**
 * Handle comment textarea keydown events
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} projectId - The project ID
 */
function handleCommentKeydown(event, projectId) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        const textarea = event.target;
        addComment(projectId, textarea);
    }
}

/**
 * Group comments by date and user for better organization
 * @param {Array} comments - Array of comment objects
 * @returns {Object} Grouped comments
 */
function groupCommentsByDateAndUser(comments) {
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
}

/**
 * Create HTML for a single comment
 * @param {Object} comment - The comment object
 * @returns {string} HTML string for the comment
 */
function createCommentHTML(comment) {
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
}

/**
 * Render grouped comments
 * @param {Object} groupedComments - Grouped comments object
 * @returns {string} HTML string for grouped comments
 */
function renderGroupedComments(groupedComments) {
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
}