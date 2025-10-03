/**
 * Main Application Module
 * Handles initialization, event listeners, and application lifecycle
 */



// Session log functionality
async function toggleSessionLog() {
    const sessionLog = document.getElementById('sessionLog');
    sessionLog.classList.toggle('expanded');
    
    if (sessionLog.classList.contains('expanded')) {
        await loadSessionLog();
        await userSession.logActivity('session_log_opened');
    } else {
        await userSession.logActivity('session_log_closed');
    }
}

// User-initiated location collection
async function collectUserLocation() {
    const button = document.getElementById('getLocationBtn');
    const status = document.getElementById('locationStatus');
    
    try {
        button.textContent = 'Getting...';
        button.disabled = true;
        
        const location = await userSession.getLocation();
        
        if (location.error) {
            status.innerHTML = `Location: <span style="color: #ff6b6b;">${location.error}</span>`;
        } else if (location.lat && location.lon) {
            status.innerHTML = `Location: <span style="color: #4ecdc4;">${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}</span>`;
        } else {
            status.innerHTML = `Location: <span style="color: #ffa726;">Unknown</span>`;
        }
        
        await userSession.logActivity('location_collected', location);
    } catch (error) {
        console.error('Location collection failed:', error);
        status.innerHTML = `Location: <span style="color: #ff6b6b;">Failed</span>`;
        await userSession.logActivity('location_collection_failed', { error: error.message });
    } finally {
        button.style.display = 'none';
    }
}

async function loadSessionLog() {
    const logs = await userSession.storage.getItem('logs._activity_logs') || [];
    const logEntries = document.getElementById('sessionLogEntries');
    
    logEntries.innerHTML = logs.slice(-50).reverse().map(log => {
        const timestamp = new Date(log.timestamp).toLocaleTimeString();
        const nickname = log.nickname || 'Anonymous';
        const action = log.action.replace(/_/g, ' ');
        
        return `
            <div class="log-entry">
                <span class="log-timestamp">${timestamp}</span>
                <span class="log-action">${action}</span>
                <span class="log-details">${nickname}#${log.userStamp}</span>
            </div>
        `;
    }).join('');
}



// Storage system test function
async function testStorageSystem() {
    try {
        console.log('Running storage system test...');
        
        // Test basic storage operations
        const testKey = 'test.storage.key';
        const testData = { test: 'data', timestamp: Date.now() };
        
        await userSession.storage.setItem(testKey, testData);
        const retrievedData = await userSession.storage.getItem(testKey);
        
        if (JSON.stringify(retrievedData) === JSON.stringify(testData)) {
            console.log('✅ Storage read/write test passed');
        } else {
            console.error('❌ Storage read/write test failed');
        }
        
        await userSession.storage.removeItem(testKey);
        const removedData = await userSession.storage.getItem(testKey);
        
        if (removedData === null) {
            console.log('✅ Storage remove test passed');
        } else {
            console.error('❌ Storage remove test failed');
        }
        
        console.log('Storage system test completed');
    } catch (error) {
        console.error('Storage system test failed:', error);
    }
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // Log to storage if possible
    if (window.userSession && userSession.logActivity) {
        userSession.logActivity('javascript_error', {
            message: e.error.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            timestamp: new Date().toISOString()
        }).catch(console.error);
    }
});



