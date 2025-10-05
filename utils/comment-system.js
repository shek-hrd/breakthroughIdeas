return false;
    }
}

/**
 * Display comments for a project using utility functions for HTML generation and formatting
 * @param {string} projectId - The ID of the project
 * @param {Array} comments - Array of comment objects
 * @param {Object} options - Display options
 */
async function displayComments(projectId, comments, options = {}) {
    try {
        const projectCard = document.getElementById(`project_${projectId}`);
        const commentsContainer = projectCard?.querySelector('.comments-container');
        
        if (!commentsContainer) {
            console.warn(`Comments container not found for project ${projectId}`);
            return;
        }
        
        // Group comments by date and user using utility function
        const groupedComments = groupCommentsByDateAndUser(comments);
        
        // Generate HTML using utility functions
        const commentsHTML = renderCommentsHTML(groupedComments, {
            showTimestamps: options.showTimestamps !== false,
            showAuthors: options.showAuthors !== false,
            maxDisplay: options.maxDisplay || 0, // 0 = show all
            sortOrder: options.sortOrder || 'desc'
        });
        
        // Update the container
        commentsContainer.innerHTML = commentsHTML;
        
        // Update comment count
        updateCommentCount(projectId, comments.length);
        
        // Initialize comment events
        initializeCommentEvents(projectId);
        
    } catch (error) {
        console.error('Error displaying comments:', error);
        showNotification('Failed to display comments', 'error');
    }
}

/**
 * Show author tooltip/information
 * @param {HTMLElement} element - The element to show tooltip for
 * @param {string} author - Author name
 * @param {string} stamp - Author stamp
 * @param {Event} event - The mouse event
 */
function showAuthorTooltip(element, author, stamp, event) {
    if (!author && !stamp) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'author-tooltip';
    tooltip.innerHTML = `
        <div class="tooltip-content">
            <strong>${author || 'Anonymous'}</strong>
            ${stamp ? `<br><small>ID: ${stamp}</small>` : ''}
        </div>
    `;
    
    // Position tooltip
    document.body.appendChild(tooltip);
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 10}px`;
    tooltip.style.transform = 'translate(-50%, -100%)';
    
    // Remove tooltip on mouseout
    element.addEventListener('mouseout', () => {
        if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
        }
    }, { once: true });
}

/**
 * Handle nickname input validation and updates
 * @param {HTMLElement} input - The nickname input element
 * @param {string} projectId - The project ID
 */
async function handleNicknameInput(input, projectId) {
    const nickname = sanitizeInput(input.value.trim());
    
    // Validate nickname
    if (nickname.length > APP_CONFIG.VALIDATION.MAX_NICKNAME_LENGTH) {
        showValidationErrors(input, [`Nickname must be ${APP_CONFIG.VALIDATION.MAX_NICKNAME_LENGTH} characters or less`]);
        return;
    }
    
    // Update session if valid
    if (nickname && nickname !== userSession.nickname) {
        try {
            await userSession.setNickname(nickname);
            showNotification('Nickname updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating nickname:', error);
            showNotification('Failed to update nickname', 'error');
        }
    }
}

/**
 * Handle comment keydown events (Enter to submit, Shift+Enter for new line)
 * @param {KeyboardEvent} event - The keyboard event
 * @param {string} projectId - The project ID
 * @param {HTMLElement} textarea - The textarea element
 */
function handleCommentKeydown(event, projectId, textarea) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        addComment(projectId, textarea);
    }
}

/**
 * Handle nickname keydown events
 * @param {KeyboardEvent} event - The keyboard event
 * @param {HTMLElement} input - The input element
 * @param {string} projectId - The project ID
 */
function handleNicknameKeydown(event, input, projectId) {
    if (event.key === 'Enter') {
        event.preventDefault();
        handleNicknameInput(input, projectId);
        // Move focus to comment textarea
        const textarea = document.querySelector(`#comment_${projectId}`);
        if (textarea) textarea.focus();
    }
}

