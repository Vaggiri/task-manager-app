// Main Application Script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    try {
        initTheme();
        initSidebar();
        initNavigation();
        initModals();
        initTaskManager();
        initFocusMode();
        initPinLock();
        initCountdownTimers();
        
        // Show dashboard by default
        showSection('dashboard');
        
        // Check if app is locked
        
        // Add click event listener to the document for delegated events
        document.addEventListener('click', function(e) {
            // Handle navigation links
            if (e.target.closest('.nav-link')) {
                e.preventDefault();
                const link = e.target.closest('.nav-link');
                const section = link.getAttribute('data-section');
                
                // Update active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Update section title
                document.querySelector('.section-title').textContent = 
                    link.querySelector('span').textContent;
                
                // Show the selected section
                showSection(section);
                
                // Close sidebar on mobile
                if (window.innerWidth < 1024) {
                    document.querySelector('.sidebar').classList.remove('open');
                }
            }
            
            // Handle modal close buttons
            if (e.target.closest('.modal-close')) {
                const modal = e.target.closest('.modal');
                toggleModal(modal);
            }
        });
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

function initApp() {
    // Initialize all components
    initTheme();
    initSidebar();
    initNavigation();
    initModals();
    initTaskManager();
    initFocusMode();
    initPinLock();
    initCountdownTimers();
    
    // Show dashboard by default
    showSection('dashboard');
    
    // Check if app is locked
    
}

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.classList.add(savedTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.classList.add('dark');
    }
    
    // Toggle theme
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        
        // Show toast notification
        showToast(`Switched to ${theme} mode`, 'success');
    });
}

// Sidebar Management
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const mobileSidebarToggle = document.getElementById('mobile-sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    // Toggle sidebar on mobile
    mobileSidebarToggle.addEventListener('click', () => {
        sidebar.classList.add('open');
    });
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.remove('open');
    });
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024 && !sidebar.contains(e.target) && 
            e.target !== mobileSidebarToggle && !mobileSidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });
}

// Navigation Management
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Update section title
            document.querySelector('.section-title').textContent = 
                link.querySelector('span').textContent;
            
            // Show the selected section
            showSection(section);
            
            // Close sidebar on mobile
            if (window.innerWidth < 1024) {
                document.querySelector('.sidebar').classList.remove('open');
            }
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section-content');
    
    sections.forEach(section => {
        if (section.id === `${sectionId}-section`) {
            section.classList.add('active');
            section.classList.remove('hidden');
        } else {
            section.classList.remove('active');
            section.classList.add('hidden');
        }
    });
}