// Function to attach event listeners after DOM is loaded
function attachEventListeners() {
    // User project form submission
    const userProjectForm = document.getElementById('userProjectForm');
    if (userProjectForm) {
        userProjectForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('User project form submitted'); // Debug log
            
            const title = document.getElementById('projectTitle').value.trim();
            const description = document.getElementById('projectDesc').value.trim();
            const link = document.getElementById('projectUrl').value.trim();
            const email = document.getElementById('userEmail').value.trim();
            const nickname = document.getElementById('userNick').value.trim();
            const tags = ['user-submitted']; // Default tags for user projects
            
            // Validate project data
            const validation = validateProjectData({
                title,
                description,
                tags,
                link: link || undefined
            });
            
            if (!validation.isValid) {
                showValidationErrors(validation.errors, userProjectForm);
                return;
            }
            
            // Rate limiting check
            const now = Date.now();
            if (now - rateLimitTracker.lastProjectTime < APP_CONFIG.RATE_LIMITING.PROJECT_COOLDOWN) {
                const remainingTime = APP_CONFIG.RATE_LIMITING.PROJECT_COOLDOWN - (now - rateLimitTracker.lastProjectTime);
                alert(`Please wait ${Math.ceil(remainingTime / 1000)} seconds before sharing another project.`);
                return;
            }
            
            try {
                // Handle nickname
                if (nickname && nickname !== userSession.nickname) {
                    await userSession.setNickname(nickname);
                }
                
                // Collect enhanced user details
                const enhancedUserDetails = {
                    email: email || null,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    language: navigator.language,
                    screen: {
                        width: screen.width,
                        height: screen.height
                    }
                };
                
                if (email) {
                    await userSession.saveUserDetails(enhancedUserDetails);
                }
                
                // Create project object
                const project = {
                    id: Date.now(),
                    title,
                    description,
                    tags,
                    link: link || null,
                    author: userSession.nickname || 'Anonymous',
                    authorStamp: userSession.stamp,
                    timestamp: new Date().toISOString(),
                    type: 'user',
                    userDetails: enhancedUserDetails
                };
                
                // Save user project
                const userProjects = await userSession.storage.getItem('projects.userProjects') || [];
                userProjects.push(project);
                await userSession.storage.setItem('projects.userProjects', userProjects);
                
                // Log project sharing activity
                await userSession.logActivity('project_shared', {
                    projectId: project.id,
                    title: project.title,
                    hasEmail: !!email,
                    enhancedDetails: enhancedUserDetails,
                    timestamp: new Date().toISOString()
                });
                
                // Clear form
                document.getElementById('projectTitle').value = '';
                document.getElementById('projectDesc').value = '';
                document.getElementById('projectUrl').value = '';
                document.getElementById('userEmail').value = '';
                
                if (userSession.nickname) {
                    document.getElementById('userNick').value = userSession.nickname;
                } else {
                    document.getElementById('userNick').value = '';
                }
                
                // Update rate limit tracker
                rateLimitTracker.lastProjectTime = now;
                
                // Reload projects
                await loadProjects();
                
                alert('Project shared successfully!');
                console.log('Project sharing completed!'); // Debug log
            } catch (error) {
                console.error('Error sharing project:', error);
                alert('Failed to share project. Please try again.');
            }
        });
    } else {
        console.warn('userProjectForm element not found - event listener not attached');
    }

    // Close overlay on click
    const overlayElement = document.getElementById('overlay');
    if (overlayElement) {
        overlayElement.addEventListener('click', closeFrame);
    } else {
        console.warn('overlay element not found - event listener not attached');
    }

    // Hide tooltip on mouse leave
    document.addEventListener('mouseleave', () => {
        const tooltip = document.getElementById('authorTooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    });

    // Initialize comment event handlers
    initializeCommentEvents();
}

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('Initializing application...');
        
        // Attach event listeners after DOM is ready
        attachEventListeners();
        
        // Initialize storage files (assumed to be defined in project-functions.js)
        await initializeStorageFiles();
        
        // Load projects
        await loadProjects();
        
        // Run storage system test
        setTimeout(testStorageSystem, 2000);
        
        console.log('Application initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Try to recover from initialization errors
        try {
            console.log('Attempting recovery...');
            
            // Clear potentially corrupted data
            const storageKeys = ['file_users.json', 'file_projects.json', 'file_comments.json', 'file_ratings.json', 'file_logs.json', 'file_clicks.json'];
            storageKeys.forEach(key => {
                try {
                    const data = localStorage.getItem(key);
                    JSON.parse(data); // Test if valid JSON
                } catch (e) {
                    console.warn(`Clearing corrupted storage key: ${key}`);
                    localStorage.removeItem(key);
                }
            });
            
            // Re-initialize
            await initializeStorageFiles();
            await loadProjects();
            
            console.log('Recovery completed successfully!');
            
        } catch (recoveryError) {
            console.error('Recovery failed:', recoveryError);
            alert('There was an issue loading the application. Please refresh the page.');
        }
    }
});

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('Initializing application...');
        
        // Attach event listeners after DOM is ready
        attachEventListeners();
        
        // Initialize storage files (assumed to be defined in project-functions.js)
        await initializeStorageFiles();
        
        // Load projects
        await loadProjects();
        
        // Run storage system test
        setTimeout(testStorageSystem, 2000);
        
        console.log('Application initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Try to recover from initialization errors
        try {
            console.log('Attempting recovery...');
            
            // Clear potentially corrupted data
            const storageKeys = ['file_users.json', 'file_projects.json', 'file_comments.json', 'file_ratings.json', 'file_logs.json', 'file_clicks.json'];
            storageKeys.forEach(key => {
                try {
                    const data = localStorage.getItem(key);
                    JSON.parse(data); // Test if valid JSON
                } catch (e) {
                    console.warn(`Clearing corrupted storage key: ${key}`);
                    localStorage.removeItem(key);
                }
            });
            
            // Re-initialize
            await initializeStorageFiles();
            await loadProjects();
            
            console.log('Recovery completed successfully!');
            
        } catch (recoveryError) {
            console.error('Recovery failed:', recoveryError);
            alert('There was an issue loading the application. Please refresh the page.');
        }
    }
});

// Initialize application
document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('Initializing application...');
        
        // Attach event listeners after DOM is ready
        attachEventListeners();
        
        // Initialize storage files (assumed to be defined in project-functions.js)
        await initializeStorageFiles();
        
        // Load projects
        await loadProjects();
        
        // Run storage system test
        setTimeout(testStorageSystem, 2000);
        
        console.log('Application initialized successfully!');
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Try to recover from initialization errors
        try {
            console.log('Attempting recovery...');
            
            // Clear potentially corrupted data
            const storageKeys = ['file_users.json', 'file_projects.json', 'file_comments.json', 'file_ratings.json', 'file_logs.json', 'file_clicks.json'];
            storageKeys.forEach(key => {
                try {
                    const data = localStorage.getItem(key);
                    JSON.parse(data); // Test if valid JSON
                } catch (e) {
                    console.warn(`Clearing corrupted storage key: ${key}`);
                    localStorage.removeItem(key);
                }
            });
            
            // Re-initialize
            await initializeStorageFiles();
            await loadProjects();
            
            console.log('Recovery completed successfully!');
            
        } catch (recoveryError) {
            console.error('Recovery failed:', recoveryError);
            alert('There was an issue loading the application. Please refresh the page.');
        }
    }
});