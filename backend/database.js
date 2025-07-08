// ============================================================================
// BOXO EVENT CALENDAR - DATABASE CLASS
// ============================================================================
// This file contains the Database class that handles all database operations:
// 1. SQLite database connection and table creation
// 2. User management (create, validate, authentication)
// 3. Session management (login tokens, expiration)
// 4. Event management (CRUD operations)
// 5. Data security (password hashing, input validation)
// ============================================================================

// ===== IMPORTS & DEPENDENCIES =====
const sqlite3 = require('sqlite3').verbose();  // SQLite database driver - .verbose() enables detailed error reporting
const bcrypt = require('bcrypt');              // Password hashing library for secure password storage
const path = require('path');                  // Node.js utility for working with file paths

// ===== DATABASE CLASS DEFINITION =====
class Database {
    /**
     * Constructor - Initialize database connection and create tables
     */
    constructor() {
        // Create SQLite database connection
        // path.join(__dirname, 'boxo_calendar.db') creates full path to database file
        this.db = new sqlite3.Database(path.join(__dirname, 'boxo_calendar.db'));
        
        // Initialize database tables when class is instantiated
        this.initializeTables();
    }

    /**
     * Create all necessary database tables if they don't exist
     * @returns {Promise} Resolves when all tables are created
     */
    async initializeTables() {
        return new Promise((resolve, reject) => {
            // serialize() ensures all database operations run in sequence
            this.db.serialize(() => {
                
                // ===== CREATE USERS TABLE =====
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Unique user ID (auto-generated)
                        username TEXT UNIQUE NOT NULL,           -- Username (must be unique)
                        email TEXT UNIQUE NOT NULL,              -- Email address (must be unique)
                        password_hash TEXT NOT NULL,             -- Hashed password (never store plain text)
                        full_name TEXT NOT NULL,                 -- User's full name
                        role TEXT DEFAULT 'admin',               -- User role (default: admin)
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Account creation time
                        last_login DATETIME,                     -- Last login timestamp
                        is_active BOOLEAN DEFAULT 1              -- Account status (1=active, 0=disabled)
                    )
                `, (err) => {
                    if (err) console.error('Error creating users table:', err);
                });

                // ===== CREATE EVENTS TABLE =====
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS events (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Unique event ID
                        title TEXT NOT NULL,                     -- Event title
                        description TEXT NOT NULL,               -- Event description
                        date DATE NOT NULL,                      -- Event date (YYYY-MM-DD)
                        time TIME NOT NULL,                      -- Event time (HH:MM)
                        type TEXT NOT NULL CHECK(type IN ('assignment', 'webinar', 'workshop')), -- Event type (restricted values)
                        created_by INTEGER,                      -- User ID who created the event
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Event creation time
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Last update time
                        FOREIGN KEY (created_by) REFERENCES users (id)  -- Link to users table
                    )
                `, (err) => {
                    if (err) console.error('Error creating events table:', err);
                });

                // ===== CREATE SESSIONS TABLE =====
                // This table manages user login sessions and authentication tokens
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS sessions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,    -- Unique session ID
                        user_id INTEGER NOT NULL,                -- User ID this session belongs to
                        token TEXT UNIQUE NOT NULL,              -- Unique session token
                        expires_at DATETIME NOT NULL,            -- When this session expires
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Session creation time
                        FOREIGN KEY (user_id) REFERENCES users (id)     -- Link to users table
                    )
                `, (err) => {
                    if (err) console.error('Error creating sessions table:', err);
                });

                // Create a demo admin user for testing
                this.createDemoAdmin();
                resolve(); // Signal that initialization is complete
            });
        });
    }

    /**
     * Create a default admin user for the system
     * This allows immediate access without requiring user registration
     */
    async createDemoAdmin() {
        const saltRounds = 10; // bcrypt salt rounds - higher = more secure but slower
        
        // Hash the default password 'boxo2025' for security
        const hashedPassword = await bcrypt.hash('boxo2025', saltRounds);
        
        // Insert demo admin user (OR IGNORE prevents duplicate insertion)
        this.db.run(`
            INSERT OR IGNORE INTO users (username, email, password_hash, full_name, role)
            VALUES (?, ?, ?, ?, ?)
        `, ['admin', 'admin@boxo.com', hashedPassword, 'System Administrator', 'admin'], (err) => {
            if (err && !err.message.includes('UNIQUE constraint failed')) {
                console.error('Error creating demo admin:', err);
            } else if (!err) {
                console.log('✅ Demo admin user created successfully');
                console.log('   Username: admin');
                console.log('   Password: boxo2025');
            }
        });
    }

    // ===== USER MANAGEMENT METHODS =====

    /**
     * Create a new user account
     * @param {Object} userData - User information {username, email, password, fullName}
     * @returns {Promise<Object>} Created user object (without password)
     */
    async createUser(userData) {
        // Destructure user data from input object
        const { username, email, password, fullName } = userData;
        
        // Hash the password for secure storage
        const saltRounds = 10; // bcrypt complexity setting
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        return new Promise((resolve, reject) => {
            // Insert new user into database
            this.db.run(`
                INSERT INTO users (username, email, password_hash, full_name)
                VALUES (?, ?, ?, ?)
            `, [username, email, hashedPassword, fullName], function(err) {
                if (err) {
                    // Database error (e.g., duplicate username/email)
                    reject(err);
                } else {
                    // Success - return user info without password
                    resolve({ 
                        id: this.lastID,  // Auto-generated user ID
                        username, 
                        email, 
                        fullName 
                    });
                }
            });
        });
    }

    /**
     * Validate user login credentials
     * @param {string} username - Username to check
     * @param {string} password - Plain text password to verify
     * @returns {Promise<Object|null>} User object if valid, null if invalid
     */
    async validateUser(username, password) {
        return new Promise((resolve, reject) => {
            // Find user by username (only active users)
            this.db.get(`
                SELECT * FROM users WHERE username = ? AND is_active = 1
            `, [username], async (err, user) => {
                if (err) {
                    // Database error
                    reject(err);
                } else if (!user) {
                    // No user found with this username
                    resolve(null);
                } else {
                    // User found - verify password
                    const isValid = await bcrypt.compare(password, user.password_hash);
                    
                    if (isValid) {
                        // Password matches - update last login time
                        this.db.run(`
                            UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?
                        `, [user.id]);
                        
                        // Return user object
                        resolve(user);
                    } else {
                        // Password doesn't match
                        resolve(null);
                    }
                }
            });
        });
    }

    // ===== SESSION MANAGEMENT METHODS =====

    /**
     * Create a new user session (login token)
     * @param {number} userId - User ID
     * @param {string} token - Unique session token
     * @param {string} expiresAt - When this session expires (ISO string)
     * @returns {Promise<Object>} Session object with ID
     */
    async createSession(userId, token, expiresAt) {
        return new Promise((resolve, reject) => {
            // Insert new session into database
            this.db.run(`
                INSERT INTO sessions (user_id, token, expires_at)
                VALUES (?, ?, ?)
            `, [userId, token, expiresAt], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Return session info
                    resolve({ id: this.lastID });
                }
            });
        });
    }

    /**
     * Validate a session token
     * @param {string} token - Session token to validate
     * @returns {Promise<Object|null>} Session+user info if valid, null if invalid/expired
     */
    async validateSession(token) {
        return new Promise((resolve, reject) => {
            // Join sessions and users tables to get complete info
            // Check that token exists, hasn't expired, and user is active
            this.db.get(`
                SELECT s.*, u.username, u.full_name, u.role 
                FROM sessions s 
                JOIN users u ON s.user_id = u.id 
                WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP AND u.is_active = 1
            `, [token], (err, session) => {
                if (err) {
                    reject(err);
                } else {
                    // Return session info (null if not found/expired)
                    resolve(session);
                }
            });
        });
    }

    /**
     * Delete a session (logout)
     * @param {string} token - Session token to delete
     * @returns {Promise<void>}
     */
    async deleteSession(token) {
        return new Promise((resolve, reject) => {
            // Remove session from database
            this.db.run(`DELETE FROM sessions WHERE token = ?`, [token], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    // ===== EVENT MANAGEMENT METHODS =====

    /**
     * Get all events from database
     * @returns {Promise<Array>} Array of all events with creator usernames
     */
    async getAllEvents() {
        return new Promise((resolve, reject) => {
            // Join events with users to get creator username
            // Order by date and time for chronological display
            this.db.all(`
                SELECT e.*, u.username as created_by_username 
                FROM events e 
                LEFT JOIN users u ON e.created_by = u.id 
                ORDER BY e.date ASC, e.time ASC
            `, (err, events) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(events);
                }
            });
        });
    }

    /**
     * Create a new event
     * @param {Object} eventData - Event information {title, description, date, time, type}
     * @param {number} createdBy - User ID of event creator
     * @returns {Promise<Object>} Created event object
     */
    async createEvent(eventData, createdBy) {
        // Extract event details from input object
        const { title, description, date, time, type } = eventData;
        
        return new Promise((resolve, reject) => {
            // Insert new event into database
            this.db.run(`
                INSERT INTO events (title, description, date, time, type, created_by)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [title, description, date, time, type, createdBy], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Return created event with generated ID
                    resolve({ 
                        id: this.lastID,  // Auto-generated event ID
                        title, 
                        description, 
                        date, 
                        time, 
                        type,
                        created_by: createdBy,
                        created_at: new Date().toISOString()
                    });
                }
            });
        });
    }

    /**
     * Update an existing event
     * @param {number} eventId - ID of event to update
     * @param {Object} eventData - Updated event data
     * @returns {Promise<Object>} Updated event object
     */
    async updateEvent(eventId, eventData) {
        const { title, description, date, time, type } = eventData;
        
        return new Promise((resolve, reject) => {
            // Update event in database and set updated_at timestamp
            this.db.run(`
                UPDATE events 
                SET title = ?, description = ?, date = ?, time = ?, type = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [title, description, date, time, type, eventId], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    // No rows were updated - event doesn't exist
                    reject(new Error('Event not found'));
                } else {
                    // Return updated event data
                    resolve({ id: eventId, title, description, date, time, type });
                }
            });
        });
    }

    /**
     * Delete an event
     * @param {number} eventId - ID of event to delete
     * @returns {Promise<void>}
     */
    async deleteEvent(eventId) {
        return new Promise((resolve, reject) => {
            // Remove event from database
            this.db.run(`DELETE FROM events WHERE id = ?`, [eventId], function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    // No rows were deleted - event doesn't exist
                    reject(new Error('Event not found'));
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Get events filtered by type
     * @param {string} type - Event type to filter by ('assignment', 'webinar', 'workshop')
     * @returns {Promise<Array>} Array of events of specified type
     */
    async getEventsByType(type) {
        return new Promise((resolve, reject) => {
            // Get events of specific type, ordered chronologically
            this.db.all(`
                SELECT e.*, u.username as created_by_username 
                FROM events e 
                LEFT JOIN users u ON e.created_by = u.id 
                WHERE e.type = ? 
                ORDER BY e.date ASC, e.time ASC
            `, [type], (err, events) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(events);
                }
            });
        });
    }

    // ===== MAINTENANCE METHODS =====

    /**
     * Remove expired sessions from database
     * This prevents the sessions table from growing indefinitely
     * @returns {Promise<number>} Number of sessions deleted
     */
    async cleanupExpiredSessions() {
        return new Promise((resolve, reject) => {
            // Delete all sessions where expiration time has passed
            this.db.run(`DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP`, function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Return number of deleted sessions
                    resolve(this.changes);
                }
            });
        });
    }

    /**
     * Close database connection
     * Should be called when application shuts down
     */
    close() {
        this.db.close();
    }
}

// ===== EXPORT MODULE =====
module.exports = Database;

// ============================================================================
// END OF DATABASE CLASS
// ============================================================================
//
// SECURITY NOTES:
// 1. Passwords are hashed using bcrypt before storage
// 2. Session tokens are randomly generated and have expiration times
// 3. SQL injection is prevented by using parameterized queries (?)
// 4. User input validation is handled in the server.js file
// 5. Only active users can authenticate
//
// DATABASE SCHEMA:
// users: id, username, email, password_hash, full_name, role, created_at, last_login, is_active
// events: id, title, description, date, time, type, created_by, created_at, updated_at
// sessions: id, user_id, token, expires_at, created_at
//
// RELATIONSHIPS:
// - events.created_by → users.id (who created the event)
// - sessions.user_id → users.id (which user owns the session)
// ============================================================================