// Modal Management
function initModals() {
    // Add Task Modal
    const addTaskBtn = document.getElementById('add-task-btn');
    const addTaskModal = document.getElementById('add-task-modal');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    
    addTaskBtn.addEventListener('click', () => {
        toggleModal(addTaskModal);
    });
    
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            toggleModal(modal);
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            toggleModal(e.target);
        }
    });
    
    // Task form submission
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would handle the form submission
        // For now, we'll just close the modal
        toggleModal(addTaskModal);
        showToast('Task added successfully', 'success');
    });
    
    // Recurring task toggle
    const recurringToggle = document.getElementById('task-recurring');
    const recurringOptions = document.getElementById('recurring-options');
    
    recurringToggle.addEventListener('change', function() {
        if (this.checked) {
            recurringOptions.classList.remove('hidden');
        } else {
            recurringOptions.classList.add('hidden');
        }
    });
    
    // Add tag functionality
    const addTagBtn = document.getElementById('add-tag-btn');
    const tagInput = document.getElementById('task-tag-input');
    const tagsContainer = document.getElementById('task-tags-container');
    
    addTagBtn.addEventListener('click', function() {
        if (tagInput.value.trim()) {
            const tag = document.createElement('span');
            tag.className = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            tag.textContent = tagInput.value.trim();
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'ml-1 text-purple-600 dark:text-purple-300';
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', function() {
                tag.remove();
            });
            
            tag.appendChild(removeBtn);
            tagsContainer.appendChild(tag);
            tagInput.value = '';
        }
    });
    
    // Add reminder functionality
    const addReminderBtn = document.getElementById('add-reminder-btn');
    const reminderSelect = document.getElementById('reminder-time');
    const remindersContainer = document.getElementById('reminders-container');
    
    addReminderBtn.addEventListener('click', function() {
        const value = reminderSelect.value;
        let text = '';
        
        switch(value) {
            case '5': text = '5 minutes before'; break;
            case '15': text = '15 minutes before'; break;
            case '30': text = '30 minutes before'; break;
            case '60': text = '1 hour before'; break;
            case '1440': text = '1 day before'; break;
            case '2880': text = '2 days before'; break;
        }
        
        const reminder = document.createElement('div');
        reminder.className = 'flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded';
        
        reminder.innerHTML = `
            <span class="text-sm text-gray-700 dark:text-gray-300">${text}</span>
            <button class="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        reminder.querySelector('button').addEventListener('click', function() {
            reminder.remove();
        });
        
        remindersContainer.appendChild(reminder);
    });
}

function toggleModal(modal) {
    modal.classList.toggle('hidden');
    modal.classList.toggle('active');
}

// Focus Mode Management
function initFocusMode() {
    const focusModal = document.getElementById('focus-mode-modal');
    const startFocusBtn = document.getElementById('start-focus-btn');
    const focusTimer = document.getElementById('focus-timer');
    const pauseFocusBtn = document.getElementById('pause-focus-btn');
    const endFocusBtn = document.getElementById('end-focus-btn');
    
    // Open focus modal from sidebar
    document.querySelector('[data-section="focus"]').addEventListener('click', (e) => {
        e.preventDefault();
        toggleModal(focusModal);
    });
    
    // Start focus session
    startFocusBtn.addEventListener('click', function() {
        const minutes = parseInt(this.getAttribute('data-minutes')) || 25;
        const taskSelect = document.getElementById('focus-task-select');
        const taskText = taskSelect.options[taskSelect.selectedIndex].text;
        
        // Set focus task display
        document.getElementById('focus-task-display').textContent = 
            taskText ? `Working on: ${taskText}` : 'Working on: General focus';
        
        // Start timer
        startFocusTimer(minutes * 60);
        
        // Close modal and show timer
        toggleModal(focusModal);
        focusTimer.classList.remove('hidden');
        
        // Show toast
        showToast('Focus session started', 'success');
    });
    
    // Set duration buttons
    document.querySelectorAll('.focus-duration-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.focus-duration-btn').forEach(b => {
                b.classList.remove('bg-purple-600', 'text-white', 'border-purple-600');
                b.classList.add('border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
            });
            
            this.classList.remove('border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
            this.classList.add('bg-purple-600', 'text-white', 'border-purple-600');
            
            startFocusBtn.setAttribute('data-minutes', this.getAttribute('data-minutes'));
        });
    });
    
    // Pause/end focus session
    pauseFocusBtn.addEventListener('click', function() {
        if (this.innerHTML.includes('Pause')) {
            pauseFocusTimer();
            this.innerHTML = '<i class="fas fa-play mr-2"></i> Resume';
        } else {
            resumeFocusTimer();
            this.innerHTML = '<i class="fas fa-pause mr-2"></i> Pause';
        }
    });
    
    endFocusBtn.addEventListener('click', function() {
        endFocusTimer();
        focusTimer.classList.add('hidden');
        showToast('Focus session completed', 'success');
    });
    
    // Close focus timer
    focusTimer.addEventListener('click', function(e) {
        if (e.target === this) {
            endFocusTimer();
            this.classList.add('hidden');
        }
    });
}

let focusTimerInterval;
let remainingSeconds = 0;
let isPaused = false;

function startFocusTimer(seconds) {
    remainingSeconds = seconds;
    isPaused = false;
    updateFocusTimerDisplay();
    
    // Clear any existing timer
    if (focusTimerInterval) clearInterval(focusTimerInterval);
    
    // Start new timer
    focusTimerInterval = setInterval(() => {
        if (!isPaused) {
            remainingSeconds--;
            updateFocusTimerDisplay();
            
            if (remainingSeconds <= 0) {
                endFocusTimer();
                document.getElementById('focus-timer').classList.add('hidden');
                showToast('Focus session completed!', 'success');
            }
        }
    }, 1000);
    
    // Update progress ring
    updateProgressRing();
}

function pauseFocusTimer() {
    isPaused = true;
}

function resumeFocusTimer() {
    isPaused = false;
}

function endFocusTimer() {
    clearInterval(focusTimerInterval);
    focusTimerInterval = null;
}

function updateFocusTimerDisplay() {
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    
    const timeDisplay = document.getElementById('focus-time');
    
    if (hours > 0) {
        timeDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateProgressRing();
}

function updateProgressRing() {
    const circle = document.querySelector('.progress-ring__circle');
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    const totalSeconds = parseInt(document.getElementById('start-focus-btn').getAttribute('data-minutes')) * 60 || 1500;
    const offset = circumference - (remainingSeconds / totalSeconds) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
}

// PIN Lock Management
function initPinLock() {
    const lockAppBtn = document.getElementById('lock-app');
    const pinLock = document.getElementById('pin-lock');
    const pinBtns = document.querySelectorAll('.pin-btn');
    const pinDigits = document.querySelectorAll('.pin-digit');
    const pinError = document.getElementById('pin-error');
    
    // Set PIN (in a real app, this would be set by the user in settings)
    const correctPin = '1234';
    let enteredPin = '';
    
    // Lock app
    lockAppBtn.addEventListener('click', function() {
        localStorage.setItem('appLocked', 'true');
        showPinLock();
    });
    
    // Check if app is locked
    
    
    function showPinLock() {
        pinLock.classList.remove('hidden');
        enteredPin = '';
        updatePinDisplay();
    }
    
    // Handle PIN input
    pinBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.textContent.trim();
            
            if (value === '<i class="fas fa-backspace"></i>') {
                // Backspace
                enteredPin = enteredPin.slice(0, -1);
            } else if (value === '<i class="fas fa-fingerprint"></i>') {
                // Fingerprint (placeholder)
                pinError.textContent = 'Fingerprint not configured';
                setTimeout(() => pinError.textContent = '', 2000);
            } else if (!isNaN(value)) {
                // Number
                if (enteredPin.length < 4) {
                    enteredPin += value;
                }
            }
            
            updatePinDisplay();
            
            // Check if PIN is complete
            if (enteredPin.length === 4) {
                if (enteredPin === correctPin) {
                    // Correct PIN
                    localStorage.removeItem('appLocked');
                    pinLock.classList.add('hidden');
                    showToast('App unlocked', 'success');
                } else {
                    // Incorrect PIN
                    pinError.textContent = 'Incorrect PIN';
                    enteredPin = '';
                    updatePinDisplay();
                    setTimeout(() => pinError.textContent = '', 2000);
                }
            }
        });
    });
    
    function updatePinDisplay() {
        pinDigits.forEach((digit, index) => {
            if (index < enteredPin.length) {
                digit.classList.add('bg-purple-500');
                digit.classList.remove('bg-gray-700');
            } else {
                digit.classList.remove('bg-purple-500');
                digit.classList.add('bg-gray-700');
            }
        });
    }
}

// Countdown Timers
function initCountdownTimers() {
    const timers = document.querySelectorAll('.countdown-timer');
    
    timers.forEach(timer => {
        const deadline = timer.getAttribute('data-deadline');
        if (deadline) {
            const timeinterval = startCountdown(timer, deadline); // Store the interval
            timer.dataset.intervalId = timeinterval; // Attach to element for cleanup
        }
    });
}

function startCountdown(element, endtime) {
    function updateCountdown() {
        const total = Date.parse(endtime) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        
        if (element.querySelector('.days')) {
            element.querySelector('.days').textContent = days.toString().padStart(2, '0');
        }
        if (element.querySelector('.hours')) {
            element.querySelector('.hours').textContent = hours.toString().padStart(2, '0');
        }
        if (element.querySelector('.minutes')) {
            element.querySelector('.minutes').textContent = minutes.toString().padStart(2, '0');
        }
        if (element.querySelector('.seconds')) {
            element.querySelector('.seconds').textContent = seconds.toString().padStart(2, '0');
        }
        
        if (total <= 0) {
            const intervalId = element.dataset.intervalId;
            if (intervalId) {
                clearInterval(intervalId);
            }
            
            if (element.querySelector('.days')) {
                element.querySelector('.days').textContent = '00';
            }
            if (element.querySelector('.hours')) {
                element.querySelector('.hours').textContent = '00';
            }
            if (element.querySelector('.minutes')) {
                element.querySelector('.minutes').textContent = '00';
            }
            if (element.querySelector('.seconds')) {
                element.querySelector('.seconds').textContent = '00';
            }
            
            element.classList.add('text-red-500');
        }
    }
    
    updateCountdown();
    return setInterval(updateCountdown, 1000); // Return the interval ID
}

// Toast Notifications
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = '';
    switch(type) {
        case 'success': icon = '<i class="fas fa-check-circle"></i>'; break;
        case 'error': icon = '<i class="fas fa-exclamation-circle"></i>'; break;
        case 'warning': icon = '<i class="fas fa-exclamation-triangle"></i>'; break;
        default: icon = '<i class="fas fa-info-circle"></i>';
    }
    
    toast.innerHTML = `
        ${icon}
        <span>${message}</span>
        <button class="close-toast">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toast.querySelector('.close-toast').addEventListener('click', function() {
        toast.classList.add('slide-out');
        setTimeout(() => toast.remove(), 300);
    });
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('slide-out');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// Task View Toggle
function initTaskManager() {
    const viewToggleList = document.getElementById('view-toggle-list');
    const viewToggleGrid = document.getElementById('view-toggle-grid');
    const taskListView = document.getElementById('task-list-view');
    const taskGridView = document.getElementById('task-grid-view');
    
    viewToggleList.addEventListener('click', function() {
        this.classList.add('active');
        viewToggleGrid.classList.remove('active');
        taskListView.classList.remove('hidden');
        taskGridView.classList.add('hidden');
    });
    
    viewToggleGrid.addEventListener('click', function() {
        this.classList.add('active');
        viewToggleList.classList.remove('active');
        taskGridView.classList.remove('hidden');
        taskListView.classList.add('hidden');
    });
    
    // Task checkbox functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('task-checkbox') || e.target.closest('.task-checkbox')) {
            const checkbox = e.target.classList.contains('task-checkbox') ? e.target : e.target.closest('.task-checkbox');
            checkbox.classList.toggle('checked');
            
            // In a real app, you would update the task status in your data store
        }
        
        if (e.target.classList.contains('task-star') || e.target.closest('.task-star')) {
            const star = e.target.classList.contains('task-star') ? e.target : e.target.closest('.task-star');
            const icon = star.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                star.classList.add('text-yellow-400');
                
                // In a real app, you would update the task's pinned status
                showToast('Task pinned', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                star.classList.remove('text-yellow-400');
                
                // In a real app, you would update the task's pinned status
                showToast('Task unpinned', 'info');
            }
        }
    });
}