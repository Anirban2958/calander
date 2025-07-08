// ============================================================================
// BOXO EVENT CALENDAR - FRONTEND JAVASCRIPT (calendar.js)
// ============================================================================
// This file contains all the frontend logic for the calendar application:
// 1. EventCalendar class that manages the entire calendar interface
// 2. Event loading from backend API
// 3. Calendar rendering and navigation
// 4. Event filtering and display
// 5. Browser notification system
// 6. Modal popup for event details
// 7. Responsive user interface interactions
// ============================================================================

// ===== MAIN CALENDAR CLASS =====
/**
 * EventCalendar - Main class that handles all calendar functionality
 * This class manages the complete user interface and data flow
 */
class EventCalendar {
    /**
     * Constructor - Initialize calendar properties
     * Sets up default state when calendar is created
     */
    constructor() {
        this.events = [];                   // Array to store all events loaded from backend
        this.currentDate = new Date();      // Current date being viewed in calendar
        this.selectedFilter = 'all';        // Current filter type ('all', 'assignment', 'webinar', 'workshop')
        this.notificationsEnabled = false;  // Whether user has enabled browser notifications
        
        // Start the calendar initialization process
        this.init();
    }

    /**
     * Initialize the calendar
     * This method runs all setup functions in the correct order
     */
    async init() {
        await this.loadEvents();           // Load events from backend API
        this.setupEventListeners();       // Set up all button clicks and interactions
        this.renderCalendar();            // Draw the calendar grid
        this.renderEvents();              // Display events in the events list
        this.checkNotificationPermission(); // Check if notifications are available/enabled
    }

