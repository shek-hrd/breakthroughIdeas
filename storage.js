/**
 * Storage Module
 * Handles all localStorage operations with error handling and data validation
 */

/**
 * FileStorage class for managing localStorage operations
 */
class FileStorage {
    constructor() {
        this.prefix = 'breakthroughIdeas_';
        this.enabled = this.checkStorageEnabled();
    }

    /**
     * Check if localStorage is enabled and available
     * @returns {boolean} - True if localStorage is available
     */
    checkStorageEnabled() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage is not available:', e);
            return false;
        }
    }

    /**
     * Get default values for various storage keys
     * @param {string} key - The storage key
     * @returns {*} - Default value for the key
     */
    getDefaults(key) {
        const defaults = {
            'projects.system': [],
            'projects.user': [],
            'projects.allProjects': [],
            'users.allUsers': [],
            'users.userProjects': [],
            'logs._activity_logs': [],
            'logs.rate_limits': {},
            'session.location': { pending: 'User interaction required' },
            'session.userDetails': {}
        };
        return defaults[key] !== undefined ? defaults[key] : null;
    }

    /**
     * Get item from localStorage
     * @param {string} key - The storage key
     * @returns {*} - The stored value
     */
    getItem(key) {
        if (!this.enabled) return this.getDefaults(key);
        
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : this.getDefaults(key);
        } catch (e) {
            console.error('Error getting item from localStorage:', e);
            return this.getDefaults(key);
        }
    }

    /**
     * Set item in localStorage
     * @param {string} key - The storage key
     * @param {*} value - The value to store
     */
    setItem(key, value) {
        if (!this.enabled) return false;
        
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error setting item in localStorage:', e);
            return false;
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key - The storage key
     */
    removeItem(key) {
        if (!this.enabled) return;
        
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (e) {
            console.error('Error removing item from localStorage:', e);
        }
    }

    /**
     * Clear all storage items with the prefix
     */
    clear() {
        if (!this.enabled) return;
        
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }

    /**
     * Get all storage keys with the prefix
     * @returns {string[]} - Array of storage keys
     */
    getAllKeys() {
        if (!this.enabled) return [];
        
        try {
            return Object.keys(localStorage)
                .filter(key => key.startsWith(this.prefix))
                .map(key => key.substring(this.prefix.length));
        } catch (e) {
            console.error('Error getting storage keys:', e);
            return [];
        }
    }

    /**
     * Get storage usage statistics
     * @returns {Object} - Storage usage information
     */
    getStorageInfo() {
        if (!this.enabled) return { enabled: false };
        
        try {
            const keys = this.getAllKeys();
            let totalSize = 0;
            
            keys.forEach(key => {
                const item = localStorage.getItem(this.prefix + key);
                if (item) totalSize += item.length;
            });
            
            return {
                enabled: true,
                keysCount: keys.length,
                totalSize: totalSize,
                remainingSpace: this.getRemainingSpace(),
                keys: keys
            };
        } catch (e) {
            console.error('Error getting storage info:', e);
            return { enabled: false, error: e.message };
        }
    }

    /**
     * Get remaining localStorage space
     * @returns {number} - Remaining space in bytes
     */
    getRemainingSpace() {
        if (!this.enabled) return 0;
        
        try {
            const testKey = this.prefix + '__test__';
            const testData = 'a'.repeat(1000);
            let remaining = 0;
            
            // Binary search to find remaining space
            let low = 0;
            let high = 10000000; // 10MB max
            
            while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                try {
                    localStorage.setItem(testKey, 'a'.repeat(mid));
                    localStorage.removeItem(testKey);
                    remaining = mid;
                    low = mid + 1;
                } catch (e) {
                    high = mid - 1;
                }
            }
            
            return remaining;
        } catch (e) {
            return 0;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileStorage;
}