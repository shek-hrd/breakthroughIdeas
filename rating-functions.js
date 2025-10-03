/**
 * Rating Functions Module
 * Handles project rating functionality
 */

/**
 * Rate a project with a star rating
 * @param {number} projectId - The ID of the project to rate
 * @param {number} rating - The rating value (1-5)
 */
async function rateProject(projectId, rating) {
    event.stopPropagation();
    
    // Rate limiting check
    const now = Date.now();
    if (now - rateLimitTracker.lastRatingTime < APP_CONFIG.RATE_LIMITING.RATING_COOLDOWN) {
        const remainingTime = APP_CONFIG.RATE_LIMITING.RATING_COOLDOWN - (now - rateLimitTracker.lastRatingTime);
        alert(`Please wait ${Math.ceil(remainingTime / 1000)} seconds before rating again.`);
        return;
    }
    
    try {
        const ratings = await userSession.storage.getItem(`ratings.${projectId}`) || [];
        ratings.push(rating);
        await userSession.storage.setItem(`ratings.${projectId}`, ratings);
        
        // Log rating activity
        await userSession.logActivity('project_rated', {
            projectId: projectId,
            rating: rating,
            totalRatings: ratings.length
        });
        
        // Update rate limit tracker
        rateLimitTracker.lastRatingTime = now;
        
        // Update display
        await loadProjects();
        
        // Show success notification
        showNotification(`Project rated with ${rating} star${rating !== 1 ? 's' : ''}!`);
        
    } catch (error) {
        console.error('Error rating project:', error);
        showNotification('Failed to rate project. Please try again.', 'error');
    }
}

/**
 * Get average rating for a project
 * @param {Array} ratings - Array of rating values
 * @returns {string} - Average rating as string, or 'N/A' if no ratings
 */
function getAverageRating(ratings) {
    if (!ratings || ratings.length === 0) {
        return 'N/A';
    }
    
    const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return avgRating.toFixed(1);
}

/**
 * Create star rating HTML
 * @param {number} projectId - The project ID
 * @param {Array} ratings - Array of existing ratings
 * @returns {string} - HTML string for star rating interface
 */
function createStarRatingHTML(projectId, ratings) {
    const avgRating = getAverageRating(ratings);
    
    return `
        <div class="rating" onclick="event.stopPropagation();">
            <span class="rating-label">Rate this project:</span>
            <div class="star-rating">
                ${[1, 2, 3, 4, 5].map(star => `
                    <span class="star" onclick="rateProject(${projectId}, ${star})" title="Rate ${star} star${star !== 1 ? 's' : ''}">★</span>
                `).join('')}
            </div>
            <div class="rating-stats">
                <span class="average-rating">Average: ${avgRating}</span>
                <span class="rating-count">(${ratings.length} rating${ratings.length !== 1 ? 's' : ''})</span>
            </div>
        </div>
    `;
}

/**
 * Update rating display for a project card
 * @param {Element} card - The project card element
 * @param {Array} ratings - Array of rating values
 */
function updateRatingDisplay(card, ratings) {
    const avgRating = getAverageRating(ratings);
    const ratingElement = card.querySelector('.stat:first-child');
    
    if (ratingElement) {
        ratingElement.textContent = `⭐ ${avgRating}`;
    }
}

/**
 * Show notification to user
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info)
 */
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        font-size: 14px;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 2000);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        rateProject,
        getAverageRating,
        createStarRatingHTML,
        updateRatingDisplay,
        showNotification
    };
}