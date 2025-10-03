/**
 * User Session Module
 * Handles user session management, data collection, and activity logging
 */

/**
 * UserSession class for managing user sessions and data
 */
class UserSession {
    constructor() {
        this.storage = new FileStorage(); // Use the FileStorage instance
        this.stamp = this.generateUserStamp();
        this.nickname = localStorage.getItem('userNickname') || null;
        this.userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
        this.sessionData = this.collectSessionData();
        
        this.initializeSession();
    }

    /**
     * Generate a unique user stamp based on browser fingerprinting
     * @returns {string} - The generated user stamp
     */
    generateUserStamp() {
        const existing = localStorage.getItem('userStamp');
        if (existing) return existing;
        
        const browserData = navigator.userAgent + navigator.language + screen.width + screen.height;
        const hash = this.simpleHash(browserData);
        const stamp = hash.toString(36).substring(0, 6).toUpperCase();
        
        localStorage.setItem('userStamp', stamp);
        return stamp;
    }

    /**
     * Simple hash function for generating user stamps
     * @param {string} str - The string to hash
     * @returns {number} - The hash value
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    /**
     * Collect comprehensive session data
     * @returns {Object} - Session data object
     */
    collectSessionData() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            screen: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: new Date().toISOString(),
            cookies: this.getCookies(),
            // Location will be collected only on user interaction
            location: { pending: 'User interaction required' },
            referrer: document.referrer,
            url: window.location.href,
            performance: this.getPerformanceData(),
            connection: this.getConnectionData()
        };
    }

    /**
     * Collect location data (requires user interaction)
     * @returns {Promise<Object>} - Location data
     */
    async collectLocationData() {
        try {
            const location = await this.getLocation();
            this.sessionData.location = location;
            await this.storage.setItem('session.location', location);
            return location;
        } catch (error) {
            console.error('Failed to collect location data:', error);
            this.sessionData.location = { error: 'Location collection failed' };
            return { error: 'Location collection failed' };
        }
    }

    /**
     * Get cookies as an object
     * @returns {Object} - Cookies object
     */
    getCookies() {
        return document.cookie.split(';').reduce((cookies, cookie) => {
            const [name, value] = cookie.trim().split('=');
            cookies[name] = value;
            return cookies;
        }, {});
    }

    /**
     * Get user location using geolocation API
     * @returns {Promise<Object>} - Location data
     */
    getLocation() {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve({
                            lat: position.coords.latitude,
                            lon: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        });
                    },
                    () => resolve({ error: 'Location permission denied' })
                );
            } else {
                resolve({ error: 'Geolocation not supported' });
            }
        });
    }

    /**
     * Get performance data
     * @returns {Object|null} - Performance data
     */
    getPerformanceData() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            return {
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstByte: timing.responseStart - timing.navigationStart
            };
        }
        return null;
    }

    /**
     * Get connection data
     * @returns {Object|null} - Connection data
     */
    getConnectionData() {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            };
        }
        return null;
    }

    /**
     * Initialize the user session
     */
    initializeSession() {
        document.getElementById('userStamp').textContent = this.stamp;
        
        if (this.nickname) {
            document.getElementById('currentUser').textContent = this.nickname;
            document.getElementById('userNickname').style.display = 'block';
            document.getElementById('userNick').value = this.nickname;
        }

        // Check for returning user
        this.checkReturningUser();
        
        // Log session initialization
        this.logActivity('session_initialized', {
            isReturningUser: !!localStorage.getItem('lastVisit'),
            hasNickname: !!this.nickname
        });
    }

    /**
     * Check if user is returning and handle accordingly
     */
    checkReturningUser() {
        const lastVisit = localStorage.getItem('lastVisit');
        if (lastVisit && !this.nickname) {
            const daysSince = (Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24);
            if (daysSince > 1 && daysSince < 30) {
                setTimeout(() => {
                    if (confirm('Welcome back! Would you like to continue with your previous session?')) {
                        const oldNick = localStorage.getItem('tempNickname');
                        if (oldNick) {
                            this.setNickname(oldNick);
                        }
                    }
                }, 2000);
            }
        }
        localStorage.setItem('lastVisit', Date.now().toString());
    }

    /**
     * Set user nickname
     * @param {string} nickname - The desired nickname
     * @returns {string} - The actual nickname set (may be modified for uniqueness)
     */
    setNickname(nickname) {
        const uniqueNick = this.ensureUniqueNickname(nickname);
        this.nickname = uniqueNick;
        localStorage.setItem('userNickname', uniqueNick);
        document.getElementById('currentUser').textContent = uniqueNick;
        document.getElementById('userNickname').style.display = 'block';
        return uniqueNick;
    }

    /**
     * Ensure nickname is unique across all users
     * @param {string} nickname - The desired nickname
     * @returns {string} - A unique nickname
     */
    ensureUniqueNickname(nickname) {
        const existingUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
        const baseNick = nickname.trim();
        
        if (!existingUsers.find(u => u.nickname === baseNick && u.stamp !== this.stamp)) {
            return baseNick;
        }
        
        return `${baseNick}#${this.stamp}`;
    }

    /**
     * Save user details
     * @param {Object} details - User details to save
     */
    async saveUserDetails(details) {
        this.userDetails = { ...this.userDetails, ...details };
        await this.storage.setItem('users.details', this.userDetails);
        
        // Save to global users list
        const allUsers = await this.storage.getItem('users.allUsers') || [];
        const userIndex = allUsers.findIndex(u => u.stamp === this.stamp);
        const userData = {
            stamp: this.stamp,
            nickname: this.nickname,
            details: this.userDetails,
            lastActive: new Date().toISOString()
        };
        
        if (userIndex >= 0) {
            allUsers[userIndex] = userData;
        } else {
            allUsers.push(userData);
        }
        
        await this.storage.setItem('users.allUsers', allUsers);
        
        // Log access and changes
        await this.logActivity('user_details_saved', { details });
    }

    /**
     * Log user activity
     * @param {string} action - The action being logged
     * @param {Object} data - Additional data to log
     */
    async logActivity(action, data = {}) {
        const logs = await this.storage.getItem('logs._activity_logs') || [];
        const logEntry = {
            timestamp: new Date().toISOString(),
            userStamp: this.stamp,
            nickname: this.nickname,
            action: action,
            data: data,
            sessionData: this.sessionData
        };
        
        logs.push(logEntry);
        
        // Keep only last 1000 entries
        if (logs.length > 1000) {
            logs.splice(0, logs.length - 1000);
        }
        
        await this.storage.setItem('logs._activity_logs', logs);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UserSession;
}