    // ===== EVENT LISTENERS SETUP =====
    /**
     * Set up all event listeners for user interactions
     * This includes button clicks, modal interactions, and keyboard events
     */
    setupEventListeners() {
        
        // ===== CALENDAR NAVIGATION =====
        
        // Previous month button
        document.getElementById('prevMonth').addEventListener('click', () => {
            // Move to previous month and re-render calendar
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });

        // Next month button
        document.getElementById('nextMonth').addEventListener('click', () => {
            // Move to next month and re-render calendar
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });

        // ===== EVENT FILTER BUTTONS =====
        
        // Set up click handlers for all filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove 'active' class from all filter buttons
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                
                // Add 'active' class to clicked button
                e.target.classList.add('active');
                
                // Update selected filter from button's data-type attribute
                this.selectedFilter = e.target.dataset.type;
                
                // Re-render events and calendar with new filter
                this.renderEvents();
                this.renderCalendar();
            });
        });

        // ===== NOTIFICATION BUTTON =====
        
        // Enable notifications button
        document.getElementById('notificationBtn').addEventListener('click', () => {
            this.requestNotificationPermission();
        });

        // ===== MODAL INTERACTIONS =====
        
        // Close modal when X button is clicked
        document.querySelector('.close').addEventListener('click', () => {
            document.getElementById('eventModal').style.display = 'none';
        });

        // Close modal when user clicks outside the modal content
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('eventModal')) {
                document.getElementById('eventModal').style.display = 'none';
            }
        });
    }

    // ===== DATA LOADING =====
    /**
     * Load events from the backend API
     * Makes HTTP request to /api/events and stores results
     */
    async loadEvents() {
        try {
            // Fetch events from backend server
            const response = await fetch('/api/events');
            
            // Parse JSON response and store in events array
            this.events = await response.json();
        } catch (error) {
            // Log error if API request fails
            console.error('Error loading events:', error);
            
            // Set empty array if loading fails to prevent crashes
            this.events = [];
        }
    }

    // ===== CALENDAR RENDERING =====
    /**
     * Render the calendar grid for the current month
     * Creates a visual calendar with days and events
     */
    renderCalendar() {
        // Get DOM elements for calendar
        const monthYear = document.getElementById('monthYear');
        const calendarGrid = document.querySelector('.calendar-grid');
        
        // Remove existing calendar days (but keep day headers like "Sun", "Mon", etc.)
        const existingDays = calendarGrid.querySelectorAll('.calendar-day');
        existingDays.forEach(day => day.remove());

        // Get current year and month being displayed
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month/year display (e.g., "December 2024")
        monthYear.textContent = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric'
        }).format(this.currentDate);

        // Calculate calendar layout information
        const firstDay = new Date(year, month, 1);          // First day of current month
        const lastDay = new Date(year, month + 1, 0);       // Last day of current month
        const daysInMonth = lastDay.getDate();              // Number of days in month
        const startingDayOfWeek = firstDay.getDay();        // What day of week month starts on (0=Sun, 6=Sat)

        // ===== ADD EMPTY CELLS FOR PREVIOUS MONTH =====
        // Fill in days from previous month to complete the first week
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            
            // Calculate what day from previous month to show
            const prevMonthDay = new Date(year, month, 0 - (startingDayOfWeek - 1 - i));
            emptyDay.innerHTML = `<div class="day-number">${prevMonthDay.getDate()}</div>`;
            
            calendarGrid.appendChild(emptyDay);
        }

        // ===== ADD DAYS OF CURRENT MONTH =====
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // Create date string in YYYY-MM-DD format for comparison
            const currentDateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const today = new Date().toISOString().split('T')[0];  // Today's date in same format
            
            // Highlight today's date
            if (currentDateString === today) {
                dayElement.classList.add('today');
            }

            // Get events scheduled for this specific day
            const dayEvents = this.getEventsForDay(currentDateString);
            
            // Add visual indicator if day has events
            if (dayEvents.length > 0) {
                dayElement.classList.add('has-events');
            }

            // Build HTML content for this day
            dayElement.innerHTML = `
                <div class="day-number">${day}</div>
                <div class="day-events">
                    ${dayEvents.slice(0, 2).map(event => 
                        `<div class="day-event ${event.type}">${event.title}</div>`
                    ).join('')}
                    ${dayEvents.length > 2 ? `<div class="day-event">+${dayEvents.length - 2} more</div>` : ''}
                </div>
            `;

            // Add click handler to show events when day is clicked
            dayElement.addEventListener('click', () => {
                this.showDayEvents(currentDateString, dayEvents);
            });

            // Add day to calendar grid
            calendarGrid.appendChild(dayElement);
        }

        // ===== ADD EMPTY CELLS FOR NEXT MONTH =====
        // Fill remaining cells to complete the last week
        const totalCells = calendarGrid.children.length;
        const cellsNeeded = Math.ceil(totalCells / 7) * 7;  // Round up to nearest multiple of 7
        
        for (let i = totalCells; i < cellsNeeded; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            
            // Calculate day from next month
            const nextMonthDay = i - totalCells + 1;
            emptyDay.innerHTML = `<div class="day-number">${nextMonthDay}</div>`;
            
            calendarGrid.appendChild(emptyDay);
        }
    }

    // ===== UTILITY FUNCTIONS =====
    
    /**
     * Get appropriate icon for each event type
     * @param {string} eventType - Type of event ('assignment', 'webinar', 'workshop')
     * @returns {string} Font Awesome CSS class for icon
     */
    getEventTypeIcon(eventType) {
        const icons = {
            'assignment': 'fas fa-file-alt',    // Document icon for assignments
            'webinar': 'fas fa-video',          // Video icon for webinars
            'workshop': 'fas fa-tools'          // Tools icon for workshops
        };
        // Return appropriate icon or default calendar icon
        return icons[eventType] || 'fas fa-calendar-check';
    }

    /**
     * Get events for a specific day, filtered by current filter setting
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {Array} Array of events for that day
     */
    getEventsForDay(dateString) {
        // First, get all events for this date
        let dayEvents = this.events.filter(event => event.date === dateString);
        
        // Apply current filter (if not 'all')
        if (this.selectedFilter !== 'all') {
            dayEvents = dayEvents.filter(event => event.type === this.selectedFilter);
        }
        
        // Sort events by time (earliest first)
        return dayEvents.sort((a, b) => a.time.localeCompare(b.time));
    }

    /**
     * Show events for a specific day in a modal popup
     * @param {string} date - Date string to display
     * @param {Array} events - Array of events for that day
     */
    showDayEvents(date, events) {
        const modal = document.getElementById('eventModal');
        const eventDetails = document.getElementById('eventDetails');
        
        // Format date for display (e.g., "Monday, December 25, 2024")
        const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Build HTML content for modal
        eventDetails.innerHTML = `
            <h2><i class="fas fa-calendar-day"></i> ${formattedDate}</h2>
            ${events.length === 0 ? 
                '<p>No events scheduled for this day.</p>' : 
                events.map(event => `
                    <div class="event-card ${event.type}">
                        <div class="event-header">
                            <div>
                                <div class="event-title">
                                    <i class="${this.getEventTypeIcon(event.type)}"></i> ${event.title}
                                </div>
                                <div class="event-datetime">
                                    <span><i class="fas fa-clock"></i> ${this.formatTime(event.time)}</span>
                                </div>
                            </div>
                            <span class="event-type ${event.type}">${event.type}</span>
                        </div>
                        <div class="event-description">${event.description}</div>
                    </div>
                `).join('')
            }
        `;
        
        // Show the modal
        modal.style.display = 'block';
    }

    // ===== EVENTS LIST RENDERING =====
    /**
     * Render the upcoming events list below the calendar
     * Shows events in chronological order
     */
    renderEvents() {
        const eventsList = document.getElementById('eventsList');
        
        // Apply current filter to events
        let filteredEvents = this.events;
        if (this.selectedFilter !== 'all') {
            filteredEvents = this.events.filter(event => event.type === this.selectedFilter);
        }

        // Sort events chronologically (date first, then time)
        filteredEvents.sort((a, b) => {
            const dateCompare = new Date(a.date) - new Date(b.date);
            if (dateCompare === 0) {
                // If same date, sort by time
                return a.time.localeCompare(b.time);
            }
            return dateCompare;
        });

        // Show only upcoming events (today and future)
        const today = new Date().toISOString().split('T')[0];
        const upcomingEvents = filteredEvents.filter(event => event.date >= today);

        // Handle case where no upcoming events exist
        if (upcomingEvents.length === 0) {
            eventsList.innerHTML = '<p>No upcoming events found.</p>';
            return;
        }

        // Generate HTML for events list
        eventsList.innerHTML = upcomingEvents.map(event => `
            <div class="event-card ${event.type}" onclick="calendar.showEventDetails('${event.id}')">
                <div class="event-header">
                    <div>
                        <div class="event-title">
                            <i class="${this.getEventTypeIcon(event.type)}"></i> ${event.title}
                        </div>
                        <div class="event-datetime">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(event.date)}</span>
                            <span><i class="fas fa-clock"></i> ${this.formatTime(event.time)}</span>
                        </div>
                    </div>
                    <span class="event-type ${event.type}">${event.type}</span>
                </div>
                <div class="event-description">${event.description}</div>
            </div>
        `).join('');

        // Check if any events need notification alerts
        this.checkUpcomingNotifications(upcomingEvents);
    }

    /**
     * Show detailed information for a specific event
     * @param {string} eventId - ID of event to display
     */
    showEventDetails(eventId) {
        // Find event by ID
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;  // Exit if event not found

        const modal = document.getElementById('eventModal');
        const eventDetails = document.getElementById('eventDetails');
        
        // Generate detailed event display
        eventDetails.innerHTML = `
            <h2><i class="fas fa-info-circle"></i> Event Details</h2>
            <div class="event-card ${event.type}">
                <div class="event-header">
                    <div>
                        <div class="event-title">${event.title}</div>
                        <div class="event-datetime">
                            <span><i class="fas fa-calendar"></i> ${this.formatDate(event.date)}</span>
                            <span><i class="fas fa-clock"></i> ${this.formatTime(event.time)}</span>
                        </div>
                    </div>
                    <span class="event-type ${event.type}">${event.type}</span>
                </div>
                <div class="event-description">${event.description}</div>
            </div>
        `;
        
        // Show modal with event details
        modal.style.display = 'block';
    }

    // ===== DATE/TIME FORMATTING =====
    
    /**
     * Format date for display
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {string} Formatted date (e.g., "Mon, Dec 25, 2024")
     */
    formatDate(dateString) {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    /**
     * Format time for display
     * @param {string} timeString - Time in HH:MM format (24-hour)
     * @returns {string} Formatted time (e.g., "2:30 PM")
     */
    formatTime(timeString) {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // ===== NOTIFICATION SYSTEM =====
    
    /**
     * Check current notification permission status
     * Updates notification button appearance based on permission
     */
    checkNotificationPermission() {
        // Check if browser supports notifications
        if ('Notification' in window) {
            const permission = Notification.permission;
            const btn = document.getElementById('notificationBtn');
            
            if (permission === 'granted') {
                // Notifications are enabled
                btn.innerHTML = '<i class="fas fa-bell"></i> Notifications Enabled';
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-outline');
                this.notificationsEnabled = true;
            } else if (permission === 'denied') {
                // User has blocked notifications
                btn.innerHTML = '<i class="fas fa-bell-slash"></i> Notifications Blocked';
                btn.disabled = true;
            }
            // If permission is 'default', button shows original text asking to enable
        } else {
            // Browser doesn't support notifications, hide button
            document.getElementById('notificationBtn').style.display = 'none';
        }
    }

    /**
     * Request permission to show browser notifications
     * Called when user clicks the notification button
     */
    async requestNotificationPermission() {
        if ('Notification' in window) {
            // Request permission from user
            const permission = await Notification.requestPermission();
            
            if (permission === 'granted') {
                // Permission granted - update UI and enable notifications
                this.notificationsEnabled = true;
                const btn = document.getElementById('notificationBtn');
                btn.innerHTML = '<i class="fas fa-bell"></i> Notifications Enabled';
                btn.classList.add('btn-primary');
                btn.classList.remove('btn-outline');
                
                // Show confirmation notification
                new Notification('Boxo Calendar', {
                    body: 'Notifications are now enabled! You\'ll be notified about upcoming events.',
                    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>'
                });
            }
        }
    }

    /**
     * Check upcoming events and send notifications if needed
     * @param {Array} events - Array of upcoming events to check
     */
    checkUpcomingNotifications(events) {
        // Only proceed if notifications are enabled
        if (!this.notificationsEnabled) return;

        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);    // 1 hour from now
        const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

        events.forEach(event => {
            // Convert event date/time to Date object
            const eventDateTime = new Date(`${event.date}T${event.time}`);
            
            // Check if event is within notification window (24 hours)
            if (eventDateTime > now && eventDateTime <= oneDayFromNow) {
                const timeDiff = eventDateTime - now;
                const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));
                
                // Send 1-hour warning notification
                if (hoursUntil <= 1 && !this.hasNotified(event.id, '1hour')) {
                    this.sendNotification(event, 'Starting in 1 hour!');
                    this.markAsNotified(event.id, '1hour');
                } 
                // Send 24-hour advance notification
                else if (hoursUntil <= 24 && !this.hasNotified(event.id, '24hours')) {
                    this.sendNotification(event, `Starting in ${hoursUntil} hours`);
                    this.markAsNotified(event.id, '24hours');
                }
            }
        });
    }

    /**
     * Send a browser notification for an event
     * @param {Object} event - Event object to notify about
     * @param {string} timeMessage - Message about when event starts
     */
    sendNotification(event, timeMessage) {
        // Double-check that notifications are available and permitted
        if (this.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`Upcoming ${event.type}: ${event.title}`, {
                body: `${timeMessage}\n${event.description}`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23667eea"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',
                tag: event.id  // Prevents duplicate notifications for same event
            });
        }
    }

    /**
     * Check if we've already sent a specific notification for an event
     * @param {string} eventId - Event ID
     * @param {string} type - Notification type ('1hour' or '24hours')
     * @returns {boolean} True if already notified
     */
    hasNotified(eventId, type) {
        // Check localStorage for notification record
        const notified = localStorage.getItem(`notified_${eventId}_${type}`);
        return notified === 'true';
    }

    /**
     * Mark that we've sent a notification for an event
     * @param {string} eventId - Event ID
     * @param {string} type - Notification type ('1hour' or '24hours')
     */
    markAsNotified(eventId, type) {
        // Store notification record in localStorage
        localStorage.setItem(`notified_${eventId}_${type}`, 'true');
    }
}

