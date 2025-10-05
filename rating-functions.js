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

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        rateProject,
        getAverageRating,
        createStarRatingHTML,
        updateRatingDisplay
    };
}