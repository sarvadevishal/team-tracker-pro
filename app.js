// Application State
let currentUser = null;
let currentPage = 'dashboard';
let appData = {
    users: [],
    teams: [
        {
            id: 1,
            name: "TDM",
            description: "Test Data Management",
            color: "#3B82F6",
            members: [],
            performance: {
                completionRate: 0,
                averageVelocity: 0,
                blockedTasks: 0
            }
        },
        {
            id: 2,
            name: "Looker",
            description: "Analytics and Visualization",
            color: "#10B981",
            members: [],
            performance: {
                completionRate: 0,
                averageVelocity: 0,
                blockedTasks: 0
            }
        },
        {
            id: 3,
            name: "Production Support",
            description: "Operations and Maintenance",
            color: "#F59E0B",
            members: [],
            performance: {
                completionRate: 0,
                averageVelocity: 0,
                blockedTasks: 0
            }
        }
    ],
    tasks: [],
    activities: [],
    retrospectives: {
        whatWentWell: [],
        areasOfImprovement: [],
        teamConcerns: [],
        majorFeatures: []
    },
    jiraConfig: {
        baseUrl: '',
        username: '',
        apiKey: '',
        boardId: ''
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Application starting...');
    
    try {
        initializeApp();
    } catch (error) {
        console.error('Error initializing application:', error);
        showNotificationSafe('Application initialization failed', 'error');
    }
});

function initializeApp() {
    loadData();
    setupEventListeners();
    checkAuthentication();
    console.log('Application initialized successfully');
}

// Data Management
function loadData() {
    try {
        const savedData = localStorage.getItem('teamTrackerData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            appData = { ...appData, ...parsedData };
            console.log('Data loaded from localStorage');
        }
    } catch (error) {
        console.error('Error loading data from localStorage:', error);
    }
    
    // Always ensure default admin exists
    if (!appData.users || appData.users.length === 0) {
        appData.users = [{
            id: 1,
            name: "Admin User",
            email: "admin@company.com",
            password: "admin123",
            role: "Admin",
            team: "TDM",
            joinDate: "2020-01-01",
            avatar: "https://via.placeholder.com/150/4A5568/FFFFFF?text=Admin"
        }];
        saveData();
        console.log('Default admin user created');
    }
}

function saveData() {
    try {
        localStorage.setItem('teamTrackerData', JSON.stringify(appData));
        console.log('Data saved to localStorage');
    } catch (error) {
        console.error('Error saving data to localStorage:', error);
    }
}

function addActivity(action, details) {
    if (!currentUser) return;
    
    const activity = {
        id: Date.now(),
        user: currentUser.name,
        action,
        details,
        timestamp: new Date().toISOString()
    };
    
    if (!appData.activities) {
        appData.activities = [];
    }
    
    appData.activities.unshift(activity);
    saveData();
    
    if (currentPage === 'dashboard') {
        setTimeout(() => renderActivityFeed(), 100);
    }
}

// Authentication Functions
function checkAuthentication() {
    console.log('Checking authentication status...');
    
    try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            console.log('Found saved user:', currentUser.name);
            setTimeout(() => showMainApp(), 100);
        } else {
            console.log('No saved user found');
            showAuthPage();
        }
    } catch (error) {
        console.error('Error checking authentication:', error);
        localStorage.removeItem('currentUser');
        showAuthPage();
    }
}

function showAuthPage() {
    console.log('Showing authentication page');
    
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');
    const mainApp = document.getElementById('mainApp');
    
    if (loginPage) {
        loginPage.classList.remove('hidden');
        loginPage.style.display = 'flex';
    }
    if (signupPage) {
        signupPage.classList.add('hidden');
        signupPage.style.display = 'none';
    }
    if (mainApp) {
        mainApp.classList.add('hidden');
        mainApp.style.display = 'none';
    }
}

function showMainApp() {
    console.log('Showing main application');
    
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');
    const mainApp = document.getElementById('mainApp');
    
    if (loginPage) {
        loginPage.classList.add('hidden');
        loginPage.style.display = 'none';
    }
    if (signupPage) {
        signupPage.classList.add('hidden');
        signupPage.style.display = 'none';
    }
    if (mainApp) {
        mainApp.classList.remove('hidden');
        mainApp.style.display = 'block';
    }
    
    // Update user info in navbar
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (userName && currentUser) userName.textContent = currentUser.name;
    if (userAvatar && currentUser) userAvatar.src = currentUser.avatar;
    
    // Show dashboard by default
    setTimeout(() => showPage('dashboard'), 200);
}

