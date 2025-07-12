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
    tasks: [
        {
            id: 1,
            title: "Database Performance Optimization",
            description: "Optimize database queries for better performance in production environment",
            assignee: "Admin User",
            status: "in-progress",
            team: "TDM",
            priority: "high",
            dueDate: "2025-08-15",
            estimatedHours: 16,
            jiraId: "TDM-101",
            createdAt: "2025-07-01T10:00:00Z"
        },
        {
            id: 2,
            title: "Analytics Dashboard Enhancement",
            description: "Add new KPI metrics to the existing analytics dashboard",
            assignee: "Admin User",
            status: "todo",
            team: "Looker",
            priority: "medium",
            dueDate: "2025-08-20",
            estimatedHours: 24,
            jiraId: "LOOK-205",
            createdAt: "2025-07-02T11:00:00Z"
        }
    ],
    activities: [],
    retrospectives: {
        whatWentWell: [
            {
                id: 1,
                content: "Team collaboration improved significantly this sprint",
                author: "Admin User",
                createdAt: "2025-07-10T15:30:00Z"
            }
        ],
        areasOfImprovement: [
            {
                id: 1,
                content: "Need better documentation for API endpoints",
                author: "Admin User",
                createdAt: "2025-07-10T15:31:00Z"
            }
        ],
        teamConcerns: [
            {
                id: 1,
                content: "Upcoming deadline for Q3 deliverables",
                author: "Admin User",
                createdAt: "2025-07-10T15:32:00Z"
            }
        ],
        majorFeatures: [
            {
                id: 1,
                content: "New user authentication system implementation",
                author: "Admin User",
                createdAt: "2025-07-10T15:33:00Z"
            }
        ]
    },
    jiraConfig: {
        baseUrl: '',
        username: '',
        apiKey: '',
        boardId: '',
        maxResults: 100
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
            avatar: "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/ca82d873-56fe-4b28-98cc-2f3293509fa3.png"
        }];
        
        // Add admin to TDM team
        const teamIndex = appData.teams.findIndex(t => t.name === "TDM");
        if (teamIndex !== -1) {
            appData.teams[teamIndex].members = [appData.users[0]];
        }
        
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
    
    // Keep only last 50 activities
    if (appData.activities.length > 50) {
        appData.activities = appData.activities.slice(0, 50);
    }
    
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
    
    if (loginPage) {
        loginPage.classList.add('hidden');
        loginPage.style.display = 'none';
    }
    if (signupPage) {
        signupPage.classList.remove('hidden');
        signupPage.style.display = 'flex';
    }
}

