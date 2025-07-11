// Application Data and State Management
class TeamTracker {
    constructor() {
        this.tasks = [
            {"jira_id": "DE-1001", "title": "Feature Development - Alice Task 1", "description": "Complete feature development for project milestone 1", "assignee": "Alice Johnson", "assignee_id": 1, "team": "Data Platform", "status": "In Progress", "priority": "High", "task_type": "Feature Development", "estimation_hours": 24, "actual_hours": null, "start_date": "2024-12-20", "estimated_completion": "2024-12-28", "actual_completion": null, "blocker": "None", "clarification_needed": false, "git_link": "https://github.com/company/project/pull/1", "onedrive_link": "https://company.sharepoint.com/sites/project/documents/task-1", "customer_feedback": "Pending", "is_reopened": false, "daily_comments": "Working on feature development, progress is on track", "lead_comments": "Task 1 - In progress"},
            {"jira_id": "DE-1002", "title": "Bug Fix - Bob Task 2", "description": "Complete bug fix for project milestone 2", "assignee": "Bob Smith", "assignee_id": 2, "team": "Data Platform", "status": "Blocked", "priority": "Critical", "task_type": "Bug Fix", "estimation_hours": 16, "actual_hours": null, "start_date": "2024-12-21", "estimated_completion": "2024-12-25", "actual_completion": null, "blocker": "Waiting for API", "clarification_needed": true, "git_link": "https://github.com/company/project/pull/2", "onedrive_link": "https://company.sharepoint.com/sites/project/documents/task-2", "customer_feedback": "Negative", "is_reopened": false, "daily_comments": "Working on bug fix, progress is blocked", "lead_comments": "Task 2 - Needs attention"},
            {"jira_id": "DE-1003", "title": "Data Pipeline - Carol Task 3", "description": "Complete data pipeline for project milestone 3", "assignee": "Carol Davis", "assignee_id": 3, "team": "AI/ML", "status": "Done", "priority": "Medium", "task_type": "Data Pipeline", "estimation_hours": 32, "actual_hours": 30, "start_date": "2024-12-15", "estimated_completion": "2024-12-22", "actual_completion": "2024-12-21", "blocker": "None", "clarification_needed": false, "git_link": "https://github.com/company/project/pull/3", "onedrive_link": "https://company.sharepoint.com/sites/project/documents/task-3", "customer_feedback": "Positive", "is_reopened": false, "daily_comments": "Working on data pipeline, progress is on track", "lead_comments": "Task 3 - Good progress"},
            {"jira_id": "DE-1004", "title": "Analysis - David Task 4", "description": "Complete analysis for project milestone 4", "assignee": "David Wilson", "assignee_id": 4, "team": "Analytics", "status": "Testing", "priority": "Low", "task_type": "Analysis", "estimation_hours": 20, "actual_hours": 22, "start_date": "2024-12-18", "estimated_completion": "2024-12-26", "actual_completion": null, "blocker": "None", "clarification_needed": false, "git_link": "https://github.com/company/project/pull/4", "onedrive_link": "https://company.sharepoint.com/sites/project/documents/task-4", "customer_feedback": "Neutral", "is_reopened": true, "daily_comments": "Working on analysis, progress is on track", "lead_comments": "Task 4 - In progress"},
            {"jira_id": "DE-1005", "title": "Testing - Eva Task 5", "description": "Complete testing for project milestone 5", "assignee": "Eva Brown", "assignee_id": 5, "team": "Data Platform", "status": "Not Started", "priority": "Medium", "task_type": "Testing", "estimation_hours": 12, "actual_hours": null, "start_date": "2024-12-25", "estimated_completion": "2024-12-30", "actual_completion": null, "blocker": "Dependencies", "clarification_needed": true, "git_link": "https://github.com/company/project/pull/5", "onedrive_link": "https://company.sharepoint.com/sites/project/documents/task-5", "customer_feedback": "Pending", "is_reopened": false, "daily_comments": "Working on testing, progress is on track", "lead_comments": "Task 5 - In progress"}
        ];

        this.teamMembers = [
            {"id": 1, "name": "Alice Johnson", "role": "Senior Data Engineer", "team": "Data Platform", "email": "alice.johnson@company.com"},
            {"id": 2, "name": "Bob Smith", "role": "Data Engineer", "team": "Data Platform", "email": "bob.smith@company.com"},
            {"id": 3, "name": "Carol Davis", "role": "ML Engineer", "team": "AI/ML", "email": "carol.davis@company.com"},
            {"id": 4, "name": "David Wilson", "role": "Analytics Engineer", "team": "Analytics", "email": "david.wilson@company.com"},
            {"id": 5, "name": "Eva Brown", "role": "Data Architect", "team": "Data Platform", "email": "eva.brown@company.com"},
            {"id": 6, "name": "Frank Miller", "role": "DevOps Engineer", "team": "Infrastructure", "email": "frank.miller@company.com"},
            {"id": 7, "name": "Grace Lee", "role": "QA Engineer", "team": "Quality", "email": "grace.lee@company.com"},
            {"id": 8, "name": "Henry Garcia", "role": "Data Scientist", "team": "AI/ML", "email": "henry.garcia@company.com"}
        ];

        this.currentEditingTask = null;
        this.charts = {};
        this.settings = {
            theme: 'light',
            refreshInterval: 60,
            notifications: {
                deadline: true,
                blocked: true,
                overdue: true,
                completion: false
            }
        };

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        this.initNavigation();
        this.initDashboard();
        this.initTaskManagement();
        this.initTeamPerformance();
        this.initReports();
        this.initSettings();
        this.initModal();
        this.initThemeToggle();
        this.startAutoRefresh();
        this.updateLastRefresh();
    }