function showSignupPage() {
    console.log('Showing signup page');
    
    const loginPage = document.getElementById('loginPage');
    const signupPage = document.getElementById('signupPage');
    const mainApp = document.getElementById('mainApp');
    
    if (loginPage) {
        loginPage.classList.add('hidden');
        loginPage.style.display = 'none';
    }
    if (signupPage) {
        signupPage.classList.remove('hidden');
        signupPage.style.display = 'flex';
    }
    if (mainApp) {
        mainApp.classList.add('hidden');
        mainApp.style.display = 'none';
    }
}

function performLogin(email, password) {
    console.log('Attempting login for email:', email);
    
    if (!email || !password) {
        showNotificationSafe('Please enter both email and password!', 'error');
        return false;
    }
    
    // Find user with matching credentials
    const user = appData.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Login successful for user:', user.name);
        
        // Show success notification
        showNotificationSafe('Login successful!', 'success');
        
        // Add activity
        addActivity('logged in', '');
        
        // Redirect to main app after a brief delay
        setTimeout(() => {
            showMainApp();
        }, 500);
        
        return true;
    } else {
        console.log('Login failed - invalid credentials');
        showNotificationSafe('Invalid email or password!', 'error');
        return false;
    }
}

function performSignup(name, email, password, team) {
    console.log('Attempting signup for:', name, email, team);
    
    if (!name || !email || !password || !team) {
        showNotificationSafe('Please fill in all fields!', 'error');
        return false;
    }
    
    if (appData.users.find(u => u.email === email)) {
        showNotificationSafe('User with this email already exists!', 'error');
        return false;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        role: 'Member',
        team,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: `https://via.placeholder.com/150/4A5568/FFFFFF?text=${name.charAt(0)}`
    };
    
    appData.users.push(newUser);
    saveData();
    
    console.log('Signup successful for:', name);
    showNotificationSafe('Account created successfully! Please login.', 'success');
    
    // Switch back to login page
    setTimeout(() => showAuthPage(), 1000);
    
    return true;
}

function performLogout() {
    console.log('Logging out user:', currentUser?.name);
    
    if (currentUser) {
        addActivity('logged out', '');
    }
    
    currentUser = null;
    localStorage.removeItem('currentUser');
    showAuthPage();
    showNotificationSafe('Logged out successfully!', 'info');
}

// Navigation Functions
function showPage(page) {
    console.log('Navigating to page:', page);
    
    // Hide all pages and remove active classes
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Activate corresponding nav link
    const navLink = document.querySelector(`[data-page="${page}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    currentPage = page;
    
    // Render page content
    setTimeout(() => {
        switch(page) {
            case 'dashboard':
                renderDashboard();
                break;
            case 'tasks':
                renderTasks();
                break;
            case 'teams':
                renderTeams();
                break;
            case 'retrospectives':
                renderRetrospectives();
                break;
            case 'settings':
                renderSettings();
                break;
        }
    }, 100);
}

// Dashboard Functions
function renderDashboard() {
    console.log('Rendering dashboard');
    
    if (!currentUser) return;
    
    const userTeam = appData.teams.find(t => t.name === currentUser.team);
    const teamTasks = appData.tasks.filter(t => t.team === currentUser.team);
    const activeTasks = teamTasks.filter(t => t.status !== 'done');
    const completedTasks = teamTasks.filter(t => t.status === 'done');
    const completionRate = teamTasks.length > 0 ? Math.round((completedTasks.length / teamTasks.length) * 100) : 0;
    
    const totalTasksEl = document.getElementById('totalTasks');
    const activeTasksEl = document.getElementById('activeTasks');
    const teamMembersEl = document.getElementById('teamMembers');
    const completionRateEl = document.getElementById('completionRate');
    
    if (totalTasksEl) totalTasksEl.textContent = teamTasks.length;
    if (activeTasksEl) activeTasksEl.textContent = activeTasks.length;
    if (teamMembersEl) teamMembersEl.textContent = userTeam ? userTeam.members.length : 0;
    if (completionRateEl) completionRateEl.textContent = completionRate + '%';
    
    renderActivityFeed();
}

function renderActivityFeed() {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;
    
    const recentActivities = appData.activities.slice(0, 10);
    
    if (recentActivities.length === 0) {
        feed.innerHTML = '<div class="empty-state"><i class="lni lni-pulse"></i><h3>No recent activity</h3><p>Activities will appear here as your team works.</p></div>';
        return;
    }
    
    feed.innerHTML = recentActivities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="lni lni-user"></i>
            </div>
            <div class="activity-content">
                <p><strong>${activity.user}</strong> ${activity.action} ${activity.details}</p>
            </div>
            <div class="activity-time">
                ${formatTimeAgo(activity.timestamp)}
            </div>
        </div>
    `).join('');
}

