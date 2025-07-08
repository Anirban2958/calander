// ============================================================================
// BOXO EVENT CALENDAR - BACKEND SERVER
// ============================================================================
// This file creates the main web server that handles:
// 1. User authentication (login/register/logout)
// 2. Event management (create/read/update/delete events)
// 3. Serving frontend files to users
// 4. Database operations through the Database class
// ============================================================================

// ===== IMPORTS & DEPENDENCIES =====
const express = require('express');        // Web framework for Node.js - handles HTTP requests/responses
const cors = require('cors');              // Cross-Origin Resource Sharing - allows frontend to talk to backend
const bodyParser = require('body-parser'); // Parses incoming request data (JSON, form data)
const path = require('path');              // Node.js utility for working with file/directory paths
const crypto = require('crypto');          // Node.js built-in module for cryptographic functions
const Database = require('./database');    // Our custom database class (imports from database.js)

// ===== SERVER SETUP =====
const app = express();                     // Create an Express application instance
const PORT = process.env.PORT || 3000;     // Set server port: use environment variable OR default to 3000

// ===== DATABASE INITIALIZATION =====
// Initialize database
const db = new Database();                 // Create a new database instance (connects to SQLite)

// ===== MIDDLEWARE CONFIGURATION =====
// Middleware runs between receiving a request and sending a response
app.use(cors());                          // Enable CORS - allows requests from different domains/ports
app.use(bodyParser.json());               // Parse JSON data from request bodies
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static files from frontend folder

// ===== UTILITY FUNCTIONS =====

/**
 * Generate a secure random token for user sessions
 * @returns {string} A 64-character hexadecimal string
 */
// Generate random token
const generateToken = () => {
    // crypto.randomBytes(32) creates 32 random bytes
    // .toString('hex') converts those bytes to a hexadecimal string (64 characters)
    return crypto.randomBytes(32).toString('hex');
};

// ===== AUTHENTICATION MIDDLEWARE =====
/**
 * Middleware to check if user is authenticated before accessing protected routes
 * This function runs before any protected API endpoint
 */