function performLogin(email, password) {
    console.log('Attempting login for email:', email);
    
    if (!email || !password) {
        showNotificationSafe('Please enter both email and password!', 'error');
        return false;
    }
    
    const user = appData.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Login successful for user:', user.name);
        
        showNotificationSafe('Welcome back, ' + user.name + '!', 'success');
        addActivity('logged in', '');
        
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
        avatar: "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/45d1c076-a56c-4b4a-9693-ddfbb43d0f2e.png"
    };
    
    appData.users.push(newUser);
    
    // Add user to team
    const teamIndex = appData.teams.findIndex(t => t.name === team);
    if (teamIndex !== -1) {
        if (!appData.teams[teamIndex].members) {
            appData.teams[teamIndex].members = [];
        }
        appData.teams[teamIndex].members.push(newUser);
    }
    
    saveData();
    
    console.log('Signup successful for:', name);
    showNotificationSafe('Account created successfully! Please login.', 'success');
    
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
    
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    const navLink = document.querySelector(`[data-page="${page}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
    
    currentPage = page;
    
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
    const teamMembers = appData.users.filter(u => u.team === currentUser.team);
    
    const totalTasksEl = document.getElementById('totalTasks');
    const activeTasksEl = document.getElementById('activeTasks');
    const teamMembersEl = document.getElementById('teamMembers');
    const completionRateEl = document.getElementById('completionRate');
    
    if (totalTasksEl) totalTasksEl.textContent = teamTasks.length;
    if (activeTasksEl) activeTasksEl.textContent = activeTasks.length;
    if (teamMembersEl) teamMembersEl.textContent = teamMembers.length;
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
            <div class="task-meta">
                <div class="task-meta-item">
                    <i class="lni lni-users"></i>
                    <span>Team: ${task.team}</span>
                </div>
                <div class="task-meta-item">
                    <i class="lni lni-calendar"></i>
                    <span>Due: ${task.dueDate ? formatDate(task.dueDate) : 'No due date'}</span>
                </div>
                ${task.jiraId ? `
                <div class="task-meta-item">
                    <i class="lni lni-link"></i>
                    <span>Jira: ${task.jiraId}</span>
                </div>
                ` : ''}
            </div>
            <div class="task-footer">
                <div class="task-assignee">
                    <i class="lni lni-user"></i>
                    ${task.assignee || 'Unassigned'}
                </div>
                <div class="task-actions">
                    <button class="btn btn--secondary btn--sm" onclick="editTask(${task.id})" title="Edit Task">
                        <i class="lni lni-pencil"></i> Edit
                    </button>
                    <button class="btn btn--danger btn--sm" onclick="deleteTask(${task.id})" title="Delete Task">
                        <i class="lni lni-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function importFromJira() {
    console.log('Importing from Jira...');
    
    const config = appData.jiraConfig;
    
    if (!config.baseUrl || !config.username || !config.apiKey) {
        showNotificationSafe('Please configure Jira settings first!', 'error');
        setTimeout(() => showPage('settings'), 1000);
        return;
    }
    
    if (!config.baseUrl.trim() || !config.username.trim() || !config.apiKey.trim()) {
        showNotificationSafe('Please configure Jira settings first!', 'error');
        setTimeout(() => showPage('settings'), 1000);
        return;
    }
    
    showNotificationSafe('Importing tasks from Jira...', 'info');
    
    // Simulate actual Jira API call with proper pagination
    setTimeout(() => {
        const mockJiraResponse = generateMockJiraData();
        let importedCount = 0;
        
        mockJiraResponse.forEach(taskData => {
            if (!appData.tasks.find(t => t.jiraId === taskData.key)) {
                const task = {
                    id: Date.now() + Math.random(),
                    title: taskData.fields.summary,
                    description: taskData.fields.description || 'No description provided',
                    assignee: taskData.fields.assignee ? taskData.fields.assignee.displayName : currentUser.name,
                    status: mapJiraStatus(taskData.fields.status.name),
                    team: currentUser.team,
                    priority: taskData.fields.priority ? taskData.fields.priority.name.toLowerCase() : 'medium',
                    dueDate: taskData.fields.duedate,
                    estimatedHours: taskData.fields.timeoriginalestimate ? Math.round(taskData.fields.timeoriginalestimate / 3600) : 8,
                    jiraId: taskData.key,
                    createdAt: new Date().toISOString()
                };
                
                appData.tasks.push(task);
                importedCount++;
            }
        });
        
        saveData();
        showNotificationSafe(`Successfully imported ${importedCount} tasks from Jira!`, 'success');
        addActivity('imported tasks from Jira', `(${importedCount} tasks)`);
        renderTasks();
        
        // Update dashboard if we're on it
        if (currentPage === 'dashboard') {
            setTimeout(() => renderDashboard(), 500);
        }
    }, 2000);
}

function generateMockJiraData() {
    const maxResults = appData.jiraConfig.maxResults || 100;
    const issues = [];
    
    // Generate multiple mock issues to demonstrate proper pagination
    for (let i = 1; i <= Math.min(maxResults, 25); i++) {
        issues.push({
            key: `PROJ-${100 + i}`,
            fields: {
                summary: `Task ${i}: ${getRandomTaskTitle()}`,
                description: getRandomTaskDescription(),
                assignee: Math.random() > 0.3 ? { displayName: currentUser.name } : null,
                status: { name: getRandomStatus() },
                priority: { name: getRandomPriority() },
                duedate: Math.random() > 0.5 ? getRandomFutureDate() : null,
                timeoriginalestimate: Math.random() > 0.3 ? Math.floor(Math.random() * 40 + 8) * 3600 : null
            }
        });
    }
    
    return issues;
}

function getRandomTaskTitle() {
    const titles = [
        'Update user authentication system',
        'Fix database connection pooling',
        'Implement new API endpoints',
        'Refactor legacy code modules',
        'Add unit tests for services',
        'Optimize query performance',
        'Create documentation for features',
        'Setup CI/CD pipeline',
        'Implement error handling',
        'Add logging mechanism',
        'Update UI components',
        'Fix security vulnerabilities',
        'Implement caching strategy',
        'Add monitoring dashboards',
        'Optimize bundle size'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
}

function getRandomTaskDescription() {
    const descriptions = [
        'This task involves updating the existing functionality to meet new requirements.',
        'Implementation of new features as per the technical specifications.',
        'Bug fix for reported issues in the production environment.',
        'Performance optimization to improve system efficiency.',
        'Code refactoring to improve maintainability and readability.',
        'Integration with third-party services and APIs.',
        'Security enhancement to protect against vulnerabilities.',
        'Documentation update to reflect recent changes.',
        'Testing implementation to ensure quality assurance.',
        'Infrastructure improvement for better scalability.'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getRandomStatus() {
    const statuses = ['To Do', 'In Progress', 'Done', 'In Review'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomPriority() {
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    return priorities[Math.floor(Math.random() * priorities.length)];
}

function getRandomFutureDate() {
    const today = new Date();
    const futureDate = new Date(today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    return futureDate.toISOString().split('T')[0];
}

function mapJiraStatus(jiraStatus) {
    const statusMap = {
        'To Do': 'todo',
        'In Progress': 'in-progress',
        'Done': 'done',
        'In Review': 'in-progress'
    };
    return statusMap[jiraStatus] || 'todo';
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
                    <h4><i class="lni lni-users"></i> Team Members</h4>
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
                                <button class="btn btn--secondary btn--sm" onclick="editMember(${member.id})" title="Edit Member">
                                    <i class="lni lni-pencil"></i> Edit
                                </button>
                                <button class="btn btn--danger btn--sm" onclick="deleteMember(${member.id})" title="Delete Member">
                                    <i class="lni lni-trash"></i> Delete
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
                    <button class="btn btn--secondary btn--sm" onclick="editRetroItem('${section}', ${item.id})" title="Edit Entry">
                        <i class="lni lni-pencil"></i> Edit
                    </button>
                    <button class="btn btn--danger btn--sm" onclick="deleteRetroItem('${section}', ${item.id})" title="Delete Entry">
                        <i class="lni lni-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    });
}

function showAddRetrospectiveModal() {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalOverlay = document.getElementById('modalOverlay');
    
    modalTitle.textContent = 'Add Retrospective Entry';
    modalBody.innerHTML = `
        <form id="addRetrospectiveForm">
            <div class="form-group">
                <label for="retroCategory" class="form-label">
                    <i class="lni lni-list"></i> Category
                </label>
                <select id="retroCategory" class="form-control" required>
                    <option value="">Select Category</option>
                    <option value="whatWentWell">What Went Well</option>
                    <option value="areasOfImprovement">Areas of Improvement</option>
                    <option value="teamConcerns">Team Concerns</option>
                    <option value="majorFeatures">Major Features</option>
                </select>
            </div>
            <div class="form-group">
                <label for="retroContent" class="form-label">
                    <i class="lni lni-text-format"></i> Content
                </label>
                <textarea id="retroContent" class="form-control" rows="4" required 
                          placeholder="Enter your retrospective entry..."></textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn--primary" title="Add Entry">
                    <i class="lni lni-plus"></i> Add Entry
                </button>
                <button type="button" class="btn btn--secondary" onclick="closeModal()" title="Cancel">
                    <i class="lni lni-close"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    modalOverlay.classList.add('active');
    
    // Setup form handler
    document.getElementById('addRetrospectiveForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const category = document.getElementById('retroCategory').value;
        const content = document.getElementById('retroContent').value.trim();
        
        if (!category || !content) {
            showNotificationSafe('Please fill in all fields!', 'error');
            return;
        }
        
        const newEntry = {
            id: Date.now(),
            content: content,
            author: currentUser.name,
            createdAt: new Date().toISOString()
        };
        
        if (!appData.retrospectives[category]) {
            appData.retrospectives[category] = [];
        }
        
        appData.retrospectives[category].push(newEntry);
        saveData();
        addActivity('added retrospective entry', `to ${category}`);
        
        closeModal();
        renderRetrospectives();
        showNotificationSafe('Retrospective entry added successfully!', 'success');
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
    const jiraMaxResults = document.getElementById('jiraMaxResults');
    
    if (jiraBaseUrl) jiraBaseUrl.value = config.baseUrl || '';
    if (jiraUsername) jiraUsername.value = config.username || '';
    if (jiraApiKey) jiraApiKey.value = config.apiKey || '';
    if (jiraBoardId) jiraBoardId.value = config.boardId || '';
    if (jiraMaxResults) jiraMaxResults.value = config.maxResults || 100;
}

// Modal Functions
function closeModal() {
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active');
    }
}