/**
 * Update comment count display
 * @param {string} projectId - The project ID
 * @param {number} count - The comment count
 */
function updateCommentCount(projectId, count) {
    const projectCard = document.getElementById(`project_${projectId}`);
    const countElement = projectCard?.querySelector('.comment-count');
    
    if (countElement) {
        countElement.textContent = count;
        countElement.style.display = count > 0 ? 'inline' : 'none';
    }
}

/**
 * Load comments for a project
 * @param {string} projectId - The project ID
 * @param {Object} options - Loading options
 * @returns {Promise<Array>} Array of comments
 */
async function loadComments(projectId, options = {}) {
    try {
        const comments = await userSession.storage.getItem(`comments.${projectId}`) || [];
        
        // Filter comments if needed
        let filteredComments = comments;
        if (options.maxAge) {
            const cutoffDate = new Date(Date.now() - options.maxAge);
            filteredComments = comments.filter(comment => new Date(comment.timestamp) >= cutoffDate);
        }
        
        if (options.maxComments) {
            filteredComments = filteredComments.slice(-options.maxComments);
        }
        
        return filteredComments;
    } catch (error) {
        console.error('Error loading comments:', error);
        return [];
    }
}

/**
 * Delete a comment
 * @param {string} projectId - The project ID
 * @param {number} commentIndex - The index of the comment to delete
 * @returns {Promise<boolean>} Success status
 */
async function deleteComment(projectId, commentIndex) {
    try {
        const comments = await userSession.storage.getItem(`comments.${projectId}`) || [];
        
        if (commentIndex < 0 || commentIndex >= comments.length) {
            console.warn('Invalid comment index');
            return false;
        }
        
        // Remove the comment
        const deletedComment = comments.splice(commentIndex, 1)[0];
        
        // Save updated comments
        await userSession.storage.setItem(`comments.${projectId}`, comments);
        
        // Log deletion activity
        await userSession.logActivity('comment_deleted', {
            projectId: projectId,
            commentIndex: commentIndex,
            commentLength: deletedComment.text.length,
            timestamp: new Date().toISOString()
        });
        
        // Refresh display
        await displayComments(projectId, comments);
        
        showNotification('Comment deleted successfully!', 'success');
        return true;
        
    } catch (error) {
        console.error('Error deleting comment:', error);
        showNotification('Failed to delete comment', 'error');
        return false;
    }
}

/**
 * Initialize comment events for a project
 * @param {string} projectId - The project ID
 */
function initializeCommentEvents(projectId) {
    const projectCard = document.getElementById(`project_${projectId}`);
    if (!projectCard) return;
    
    // Initialize author tooltips
    const authorElements = projectCard.querySelectorAll('.comment-author');
    authorElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const author = element.dataset.author;
            const stamp = element.dataset.stamp;
            if (author || stamp) {
                showAuthorTooltip(element, author, stamp, e);
            }
        });
    });
    
    // Initialize delete buttons (if user has permission)
    const deleteButtons = projectCard.querySelectorAll('.delete-comment');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const commentIndex = parseInt(button.dataset.commentIndex);
            if (confirm('Are you sure you want to delete this comment?')) {
                await deleteComment(projectId, commentIndex);
            }
        });
    });
}

/**
 * Cleanup comment system resources
 */
function cleanupCommentSystem() {
    // Remove any remaining tooltips
    const tooltips = document.querySelectorAll('.author-tooltip');
    tooltips.forEach(tooltip => tooltip.remove());
    
    // Clear any pending timeouts or intervals
    // This would be implemented based on specific needs
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addComment,
        displayComments,
        showAuthorTooltip,
        handleNicknameInput,
        handleCommentKeydown,
        handleNicknameKeydown,
        updateCommentCount,
        loadComments,
        deleteComment,
        initializeCommentEvents,
        cleanupCommentSystem
    };
}