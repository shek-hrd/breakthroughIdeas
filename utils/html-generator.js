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
 * Generate star rating HTML
 * @param {string} projectId - Project ID
 * @param {Array} ratings - Array of rating objects
 * @returns {string} - Generated HTML string
 */
function generateStarRatingHTML(projectId, ratings) {
    const avgRating = getAverageRating(ratings);
    const userRating = getUserRating(ratings);
    
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= Math.round(avgRating) ? 'filled' : '';
        const userFilled = i <= userRating ? 'user-filled' : '';
        starsHtml += `
            <span class="star ${filled} ${userFilled}" 
                  data-rating="${i}" 
                  onclick="rateProject('${projectId}', ${i})"
                  onmouseenter="highlightStars(this)"
                  onmouseleave="resetStars()">
                ⭐
            </span>
        `;
    }
    
    return `
        <div class="star-rating" data-project-id="${projectId}">
            <div class="stars">
                ${starsHtml}
            </div>
            <span class="rating-text">${avgRating.toFixed(1)} (${ratings.length} ratings)</span>
        </div>
    `;
}

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

// Helper functions (these should be imported from their respective modules)
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

function getAverageRating(ratings) {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
}

function getUserRating(ratings) {
    if (!ratings || !window.userSession) return 0;
    const userRating = ratings.find(r => r.userId === window.userSession.userId);
    return userRating ? userRating.rating : 0;
}

function groupCommentsByDateAndUser(comments) {
    const groups = {};
    
    comments.forEach(comment => {
        const date = new Date(comment.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
        const dateCompare = new Date(b.date) - new Date(a.date);
        if (dateCompare !== 0) return dateCompare;
        return a.author.localeCompare(b.author);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateCommentHTML,
        generateCommentGroupHTML,
        generateValidationErrorHTML,
        generateStarRatingHTML,
        generateNotificationHTML,
        generateProjectCardTemplate,
        renderCommentsHTML
    };
} else {
    window.HTMLGenerator = {
        generateCommentHTML,
        generateCommentGroupHTML,
        generateValidationErrorHTML,
        generateStarRatingHTML,
        generateNotificationHTML,
        generateProjectCardTemplate,
        renderCommentsHTML
    };
}