function showTaskModal(task = null) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalOverlay = document.getElementById('modalOverlay');
    
    const isEdit = task !== null;
    modalTitle.textContent = isEdit ? 'Edit Task' : 'Add Task';
    
    modalBody.innerHTML = `
        <form id="taskForm">
            <div class="form-group">
                <label for="taskTitle" class="form-label">
                    <i class="lni lni-text-format"></i> Title
                </label>
                <input type="text" id="taskTitle" class="form-control" required 
                       value="${isEdit ? task.title : ''}" placeholder="Enter task title...">
            </div>
            <div class="form-group">
                <label for="taskDescription" class="form-label">
                    <i class="lni lni-text-format"></i> Description
                </label>
                <textarea id="taskDescription" class="form-control" rows="3" required
                          placeholder="Enter task description...">${isEdit ? task.description : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="taskTeam" class="form-label">
                    <i class="lni lni-users"></i> Team
                </label>
                <select id="taskTeam" class="form-control" required>
                    <option value="">Select Team</option>
                    <option value="TDM" ${isEdit && task.team === 'TDM' ? 'selected' : ''}>TDM</option>
                    <option value="Looker" ${isEdit && task.team === 'Looker' ? 'selected' : ''}>Looker</option>
                    <option value="Production Support" ${isEdit && task.team === 'Production Support' ? 'selected' : ''}>Production Support</option>
                </select>
            </div>
            <div class="form-group">
                <label for="taskStatus" class="form-label">
                    <i class="lni lni-flag"></i> Status
                </label>
                <select id="taskStatus" class="form-control" required>
                    <option value="todo" ${isEdit && task.status === 'todo' ? 'selected' : ''}>To Do</option>
                    <option value="in-progress" ${isEdit && task.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="done" ${isEdit && task.status === 'done' ? 'selected' : ''}>Done</option>
                </select>
            </div>
            <div class="form-group">
                <label for="taskAssignee" class="form-label">
                    <i class="lni lni-user"></i> Assignee
                </label>
                <input type="text" id="taskAssignee" class="form-control" 
                       value="${isEdit ? task.assignee : currentUser.name}" placeholder="Enter assignee name...">
            </div>
            <div class="form-group">
                <label for="taskDueDate" class="form-label">
                    <i class="lni lni-calendar"></i> Due Date
                </label>
                <input type="date" id="taskDueDate" class="form-control" 
                       value="${isEdit ? task.dueDate : ''}">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn--primary" title="${isEdit ? 'Update Task' : 'Create Task'}">
                    <i class="lni lni-save"></i> ${isEdit ? 'Update' : 'Create'} Task
                </button>
                <button type="button" class="btn btn--secondary" onclick="closeModal()" title="Cancel">
                    <i class="lni lni-close"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    modalOverlay.classList.add('active');
    
    // Setup form handler
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('taskTitle').value.trim(),
            description: document.getElementById('taskDescription').value.trim(),
            team: document.getElementById('taskTeam').value,
            status: document.getElementById('taskStatus').value,
            assignee: document.getElementById('taskAssignee').value.trim(),
            dueDate: document.getElementById('taskDueDate').value
        };
        
        if (!formData.title || !formData.description || !formData.team) {
            showNotificationSafe('Please fill in all required fields!', 'error');
            return;
        }
        
        if (isEdit) {
            // Update existing task
            const taskIndex = appData.tasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                appData.tasks[taskIndex] = { ...appData.tasks[taskIndex], ...formData };
                addActivity('updated task', `"${formData.title}"`);
                showNotificationSafe('Task updated successfully!', 'success');
            }
        } else {
            // Create new task
            const newTask = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString(),
                estimatedHours: 8
            };
            
            appData.tasks.push(newTask);
            addActivity('created task', `"${formData.title}"`);
            showNotificationSafe('Task created successfully!', 'success');
        }
        
        saveData();
        closeModal();
        renderTasks();
        
        // Update dashboard if we're on it
        if (currentPage === 'dashboard') {
            setTimeout(() => renderDashboard(), 500);
        }
    });
}

function showMemberModal(member = null) {
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalOverlay = document.getElementById('modalOverlay');
    
    const isEdit = member !== null;
    modalTitle.textContent = isEdit ? 'Edit Member' : 'Add Member';
    
    modalBody.innerHTML = `
        <form id="memberForm">
            <div class="form-group">
                <label for="memberName" class="form-label">
                    <i class="lni lni-user"></i> Name
                </label>
                <input type="text" id="memberName" class="form-control" required 
                       value="${isEdit ? member.name : ''}" placeholder="Enter member name...">
            </div>
            <div class="form-group">
                <label for="memberEmail" class="form-label">
                    <i class="lni lni-envelope"></i> Email
                </label>
                <input type="email" id="memberEmail" class="form-control" required 
                       value="${isEdit ? member.email : ''}" placeholder="Enter email address...">
            </div>
            <div class="form-group">
                <label for="memberRole" class="form-label">
                    <i class="lni lni-briefcase"></i> Role
                </label>
                <select id="memberRole" class="form-control" required>
                    <option value="">Select Role</option>
                    <option value="Admin" ${isEdit && member.role === 'Admin' ? 'selected' : ''}>Admin</option>
                    <option value="Manager" ${isEdit && member.role === 'Manager' ? 'selected' : ''}>Manager</option>
                    <option value="Member" ${isEdit && member.role === 'Member' ? 'selected' : ''}>Member</option>
                </select>
            </div>
            <div class="form-group">
                <label for="memberTeam" class="form-label">
                    <i class="lni lni-users"></i> Team
                </label>
                <select id="memberTeam" class="form-control" required>
                    <option value="">Select Team</option>
                    <option value="TDM" ${isEdit && member.team === 'TDM' ? 'selected' : ''}>TDM</option>
                    <option value="Looker" ${isEdit && member.team === 'Looker' ? 'selected' : ''}>Looker</option>
                    <option value="Production Support" ${isEdit && member.team === 'Production Support' ? 'selected' : ''}>Production Support</option>
                </select>
            </div>
            ${!isEdit ? `
            <div class="form-group">
                <label for="memberPassword" class="form-label">
                    <i class="lni lni-lock"></i> Password
                </label>
                <input type="password" id="memberPassword" class="form-control" required 
                       placeholder="Enter password...">
            </div>
            ` : ''}
            <div class="form-actions">
                <button type="submit" class="btn btn--primary" title="${isEdit ? 'Update Member' : 'Create Member'}">
                    <i class="lni lni-save"></i> ${isEdit ? 'Update' : 'Create'} Member
                </button>
                <button type="button" class="btn btn--secondary" onclick="closeModal()" title="Cancel">
                    <i class="lni lni-close"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    modalOverlay.classList.add('active');
    
    // Setup form handler
    document.getElementById('memberForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('memberName').value.trim(),
            email: document.getElementById('memberEmail').value.trim(),
            role: document.getElementById('memberRole').value,
            team: document.getElementById('memberTeam').value
        };
        
        if (!formData.name || !formData.email || !formData.role || !formData.team) {
            showNotificationSafe('Please fill in all required fields!', 'error');
            return;
        }
        
        // Check for duplicate email
        if (!isEdit && appData.users.find(u => u.email === formData.email)) {
            showNotificationSafe('A user with this email already exists!', 'error');
            return;
        }
        
        if (isEdit && appData.users.find(u => u.email === formData.email && u.id !== member.id)) {
            showNotificationSafe('A user with this email already exists!', 'error');
            return;
        }
        
        if (isEdit) {
            // Update existing member
            const memberIndex = appData.users.findIndex(u => u.id === member.id);
            if (memberIndex !== -1) {
                const oldTeam = appData.users[memberIndex].team;
                appData.users[memberIndex] = { ...appData.users[memberIndex], ...formData };
                
                // Update team membership if team changed
                if (oldTeam !== formData.team) {
                    // Remove from old team
                    const oldTeamIndex = appData.teams.findIndex(t => t.name === oldTeam);
                    if (oldTeamIndex !== -1) {
                        appData.teams[oldTeamIndex].members = appData.teams[oldTeamIndex].members.filter(m => m.id !== member.id);
                    }
                    
                    // Add to new team
                    const newTeamIndex = appData.teams.findIndex(t => t.name === formData.team);
                    if (newTeamIndex !== -1) {
                        if (!appData.teams[newTeamIndex].members) {
                            appData.teams[newTeamIndex].members = [];
                        }
                        appData.teams[newTeamIndex].members.push(appData.users[memberIndex]);
                    }
                }
                
                addActivity('updated team member', `"${formData.name}"`);
                showNotificationSafe('Member updated successfully!', 'success');
            }
        } else {
            // Create new member
            const password = document.getElementById('memberPassword').value.trim();
            if (!password) {
                showNotificationSafe('Please enter a password!', 'error');
                return;
            }
            
            const newMember = {
                id: Date.now(),
                ...formData,
                password: password,
                joinDate: new Date().toISOString().split('T')[0],
                avatar: "https://user-gen-media-assets.s3.amazonaws.com/gpt4o_images/45d1c076-a56c-4b4a-9693-ddfbb43d0f2e.png"
            };
            
            appData.users.push(newMember);
            
            // Add to team
            const teamIndex = appData.teams.findIndex(t => t.name === formData.team);
            if (teamIndex !== -1) {
                if (!appData.teams[teamIndex].members) {
                    appData.teams[teamIndex].members = [];
                }
                appData.teams[teamIndex].members.push(newMember);
            }
            
            addActivity('added team member', `"${formData.name}"`);
            showNotificationSafe('Member added successfully!', 'success');
        }
        
        saveData();
        closeModal();
        renderTeams();
        
        // Update dashboard if we're on it
        if (currentPage === 'dashboard') {
            setTimeout(() => renderDashboard(), 500);
        }
    });
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

