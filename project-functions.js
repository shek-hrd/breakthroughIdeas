/**
 * Project Functions Module
 * Handles project loading, card creation, and project management
 */

// Project data
const projects = [
    {
        id: 1,
        title: "AI-Powered Code Generator",
        description: "Revolutionary tool that generates production-ready code from natural language descriptions.",
        host: "GitHub",
        url: "https://github.com/shekhrd/ai-code-gen",
        rating: 4.8,
        comments: 23,
        forks: 156,
        category: "AI/ML"
    },
    {
        id: 2,
        title: "Quantum Visualization Engine",
        description: "Interactive 3D visualization of quantum mechanics concepts for education and research.",
        host: "InfinityFree",
        url: "https://quantum-viz.infinityfree.net",
        rating: 4.9,
        comments: 18,
        forks: 89,
        category: "Visualization"
    },
    {
        id: 3,
        title: "Blockchain Social Network",
        description: "Decentralized social platform built on blockchain technology with privacy-first approach.",
        host: "IndieCloud",
        url: "https://social.indiecloud.co/shekhrd",
        rating: 4.7,
        comments: 34,
        forks: 203,
        category: "Blockchain"
    },
    {
        id: 4,
        title: "Neural Network Playground",
        description: "Interactive environment for experimenting with neural network architectures in real-time.",
        host: "GitHub",
        url: "https://github.com/shekhrd/neural-playground",
        rating: 4.6,
        comments: 41,
        forks: 178,
        category: "AI/ML"
    }
];

/**
 * Initialize storage files
 */
async function initializeStorageFiles() {
    try {
        // Create initial storage structure
        const storageStructure = {
            users: {
                nickname: "",
                userDetails: null,
                userStamp: null,
                lastVisit: null,
                allUsers: []
            },
            projects: {
                userProjects: []
            },
            comments: {},
            ratings: {},
            logs: {
                _activity_logs: []
            },
            clicks: {}
        };

        // Initialize each storage file
        for (const [key, data] of Object.entries(storageStructure)) {
            const fileKey = `${key}.${key === 'users' ? 'users' : key === 'projects' ? 'userProjects' : key === 'logs' ? '_activity_logs' : ''}`;
            const existingData = await userSession.storage.getItem(fileKey);
            if (!existingData) {
                await userSession.storage.setItem(fileKey, data);
            }
        }
    } catch (error) {
        console.log('Storage initialization failed, using localStorage fallback:', error);
    }
}

/**
 * Populate example projects to storage
 */
async function populateExampleProjects() {
    try {
        // Check if example projects are already in storage
        const existingProjects = await userSession.storage.getItem('projects.allProjects') || [];
        
        if (existingProjects.length === 0) {
            // Convert example projects to storage format
            const exampleProjects = projects.map(project => ({
                id: project.id,
                title: project.title,
                description: project.description,
                host: project.host,
                url: project.url,
                category: project.category,
                timestamp: new Date().toISOString(),
                author: 'System',
                stamp: 'SYSTEM'
            }));
            
            // Save to storage
            await userSession.storage.setItem('projects.allProjects', exampleProjects);
            console.log('Example projects populated to storage');
            
            // Log the activity
            await userSession.storage.setItem('logs._activity_logs', [{
                action: 'system_populate_examples',
                timestamp: new Date().toISOString(),
                details: `Populated ${exampleProjects.length} example projects to storage`
            }]);
        }
    } catch (error) {
        console.error('Failed to populate example projects:', error);
    }
}

/**
 * Load projects from storage and display them
 */
async function loadProjects() {
    const container = document.getElementById('projectsGrid');
    container.innerHTML = '';

    // Load all projects from storage
    const systemProjects = await userSession.storage.getItem('projects.allProjects') || [];
    const userProjects = await userSession.storage.getItem('projects.userProjects') || [];
    
    // Initialize expandedProjects if not exists
    if (!window.expandedProjects) {
        window.expandedProjects = new Set();
    }
    
    // Combine system and user projects
    const allProjects = [...systemProjects, ...userProjects]
        .map((project, index) => ({ ...project, originalIndex: index }))
        .sort((a, b) => {
            const aExpanded = expandedProjects.has(a.id);
            const bExpanded = expandedProjects.has(b.id);
            if (aExpanded && !bExpanded) return -1;
            if (!aExpanded && bExpanded) return 1;
            return a.originalIndex - b.originalIndex;
        });

    for (const project of allProjects) {
        await createProjectCard(project, container);
    }
}

/**
 * Create a project card element
 */