// ===== INITIALIZATION =====

// Global calendar variable for access from HTML onclick handlers
let calendar;

/**
 * Initialize the calendar when page finishes loading
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create new calendar instance
    calendar = new EventCalendar();
    
    // Set up periodic notification checking (every minute)
    setInterval(() => {
        if (calendar.notificationsEnabled) {
            calendar.checkUpcomingNotifications(calendar.events);
        }
    }, 60000); // 60,000 milliseconds = 1 minute
});

// ============================================================================
// END OF CALENDAR JAVASCRIPT
// ============================================================================
//
// FUNCTIONALITY SUMMARY:
// 1. Calendar Display: Visual month-view calendar with event indicators
// 2. Event Loading: Fetches events from backend API (/api/events)
// 3. Event Filtering: Filter by event type (all, assignments, webinars, workshops)
// 4. Event Details: Click events to see detailed information in modal
// 5. Navigation: Previous/next month navigation
// 6. Notifications: Browser notifications for upcoming events
// 7. Responsive Design: Works on desktop and mobile devices
//
// DATA FLOW:
// 1. Page loads → calendar.js executes
// 2. EventCalendar class is instantiated
// 3. Events are loaded from backend API
// 4. Calendar is rendered with events
// 5. User interactions trigger re-rendering
// 6. Notifications are checked periodically
//
// BROWSER STORAGE:
// - localStorage: Used to track which notifications have been sent
// - sessionStorage: Not used
// - cookies: Not used
//
// API ENDPOINTS USED:
// - GET /api/events: Fetch all events from backend
//
// BROWSER FEATURES USED:
// - Notification API: For event reminders
// - localStorage: For notification tracking
// - Fetch API: For HTTP requests
// - Date/Time APIs: For date formatting and calculations
// ============================================================================