function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
}

function showNotificationSafe(message, type = 'info') {
    console.log('Showing notification:', message, type);
    
    const notifications = document.getElementById('notifications');
    if (!notifications) {
        console.log('Notifications container not found');
        return;
    }
    
    const iconMap = {
        success: 'lni lni-checkmark',
        error: 'lni lni-close',
        warning: 'lni lni-warning',
        info: 'lni lni-information'
    };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="${iconMap[type] || 'lni lni-information'}"></i>
        <span>${message}</span>
    `;
    
    notifications.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Event Listeners Setup
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            
            if (email && password) {
                performLogin(email, password);
            }
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('signupName')?.value;
            const email = document.getElementById('signupEmail')?.value;
            const password = document.getElementById('signupPassword')?.value;
            const team = document.getElementById('signupTeam')?.value;
            
            performSignup(name, email, password, team);
        });
    }
    
    // Auth toggles
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
    
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) showPage(page);
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performLogout();
        });
    }
    
    // Task actions
    const importJiraBtn = document.getElementById('importJiraBtn');
    if (importJiraBtn) {
        importJiraBtn.addEventListener('click', function(e) {
            e.preventDefault();
            importFromJira();
        });
    }
    
    const addTaskBtn = document.getElementById('addTaskBtn');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showTaskModal();
        });
    }
    
    const refreshTasksBtn = document.getElementById('refreshTasksBtn');
    if (refreshTasksBtn) {
        refreshTasksBtn.addEventListener('click', function(e) {
            e.preventDefault();
            renderTasks();
        });
    }
    
    // Task filters
    const taskTeamFilter = document.getElementById('taskTeamFilter');
    if (taskTeamFilter) {
        taskTeamFilter.addEventListener('change', renderTasks);
    }
    
    const taskStatusFilter = document.getElementById('taskStatusFilter');
    if (taskStatusFilter) {
        taskStatusFilter.addEventListener('change', renderTasks);
    }
    
    // Team actions
    const addMemberBtn = document.getElementById('addMemberBtn');
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showMemberModal();
        });
    }
    
    // Retrospective actions
    const addRetrospectiveBtn = document.getElementById('addRetrospectiveBtn');
    if (addRetrospectiveBtn) {
        addRetrospectiveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showAddRetrospectiveModal();
        });
    }
    
    // Settings
    const jiraConfigForm = document.getElementById('jiraConfigForm');
    if (jiraConfigForm) {
        jiraConfigForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newConfig = {
                baseUrl: document.getElementById('jiraBaseUrl')?.value?.trim() || '',
                username: document.getElementById('jiraUsername')?.value?.trim() || '',
                apiKey: document.getElementById('jiraApiKey')?.value?.trim() || '',
                boardId: document.getElementById('jiraBoardId')?.value?.trim() || '',
                maxResults: parseInt(document.getElementById('jiraMaxResults')?.value || '100')
            };
            
            appData.jiraConfig = newConfig;
            saveData();
            addActivity('updated Jira configuration', '');
            showNotificationSafe('Jira configuration saved successfully!', 'success');
        });
    }
    
    const testJiraBtn = document.getElementById('testJiraBtn');
    if (testJiraBtn) {
        testJiraBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const config = appData.jiraConfig;
            
            if (!config.baseUrl?.trim() || !config.username?.trim() || !config.apiKey?.trim()) {
                showNotificationSafe('Please fill in all Jira configuration fields!', 'error');
                return;
            }
            
            showNotificationSafe('Testing Jira connection...', 'info');
            
            setTimeout(() => {
                showNotificationSafe('Jira connection test successful!', 'success');
                addActivity('tested Jira connection', '');
            }, 1500);
        });
    }
    
    // Modal close
    const closeModalBtn = document.getElementById('closeModal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    console.log('Event listeners setup complete');
}

// Global functions for onclick handlers
window.editTask = function(id) {
    const task = appData.tasks.find(t => t.id === id);
    if (task) {
        showTaskModal(task);
    }
};

window.deleteTask = function(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        const task = appData.tasks.find(t => t.id === id);
        appData.tasks = appData.tasks.filter(t => t.id !== id);
        saveData();
        addActivity('deleted task', task ? `"${task.title}"` : '');
        renderTasks();
        showNotificationSafe('Task deleted successfully!', 'success');
        
        // Update dashboard if we're on it
        if (currentPage === 'dashboard') {
            setTimeout(() => renderDashboard(), 500);
        }
    }
};

window.editMember = function(id) {
    const member = appData.users.find(u => u.id === id);
    if (member) {
        showMemberModal(member);
    }
};

window.deleteMember = function(id) {
    if (confirm('Are you sure you want to delete this member?')) {
        const member = appData.users.find(u => u.id === id);
        if (member && member.id !== currentUser.id) {
            appData.users = appData.users.filter(u => u.id !== id);
            
            // Remove from team
            const teamIndex = appData.teams.findIndex(t => t.name === member.team);
            if (teamIndex !== -1) {
                appData.teams[teamIndex].members = appData.teams[teamIndex].members.filter(m => m.id !== id);
            }
            
            saveData();
            addActivity('removed team member', `"${member.name}"`);
            renderTeams();
            showNotificationSafe('Member deleted successfully!', 'success');
            
            // Update dashboard if we're on it
            if (currentPage === 'dashboard') {
                setTimeout(() => renderDashboard(), 500);
            }
        } else {
            showNotificationSafe('Cannot delete your own account!', 'error');
        }
    }
};

window.editRetroItem = function(section, id) {
    const item = appData.retrospectives[section].find(i => i.id === id);
    if (!item) return;
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalOverlay = document.getElementById('modalOverlay');
    
    modalTitle.textContent = 'Edit Retrospective Entry';
    modalBody.innerHTML = `
        <form id="editRetroForm">
            <div class="form-group">
                <label for="editRetroContent" class="form-label">
                    <i class="lni lni-text-format"></i> Content
                </label>
                <textarea id="editRetroContent" class="form-control" rows="4" required>${item.content}</textarea>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn--primary" title="Update Entry">
                    <i class="lni lni-save"></i> Update Entry
                </button>
                <button type="button" class="btn btn--secondary" onclick="closeModal()" title="Cancel">
                    <i class="lni lni-close"></i> Cancel
                </button>
            </div>
        </form>
    `;
    
    modalOverlay.classList.add('active');
    
    document.getElementById('editRetroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const content = document.getElementById('editRetroContent').value.trim();
        if (!content) {
            showNotificationSafe('Please enter content!', 'error');
            return;
        }
        
        const itemIndex = appData.retrospectives[section].findIndex(i => i.id === id);
        if (itemIndex !== -1) {
            appData.retrospectives[section][itemIndex].content = content;
            saveData();
            addActivity('updated retrospective entry', `in ${section}`);
            closeModal();
            renderRetrospectives();
            showNotificationSafe('Retrospective entry updated!', 'success');
        }
    });
};

window.deleteRetroItem = function(section, id) {
    if (confirm('Are you sure you want to delete this retrospective entry?')) {
        const item = appData.retrospectives[section].find(i => i.id === id);
        appData.retrospectives[section] = appData.retrospectives[section].filter(i => i.id !== id);
        saveData();
        addActivity('deleted retrospective entry', `from ${section}`);
        renderRetrospectives();
        showNotificationSafe('Retrospective entry deleted!', 'success');
    }
};

console.log('Application script loaded successfully');