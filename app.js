// Team Tracker Pro - Fixed JavaScript Application
class TeamTrackerApp {
    constructor() {
        this.data = {
            teamMembers: [],
            tasks: [],
            retrospectives: [],
            recentActivity: [],
            jiraConfig: {
                baseUrl: '',
                apiKey: '',
                username: '',
                enabled: false
            },
            emailConfig: {
                enabled: false,
                smtpHost: '',
                smtpPort: 587,
                username: '',
                password: '',
                fromEmail: ''
            }
        };
        
        this.currentSection = 'dashboard';
        this.currentTeamFilter = 'all';
        this.currentTaskFilters = { status: '', assignee: '', search: '' };
        this.editingMember = null;
        this.editingTask = null;
        this.editingRetrospective = null;
        
        this.teams = ['TDM', 'Looker', 'Production Support'];
        this.roles = ['Developer', 'Senior Developer', 'Tech Lead', 'Manager', 'Product Manager', 'QA Engineer', 'DevOps Engineer'];
        this.taskStatuses = ['Not Started', 'In Progress', 'In Review', 'Blocked', 'Completed', 'Reopened'];
        
        this.teamChart = null;
        
        this.init();
    }
    
    init() {
        this.loadData();
        this.setupEventListeners();
        this.setupTheme();
        this.renderDashboard();
        this.renderTeamMembers();
        this.renderTasks();
        this.renderRetrospectives();
        this.loadSettings();
    }
    
    // Data Management
    loadData() {
        const saved = localStorage.getItem('teamTrackerData');
        if (saved) {
            this.data = { ...this.data, ...JSON.parse(saved) };
        } else {
            // Load sample data
            this.data.teamMembers = [
                {
                    id: 1,
                    name: "Sarah Chen",
                    role: "Tech Lead",
                    team: "TDM",
                    joinDate: "2020-03-15",
                    email: "sarah.chen@company.com"
                },
                {
                    id: 2,
                    name: "Michael Rodriguez",
                    role: "Senior Developer",
                    team: "Looker",
                    joinDate: "2019-08-22",
                    email: "michael.rodriguez@company.com"
                },
                {
                    id: 3,
                    name: "Priya Patel",
                    role: "Manager",
                    team: "Production Support",
                    joinDate: "2018-11-10",
                    email: "priya.patel@company.com"
                }
            ];
            
            this.data.tasks = [
                {
                    id: 1,
                    jiraId: "TDM-123",
                    description: "Implement data validation pipeline",
                    estimation: 40,
                    dailyComments: "Working on schema validation logic",
                    completionDate: "2025-07-20",
                    blockers: "Waiting for API documentation",
                    clarificationNeeded: false,
                    gitLink: "https://github.com/company/project/pull/456",
                    oneDriveLink: "https://company.sharepoint.com/docs/requirements.pdf",
                    assignee: "Sarah Chen",
                    status: "In Progress",
                    customerFeedback: "High priority for Q3 release",
                    reopened: false,
                    leadComments: "Good progress, need to resolve API dependency",
                    createdDate: "2025-07-05",
                    updatedDate: "2025-07-11"
                },
                {
                    id: 2,
                    jiraId: "LOOK-789",
                    description: "Dashboard performance optimization",
                    estimation: 24,
                    dailyComments: "Implemented caching layer, seeing 40% improvement",
                    completionDate: "2025-07-15",
                    blockers: "",
                    clarificationNeeded: false,
                    gitLink: "https://github.com/company/looker-dashboard/pull/123",
                    oneDriveLink: "https://company.sharepoint.com/performance-metrics.xlsx",
                    assignee: "Michael Rodriguez",
                    status: "Completed",
                    customerFeedback: "Great improvement in load times",
                    reopened: false,
                    leadComments: "Excellent work on optimization",
                    createdDate: "2025-07-01",
                    updatedDate: "2025-07-11"
                }
            ];
            
            // Initialize activity based on existing tasks
            this.data.recentActivity = this.data.tasks.map(task => ({
                id: Date.now() + Math.random(),
                type: 'task_created',
                title: `Task Created: ${task.jiraId}`,
                description: task.description,
                timestamp: new Date(task.createdDate).toISOString(),
                user: task.assignee || 'System'
            }));
            
            this.saveData();
        }
    }
    
    saveData() {
        localStorage.setItem('teamTrackerData', JSON.stringify(this.data));
    }
    
    // Event Listeners
    setupEventListeners() {
        // Navigation - Use preventDefault to stop default behavior
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }
        
