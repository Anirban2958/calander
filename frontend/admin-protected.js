// ============================================================================
// BOXO EVENT CALENDAR - PROTECTED ADMIN PANEL FUNCTIONALITY
// ============================================================================
// This file handles all administrative operations for the event calendar:
// 1. Authentication verification and session management
// 2. Event creation, editing, and deletion
// 3. Dashboard statistics and today's events display
// 4. Event search and filtering functionality
// 5. System settings management
// All functionality is protected and requires valid admin authentication
// ============================================================================

/**
 * ProtectedAdminPanel Class - Main controller for admin panel functionality
 * Handles authentication, event management, and UI interactions
 */
class ProtectedAdminPanel {
    /**
     * Constructor - Initialize admin panel with authentication check
     */
    constructor() {
        this.events = [];                               // Array to store all events from backend
        this.editingEventId = null;                     // ID of event being edited (null for new events)
        this.authToken = localStorage.getItem('adminToken'); // Retrieve stored authentication token
        
        // Initialize the admin panel
        this.init();
    }

    /**
     * Initialize the admin panel with authentication and setup
     * Verifies user credentials before allowing access to admin features
     */
    async init() {
        // Check authentication first - critical security step
        if (!await this.verifyAuthentication()) {
            this.showAccessDenied();
            return; // Stop initialization if not authenticated
        }
        
        // If authenticated, proceed with full initialization
        await this.loadEvents();        // Load events from backend
        this.setupEventListeners();    // Set up all UI event handlers
        this.renderAdminEvents();       // Display events in management interface
        this.setMinDate();              // Set minimum date for event creation
    }

    /**
     * Verify user authentication with backend server
     * @returns {boolean} True if user is authenticated, false otherwise
     */
    async verifyAuthentication() {
        // Check if authentication token exists in local storage
        if (!this.authToken) {
            return false;
        }

        try {
            // Send verification request to backend with auth token
            const response = await fetch('/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            // If verification fails, remove invalid token
            if (!response.ok) {
                localStorage.removeItem('adminToken');
                return false;
            }
            
            return true; // Authentication successful
        } catch (error) {
            // Network error or server down - assume invalid session
            localStorage.removeItem('adminToken');
            return false;
        }
    }

    /**
     * Display access denied screen and hide protected content
     * Called when user is not authenticated or session is invalid
     */
    showAccessDenied() {
        document.getElementById('accessDenied').style.display = 'flex';
        document.querySelector('.protected-content').style.display = 'none';
    }

    /**
     * Set up all event listeners for admin panel interactions
     * Handles form submissions, searches, authentication, and event management
     */
    setupEventListeners() {
        // ===== FORM SUBMISSION HANDLERS =====
        // Event form submission for creating/editing events
        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent default form submission
            this.handleEventSubmission(); // Handle form data processing
        });

        // ===== SEARCH FUNCTIONALITY =====
        // Real-time search filtering as user types
        document.getElementById('searchEvents').addEventListener('input', (e) => {
            this.filterEvents(e.target.value); // Filter events by search term
        });