async function createProjectCard(project, container, isUserProject = false) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.setProperty('--index', Array.from(container.children).length);
    card.dataset.projectId = project.id;
    
    const comments = await userSession.storage.getItem(`comments.${project.id}`) || [];
    const ratings = await userSession.storage.getItem(`ratings.${project.id}`) || [];
    const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : 'N/A';
    
    card.innerHTML = `
        <div class="card-header">
            <h3 class="project-title">
                ${project.title}
                <span class="expand-indicator">▼</span>
            </h3>
            <p class="project-description">${project.description}</p>
            <div class="project-host">Hosted on: ${project.host || 'User Submitted'}</div>
            
            <div class="project-stats">
                <div class="stat">⭐ ${avgRating}</div>
                <div class="stat">💬 ${comments.length}</div>
            </div>
        </div>
        
        <div class="project-actions">
            <a href="${project.url}" class="btn btn-primary external-link" target="_blank" onclick="trackClick('${project.title}')" style="display: none;">↗️</a>
        </div>
        
        <div class="expandable-content" id="expand_${project.id}">
            <div class="project-url-display" style="margin-bottom: 15px;">
                <a href="${project.url}" target="_blank" style="color: #4ecdc4; text-decoration: none;">${project.url}</a>
            </div>
            
            <div class="rating" onclick="event.stopPropagation();">
                Rate this project:
                ${[1,2,3,4,5].map(star => `<span class="star" onclick="rateProject(${project.id}, ${star})">★</span>`).join('')}
            </div>
            
            <div class="comments-section">
                <h4>Comments</h4>
                <div class="comments-container" id="comments_${project.id}">
                    ${comments.length === 0 ? '<div class="no-comments">No comments yet. Be the first to comment!</div>' : renderGroupedComments(groupCommentsByDateAndUser(comments))}
                </div>
                
                <div class="add-comment" onclick="event.stopPropagation();">
                    <div class="comment-input-container">
                        <input class="comment-input-nickname" placeholder="" id="inputNick_${project.id}" oninput="handleNicknameInput(this, ${project.id})" onkeydown="handleNicknameKeydown(event, ${project.id})" onfocus="this.classList.remove('placeholder')" onblur="handleNicknameInput(this, ${project.id})">
                        <div class="comment-input-stamp" id="inputStamp_${project.id}">#LOADING</div>
                        <textarea class="comment-textarea" placeholder="Add your comment..." rows="1" id="comment_${project.id}" onkeydown="handleCommentKeydown(event, ${project.id})" oninput="autoResizeTextarea(this)"></textarea>
                        <button class="send-comment-btn" onclick="addComment(${project.id})" title="Send comment">→</button>
                    </div>
                </div>
            </div>
            
            <div class="preview-toggle-section" onclick="togglePreview(event, ${project.id})">
                <div class="preview-indicator" id="previewIndicator_${project.id}">▼</div>
                <div class="preview-text">Click to preview site</div>
                <div class="preview-container" id="previewContainer_${project.id}">
                    <div id="preview_${project.id}"></div>
                </div>
            </div>
        </div>
    `;
    
    // Add click handler for the entire card
    card.addEventListener('click', function(e) {
        // Don't toggle if clicking on interactive elements
        if (e.target.closest('.comment-input-container, .send-comment-btn, .comment-textarea, .rating, .star, a')) {
            return;
        }
        e.stopPropagation();
        toggleCard(card, project);
    });
    
    container.appendChild(card);
}

/**
 * Group comments by date and user
 */
function groupCommentsByDateAndUser(comments) {
    const grouped = {};
    
    comments.forEach(comment => {
        const date = new Date(comment.timestamp).toLocaleDateString('en-US');
        const key = `${date}_${comment.author}`;
        
        if (!grouped[key]) {
            grouped[key] = {
                author: comment.author,
                stamp: comment.stamp,
                date: date,
                comments: []
            };
        }
        
        grouped[key].comments.push(comment);
    });
    
    return Object.values(grouped);
}

/**
 * Render grouped comments
 */