        // Team member management
        const addMemberBtn = document.getElementById('addMemberBtn');
        if (addMemberBtn) {
            addMemberBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showMemberModal();
            });
        }
        
        const memberForm = document.getElementById('memberForm');
        if (memberForm) {
            memberForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveMember();
            });
        }
        
        const cancelMemberBtn = document.getElementById('cancelMemberBtn');
        if (cancelMemberBtn) {
            cancelMemberBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMemberModal();
            });
        }
        
        const closeMemberModal = document.getElementById('closeMemberModal');
        if (closeMemberModal) {
            closeMemberModal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeMemberModal();
            });
        }
        
        // Task management
        const addTaskBtn = document.getElementById('addTaskBtn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showTaskModal();
            });
        }
        
        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            taskForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveTask();
            });
        }
        
        const cancelTaskBtn = document.getElementById('cancelTaskBtn');
        if (cancelTaskBtn) {
            cancelTaskBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeTaskModal();
            });
        }
        
        const closeTaskModal = document.getElementById('closeTaskModal');
        if (closeTaskModal) {
            closeTaskModal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeTaskModal();
            });
        }
        
        // Task filters
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                e.stopPropagation();
                this.currentTaskFilters.status = e.target.value;
                this.renderTasks();
            });
        }
        
        const assigneeFilter = document.getElementById('assigneeFilter');
        if (assigneeFilter) {
            assigneeFilter.addEventListener('change', (e) => {
                e.stopPropagation();
                this.currentTaskFilters.assignee = e.target.value;
                this.renderTasks();
            });
        }
        
        const searchTasks = document.getElementById('searchTasks');
        if (searchTasks) {
            searchTasks.addEventListener('input', (e) => {
                e.stopPropagation();
                this.currentTaskFilters.search = e.target.value;
                this.renderTasks();
            });
        }
        
        // Team tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.currentTeamFilter = e.target.dataset.team;
                this.updateTeamTabs();
                this.renderTeamMembers();
            });
        });
        
        // Retrospectives
        const addRetrospectiveBtn = document.getElementById('addRetrospectiveBtn');
        if (addRetrospectiveBtn) {
            addRetrospectiveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showRetrospectiveModal();
            });
        }
        
        const retrospectiveForm = document.getElementById('retrospectiveForm');
        if (retrospectiveForm) {
            retrospectiveForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveRetrospective();
            });
        }
        
        const cancelRetrospectiveBtn = document.getElementById('cancelRetrospectiveBtn');
        if (cancelRetrospectiveBtn) {
            cancelRetrospectiveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeRetrospectiveModal();
            });
        }
        
        const closeRetrospectiveModal = document.getElementById('closeRetrospectiveModal');
        if (closeRetrospectiveModal) {
            closeRetrospectiveModal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeRetrospectiveModal();
            });
        }
        
        // Jira integration
        const jiraConfigForm = document.getElementById('jiraConfigForm');
        if (jiraConfigForm) {
            jiraConfigForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveJiraConfig();
            });
        }
        
        const testJiraConnection = document.getElementById('testJiraConnection');
        if (testJiraConnection) {
            testJiraConnection.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.testJiraConnection();
            });
        }
        
        const importJiraTasksBtn = document.getElementById('importJiraTasksBtn');
        if (importJiraTasksBtn) {
            importJiraTasksBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.importJiraTasks();
            });
        }
        
        // Email settings
        const emailConfigForm = document.getElementById('emailConfigForm');
        if (emailConfigForm) {
            emailConfigForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveEmailConfig();
            });
        }
        
        const testEmailBtn = document.getElementById('testEmailBtn');
        if (testEmailBtn) {
            testEmailBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.testEmail();
            });
        }
        
        // Modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });
    }
    
    // Theme Management
    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }
    
    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        if (icon) {
            icon.className = theme === 'light' ? 'lni lni-moon' : 'lni lni-sun';
        }
    }
    
    // Navigation
    switchSection(section) {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-section="${section}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
        
        // Update sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
            sectionElement.classList.add('active');
        }
        
        this.currentSection = section;
        
        // Render section-specific content
        switch(section) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'team-members':
                this.renderTeamMembers();
                break;
            case 'tasks':
                this.renderTasks();
                break;
            case 'retrospectives':
                this.renderRetrospectives();
                break;
            case 'jira-integration':
                this.loadSettings();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }
    
    // Dashboard
    renderDashboard() {
        this.updateKPIs();
        this.renderTeamChart();
        this.renderRecentActivity();
    }
    
    updateKPIs() {
        const totalMembers = this.data.teamMembers.length;
        const totalTasks = this.data.tasks.filter(t => t.status !== 'Completed').length;
        const completedTasks = this.data.tasks.filter(t => t.status === 'Completed').length;
        const blockedTasks = this.data.tasks.filter(t => t.status === 'Blocked').length;
        
        const totalMembersEl = document.getElementById('totalMembers');
        const totalTasksEl = document.getElementById('totalTasks');
        const completedTasksEl = document.getElementById('completedTasks');
        const blockedTasksEl = document.getElementById('blockedTasks');
        
        if (totalMembersEl) totalMembersEl.textContent = totalMembers;
        if (totalTasksEl) totalTasksEl.textContent = totalTasks;
        if (completedTasksEl) completedTasksEl.textContent = completedTasks;
        if (blockedTasksEl) blockedTasksEl.textContent = blockedTasks;
    }
    
    renderTeamChart() {
        const ctx = document.getElementById('teamChart');
        if (!ctx) return;
        
        const teamCounts = this.teams.map(team => 
            this.data.teamMembers.filter(member => member.team === team).length
        );
        
        if (this.teamChart) {
            this.teamChart.destroy();
        }
        
        this.teamChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.teams,
                datasets: [{
                    data: teamCounts,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20
                        }
                    }
                }
            }
        });
    }
    
    renderRecentActivity() {
        const container = document.getElementById('recentActivity');
        if (!container) return;
        
        if (this.data.recentActivity.length === 0) {
            container.innerHTML = `
                <div class="activity-empty">
                    <i class="lni lni-information"></i>
                    <p>No recent activity</p>
                </div>
            `;
            return;
        }
        
        const sortedActivity = this.data.recentActivity
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);
        
        container.innerHTML = sortedActivity.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="lni lni-${this.getActivityIcon(activity.type)}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                </div>
                <div class="activity-time">
                    ${this.formatRelativeTime(activity.timestamp)}
                </div>
            </div>
        `).join('');
    }
    
    getActivityIcon(type) {
        const icons = {
            'task_created': 'plus',
            'task_updated': 'pencil',
            'task_completed': 'checkmark',
            'member_added': 'user',
            'member_removed': 'user-unfollow',
            'retrospective_added': 'thought',
            'jira_import': 'download'
        };
        return icons[type] || 'information';
    }
    
    formatRelativeTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }
    
    // Team Members
    renderTeamMembers() {
        const container = document.getElementById('membersGrid');
        if (!container) return;
        
        let filteredMembers = this.data.teamMembers;
        
        if (this.currentTeamFilter !== 'all') {
            filteredMembers = filteredMembers.filter(member => member.team === this.currentTeamFilter);
        }
        
        if (filteredMembers.length === 0) {
            container.innerHTML = `
                <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <i class="lni lni-users" style="font-size: 3rem; color: var(--color-text-secondary); margin-bottom: 1rem;"></i>
                    <h3>No team members found</h3>
                    <p>Add your first team member to get started</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filteredMembers.map(member => `
            <div class="member-card" data-team="${member.team}">
                <div class="member-header">
                    <div class="member-avatar">
                        ${member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div class="member-info">
                        <h3>${member.name}</h3>
                        <p>${member.role}</p>
                    </div>
                </div>
                <div class="member-details">
                    <div class="member-detail">
                        <label>Team</label>
                        <span class="team-${member.team.toLowerCase().replace(' ', '-')}">${member.team}</span>
                    </div>
                    <div class="member-detail">
                        <label>Experience</label>
                        <span>${this.calculateExperience(member.joinDate)} years</span>
                    </div>
                    <div class="member-detail">
                        <label>Email</label>
                        <span>${member.email}</span>
                    </div>
                    <div class="member-detail">
                        <label>Joined</label>
                        <span>${this.formatDate(member.joinDate)}</span>
                    </div>
                </div>
                <div class="member-actions">
                    <button class="btn-icon btn-icon--edit" onclick="app.editMember(${member.id})" title="Edit Member">
                        <i class="lni lni-pencil"></i>
                    </button>
                    <button class="btn-icon btn-icon--delete" onclick="app.deleteMember(${member.id})" title="Delete Member">
                        <i class="lni lni-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        this.updateAssigneeFilters();
    }
    
    calculateExperience(joinDate) {
        const now = new Date();
        const joined = new Date(joinDate);
        const diffInYears = (now - joined) / (365.25 * 24 * 60 * 60 * 1000);
        return Math.max(0, Math.floor(diffInYears * 10) / 10);
    }
    
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    updateTeamTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-team="${this.currentTeamFilter}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }
    
    showMemberModal(member = null) {
        this.editingMember = member;
        const modal = document.getElementById('memberModal');
        const title = document.getElementById('memberModalTitle');
        const form = document.getElementById('memberForm');
        
        if (!modal || !title || !form) return;
        
        title.textContent = member ? 'Edit Team Member' : 'Add Team Member';
        
        if (member) {
            document.getElementById('memberName').value = member.name;
            document.getElementById('memberEmail').value = member.email;
            document.getElementById('memberRole').value = member.role;
            document.getElementById('memberTeam').value = member.team;
            document.getElementById('memberJoinDate').value = member.joinDate;
        } else {
            form.reset();
        }
        
        modal.classList.add('active');
    }
    
    closeMemberModal() {
        const modal = document.getElementById('memberModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.editingMember = null;
    }
    
    saveMember() {
        const name = document.getElementById('memberName').value;
        const email = document.getElementById('memberEmail').value;
        const role = document.getElementById('memberRole').value;
        const team = document.getElementById('memberTeam').value;
        const joinDate = document.getElementById('memberJoinDate').value;
        
        if (!name || !email || !role || !team || !joinDate) {
            alert('Please fill in all fields');
            return;
        }
        
        if (this.editingMember) {
            // Update existing member
            const index = this.data.teamMembers.findIndex(m => m.id === this.editingMember.id);
            this.data.teamMembers[index] = {
                ...this.editingMember,
                name, email, role, team, joinDate
            };
            
            this.addActivity('member_updated', `Member Updated: ${name}`, `${name} profile has been updated`);
        } else {
            // Add new member
            const newMember = {
                id: Date.now(),
                name, email, role, team, joinDate
            };
            this.data.teamMembers.push(newMember);
            
            this.addActivity('member_added', `Member Added: ${name}`, `${name} joined the ${team} team as ${role}`);
        }
        
        this.saveData();
        this.closeMemberModal();
        this.renderTeamMembers();
        this.renderDashboard();
    }
    
    editMember(id) {
        const member = this.data.teamMembers.find(m => m.id === id);
        if (member) {
            this.showMemberModal(member);
        }
    }
    
    deleteMember(id) {
        if (confirm('Are you sure you want to delete this team member?')) {
            const member = this.data.teamMembers.find(m => m.id === id);
            this.data.teamMembers = this.data.teamMembers.filter(m => m.id !== id);
            
            this.addActivity('member_removed', `Member Removed: ${member.name}`, `${member.name} has been removed from the team`);
            
            this.saveData();
            this.renderTeamMembers();
            this.renderDashboard();
        }
    }
    
    // Tasks
    renderTasks() {
        const container = document.getElementById('tasksContainer');
        if (!container) return;
        
        let filteredTasks = this.data.tasks;
        
        // Apply filters
        if (this.currentTaskFilters.status) {
            filteredTasks = filteredTasks.filter(task => task.status === this.currentTaskFilters.status);
        }
        
        if (this.currentTaskFilters.assignee) {
            filteredTasks = filteredTasks.filter(task => task.assignee === this.currentTaskFilters.assignee);
        }
        
        if (this.currentTaskFilters.search) {
            const search = this.currentTaskFilters.search.toLowerCase();
            filteredTasks = filteredTasks.filter(task => 
                task.description.toLowerCase().includes(search) ||
                task.jiraId.toLowerCase().includes(search) ||
                task.assignee.toLowerCase().includes(search)
            );
        }
        
        if (filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align: center; padding: 2rem;">
                    <i class="lni lni-checkmark-circle" style="font-size: 3rem; color: var(--color-text-secondary); margin-bottom: 1rem;"></i>
                    <h3>No tasks found</h3>
                    <p>Add your first task to get started</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filteredTasks.map(task => `
            <div class="task-card">
                <div class="task-header">
                    <div class="task-id">${task.jiraId}</div>
                    <div class="task-status ${task.status.toLowerCase().replace(' ', '-')}">${task.status}</div>
                </div>
                <div class="task-description">${task.description}</div>
                <div class="task-meta">
                    <div class="task-meta-item">
                        <label>Assignee</label>
                        <span>${task.assignee}</span>
                    </div>
                    <div class="task-meta-item">
                        <label>Estimation</label>
                        <span>${task.estimation}h</span>
                    </div>
                    <div class="task-meta-item">
                        <label>Completion Date</label>
                        <span>${task.completionDate ? this.formatDate(task.completionDate) : 'Not set'}</span>
                    </div>
                    <div class="task-meta-item">
                        <label>Updated</label>
                        <span>${this.formatDate(task.updatedDate)}</span>
                    </div>
                </div>
                ${task.dailyComments ? `
                    <div class="task-comments">
                        <strong>Daily Comments:</strong> ${task.dailyComments}
                    </div>
                ` : ''}
                ${task.blockers ? `
                    <div class="task-blockers">
                        <strong>Blockers:</strong> ${task.blockers}
                    </div>
                ` : ''}
                <div class="task-actions">
                    <button class="btn-icon btn-icon--edit" onclick="app.editTask(${task.id})" title="Edit Task">
                        <i class="lni lni-pencil"></i>
                    </button>
                    <button class="btn-icon btn-icon--delete" onclick="app.deleteTask(${task.id})" title="Delete Task">
                        <i class="lni lni-trash"></i>
                    </button>
                    ${task.gitLink ? `<a href="${task.gitLink}" target="_blank" class="btn-icon btn-icon--edit" title="View Git Link"><i class="lni lni-github"></i></a>` : ''}
                    ${task.oneDriveLink ? `<a href="${task.oneDriveLink}" target="_blank" class="btn-icon btn-icon--edit" title="View OneDrive Link"><i class="lni lni-cloud"></i></a>` : ''}
                </div>
            </div>
        `).join('');
    }
    
    updateAssigneeFilters() {
        const assigneeFilter = document.getElementById('assigneeFilter');
        if (assigneeFilter) {
            const assignees = [...new Set(this.data.teamMembers.map(m => m.name))];
            
            assigneeFilter.innerHTML = '<option value="">All Assignees</option>' +
                assignees.map(assignee => `<option value="${assignee}">${assignee}</option>`).join('');
        }
        
        // Update task assignee dropdown
        const taskAssignee = document.getElementById('taskAssignee');
        if (taskAssignee) {
            const assignees = [...new Set(this.data.teamMembers.map(m => m.name))];
            taskAssignee.innerHTML = '<option value="">Select Assignee</option>' +
                assignees.map(assignee => `<option value="${assignee}">${assignee}</option>`).join('');
        }
    }
    
    showTaskModal(task = null) {
        this.editingTask = task;
        const modal = document.getElementById('taskModal');
        const title = document.getElementById('taskModalTitle');
        const form = document.getElementById('taskForm');
        
        if (!modal || !title || !form) return;
        
        title.textContent = task ? 'Edit Task' : 'Add Task';
        this.updateAssigneeFilters();
        
        if (task) {
            document.getElementById('taskJiraId').value = task.jiraId;
            document.getElementById('taskAssignee').value = task.assignee;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskEstimation').value = task.estimation;
            document.getElementById('taskStatus').value = task.status;
            document.getElementById('taskDailyComments').value = task.dailyComments;
            document.getElementById('taskCompletionDate').value = task.completionDate;
            document.getElementById('taskClarificationNeeded').checked = task.clarificationNeeded;
            document.getElementById('taskBlockers').value = task.blockers;
            document.getElementById('taskGitLink').value = task.gitLink;
            document.getElementById('taskOneDriveLink').value = task.oneDriveLink;
            document.getElementById('taskCustomerFeedback').value = task.customerFeedback;
            document.getElementById('taskLeadComments').value = task.leadComments;
        } else {
            form.reset();
        }
        
        modal.classList.add('active');
    }
    
    closeTaskModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.editingTask = null;
    }
    
    saveTask() {
        const taskData = {
            jiraId: document.getElementById('taskJiraId').value,
            assignee: document.getElementById('taskAssignee').value,
            description: document.getElementById('taskDescription').value,
            estimation: parseInt(document.getElementById('taskEstimation').value) || 0,
            status: document.getElementById('taskStatus').value,
            dailyComments: document.getElementById('taskDailyComments').value,
            completionDate: document.getElementById('taskCompletionDate').value,
            clarificationNeeded: document.getElementById('taskClarificationNeeded').checked,
            blockers: document.getElementById('taskBlockers').value,
            gitLink: document.getElementById('taskGitLink').value,
            oneDriveLink: document.getElementById('taskOneDriveLink').value,
            customerFeedback: document.getElementById('taskCustomerFeedback').value,
            leadComments: document.getElementById('taskLeadComments').value,
            updatedDate: new Date().toISOString().split('T')[0]
        };
        
        if (!taskData.description || !taskData.assignee || !taskData.status) {
            alert('Please fill in required fields: Description, Assignee, and Status');
            return;
        }
        
        if (this.editingTask) {
            // Update existing task
            const index = this.data.tasks.findIndex(t => t.id === this.editingTask.id);
            this.data.tasks[index] = {
                ...this.editingTask,
                ...taskData
            };
            
            this.addActivity('task_updated', `Task Updated: ${taskData.jiraId}`, taskData.description);
        } else {
            // Add new task
            const newTask = {
                id: Date.now(),
                ...taskData,
                createdDate: new Date().toISOString().split('T')[0],
                reopened: false
            };
            this.data.tasks.push(newTask);
            
            this.addActivity('task_created', `Task Created: ${taskData.jiraId}`, taskData.description);
        }
        
        this.saveData();
        this.closeTaskModal();
        this.renderTasks();
        this.renderDashboard();
    }
    
    editTask(id) {
        const task = this.data.tasks.find(t => t.id === id);
        if (task) {
            this.showTaskModal(task);
        }
    }
    
    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            const task = this.data.tasks.find(t => t.id === id);
            this.data.tasks = this.data.tasks.filter(t => t.id !== id);
            
            this.addActivity('task_deleted', `Task Deleted: ${task.jiraId}`, task.description);
            
            this.saveData();
            this.renderTasks();
            this.renderDashboard();
        }
    }
    
    // Retrospectives
    renderRetrospectives() {
        const container = document.getElementById('retrospectivesContainer');
        if (!container) return;
        
        if (this.data.retrospectives.length === 0) {
            container.innerHTML = `
                <div class="card" style="text-align: center; padding: 2rem;">
                    <i class="lni lni-thought" style="font-size: 3rem; color: var(--color-text-secondary); margin-bottom: 1rem;"></i>
                    <h3>No retrospectives found</h3>
                    <p>Add your first retrospective to get started</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.data.retrospectives.map(retro => `
            <div class="retrospective-card">
                <div class="retrospective-header">
                    <h3>${retro.period}</h3>
                    <div>
                        <button class="btn-icon btn-icon--edit" onclick="app.editRetrospective(${retro.id})" title="Edit Retrospective">
                            <i class="lni lni-pencil"></i>
                        </button>
                        <button class="btn-icon btn-icon--delete" onclick="app.deleteRetrospective(${retro.id})" title="Delete Retrospective">
                            <i class="lni lni-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="retrospective-body">
                    <div class="retro-section">
                        <h4>What went well?</h4>
                        <div class="retro-items">
                            ${retro.whatWentWell.length > 0 ? 
                                retro.whatWentWell.map(item => `<div class="retro-item-display">${item}</div>`).join('') :
                                '<div class="retro-empty">No items added</div>'
                            }
                        </div>
                    </div>
                    <div class="retro-section">
                        <h4>Areas of Improvement</h4>
                        <div class="retro-items">
                            ${retro.areasOfImprovement.length > 0 ? 
                                retro.areasOfImprovement.map(item => `<div class="retro-item-display">${item}</div>`).join('') :
                                '<div class="retro-empty">No items added</div>'
                            }
                        </div>
                    </div>
                    <div class="retro-section">
                        <h4>Team Concerns</h4>
                        <div class="retro-items">
                            ${retro.teamConcerns.length > 0 ? 
                                retro.teamConcerns.map(item => `<div class="retro-item-display">${item}</div>`).join('') :
                                '<div class="retro-empty">No items added</div>'
                            }
                        </div>
                    </div>
                    <div class="retro-section">
                        <h4>Major Features</h4>
                        <div class="retro-items">
                            ${retro.majorFeatures.length > 0 ? 
                                retro.majorFeatures.map(item => `<div class="retro-item-display">${item}</div>`).join('') :
                                '<div class="retro-empty">No items added</div>'
                            }
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    showRetrospectiveModal(retro = null) {
        this.editingRetrospective = retro;
        const modal = document.getElementById('retrospectiveModal');
        const title = document.getElementById('retrospectiveModalTitle');
        const form = document.getElementById('retrospectiveForm');
        
        if (!modal || !title || !form) return;
        
        title.textContent = retro ? 'Edit Retrospective' : 'Add Retrospective';
        
        if (retro) {
            document.getElementById('retrospectivePeriod').value = retro.period;
            this.populateRetroItems('whatWentWellContainer', retro.whatWentWell);
            this.populateRetroItems('areasOfImprovementContainer', retro.areasOfImprovement);
            this.populateRetroItems('teamConcernsContainer', retro.teamConcerns);
            this.populateRetroItems('majorFeaturesContainer', retro.majorFeatures);
        } else {
            form.reset();
            this.resetRetroItems();
        }
        
        modal.classList.add('active');
    }
    
    closeRetrospectiveModal() {
        const modal = document.getElementById('retrospectiveModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.editingRetrospective = null;
    }
    
    populateRetroItems(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = items.length > 0 ? 
            items.map(item => `
                <div class="retro-item">
                    <input type="text" class="form-control" value="${item}">
                    <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
                </div>
            `).join('') :
            `<div class="retro-item">
                <input type="text" class="form-control" placeholder="Add item...">
                <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
            </div>`;
    }
    
    resetRetroItems() {
        ['whatWentWellContainer', 'areasOfImprovementContainer', 'teamConcernsContainer', 'majorFeaturesContainer'].forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="retro-item">
                        <input type="text" class="form-control" placeholder="Add item...">
                        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
                    </div>
                `;
            }
        });
    }
    
    saveRetrospective() {
        const period = document.getElementById('retrospectivePeriod').value;
        const whatWentWell = this.getRetroItems('whatWentWellContainer');
        const areasOfImprovement = this.getRetroItems('areasOfImprovementContainer');
        const teamConcerns = this.getRetroItems('teamConcernsContainer');
        const majorFeatures = this.getRetroItems('majorFeaturesContainer');
        
        if (!period) {
            alert('Please enter a period for the retrospective');
            return;
        }
        
        if (this.editingRetrospective) {
            // Update existing retrospective
            const index = this.data.retrospectives.findIndex(r => r.id === this.editingRetrospective.id);
            this.data.retrospectives[index] = {
                ...this.editingRetrospective,
                period, whatWentWell, areasOfImprovement, teamConcerns, majorFeatures
            };
        } else {
            // Add new retrospective
            const newRetrospective = {
                id: Date.now(),
                period, whatWentWell, areasOfImprovement, teamConcerns, majorFeatures,
                createdDate: new Date().toISOString().split('T')[0]
            };
            this.data.retrospectives.push(newRetrospective);
            
            this.addActivity('retrospective_added', `Retrospective Added: ${period}`, 'New retrospective has been created');
        }
        
        this.saveData();
        this.closeRetrospectiveModal();
        this.renderRetrospectives();
    }
    
    getRetroItems(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return [];
        
        const inputs = container.querySelectorAll('input[type="text"]');
        return Array.from(inputs)
            .map(input => input.value.trim())
            .filter(value => value !== '');
    }
    
    editRetrospective(id) {
        const retro = this.data.retrospectives.find(r => r.id === id);
        if (retro) {
            this.showRetrospectiveModal(retro);
        }
    }
    
    deleteRetrospective(id) {
        if (confirm('Are you sure you want to delete this retrospective?')) {
            const retro = this.data.retrospectives.find(r => r.id === id);
            this.data.retrospectives = this.data.retrospectives.filter(r => r.id !== id);
            
            this.addActivity('retrospective_deleted', `Retrospective Deleted: ${retro.period}`, 'Retrospective has been removed');
            
            this.saveData();
            this.renderRetrospectives();
        }
    }
    
    // Jira Integration
    saveJiraConfig() {
        const config = {
            baseUrl: document.getElementById('jiraBaseUrl').value,
            apiKey: document.getElementById('jiraApiKey').value,
            username: document.getElementById('jiraUsername').value,
            enabled: true
        };
        
        this.data.jiraConfig = config;
        this.saveData();
        
        this.showStatus('jiraStatus', 'Configuration saved successfully', 'success');
        this.toggleJiraImport(true);
    }
    
    async testJiraConnection() {
        const config = this.data.jiraConfig;
        
        if (!config.baseUrl || !config.apiKey || !config.username) {
            this.showStatus('jiraStatus', 'Please fill in all configuration fields', 'error');
            return;
        }
        
        try {
            // Simulate API call - in real implementation, this would make an actual request
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            this.showStatus('jiraStatus', 'Connection successful! Jira integration is ready.', 'success');
            this.toggleJiraImport(true);
        } catch (error) {
            this.showStatus('jiraStatus', 'Connection failed. Please check your configuration.', 'error');
        }
    }
    
    toggleJiraImport(show) {
        const importCard = document.getElementById('jiraImportCard');
        if (importCard) {
            importCard.style.display = show ? 'block' : 'none';
        }
    }
    
    async importJiraTasks() {
        const projectKey = document.getElementById('jiraProjectKey').value;
        
        if (!projectKey) {
            alert('Please enter a project key');
            return;
        }
        
        try {
            // Simulate importing tasks - in real implementation, this would call Jira API
            const mockTasks = [
                {
                    id: Date.now() + 1,
                    jiraId: `${projectKey}-101`,
                    description: 'Implement authentication module',
                    estimation: 32,
                    dailyComments: 'Imported from Jira',
                    completionDate: '2025-07-25',
                    blockers: '',
                    clarificationNeeded: false,
                    gitLink: '',
                    oneDriveLink: '',
                    assignee: this.data.teamMembers[0]?.name || 'Unassigned',
                    status: 'In Progress',
                    customerFeedback: '',
                    reopened: false,
                    leadComments: '',
                    createdDate: new Date().toISOString().split('T')[0],
                    updatedDate: new Date().toISOString().split('T')[0]
                },
                {
                    id: Date.now() + 2,
                    jiraId: `${projectKey}-102`,
                    description: 'Fix performance issues in data processing',
                    estimation: 16,
                    dailyComments: 'Imported from Jira',
                    completionDate: '2025-07-22',
                    blockers: '',
                    clarificationNeeded: false,
                    gitLink: '',
                    oneDriveLink: '',
                    assignee: this.data.teamMembers[1]?.name || 'Unassigned',
                    status: 'Not Started',
                    customerFeedback: '',
                    reopened: false,
                    leadComments: '',
                    createdDate: new Date().toISOString().split('T')[0],
                    updatedDate: new Date().toISOString().split('T')[0]
                }
            ];
            
            this.data.tasks.push(...mockTasks);
            
            this.addActivity('jira_import', `Jira Import: ${projectKey}`, `Imported ${mockTasks.length} tasks from Jira`);
            
            this.saveData();
            this.renderTasks();
            this.renderDashboard();
            
            alert(`Successfully imported ${mockTasks.length} tasks from Jira`);
        } catch (error) {
            alert('Failed to import tasks from Jira');
        }
    }
    
    // Email Configuration
    saveEmailConfig() {
        const config = {
            enabled: document.getElementById('emailEnabled').checked,
            smtpHost: document.getElementById('smtpHost').value,
            smtpPort: parseInt(document.getElementById('smtpPort').value),
            username: document.getElementById('emailUsername').value,
            password: document.getElementById('emailPassword').value,
            fromEmail: document.getElementById('fromEmail').value
        };
        
        this.data.emailConfig = config;
        this.saveData();
        
        alert('Email configuration saved successfully');
    }
    
    async testEmail() {
        const config = this.data.emailConfig;
        
        if (!config.enabled || !config.smtpHost || !config.username) {
            alert('Please configure email settings first');
            return;
        }
        
        try {
            // Simulate sending test email
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Test email sent successfully!');
        } catch (error) {
            alert('Failed to send test email. Please check your configuration.');
        }
    }
    
    // Settings
    loadSettings() {
        const { jiraConfig, emailConfig } = this.data;
        
        // Load Jira settings
        const jiraBaseUrl = document.getElementById('jiraBaseUrl');
        const jiraApiKey = document.getElementById('jiraApiKey');
        const jiraUsername = document.getElementById('jiraUsername');
        
        if (jiraBaseUrl) jiraBaseUrl.value = jiraConfig.baseUrl || '';
        if (jiraApiKey) jiraApiKey.value = jiraConfig.apiKey || '';
        if (jiraUsername) jiraUsername.value = jiraConfig.username || '';
        
        // Load Email settings
        const emailEnabled = document.getElementById('emailEnabled');
        const smtpHost = document.getElementById('smtpHost');
        const smtpPort = document.getElementById('smtpPort');
        const emailUsername = document.getElementById('emailUsername');
        const emailPassword = document.getElementById('emailPassword');
        const fromEmail = document.getElementById('fromEmail');
        
        if (emailEnabled) emailEnabled.checked = emailConfig.enabled || false;
        if (smtpHost) smtpHost.value = emailConfig.smtpHost || '';
        if (smtpPort) smtpPort.value = emailConfig.smtpPort || 587;
        if (emailUsername) emailUsername.value = emailConfig.username || '';
        if (emailPassword) emailPassword.value = emailConfig.password || '';
        if (fromEmail) fromEmail.value = emailConfig.fromEmail || '';
        
        this.toggleJiraImport(jiraConfig.enabled);
    }
    
    // Utility Functions
    addActivity(type, title, description) {
        const activity = {
            id: Date.now() + Math.random(),
            type,
            title,
            description,
            timestamp: new Date().toISOString(),
            user: 'Admin'
        };
        
        this.data.recentActivity.unshift(activity);
        
        // Keep only last 50 activities
        if (this.data.recentActivity.length > 50) {
            this.data.recentActivity = this.data.recentActivity.slice(0, 50);
        }
        
        this.saveData();
        
        if (this.currentSection === 'dashboard') {
            this.renderRecentActivity();
        }
    }
    
    showStatus(containerId, message, type) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const statusClass = type === 'success' ? 'status--success' : 'status--error';
        
        container.innerHTML = `
            <div class="status ${statusClass}">
                <i class="lni lni-${type === 'success' ? 'checkmark' : 'warning'}"></i>
                ${message}
            </div>
        `;
        
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }
    
    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
        this.editingMember = null;
        this.editingTask = null;
        this.editingRetrospective = null;
    }
}

// Global functions for retrospective management
function addRetroItem(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const newItem = document.createElement('div');
    newItem.className = 'retro-item';
    newItem.innerHTML = `
        <input type="text" class="form-control" placeholder="Add item...">
        <button type="button" class="btn-remove" onclick="this.parentElement.remove()">×</button>
    `;
    container.appendChild(newItem);
}

// Initialize application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TeamTrackerApp();
});