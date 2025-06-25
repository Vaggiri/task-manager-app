// Task Manager Class
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentEditId = null; // Track which task is being edited
        this.categories = ['Work', 'Personal', 'Study', 'Health', 'Finance'];
        this.tags = ['Urgent', 'Important', 'Project', 'Meeting', 'Deadline'];
        this.initTaskManager();
    }
    
    initTaskManager() {
        this.renderTaskList();
        this.setupEventListeners();
    }
    
    loadTasks() {
        // Try to load from localStorage, fallback to default tasks
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            return JSON.parse(savedTasks);
        }
        
        // Default tasks
        return [
            {
                id: 1,
                title: 'Complete project presentation',
                description: 'Prepare slides and practice presentation for client meeting',
                dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                priority: 'high',
                completed: false,
                pinned: true,
                tags: ['Work', 'Project'],
                reminders: [30, 1440], // 30 minutes and 1 day before
                subtasks: [
                    { id: 1, title: 'Create outline', completed: true },
                    { id: 2, title: 'Design slides', completed: false },
                    { id: 3, title: 'Practice delivery', completed: false }
                ]
            },
            {
                id: 2,
                title: 'Math Assignment - Chapter 5',
                description: 'Problems 1-20 on page 127',
                dueDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
                priority: 'medium',
                completed: false,
                pinned: false,
                tags: ['Study', 'Math'],
                reminders: [1440], // 1 day before
                subtasks: []
            }
        ];
    }
    
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    
    renderTaskList(filter = 'all') {
        const taskListView = document.getElementById('task-list-view');
        const taskGridView = document.getElementById('task-grid-view');
        
        // Clear existing tasks
        taskListView.innerHTML = '';
        taskGridView.innerHTML = '';
        
        // Filter tasks
        let filteredTasks = [...this.tasks];
        
        switch(filter) {
            case 'today':
                filteredTasks = filteredTasks.filter(task => {
                    const dueDate = new Date(task.dueDate);
                    const today = new Date();
                    return dueDate.toDateString() === today.toDateString();
                });
                break;
            case 'upcoming':
                filteredTasks = filteredTasks.filter(task => {
                    const dueDate = new Date(task.dueDate);
                    const today = new Date();
                    return dueDate > today && !task.completed;
                });
                break;
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
        }
        
        // Sort by due date (soonest first)
        filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        // Render tasks
        filteredTasks.forEach(task => {
            // List view item
            const listItem = this.createTaskListItem(task);
            taskListView.appendChild(listItem);
            
            // Grid view card
            const gridCard = this.createTaskGridCard(task);
            taskGridView.appendChild(gridCard);
        });
    }
    
    createTaskListItem(task) {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const isOverdue = dueDate < now && !task.completed;
        
        const item = document.createElement('div');
        item.className = `task-item p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${task.completed ? 'opacity-70' : ''}`;
        item.dataset.id = task.id;
        item.dataset.priority = task.priority;
        item.dataset.dueDate = task.dueDate;
        item.dataset.tags = task.tags.join(',');
        
        // Priority badge color
        let priorityClass = '';
        switch(task.priority) {
            case 'high': priorityClass = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'; break;
            case 'medium': priorityClass = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'; break;
            case 'low': priorityClass = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'; break;
        }
        
        // Due date display
        let dueText = '';
        if (task.completed) {
            dueText = 'Completed';
        } else if (isOverdue) {
            dueText = `Overdue by ${this.formatTimeDifference(now, dueDate)}`;
        } else {
            dueText = `Due ${this.formatDueDate(dueDate)}`;
        }
        
        item.innerHTML = `
            <div class="flex items-start">
                <button class="task-checkbox mt-1 mr-3 flex-shrink-0 w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-purple-500 transition-colors ${task.completed ? 'checked' : ''}">
                    <i class="fas fa-check text-white text-xs"></i>
                </button>
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <h4 class="font-medium text-gray-800 dark:text-white ${task.completed ? 'line-through' : ''}">${task.title}</h4>
                        <div class="flex items-center space-x-2">
                            <button class="task-star text-gray-400 ${task.pinned ? 'text-yellow-400' : ''}">
                                <i class="${task.pinned ? 'fas' : 'far'} fa-star"></i>
                            </button>
                            <span class="text-xs px-2 py-1 ${priorityClass} rounded-full">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                        </div>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">${task.description}</p>
                    <div class="mt-2 flex flex-wrap items-center gap-2">
                        ${task.tags.map(tag => `<span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">${tag}</span>`).join('')}
                        <div class="flex items-center text-xs ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}">
                            <i class="far fa-clock mr-1"></i>
                            <span>${dueText}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add subtasks if they exist
        if (task.subtasks && task.subtasks.length > 0) {
            const subtasksContainer = document.createElement('div');
            subtasksContainer.className = 'subtasks mt-3 ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700';
            
            task.subtasks.forEach(subtask => {
                const subtaskEl = document.createElement('div');
                subtaskEl.className = 'flex items-center mb-2';
                subtaskEl.innerHTML = `
                    <button class="subtask-checkbox mr-2 flex-shrink-0 w-4 h-4 border border-gray-300 dark:border-gray-600 rounded-sm hover:border-purple-500 transition-colors ${subtask.completed ? 'checked' : ''}">
                        <i class="fas fa-check text-white text-xs"></i>
                    </button>
                    <span class="text-sm text-gray-700 dark:text-gray-300 ${subtask.completed ? 'line-through' : ''}">${subtask.title}</span>
                `;
                subtasksContainer.appendChild(subtaskEl);
            });
            
            item.appendChild(subtasksContainer);
        }
        
        // Add task actions
        const actions = document.createElement('div');
        actions.className = 'task-actions mt-3 ml-8 flex items-center space-x-3';
        actions.innerHTML = `
            <button class="edit-task text-xs text-purple-600 dark:text-purple-400 hover:underline">
                <i class="far fa-edit mr-1"></i> Edit
            </button>
            <button class="delete-task text-xs text-gray-500 dark:text-gray-400 hover:text-red-500">
                <i class="far fa-trash-alt mr-1"></i> Delete
            </button>
        `;
        
        item.appendChild(actions);
        
        return item;
    }
    
    createTaskGridCard(task) {
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        const isOverdue = dueDate < now && !task.completed;
        
        // Priority badge color
        let priorityClass = '';
        switch(task.priority) {
            case 'high': priorityClass = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'; break;
            case 'medium': priorityClass = 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'; break;
            case 'low': priorityClass = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'; break;
        }
        
        // Due date display
        let dueText = '';
        if (task.completed) {
            dueText = 'Completed';
        } else if (isOverdue) {
            dueText = `Overdue`;
        } else {
            dueText = this.formatDueDate(dueDate, true);
        }
        
        const card = document.createElement('div');
        card.className = `task-card bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${task.completed ? 'opacity-70' : ''}`;
        card.dataset.id = task.id;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <button class="task-checkbox w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-purple-500 transition-colors ${task.completed ? 'checked' : ''}">
                    <i class="fas fa-check text-white text-xs"></i>
                </button>
                <button class="task-star text-gray-400 ${task.pinned ? 'text-yellow-400' : ''}">
                    <i class="${task.pinned ? 'fas' : 'far'} fa-star"></i>
                </button>
            </div>
            <h4 class="font-medium text-gray-800 dark:text-white mb-2 ${task.completed ? 'line-through' : ''}">${task.title}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">${task.description}</p>
            <div class="flex flex-wrap gap-2 mb-3">
                ${task.tags.map(tag => `<span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">${tag}</span>`).join('')}
            </div>
            <div class="flex items-center justify-between text-xs ${isOverdue ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}">
                <span><i class="far fa-clock mr-1"></i> ${dueText}</span>
                <span class="px-2 py-1 ${priorityClass} rounded-full">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
            </div>
        `;
        
        return card;
    }
    
    formatDueDate(date, short = false) {
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === now.toDateString()) {
            return short ? 'Today' : `Today at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return short ? 'Tomorrow' : `Tomorrow at ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
        } else {
            const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) {
                return short ? `${diffDays}d` : `In ${diffDays} days`;
            } else {
                return short ? date.toLocaleDateString([], {month: 'short', day: 'numeric'}) : 
                    date.toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'});
            }
        }
    }
    
    formatTimeDifference(laterDate, earlierDate) {
        const diffMs = laterDate - earlierDate;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        let result = '';
        if (diffDays > 0) result += `${diffDays}d `;
        if (diffHrs > 0) result += `${diffHrs}h `;
        if (diffMins > 0) result += `${diffMins}m`;
        
        return result.trim();
    }
    
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.btn-filter').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderTaskList(btn.dataset.filter);
            });
        });
        
        // Sort dropdown
        const sortToggle = document.getElementById('sort-toggle');
        const sortDropdown = document.getElementById('sort-dropdown');
        
        sortToggle.addEventListener('click', () => {
            sortDropdown.classList.toggle('hidden');
        });
        
        document.querySelectorAll('#sort-dropdown a').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                sortToggle.innerHTML = `<i class="fas fa-sort-amount-down mr-2"></i> ${item.textContent}`;
                sortDropdown.classList.add('hidden');
                // In a real app, you would sort the tasks here
            });
        });
        
        // Close sort dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!sortToggle.contains(e.target) && !sortDropdown.contains(e.target)) {
                sortDropdown.classList.add('hidden');
            }
        });
        
        // Edit Task Click Handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-task')) {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                this.openEditModal(taskId);
            }

            // Delete Task Click Handler
            if (e.target.closest('.delete-task')) {
                const taskId = parseInt(e.target.closest('.task-item').dataset.id);
                this.deleteTask(taskId);
            }
        });

        // Save Edited Task
        document.getElementById('save-task-btn').addEventListener('click', () => {
            this.saveEditedTask();
        });

        // Add tag in edit modal
        document.getElementById('edit-add-tag-btn').addEventListener('click', () => {
            const input = document.getElementById('edit-task-tag-input');
            const tagText = input.value.trim();
            if (tagText) {
                const tagsContainer = document.getElementById('edit-task-tags-container');
                const tagElement = document.createElement('span');
                tagElement.className = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 mb-2';
                tagElement.textContent = tagText;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'ml-1 text-blue-600 dark:text-blue-300';
                removeBtn.innerHTML = '&times;';
                removeBtn.addEventListener('click', () => {
                    tagElement.remove();
                });
                
                tagElement.appendChild(removeBtn);
                tagsContainer.appendChild(tagElement);
                input.value = '';
            }
        });
    }

    openEditModal(taskId) {
        this.currentEditId = taskId;
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        // Populate modal with task data
        document.getElementById('edit-task-title').value = task.title;
        document.getElementById('edit-task-description').value = task.description || '';
        document.getElementById('edit-task-due-date').value = task.dueDate.slice(0, 16);
        document.getElementById('edit-task-priority').value = task.priority;
        
        // Populate tags
        const tagsContainer = document.getElementById('edit-task-tags-container');
        tagsContainer.innerHTML = '';
        task.tags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 mr-2 mb-2';
            tagElement.textContent = tag;
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'ml-1 text-blue-600 dark:text-blue-300';
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', () => {
                tagElement.remove();
            });
            
            tagElement.appendChild(removeBtn);
            tagsContainer.appendChild(tagElement);
        });

        // Show modal
        document.getElementById('edit-task-modal').classList.remove('hidden');
    }

    saveEditedTask() {
        const taskId = this.currentEditId;
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        // Get updated values
        this.tasks[taskIndex] = {
            ...this.tasks[taskIndex],
            title: document.getElementById('edit-task-title').value,
            description: document.getElementById('edit-task-description').value,
            dueDate: document.getElementById('edit-task-due-date').value,
            priority: document.getElementById('edit-task-priority').value,
            tags: Array.from(document.getElementById('edit-task-tags-container').children)
                     .map(el => el.textContent.replace('×', '').trim())
        };

        // Save and refresh
        this.saveTasks();
        this.renderTaskList();
        document.getElementById('edit-task-modal').classList.add('hidden');
        
        showToast('Task updated successfully', 'success');
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTaskList();
            showToast('Task deleted', 'success');
        }
    }
}

// Initialize Task Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
});