function renderGroupedComments(groupedComments) {
    return groupedComments.map(group => {
        const timeStr = group.comments[0].timestamp;
        
        return `
            <div class="comment-group">
                <div class="comment-header">
                    <div class="comment-author">${group.author}</div>
                    <div class="comment-stamp">#${group.stamp}</div>
                </div>
                <div class="comment-date-header">${group.date}</div>
                ${group.comments.map(comment => `
                    <div class="comment-text">${comment.text}</div>
                `).join('')}
                <div class="comment-timestamp">${new Date(timeStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;
    }).join('');
}

/**
 * Toggle card expansion
 */
async function toggleCard(card, project) {
    const isExpanded = card.classList.contains('expanded');
    
    if (isExpanded) {
        // Collapse the card
        collapseCard(card);
    } else {
        // Collapse any other expanded cards first
        document.querySelectorAll('.project-card.expanded').forEach(otherCard => {
            if (otherCard !== card) {
                collapseCard(otherCard);
            }
        });
        
        // Expand this card
        await expandCard(card, project.url, project.id);
    }
}

/**
 * Expand a project card
 */
async function expandCard(card, url, projectId) {
    card.classList.add('expanded');
    
    // Update comment input area with current user info
    const inputNick = document.getElementById(`inputNick_${projectId}`);
    const inputStamp = document.getElementById(`inputStamp_${projectId}`);
    const commentTextarea = document.getElementById(`comment_${projectId}`);
    
    if (inputNick && inputStamp) {
        inputNick.textContent = userSession.nickname || '';
        inputStamp.textContent = `#${userSession.stamp}`;
    }
    
    // Focus on comment textarea by default
    if (commentTextarea) {
        setTimeout(() => {
            commentTextarea.focus();
        }, 100);
    }
    
    // Log card expansion
    await userSession.logActivity('card_expanded', {
        projectId: projectId,
        hasUrl: !!url
    });
}

/**
 * Collapse a project card
 */
async function collapseCard(card) {
    card.classList.remove('expanded');
    
    // Also collapse any preview that might be open
    const projectId = card.dataset.projectId;
    const previewContainer = document.getElementById(`previewContainer_${projectId}`);
    const previewIndicator = document.getElementById(`previewIndicator_${projectId}`);
    
    if (previewContainer && previewContainer.classList.contains('expanded')) {
        previewContainer.classList.remove('expanded');
        previewIndicator.classList.remove('expanded');
        
        // Clear preview content
        const previewDiv = document.getElementById(`preview_${projectId}`);
        if (previewDiv) {
            previewDiv.innerHTML = '';
        }
    }
    
    await userSession.logActivity('card_collapsed');
}

/**
 * Toggle project preview
 */
async function togglePreview(event, projectId) {
    event.stopPropagation();
    
    const previewContainer = document.getElementById(`previewContainer_${projectId}`);
    const previewIndicator = document.getElementById(`previewIndicator_${projectId}`);
    const previewDiv = document.getElementById(`preview_${projectId}`);
    
    if (previewContainer.classList.contains('expanded')) {
        // Close preview
        previewContainer.classList.remove('expanded');
        previewIndicator.classList.remove('expanded');
        previewDiv.innerHTML = '';
        
        await userSession.logActivity('preview_closed', { projectId });
    } else {
        // Open preview
        previewContainer.classList.add('expanded');
        previewIndicator.classList.add('expanded');
        
        // Find project URL
        const systemProjects = await userSession.storage.getItem('projects.allProjects') || [];
        const userProjects = await userSession.storage.getItem('projects.userProjects') || [];
        const allProjects = [...systemProjects, ...userProjects];
        const project = allProjects.find(p => p.id == projectId);
        
        if (project && project.url && project.url !== '#') {
            previewDiv.innerHTML = `<iframe class="project-preview-frame" src="${project.url}"></iframe>`;
            
            await userSession.logActivity('preview_opened', { 
                projectId, 
                url: project.url 
            });
            
            // Scroll to preview after a short delay
            setTimeout(() => {
                previewContainer.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 100);
        } else {
            previewDiv.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">No preview available - URL not provided</div>';
        }
    }
}

/**
 * Check if iframe is supported
 */
function isFrameSupported() {
    return 'HTMLIFrameElement' in window;
}

/**
 * Open project preview in floating frame
 */
function openProjectPreview(url, projectId) {
    const previewDiv = document.getElementById(`preview_${projectId}`);
    if (previewDiv.innerHTML) {
        previewDiv.innerHTML = '';
        return;
    }
    
    previewDiv.innerHTML = `<iframe class="project-preview-frame" src="${url}"></iframe>`;
    
    // Scroll to the preview
    setTimeout(() => {
        previewDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

/**
 * Close floating frame
 */
function closeFrame() {
    document.getElementById('floatingFrame').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('frameContent').src = '';
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        projects,
        initializeStorageFiles,
        populateExampleProjects,
        loadProjects,
        createProjectCard,
        groupCommentsByDateAndUser,
        renderGroupedComments,
        toggleCard,
        expandCard,
        collapseCard,
        togglePreview,
        isFrameSupported,
        openProjectPreview,
        closeFrame
    };
}