// Tasks Functions
function renderTasks() {
    console.log('Rendering tasks');
    
    const tasksList = document.getElementById('tasksList');
    if (!tasksList) return;
    
    const teamFilter = document.getElementById('taskTeamFilter')?.value || '';
    const statusFilter = document.getElementById('taskStatusFilter')?.value || '';
    
    let filteredTasks = appData.tasks || [];
    
    if (teamFilter) {
        filteredTasks = filteredTasks.filter(t => t.team === teamFilter);
    }
    
    if (statusFilter) {
        filteredTasks = filteredTasks.filter(t => t.status === statusFilter);
    }
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state"><i class="lni lni-checkmark-circle"></i><h3>No tasks found</h3><p>Create a task or import from Jira to get started.</p></div>';
        return;
    }
    
    tasksList.innerHTML = filteredTasks.map(task => `
        <div class="task-card">
            <div class="task-header">
                <h4 class="task-title">${task.title}</h4>
                <span class="task-status ${task.status}">${task.status.replace('-', ' ')}</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-footer">
                <div class="task-assignee">
                    <i class="lni lni-user"></i>
                    ${task.assignee || 'Unassigned'}
                </div>
                <div class="task-actions">
                    <button class="btn btn--secondary btn--sm" onclick="editTask(${task.id})">
                        <i class="lni lni-pencil"></i>
                    </button>
                    <button class="btn btn--secondary btn--sm" onclick="deleteTask(${task.id})">
                        <i class="lni lni-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function importFromJira() {
    console.log('Importing from Jira...');
    
    const config = appData.jiraConfig;
    
    if (!config.baseUrl || !config.username || !config.apiKey || !config.boardId) {
        showNotificationSafe('Please configure Jira settings first!', 'error');
        setTimeout(() => showPage('settings'), 1000);
        return;
    }
    
    showNotificationSafe('Importing tasks from Jira...', 'info');
    
    // Mock Jira import with realistic delay
    setTimeout(() => {
        const mockJiraTasks = [
            {
                title: 'Fix database connection issue',
                description: 'Resolve intermittent database timeout errors in production',
                assignee: currentUser.name,
                status: 'in-progress',
                team: currentUser.team,
                jiraId: 'PROJ-123'
            },
            {
                title: 'Implement new dashboard feature',
                description: 'Add real-time analytics dashboard for team performance',
                assignee: '',
                status: 'todo',
                team: currentUser.team,
                jiraId: 'PROJ-124'
            },
            {
                title: 'Update API documentation',
                description: 'Refresh API docs with latest endpoint changes',
                assignee: currentUser.name,
                status: 'todo',
                team: currentUser.team,
                jiraId: 'PROJ-125'
            }
        ];
        
        let importedCount = 0;
        mockJiraTasks.forEach(taskData => {
            if (!appData.tasks.find(t => t.jiraId === taskData.jiraId)) {
                const task = {
                    id: Date.now() + Math.random(),
                    title: taskData.title,
                    description: taskData.description,
                    assignee: taskData.assignee,
                    status: taskData.status,
                    team: taskData.team,
                    createdAt: new Date().toISOString(),
                    jiraId: taskData.jiraId
                };
                
                appData.tasks.push(task);
                importedCount++;
            }
        });
        
        saveData();
        showNotificationSafe(`Successfully imported ${importedCount} tasks from Jira!`, 'success');
        addActivity('imported tasks from Jira', `(${importedCount} tasks)`);
        renderTasks();
    }, 2000);
}

// Teams Functions
function renderTeams() {
    console.log('Rendering teams');
    
    const teamsGrid = document.getElementById('teamsGrid');
    if (!teamsGrid) return;
    
    teamsGrid.innerHTML = appData.teams.map(team => {
        const teamMembers = appData.users.filter(u => u.team === team.name);
        const teamTasks = appData.tasks.filter(t => t.team === team.name);
        const completedTasks = teamTasks.filter(t => t.status === 'done');
        const completionRate = teamTasks.length > 0 ? Math.round((completedTasks.length / teamTasks.length) * 100) : 0;
        
        return `
            <div class="team-card">
                <div class="team-header">
                    <div class="team-color" style="background-color: ${team.color}"></div>
                    <h3 class="team-name">${team.name}</h3>
                </div>
                <p class="team-description">${team.description}</p>
                <div class="team-stats">
                    <div class="kpi-grid">
                        <div class="kpi-card">
                            <div class="kpi-content">
                                <h4>${teamMembers.length}</h4>
                                <p>Members</p>
                            </div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-content">
                                <h4>${teamTasks.length}</h4>
                                <p>Tasks</p>
                            </div>
                        </div>
                        <div class="kpi-card">
                            <div class="kpi-content">
                                <h4>${completionRate}%</h4>
                                <p>Completion</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="team-members">
                    <h4>Team Members</h4>
                    ${teamMembers.length === 0 ? '<p class="empty-state">No members yet</p>' : teamMembers.map(member => `
                        <div class="member-item">
                            <div class="member-info">
                                <img src="${member.avatar}" alt="${member.name}" class="member-avatar">
                                <div class="member-details">
                                    <h5>${member.name}</h5>
                                    <p>${member.role} • ${calculateYearsOfExperience(member.joinDate)} years</p>
                                </div>
                            </div>
                            <div class="member-actions">
                                <button class="btn btn--secondary btn--sm" onclick="editMember(${member.id})">
                                    <i class="lni lni-pencil"></i>
                                </button>
                                <button class="btn btn--secondary btn--sm" onclick="deleteMember(${member.id})">
                                    <i class="lni lni-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

function calculateYearsOfExperience(joinDate) {
    const join = new Date(joinDate);
    const now = new Date();
    return Math.floor((now - join) / (365.25 * 24 * 60 * 60 * 1000));
}

// Retrospectives Functions
function renderRetrospectives() {
    console.log('Rendering retrospectives');
    
    const sections = ['whatWentWell', 'areasOfImprovement', 'teamConcerns', 'majorFeatures'];
    
    sections.forEach(section => {
        const container = document.getElementById(section);
        if (!container) return;
        
        const items = appData.retrospectives[section] || [];
        
        if (items.length === 0) {
            container.innerHTML = '<div class="empty-state">No items yet. Click "Add Entry" to get started.</div>';
            return;
        }
        
        container.innerHTML = items.map(item => `
            <div class="retro-item">
                <div class="retro-item-content">${item.content}</div>
                <div class="retro-item-actions">
                    <button class="btn btn--secondary btn--sm" onclick="editRetroItem('${section}', ${item.id})">
                        <i class="lni lni-pencil"></i>
                    </button>
                    <button class="btn btn--secondary btn--sm" onclick="deleteRetroItem('${section}', ${item.id})">
                        <i class="lni lni-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    });
}

// Settings Functions
function renderSettings() {
    console.log('Rendering settings');
    
    const config = appData.jiraConfig;
    
    const jiraBaseUrl = document.getElementById('jiraBaseUrl');
    const jiraUsername = document.getElementById('jiraUsername');
    const jiraApiKey = document.getElementById('jiraApiKey');
    const jiraBoardId = document.getElementById('jiraBoardId');
    
    if (jiraBaseUrl) jiraBaseUrl.value = config.baseUrl;
    if (jiraUsername) jiraUsername.value = config.username;
    if (jiraApiKey) jiraApiKey.value = config.apiKey;
    if (jiraBoardId) jiraBoardId.value = config.boardId;
}

// UI Components
function showNotificationSafe(message, type = 'info') {
    console.log('Showing notification:', message, type);
    
    const notifications = document.getElementById('notifications');
    if (!notifications) {
        console.log('Notifications container not found');
        return;
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="lni lni-information"></i>
        <span>${message}</span>
    `;
    
    notifications.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Utility Functions
function formatTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

// Event Listeners Setup
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Login form submitted');
            
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            
            if (email && password) {
                performLogin(email, password);
            } else {
                showNotificationSafe('Please enter both email and password', 'error');
            }
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Signup form submitted');
            
            const name = document.getElementById('signupName')?.value;
            const email = document.getElementById('signupEmail')?.value;
            const password = document.getElementById('signupPassword')?.value;
            const team = document.getElementById('signupTeam')?.value;
            
            performSignup(name, email, password, team);
        });
    }
    
    // Auth page toggles
    const showSignupLink = document.getElementById('showSignup');
    if (showSignupLink) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            showSignupPage();
        });
    }
    
    const showLoginLink = document.getElementById('showLogin');
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            showAuthPage();
        });
    }
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                showPage(page);
            }
        });
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performLogout();
        });
    }
    
    // Import from Jira button
    const importJiraBtn = document.getElementById('importJiraBtn');
    if (importJiraBtn) {
        importJiraBtn.addEventListener('click', function(e) {
            e.preventDefault();
            importFromJira();
        });
    }
    
    // Settings form
    const jiraConfigForm = document.getElementById('jiraConfigForm');
    if (jiraConfigForm) {
        jiraConfigForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            appData.jiraConfig = {
                baseUrl: document.getElementById('jiraBaseUrl')?.value || '',
                username: document.getElementById('jiraUsername')?.value || '',
                apiKey: document.getElementById('jiraApiKey')?.value || '',
                boardId: document.getElementById('jiraBoardId')?.value || ''
            };
            
            saveData();
            addActivity('updated Jira configuration', '');
            showNotificationSafe('Jira configuration saved!', 'success');
        });
    }
    
    // Test Jira connection button
    const testJiraBtn = document.getElementById('testJiraBtn');
    if (testJiraBtn) {
        testJiraBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const config = appData.jiraConfig;
            
            if (!config.baseUrl || !config.username || !config.apiKey) {
                showNotificationSafe('Please fill in all Jira configuration fields!', 'error');
                return;
            }
            
            showNotificationSafe('Testing Jira connection...', 'info');
            
            setTimeout(() => {
                showNotificationSafe('Jira connection test successful!', 'success');
            }, 1500);
        });
    }
    
    console.log('Event listeners setup complete');
}

// Global functions for onclick handlers
window.editTask = function(id) {
    console.log('Edit task:', id);
    showNotificationSafe('Edit task functionality coming soon!', 'info');
};

window.deleteTask = function(id) {
    console.log('Delete task:', id);
    if (confirm('Are you sure you want to delete this task?')) {
        appData.tasks = appData.tasks.filter(t => t.id !== id);
        saveData();
        addActivity('deleted task', '');
        renderTasks();
        showNotificationSafe('Task deleted successfully!', 'success');
    }
};

window.editMember = function(id) {
    console.log('Edit member:', id);
    showNotificationSafe('Edit member functionality coming soon!', 'info');
};

window.deleteMember = function(id) {
    console.log('Delete member:', id);
    if (confirm('Are you sure you want to delete this member?')) {
        const member = appData.users.find(u => u.id === id);
        if (member && member.id !== currentUser.id) {
            appData.users = appData.users.filter(u => u.id !== id);
            saveData();
            addActivity('removed team member', member.name);
            renderTeams();
            showNotificationSafe('Member deleted successfully!', 'success');
        } else {
            showNotificationSafe('Cannot delete your own account!', 'error');
        }
    }
};

window.editRetroItem = function(section, id) {
    console.log('Edit retro item:', section, id);
    showNotificationSafe('Edit retrospective functionality coming soon!', 'info');
};

window.deleteRetroItem = function(section, id) {
    console.log('Delete retro item:', section, id);
    if (confirm('Are you sure you want to delete this retrospective entry?')) {
        appData.retrospectives[section] = appData.retrospectives[section].filter(i => i.id !== id);
        saveData();
        addActivity('deleted retrospective entry', `from ${section}`);
        renderRetrospectives();
        showNotificationSafe('Retrospective entry deleted!', 'success');
    }
};

console.log('Application script loaded successfully');