        // ===== AUTHENTICATION CONTROLS =====
        // Logout button - clear session and redirect
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });

        // ===== CONFIRMATION MODAL HANDLERS =====
        // Confirm button in modal (for deletions, etc.)
        document.getElementById('confirmYes').addEventListener('click', () => {
            this.confirmAction(); // Execute the confirmed action
        });

        // Cancel button in modal
        document.getElementById('confirmNo').addEventListener('click', () => {
            this.hideConfirmModal(); // Close modal without action
        });

        // Close modal when clicking outside of it
        window.addEventListener('click', (e) => {
            if (e.target === document.getElementById('confirmModal')) {
                this.hideConfirmModal();
            }
        });

        // ===== DYNAMIC EVENT MANAGEMENT =====
        // Event delegation for dynamically created edit and delete buttons
        document.addEventListener('click', (e) => {
            // Handle edit button clicks
            if (e.target.closest('.edit-event-btn')) {
                const eventId = e.target.closest('.edit-event-btn').dataset.eventId;
                this.editEvent(eventId);
            } 
            // Handle delete button clicks
            else if (e.target.closest('.delete-event-btn')) {
                const eventId = e.target.closest('.delete-event-btn').dataset.eventId;
                this.deleteEvent(eventId);
            }
        });
    }

    /**
     * Handle user logout process
     * Notifies backend and redirects to login page
     */
    async logout() {
        try {
            // Notify backend about logout to invalidate session
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local token and redirect, even if backend call fails
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
        }
    }

    /**
     * Set minimum date for event creation to today
     * Prevents scheduling events in the past
     */
    setMinDate() {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        // Set minimum date attribute on date input field
        document.getElementById('eventDate').min = today;
    }

    /**
     * Load all events from the backend API
     * Updates statistics and today's events display after loading
     */
    async loadEvents() {
        try {
            // Fetch events from backend API
            const response = await fetch('/api/events');
            this.events = await response.json();
            this.updateStatistics();     // Update dashboard statistics
            this.updateTodaysEvents();   // Update today's events section
        } catch (error) {
            console.error('Error loading events:', error);
            this.showNotification('Error loading events', 'error');
        }
    }

    /**
     * Update dashboard statistics counters
     * Counts total events and breaks down by type
     */
    updateStatistics() {
        // Calculate statistics from events array
        const totalEvents = this.events.length;
        const assignments = this.events.filter(event => event.type === 'assignment').length;
        const webinars = this.events.filter(event => event.type === 'webinar').length;
        const workshops = this.events.filter(event => event.type === 'workshop').length;

        // Update DOM elements if they exist (defensive programming)
        const totalEventsEl = document.getElementById('totalEvents');
        const totalAssignmentsEl = document.getElementById('totalAssignments');
        const totalWebinarsEl = document.getElementById('totalWebinars');
        const totalWorkshopsEl = document.getElementById('totalWorkshops');

        if (totalEventsEl) totalEventsEl.textContent = totalEvents;
        if (totalAssignmentsEl) totalAssignmentsEl.textContent = assignments;
        if (totalWebinarsEl) totalWebinarsEl.textContent = webinars;
        if (totalWorkshopsEl) totalWorkshopsEl.textContent = workshops;
    }

    /**
     * Update today's events display section
     * Shows events happening today, sorted by time
     */
    updateTodaysEvents() {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        // Filter events for today only
        const todaysEvents = this.events.filter(event => event.date === today);
        const todaysEventsContainer = document.getElementById('todaysEvents');
        
        // Check if container exists
        if (!todaysEventsContainer) return;
        
        // Handle empty state
        if (todaysEvents.length === 0) {
            todaysEventsContainer.innerHTML = '<p class="no-events">No events scheduled for today.</p>';
            return;
        }
        
        // Sort events by time (earliest first)
        todaysEvents.sort((a, b) => a.time.localeCompare(b.time));
        
        // Render today's events as cards
        todaysEventsContainer.innerHTML = todaysEvents.map(event => `
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
        `).join('');
    }

    /**
     * Get appropriate icon class for event types
     * @param {string} eventType - The type of event (assignment, webinar, workshop)
     * @returns {string} Font Awesome icon class
     */
    getEventTypeIcon(eventType) {
        // Map event types to their corresponding Font Awesome icons
        const icons = {
            'assignment': 'fas fa-file-alt',    // Document icon for assignments
            'webinar': 'fas fa-video',          // Video icon for webinars
            'workshop': 'fas fa-tools'          // Tools icon for workshops
        };
        // Return specific icon or default calendar icon
        return icons[eventType] || 'fas fa-calendar-check';
    }

    /**
     * Format time string for display in 12-hour format
     * @param {string} timeString - Time in HH:MM format (24-hour)
     * @returns {string} Formatted time (e.g., "2:30 PM")
     */
    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric',     // 1, 2, 12, etc. (no leading zero)
            minute: '2-digit',   // 00, 15, 30, etc. (with leading zero)
            hour12: true         // Use AM/PM format
        });
    }

    /**
     * Handle event form submission for creating or updating events
     * Validates data and sends to backend API
     */
    async handleEventSubmission() {
        // Extract form data into object
        const formData = new FormData(document.getElementById('eventForm'));
        const eventData = {
            title: formData.get('title').trim(),           // Remove whitespace
            description: formData.get('description').trim(), // Remove whitespace
            date: formData.get('date'),
            time: formData.get('time'),
            type: formData.get('type')
        };

        // Validate form data before submission
        if (!this.validateEventData(eventData)) {
            return; // Stop if validation fails
        }

        try {
            let response;
            // Set up request headers with authentication
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
            };

            if (this.editingEventId) {
                // Update existing event (PUT request)
                response = await fetch(`/api/events/${this.editingEventId}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(eventData)
                });
            } else {
                // Create new event (POST request)
                response = await fetch('/api/events', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(eventData)
                });
            }

            // Handle authentication expiration
            if (response.status === 401) {
                this.showNotification('Session expired. Please login again.', 'error');
                setTimeout(() => {
                    localStorage.removeItem('adminToken');
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }

            // Handle successful submission
            if (response.ok) {
                const event = await response.json();
                
                if (this.editingEventId) {
                    this.showNotification('Event updated successfully!', 'success');
                    this.cancelEdit(); // Exit edit mode
                } else {
                    this.showNotification('Event created successfully!', 'success');
                }
                
                // Reset form and refresh data
                this.resetForm();
                await this.loadEvents();           // Reload events from backend
                this.renderAdminEvents();          // Re-render events list
                this.updateStatistics();          // Update dashboard statistics
                this.updateTodaysEvents();         // Update today's events section
            } else {
                // Handle server error response
                throw new Error('Failed to save event');
            }
        } catch (error) {
            console.error('Error saving event:', error);
            this.showNotification('Error saving event', 'error');
        }
    }

    /**
     * Validate event form data before submission
     * @param {Object} data - Event data object with title, description, date, time, type
     * @returns {boolean} True if data is valid, false otherwise
     */
    validateEventData(data) {
        // Check required title field
        if (!data.title) {
            this.showNotification('Please enter an event title', 'error');
            return false;
        }

        // Check required description field
        if (!data.description) {
            this.showNotification('Please enter an event description', 'error');
            return false;
        }

        // Check required date field
        if (!data.date) {
            this.showNotification('Please select an event date', 'error');
            return false;
        }

        // Check required time field
        if (!data.time) {
            this.showNotification('Please select an event time', 'error');
            return false;
        }

        // Check required type field
        if (!data.type) {
            this.showNotification('Please select an event type', 'error');
            return false;
        }

        // Validate that date is not in the past
        const eventDate = new Date(data.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

        if (eventDate < today) {
            this.showNotification('Event date cannot be in the past', 'error');
            return false;
        }

        return true; // All validations passed
    }

    /**
     * Render the admin events list with edit and delete controls
     * Shows all events sorted by date and time
     */
    renderAdminEvents() {
        const adminEventsList = document.getElementById('adminEventsList');
        
        // Handle empty events state
        if (this.events.length === 0) {
            adminEventsList.innerHTML = '<p>No events found. Create your first event above!</p>';
            return;
        }

        // Sort events chronologically (date first, then time)
        const sortedEvents = [...this.events].sort((a, b) => {
            const dateCompare = new Date(a.date) - new Date(b.date);
            if (dateCompare === 0) {
                // If same date, sort by time
                return a.time.localeCompare(b.time);
            }
            return dateCompare;
        });

        // Render events as admin cards with management controls
        adminEventsList.innerHTML = sortedEvents.map(event => `
            <div class="admin-event-card" data-event-id="${event.id}">
                <div class="admin-event-info">
                    <h4>${event.title}</h4>
                    <div class="admin-event-meta">
                        <span><i class="fas fa-calendar"></i> ${this.formatDate(event.date)}</span>
                        <span><i class="fas fa-clock"></i> ${this.formatTime(event.time)}</span>
                        <span class="event-type ${event.type}"><i class="fas fa-tag"></i> ${event.type}</span>
                    </div>
                    <p>${event.description}</p>
                </div>
                <div class="admin-event-actions">
                    <!-- Edit button with event ID for modification -->
                    <button class="btn btn-outline btn-small edit-event-btn" data-event-id="${event.id}" onclick="window.admin.editEvent('${event.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <!-- Delete button with event ID for removal -->
                    <button class="btn btn-danger btn-small delete-event-btn" data-event-id="${event.id}" onclick="window.admin.deleteEvent('${event.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Filter events in the admin list based on search term
     * @param {string} searchTerm - Text to search for in event titles and descriptions
     */
    filterEvents(searchTerm) {
        // Get all event cards in the admin list
        const eventCards = document.querySelectorAll('.admin-event-card');
        
        eventCards.forEach(card => {
            // Get all text content from the event info section
            const eventInfo = card.querySelector('.admin-event-info').textContent.toLowerCase();
            // Check if search term matches anywhere in the event info
            const matches = eventInfo.includes(searchTerm.toLowerCase());
            // Show or hide card based on match
            card.style.display = matches ? 'grid' : 'none';
        });
    }

    /**
     * Edit an existing event by populating the form with its data
     * @param {string} eventId - ID of event to edit
     */
    editEvent(eventId) {
        // Convert eventId to number for comparison since database IDs are numbers
        const numericEventId = parseInt(eventId);
        const event = this.events.find(e => e.id === numericEventId);
        if (!event) return; // Exit if event not found

        // Set editing mode and populate form
        this.editingEventId = numericEventId;
        
        // Populate all form fields with existing event data
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventDescription').value = event.description;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventTime').value = event.time;
        document.getElementById('eventType').value = event.type;

        // Update form UI to indicate edit mode
        document.getElementById('submitText').textContent = 'Update Event';
        const form = document.getElementById('eventForm');
        form.scrollIntoView({ behavior: 'smooth' }); // Scroll to form

        // Add cancel button if not already present
        if (!document.getElementById('cancelEdit')) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.id = 'cancelEdit';
            cancelBtn.className = 'btn btn-outline btn-full';
            cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
            cancelBtn.onclick = () => this.cancelEdit();
            form.appendChild(cancelBtn);
        }

        // Show user feedback about edit mode
        this.showNotification(`Editing: ${event.title}`, 'info');
    }

    /**
     * Cancel edit mode and reset form to add new event mode
     */
    cancelEdit() {
        this.editingEventId = null;           // Clear editing ID
        this.resetForm();                     // Clear form fields
        document.getElementById('submitText').textContent = 'Add Event'; // Reset button text
        
        // Remove cancel button if it exists
        const cancelBtn = document.getElementById('cancelEdit');
        if (cancelBtn) {
            cancelBtn.remove();
        }
    }

    /**
     * Delete an event with confirmation
     * @param {string} eventId - ID of event to delete
     */
    deleteEvent(eventId) {
        // Convert eventId to number for comparison since database IDs are numbers
        const numericEventId = parseInt(eventId);
        const event = this.events.find(e => e.id === numericEventId);
        
        if (!event) return; // Exit if event not found

        // Show confirmation modal with event title
        this.showConfirmModal(
            `Are you sure you want to delete "${event.title}"?`,
            () => this.performDelete(numericEventId)
        );
    }

    /**
     * Perform actual event deletion after user confirmation
     * @param {number} eventId - ID of event to delete
     */
    async performDelete(eventId) {
        try {
            // Send DELETE request to backend
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });

            // Handle authentication expiration
            if (response.status === 401) {
                this.showNotification('Session expired. Please login again.', 'error');
                setTimeout(() => {
                    localStorage.removeItem('adminToken');
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }

            // Handle successful deletion
            if (response.ok) {
                this.showNotification('Event deleted successfully!', 'success');
                // Refresh all data and displays
                await this.loadEvents();
                this.renderAdminEvents();
                this.updateStatistics();     // Update dashboard statistics
                this.updateTodaysEvents();   // Update today's events section
            } else {
                throw new Error('Failed to delete event');
            }
        } catch (error) {
            console.error('Error deleting event:', error);
            this.showNotification('Error deleting event', 'error');
        }
    }

    /**
     * Show confirmation modal with custom message and callback
     * @param {string} message - Confirmation message to display
     * @param {Function} onConfirm - Callback function to execute if user confirms
     */
    showConfirmModal(message, onConfirm) {
        const modal = document.getElementById('confirmModal');
        const messageEl = document.getElementById('confirmMessage');
        
        // Check if modal elements exist
        if (!modal || !messageEl) {
            console.error('Modal elements not found');
            return;
        }
        
        // Set message and show modal
        messageEl.textContent = message;
        modal.style.display = 'block';
        this.confirmCallback = onConfirm; // Store callback for later execution
    }

    /**
     * Hide confirmation modal and clear callback
     */
    hideConfirmModal() {
        document.getElementById('confirmModal').style.display = 'none';
        this.confirmCallback = null; // Clear stored callback
    }

    /**
     * Execute confirmed action and hide modal
     */
    confirmAction() {
        if (this.confirmCallback) {
            this.confirmCallback(); // Execute the stored callback
        }
        this.hideConfirmModal();
    }

    /**
     * Reset event form to default state
     */
    resetForm() {
        document.getElementById('eventForm').reset(); // Clear all form fields
        this.setMinDate(); // Reset minimum date constraint
    }

    /**
     * Format date string for display
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {string} Formatted date (e.g., "Mon, Jan 15, 2024")
     */
    formatDate(dateString) {
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'short',  // Mon, Tue, etc.
            month: 'short',    // Jan, Feb, etc.
            day: 'numeric',    // 1, 2, 15, etc.
            year: 'numeric'    // 2024, 2025, etc.
        });
    }

    /**
     * Show notification message to user
     * @param {string} message - Message to display
     * @param {string} type - Type of notification ('success', 'error', 'info')
     */
    showNotification(message, type = 'info') {
        // Create notification element with appropriate styling
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add notification styles if not already present
        if (!document.getElementById('notificationStyles')) {
            const styles = document.createElement('style');
            styles.id = 'notificationStyles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                }
                
                .notification-success { background: #48bb78; }
                .notification-error { background: #f56565; }
                .notification-info { background: #4299e1; }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add notification to page
        document.body.appendChild(notification);

        // Auto-remove notification after 3 seconds with slide-out animation
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                // Remove from DOM if still present
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300); // Wait for animation to complete
        }, 3000); // Show for 3 seconds
    }
}

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

/**
 * Global admin instance - available throughout the application
 */
let admin;

/**
 * Initialize the protected admin panel when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create new admin panel instance (triggers authentication and full initialization)
    admin = new ProtectedAdminPanel();
    // Make admin globally accessible for onclick handlers in HTML
    window.admin = admin;
});