// Authentication middleware
const authenticateAdmin = async (req, res, next) => {
    // Get the Authorization header from the request (format: "Bearer <token>")
    const authHeader = req.headers.authorization;
    
    // Check if authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    // Extract the token by removing "Bearer " (first 7 characters)
    const token = authHeader.substring(7);
    
    try {
        // Validate the token against the database
        const session = await db.validateSession(token);
        
        // If no valid session found, reject the request
        if (!session) {
            return res.status(401).json({ error: 'Invalid or expired token.' });
        }
        
        // If valid, attach user info to the request object for use in route handlers
        req.user = {
            id: session.user_id,
            username: session.username,
            fullName: session.full_name,
            role: session.role
        };
        
        // Continue to the next middleware/route handler
        next();
    } catch (error) {
        // If any error occurs during validation, log it and return error
        console.error('Authentication error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};

// ===== AUTHENTICATION ROUTES =====

/**
 * POST /api/auth/register - Create a new user account
 * Body: { fullName, email, username, password }
 */
// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        // Extract user data from request body
        const { fullName, email, username, password } = req.body;
        
        // Validation: Check if all required fields are provided
        // Validation
        if (!fullName || !email || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        
        // Validation: Password length check
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }
        
        // Create new user in database (password will be hashed in database.js)
        const user = await db.createUser({ fullName, email, username, password });
        
        // Return success response with user info (excluding password)
        res.status(201).json({ 
            success: true, 
            message: 'Account created successfully',
            user: { id: user.id, username: user.username, email: user.email, fullName: user.fullName }
        });
    } catch (error) {
        // Handle database constraint errors (duplicate username/email)
        if (error.message.includes('UNIQUE constraint failed')) {
            if (error.message.includes('username')) {
                res.status(400).json({ error: 'Username already exists' });
            } else if (error.message.includes('email')) {
                res.status(400).json({ error: 'Email already exists' });
            } else {
                res.status(400).json({ error: 'User already exists' });
            }
        } else {
            // Handle any other errors
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }
});

/**
 * POST /api/auth/login - Authenticate user and create session
 * Body: { username, password }
 */
app.post('/api/auth/login', async (req, res) => {
    try {
        // Extract login credentials from request body
        const { username, password } = req.body;
        
        // Validation: Check if credentials are provided
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        
        // Validate credentials against database
        const user = await db.validateUser(username, password);
        
        // If credentials are invalid, return error
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Generate a new session token
        const token = generateToken();
        // Set token expiration to 24 hours from now
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        // Create session in database
        await db.createSession(user.id, token, expiresAt.toISOString());
        
        // Return success response with token and user info
        res.json({ 
            success: true, 
            token,
            user: {
                id: user.id,
                username: user.username,
                fullName: user.full_name,
                email: user.email
            },
            message: 'Login successful'
        });
    } catch (error) {
        // Handle any login errors
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * GET /api/auth/verify - Check if current token is valid
 * Headers: Authorization: Bearer <token>
 */
app.get('/api/auth/verify', authenticateAdmin, (req, res) => {
    // If we reach here, the authenticateAdmin middleware passed
    // This means the token is valid and req.user is populated
    res.json({ 
        success: true, 
        message: 'Token is valid',
        user: req.user  // User info attached by authenticateAdmin middleware
    });
});

/**
 * POST /api/auth/logout - End user session
 * Headers: Authorization: Bearer <token>
 */
app.post('/api/auth/logout', authenticateAdmin, async (req, res) => {
    try {
        // Extract token from authorization header
        const authHeader = req.headers.authorization;
        const token = authHeader.substring(7);
        
        // Delete the session from database
        await db.deleteSession(token);
        
        // Return success response
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        // Handle logout errors
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Logout failed' });
    }
});

// ===== EVENT MANAGEMENT ROUTES =====

/**
 * GET /api/events - Get all events (public route - no authentication required)
 */
// Event Routes

// Get all events (public)
app.get('/api/events', async (req, res) => {
    try {
        // Fetch all events from database
        const events = await db.getAllEvents();
        
        // Return events as JSON
        res.json(events);
    } catch (error) {
        // Handle database errors
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

/**
 * GET /api/events/type/:type - Get events by type (public route)
 * URL parameter: type (e.g., 'assignment', 'webinar', 'workshop')
 */
// Get events by type (public)
app.get('/api/events/type/:type', async (req, res) => {
    try {
        // Get the event type from URL parameter and fetch events of specific type
        const events = await db.getEventsByType(req.params.type);
        
        // Return filtered events
        res.json(events);
    } catch (error) {
        // Handle database errors
        console.error('Error fetching events by type:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

/**
 * POST /api/events - Create a new event (protected route - requires authentication)
 * Headers: Authorization: Bearer <token>
 * Body: { title, description, date, time, type }
 */
// Add new event (protected)
app.post('/api/events', authenticateAdmin, async (req, res) => {
    try {
        // Create new event in database
        // req.body contains event data, req.user.id is the creator's ID
        const event = await db.createEvent(req.body, req.user.id);
        
        // Return the created event
        res.status(201).json(event);
    } catch (error) {
        // Handle event creation errors
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

/**
 * PUT /api/events/:id - Update an existing event (protected route)
 * URL parameter: id (event ID)
 * Headers: Authorization: Bearer <token>
 * Body: Updated event data
 */
// Update event (protected)
app.put('/api/events/:id', authenticateAdmin, async (req, res) => {
    try {
        // Get event ID from URL parameter and update event in database
        const event = await db.updateEvent(req.params.id, req.body);
        
        // Return updated event
        res.json(event);
    } catch (error) {
        // Handle specific error for event not found
        if (error.message === 'Event not found') {
            res.status(404).json({ error: 'Event not found' });
        } else {
            // Handle other update errors
            console.error('Error updating event:', error);
            res.status(500).json({ error: 'Failed to update event' });
        }
    }
});

/**
 * DELETE /api/events/:id - Delete an event (protected route)
 * URL parameter: id (event ID)
 * Headers: Authorization: Bearer <token>
 */
// Delete event (protected)
app.delete('/api/events/:id', authenticateAdmin, async (req, res) => {
    try {
        // Get event ID from URL parameter and delete event from database
        await db.deleteEvent(req.params.id);
        
        // Return success message
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        // Handle specific error for event not found
        if (error.message === 'Event not found') {
            res.status(404).json({ error: 'Event not found' });
        } else {
            // Handle other deletion errors
            console.error('Error deleting event:', error);
            res.status(500).json({ error: 'Failed to delete event' });
        }
    }
});

// ===== FRONTEND SERVING ROUTES =====

/**
 * GET / - Serve the main calendar page
 */
// Serve frontend
app.get('/', (req, res) => {
    // Send the main index.html file from the frontend directory
    // Note: This should point to '../frontend' not 'public'
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * GET /admin.html - Redirect to login page
 * This prevents direct access to admin panel without authentication
 */
// Redirect admin.html to login if not authenticated
app.get('/admin.html', (req, res) => {
    // Redirect users to login page
    res.redirect('/login.html');
});

/**
 * GET /admin-panel.html - Serve admin panel
 * Note: This serves the file but the frontend will check authentication
 */
// Serve protected admin panel
app.get('/admin-panel.html', (req, res) => {
    // Send the admin panel HTML file
    // Note: This should point to '../frontend' not 'public'
    res.sendFile(path.join(__dirname, 'public', 'admin-panel.html'));
});

// ===== BACKGROUND TASKS =====

/**
 * Cleanup expired sessions every hour
 * This prevents the database from accumulating old session tokens
 */
// Cleanup expired sessions every hour
setInterval(async () => {
    try {
        // Delete expired sessions from database
        const deletedCount = await db.cleanupExpiredSessions();
        
        // Log cleanup results if any sessions were deleted
        if (deletedCount > 0) {
            console.log(`🧹 Cleaned up ${deletedCount} expired sessions`);
        }
    } catch (error) {
        // Log cleanup errors
        console.error('Error cleaning up sessions:', error);
    }
}, 60 * 60 * 1000); // Run every 60 minutes (60 * 60 * 1000 milliseconds)

// ===== START SERVER =====

/**
 * Start the server and listen for incoming requests
 */
app.listen(PORT, () => {
    // Display server startup information
    console.log(`🚀 Event Calendar Server running on http://localhost:${PORT}`);
    console.log(`📅 Calendar available at http://localhost:${PORT}`);
    console.log(`🔐 Admin login at http://localhost:${PORT}/login.html`);
    console.log(`👤 Register admin at http://localhost:${PORT}/register.html`);
    console.log(`⚙️  Admin panel at http://localhost:${PORT}/admin-panel.html (login required)`);
    console.log(`🗄️  Database: SQLite (boxo_calendar.db)`);
});

// ============================================================================
// END OF BACKEND SERVER
// ============================================================================