    // Navigation - Fixed version
    initNavigation() {
        const navTabs = document.querySelectorAll('.nav-tab');
        const tabContents = document.querySelectorAll('.tab-content');

        if (navTabs.length === 0 || tabContents.length === 0) {
            console.error('Navigation elements not found');
            return;
        }

        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = tab.dataset.tab;
                const targetContent = document.getElementById(`${targetTab}-tab`);
                
                if (!targetContent) {
                    console.error(`Tab content not found for: ${targetTab}`);
                    return;
                }
                
                // Remove active class from all tabs and contents
                navTabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                targetContent.classList.add('active');

                // Update content based on tab
                if (targetTab === 'dashboard') {
                    this.updateDashboard();
                } else if (targetTab === 'tasks') {
                    this.populateTaskTable();
                } else if (targetTab === 'team') {
                    this.updateTeamPerformance();
                } else if (targetTab === 'reports') {
                    // Reports tab is ready
                } else if (targetTab === 'settings') {
                    // Settings tab is ready
                }
            });
        });
    }

    // Dashboard
    initDashboard() {
        this.updateDashboard();
        // Delay chart creation to ensure canvas elements are ready
        setTimeout(() => {
            this.createCharts();
        }, 100);
    }

    updateDashboard() {
        const kpis = this.calculateKPIs();
        
        const totalTasksEl = document.getElementById('total-tasks');
        const completedTasksEl = document.getElementById('completed-tasks');
        const inProgressTasksEl = document.getElementById('in-progress-tasks');
        const blockedTasksEl = document.getElementById('blocked-tasks');
        const overdueTasksEl = document.getElementById('overdue-tasks');
        const completionRateEl = document.getElementById('completion-rate');

        if (totalTasksEl) totalTasksEl.textContent = kpis.total;
        if (completedTasksEl) completedTasksEl.textContent = kpis.completed;
        if (inProgressTasksEl) inProgressTasksEl.textContent = kpis.inProgress;
        if (blockedTasksEl) blockedTasksEl.textContent = kpis.blocked;
        if (overdueTasksEl) overdueTasksEl.textContent = kpis.overdue;
        if (completionRateEl) completionRateEl.textContent = `${kpis.completionRate}%`;

        this.updateAlerts();
        this.updateActivity();
    }

    calculateKPIs() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'Done').length;
        const inProgress = this.tasks.filter(t => t.status === 'In Progress').length;
        const blocked = this.tasks.filter(t => t.status === 'Blocked').length;
        const overdue = this.tasks.filter(t => {
            if (t.status === 'Done') return false;
            const deadline = new Date(t.estimated_completion);
            return deadline < new Date();
        }).length;
        
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, inProgress, blocked, overdue, completionRate };
    }

    createCharts() {
        // Status Distribution Chart
        const statusCtx = document.getElementById('status-chart');
        if (statusCtx) {
            const statusData = this.getStatusDistribution();
            this.charts.status = new Chart(statusCtx.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: Object.keys(statusData),
                    datasets: [{
                        data: Object.values(statusData),
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // Team Performance Chart
        const teamCtx = document.getElementById('team-chart');
        if (teamCtx) {
            const teamData = this.getTeamPerformance();
            this.charts.team = new Chart(teamCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: teamData.labels,
                    datasets: [{
                        label: 'Completion Rate (%)',
                        data: teamData.data,
                        backgroundColor: '#1FB8CD'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }
    }

    getStatusDistribution() {
        const distribution = {};
        this.tasks.forEach(task => {
            distribution[task.status] = (distribution[task.status] || 0) + 1;
        });
        return distribution;
    }

    getTeamPerformance() {
        const teams = {};
        this.tasks.forEach(task => {
            if (!teams[task.team]) {
                teams[task.team] = { total: 0, completed: 0 };
            }
            teams[task.team].total++;
            if (task.status === 'Done') {
                teams[task.team].completed++;
            }
        });

        const labels = Object.keys(teams);
        const data = labels.map(team => {
            const { total, completed } = teams[team];
            return total > 0 ? Math.round((completed / total) * 100) : 0;
        });

        return { labels, data };
    }

    updateAlerts() {
        const alertsList = document.getElementById('alerts-list');
        if (!alertsList) return;

        const alerts = [];

        // Check for blocked tasks
        const blockedTasks = this.tasks.filter(t => t.status === 'Blocked');
        blockedTasks.forEach(task => {
            alerts.push({
                type: 'blocked',
                message: `${task.jira_id}: ${task.title} is blocked - ${task.blocker}`
            });
        });

        // Check for overdue tasks
        const overdueTasks = this.tasks.filter(t => {
            if (t.status === 'Done') return false;
            const deadline = new Date(t.estimated_completion);
            return deadline < new Date();
        });
        overdueTasks.forEach(task => {
            alerts.push({
                type: 'overdue',
                message: `${task.jira_id}: ${task.title} is overdue (deadline: ${task.estimated_completion})`
            });
        });

        alertsList.innerHTML = alerts.length > 0 ? 
            alerts.map(alert => `
                <div class="alert-item ${alert.type === 'blocked' ? 'status--blocked' : ''}">
                    ${alert.message}
                </div>
            `).join('') : 
            '<div class="alert-item">No alerts at this time</div>';
    }

    updateActivity() {
        const activityFeed = document.getElementById('activity-feed');
        if (!activityFeed) return;

        const activities = [
            'Task DE-1003 completed by Carol Davis',
            'Task DE-1002 blocked - waiting for API',
            'New task DE-1005 assigned to Eva Brown',
            'Task DE-1004 moved to testing phase'
        ];

        activityFeed.innerHTML = activities.map(activity => `
            <div class="activity-item">${activity}</div>
        `).join('');
    }

    // Task Management
    initTaskManagement() {
        // Initialize task filters
        this.initTaskFilters();
        this.initTaskActions();
    }

    populateTaskTable() {
        const tbody = document.getElementById('tasks-tbody');
        if (!tbody) return;

        const filteredTasks = this.getFilteredTasks();

        tbody.innerHTML = filteredTasks.map(task => `
            <tr>
                <td>${task.jira_id}</td>
                <td>${task.title}</td>
                <td>${task.assignee}</td>
                <td>${task.team}</td>
                <td><span class="status status--${task.status.toLowerCase().replace(' ', '-')}">${task.status}</span></td>
                <td><span class="status status--${task.priority.toLowerCase()}">${task.priority}</span></td>
                <td>${task.estimation_hours}h</td>
                <td>${task.estimated_completion}</td>
                <td>${task.blocker !== 'None' ? task.blocker : '-'}</td>
                <td class="actions">
                    <button class="btn btn--sm btn--outline" onclick="app.editTask('${task.jira_id}')">Edit</button>
                    <button class="btn btn--sm btn--secondary" onclick="app.deleteTask('${task.jira_id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    }

    getFilteredTasks() {
        let filtered = [...this.tasks];
        
        const searchTerm = document.getElementById('search-tasks')?.value?.toLowerCase() || '';
        const statusFilter = document.getElementById('filter-status')?.value || '';
        const priorityFilter = document.getElementById('filter-priority')?.value || '';
        const teamFilter = document.getElementById('filter-team')?.value || '';

        if (searchTerm) {
            filtered = filtered.filter(task => 
                task.title.toLowerCase().includes(searchTerm) ||
                task.description.toLowerCase().includes(searchTerm) ||
                task.jira_id.toLowerCase().includes(searchTerm)
            );
        }

        if (statusFilter) {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        if (priorityFilter) {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        if (teamFilter) {
            filtered = filtered.filter(task => task.team === teamFilter);
        }

        return filtered;
    }

    initTaskFilters() {
        ['search-tasks', 'filter-status', 'filter-priority', 'filter-team'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.populateTaskTable());
            }
        });
    }

    initTaskActions() {
        const addTaskBtn = document.getElementById('add-task-btn');
        const exportTasksBtn = document.getElementById('export-tasks-btn');

        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                this.currentEditingTask = null;
                this.showTaskModal();
            });
        }

        if (exportTasksBtn) {
            exportTasksBtn.addEventListener('click', () => {
                this.exportTasks();
            });
        }
    }

    editTask(jiraId) {
        this.currentEditingTask = this.tasks.find(task => task.jira_id === jiraId);
        this.showTaskModal();
    }

    deleteTask(jiraId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.jira_id !== jiraId);
            this.populateTaskTable();
            this.updateDashboard();
        }
    }

    exportTasks() {
        const csvContent = this.tasksToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks_export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    }

    tasksToCSV() {
        const headers = ['Jira ID', 'Title', 'Description', 'Assignee', 'Team', 'Status', 'Priority', 'Estimation Hours', 'Deadline'];
        const rows = this.tasks.map(task => [
            task.jira_id,
            task.title,
            task.description,
            task.assignee,
            task.team,
            task.status,
            task.priority,
            task.estimation_hours,
            task.estimated_completion
        ]);
        
        return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    }

    // Team Performance
    initTeamPerformance() {
        // Team performance will be updated when tab is clicked
    }

    updateTeamPerformance() {
        this.populateTeamCards();
        setTimeout(() => {
            this.createTeamCharts();
        }, 100);
    }

    populateTeamCards() {
        const teamCards = document.getElementById('team-cards');
        if (!teamCards) return;

        const teamStats = this.getTeamMemberStats();

        teamCards.innerHTML = teamStats.map(member => `
            <div class="team-card">
                <h4>${member.name}</h4>
                <div class="card-stats">
                    <span>Role: ${member.role}</span>
                    <span>Team: ${member.team}</span>
                </div>
                <div class="card-stats">
                    <span>Tasks: ${member.totalTasks}</span>
                    <span>Completed: ${member.completedTasks}</span>
                    <span>Blocked: ${member.blockedTasks}</span>
                </div>
            </div>
        `).join('');
    }

    getTeamMemberStats() {
        return this.teamMembers.map(member => {
            const memberTasks = this.tasks.filter(task => task.assignee === member.name);
            return {
                ...member,
                totalTasks: memberTasks.length,
                completedTasks: memberTasks.filter(task => task.status === 'Done').length,
                blockedTasks: memberTasks.filter(task => task.status === 'Blocked').length
            };
        });
    }

    createTeamCharts() {
        // Team Performance Chart
        const teamCtx = document.getElementById('team-performance-chart');
        if (teamCtx) {
            if (this.charts.teamPerformance) {
                this.charts.teamPerformance.destroy();
            }
            const teamData = this.getTeamPerformance();
            this.charts.teamPerformance = new Chart(teamCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: teamData.labels,
                    datasets: [{
                        label: 'Completion Rate (%)',
                        data: teamData.data,
                        backgroundColor: '#1FB8CD'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        }

        // Blocked Tasks Chart
        const blockedCtx = document.getElementById('blocked-chart');
        if (blockedCtx) {
            if (this.charts.blocked) {
                this.charts.blocked.destroy();
            }
            const blockedData = this.getBlockedTasksData();
            this.charts.blocked = new Chart(blockedCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: blockedData.labels,
                    datasets: [{
                        label: 'Blocked Tasks',
                        data: blockedData.data,
                        backgroundColor: '#DB4545'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    }

    getBlockedTasksData() {
        const blockedByMember = {};
        this.tasks.filter(task => task.status === 'Blocked').forEach(task => {
            blockedByMember[task.assignee] = (blockedByMember[task.assignee] || 0) + 1;
        });

        return {
            labels: Object.keys(blockedByMember),
            data: Object.values(blockedByMember)
        };
    }

    // Reports
    initReports() {
        const generateReportBtn = document.getElementById('generate-report-btn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => {
                this.generateReport();
            });
        }
    }

    generateReport() {
        const reportType = document.getElementById('report-type')?.value || 'weekly';
        alert(`Generating ${reportType} report... (This is a simulation)`);
    }

    // Settings
    initSettings() {
        this.populateTeamList();
        this.initSettingsHandlers();
    }

    populateTeamList() {
        const teamList = document.getElementById('team-list');
        if (!teamList) return;

        teamList.innerHTML = this.teamMembers.map(member => `
            <div class="team-card">
                <h4>${member.name}</h4>
                <div class="card-stats">
                    <span>${member.role}</span>
                    <span>${member.team}</span>
                    <span>${member.email}</span>
                </div>
            </div>
        `).join('');
    }

    initSettingsHandlers() {
        // Notification settings
        ['deadline-notifications', 'blocked-notifications', 'overdue-notifications', 'completion-notifications'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => {
                    this.updateNotificationSettings();
                });
            }
        });

        // Dashboard settings
        const refreshInterval = document.getElementById('refresh-interval');
        if (refreshInterval) {
            refreshInterval.addEventListener('change', (e) => {
                this.settings.refreshInterval = parseInt(e.target.value);
                this.startAutoRefresh();
            });
        }
    }

    updateNotificationSettings() {
        this.settings.notifications = {
            deadline: document.getElementById('deadline-notifications')?.checked || false,
            blocked: document.getElementById('blocked-notifications')?.checked || false,
            overdue: document.getElementById('overdue-notifications')?.checked || false,
            completion: document.getElementById('completion-notifications')?.checked || false
        };
    }

    // Modal
    initModal() {
        const modal = document.getElementById('task-modal');
        const closeBtn = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('modal-cancel');
        const saveBtn = document.getElementById('modal-save');

        if (closeBtn) closeBtn.addEventListener('click', () => this.hideTaskModal());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.hideTaskModal());
        if (saveBtn) saveBtn.addEventListener('click', () => this.saveTask());

        // Populate assignee and team dropdowns
        this.populateModalDropdowns();
    }

    populateModalDropdowns() {
        const assigneeSelect = document.getElementById('task-assignee');
        const teamSelect = document.getElementById('task-team');

        if (assigneeSelect) {
            assigneeSelect.innerHTML = '<option value="">Select assignee...</option>' +
                this.teamMembers.map(member => `<option value="${member.name}">${member.name}</option>`).join('');
        }

        if (teamSelect) {
            const teams = [...new Set(this.teamMembers.map(member => member.team))];
            teamSelect.innerHTML = '<option value="">Select team...</option>' +
                teams.map(team => `<option value="${team}">${team}</option>`).join('');
        }
    }

    showTaskModal() {
        const modal = document.getElementById('task-modal');
        const title = document.getElementById('modal-title');
        
        if (!modal) return;

        if (this.currentEditingTask) {
            if (title) title.textContent = 'Edit Task';
            this.populateTaskForm(this.currentEditingTask);
        } else {
            if (title) title.textContent = 'Add New Task';
            this.clearTaskForm();
        }
        
        modal.classList.add('show');
    }

    hideTaskModal() {
        const modal = document.getElementById('task-modal');
        if (modal) modal.classList.remove('show');
        this.currentEditingTask = null;
    }

    populateTaskForm(task) {
        const fields = {
            'task-jira-id': task.jira_id,
            'task-title': task.title,
            'task-description': task.description,
            'task-assignee': task.assignee,
            'task-team': task.team,
            'task-status': task.status,
            'task-priority': task.priority,
            'task-estimation': task.estimation_hours,
            'task-completion': task.estimated_completion,
            'task-blocker': task.blocker !== 'None' ? task.blocker : '',
            'task-comments': task.daily_comments,
            'task-git-link': task.git_link,
            'task-onedrive-link': task.onedrive_link
        };

        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.value = value;
        });

        const clarificationEl = document.getElementById('task-clarification');
        if (clarificationEl) clarificationEl.checked = task.clarification_needed;
    }

    clearTaskForm() {
        const form = document.getElementById('task-form');
        if (form) form.reset();
    }

    saveTask() {
        const form = document.getElementById('task-form');
        if (!form || !form.checkValidity()) {
            if (form) form.reportValidity();
            return;
        }

        const taskData = {
            jira_id: document.getElementById('task-jira-id')?.value || '',
            title: document.getElementById('task-title')?.value || '',
            description: document.getElementById('task-description')?.value || '',
            assignee: document.getElementById('task-assignee')?.value || '',
            team: document.getElementById('task-team')?.value || '',
            status: document.getElementById('task-status')?.value || 'Not Started',
            priority: document.getElementById('task-priority')?.value || 'Medium',
            estimation_hours: parseInt(document.getElementById('task-estimation')?.value || '0'),
            estimated_completion: document.getElementById('task-completion')?.value || '',
            blocker: document.getElementById('task-blocker')?.value || 'None',
            daily_comments: document.getElementById('task-comments')?.value || '',
            git_link: document.getElementById('task-git-link')?.value || '',
            onedrive_link: document.getElementById('task-onedrive-link')?.value || '',
            clarification_needed: document.getElementById('task-clarification')?.checked || false,
            assignee_id: this.teamMembers.find(m => m.name === document.getElementById('task-assignee')?.value)?.id || 0,
            task_type: 'General',
            actual_hours: null,
            start_date: new Date().toISOString().split('T')[0],
            actual_completion: null,
            customer_feedback: 'Pending',
            is_reopened: false,
            lead_comments: ''
        };

        if (this.currentEditingTask) {
            const index = this.tasks.findIndex(t => t.jira_id === this.currentEditingTask.jira_id);
            if (index !== -1) {
                this.tasks[index] = { ...this.currentEditingTask, ...taskData };
            }
        } else {
            this.tasks.push(taskData);
        }

        this.hideTaskModal();
        this.populateTaskTable();
        this.updateDashboard();
    }

    // Theme Toggle
    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = document.getElementById('theme-icon');
        
        if (themeToggle && themeIcon) {
            themeToggle.addEventListener('click', () => {
                if (document.body.dataset.colorScheme === 'dark') {
                    document.body.dataset.colorScheme = 'light';
                    themeIcon.textContent = '🌙';
                    this.settings.theme = 'light';
                } else {
                    document.body.dataset.colorScheme = 'dark';
                    themeIcon.textContent = '☀️';
                    this.settings.theme = 'dark';
                }
            });
        }
    }

    // Auto Refresh
    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }
        
        this.refreshTimer = setInterval(() => {
            this.updateLastRefresh();
            this.updateDashboard();
        }, this.settings.refreshInterval * 1000);
    }

    updateLastRefresh() {
        const lastUpdatedEl = document.getElementById('last-updated-time');
        if (lastUpdatedEl) {
            const now = new Date();
            lastUpdatedEl.textContent = now.toLocaleTimeString();
        }
    }
}

// Initialize the application
const app = new TeamTracker();