// Application Configuration
const APP_CONFIG = {
    STORAGE_KEYS: {
        USERS: 'users.allUsers',
        PROJECTS: 'projects.allProjects',
        USER_PROJECTS: 'projects.userProjects',
        COMMENTS: 'comments',
        RATINGS: 'ratings',
        LOGS: 'logs.allLogs',
        CLICKS: 'clicks.allClicks'
    },
    VALIDATION: {
        MIN_TITLE_LENGTH: 3,
        MAX_TITLE_LENGTH: 100,
        MIN_DESCRIPTION_LENGTH: 10,
        MAX_DESCRIPTION_LENGTH: 500,
        MAX_COMMENT_LENGTH: 500
    },
    RATE_LIMITING: {
        COMMENT_COOLDOWN: 3000, // 3 seconds
        RATING_COOLDOWN: 1000,  // 1 second
        PROJECT_COOLDOWN: 5000   // 5 seconds
    }
};

// Rate limiting tracker (moved to global scope to avoid conflicts)
if (typeof rateLimitTracker === 'undefined') {
    window.rateLimitTracker = {
        lastCommentTime: 0,
        lastRatingTime: 0,
        lastProjectTime: 0
    };
}