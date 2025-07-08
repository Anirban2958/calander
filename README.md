 # 📅 Boxo Event Calendar & Notification System

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)

**A comprehensive Event Calendar & Notification System designed for educational institutions**

*Complete event management solution with intuitive interface, secure authentication, and real-time notifications*

[🚀 Quick Start](#-quick-start) • [📖 User Guide](#-user-guide) • [🛠️ Admin Guide](#️-admin-guide) • [⚙️ Installation](#️-installation) • [🔧 API Docs](#-api-documentation)

</div>

## 🚀 Quick Start
## 🌟 Overview

The **Boxo Event Calendar** is a full-featured web application designed specifically for educational institutions to manage and display events. It provides a clean, intuitive interface for students to view upcoming events and a powerful admin panel for event management.

## ✨ Key Features

### �‍🎓 **Student Experience**
- � **Interactive Monthly Calendar** - Navigate through months with smooth animations
- 🎯 **Smart Event Filtering** - Filter by Assignments, Webinars, or Workshops
- 📱 **Mobile-Responsive Design** - Perfect experience on phones, tablets, and desktops
- 🔔 **Browser Notifications** - Get reminded 24 hours and 1 hour before events
- 🎨 **Color-Coded Events** - Instantly recognize event types with distinct colors
- 👁️ **Detailed Event Views** - Click any event to see full description and timing
- 🚀 **Fast Loading** - Optimized performance with no external dependencies

### 🛡️ **Administrator Features**
- 🔐 **Secure Login System** - Protected with bcrypt password hashing
- ➕ **Complete Event Management** - Create, edit, update, and delete events
- � **Real-time Dashboard** - View statistics and today's events at a glance
- 🔍 **Advanced Search** - Find events quickly with powerful search functionality
- � **Multi-Admin Support** - Register multiple administrators safely
- 📈 **Event Analytics** - Track event types and distribution
- 🛡️ **Session Management** - Automatic logout and security features

### 🔧 **Technical Highlights**
- 🗄️ **SQLite Database** - No complex database setup required
- 🌐 **RESTful API** - Clean, documented API endpoints
- 🎨 **Modern CSS** - Flexbox and Grid layouts with smooth animations
- 📱 **Progressive Web App Ready** - Offline capabilities and app-like experience
- � **Security First** - Input validation, SQL injection protection, CORS handling
- 📝 **Comprehensive Logging** - Detailed error handling and debugging information

---

## 🏗️ System Architecture

### � **Project Structure Explained**
```
boxo-calendar/
├── � README.md                    # This comprehensive guide
├── 📋 FILE_ANALYSIS.md             # Detailed file organization documentation
│
├── 🔧 backend/                     # Server-side application
│   ├── 🚀 server.js               # Main Express.js server and API routes
│   ├── 🗄️ database.js             # SQLite database connection and operations
│   ├── 📦 package.json            # Node.js dependencies and project metadata
│   ├── 🔒 package-lock.json       # Dependency version lock file
│   ├── 💾 boxo_calendar.db        # SQLite database file (auto-generated)
│   └── 📁 node_modules/           # Installed Node.js packages
│
├── 🎨 frontend/                    # Client-side application
│   ├── 🏠 index.html              # Main calendar interface for students
│   ├── 🔐 login.html              # Administrator login page
│   ├── 👤 register.html           # Administrator registration page
│   ├── ⚙️ admin-panel.html        # Admin dashboard and event management
│   ├── 🎨 styles.css              # Complete styling system for all pages
│   ├── 📅 calendar.js             # Interactive calendar functionality
│   └── 🛡️ admin-protected.js      # Protected admin operations and UI
│
└── ⚙️ .vscode/                     # Development environment configuration
    └── 📋 tasks.json              # VS Code build and run tasks
```

### 🛠️ **Technology Stack Deep Dive**

#### Backend Technologies
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Runtime** | Node.js | ≥14.0.0 | JavaScript execution environment |
| **Framework** | Express.js | ^5.1.0 | Web server and API routing |
| **Database** | SQLite | ^5.1.7 | Embedded SQL database |
| **Security** | bcrypt | ^6.0.0 | Password hashing and verification |
| **Middleware** | body-parser | ^2.2.0 | HTTP request body parsing |
| **CORS** | cors | ^2.8.5 | Cross-origin resource sharing |

#### Frontend Technologies
| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Core** | Vanilla JavaScript | ES6+ | Interactive functionality |
| **Styling** | CSS3 | Latest | Modern responsive design |
| **Layout** | Flexbox & Grid | Latest | Flexible responsive layouts |
| **Icons** | FontAwesome | 6.4.0 | Professional iconography |
| **Fonts** | Inter | Latest | Modern typography system |
| **Notifications** | Browser API | Native | Real-time user alerts |


## ⚙️ Installation

### 📋 **System Requirements**

Before you begin, ensure you have the following installed on your system:

- **Node.js** version 14.0.0 or higher ([Download here](https://nodejs.org/))
- **npm** (comes bundled with Node.js)
- **Modern web browser** (Chrome 88+, Firefox 85+, Safari 14+, or Edge 88+)
- **Text editor** (VS Code recommended for development)

### 🔍 **Check Your System**

Verify your installation by running these commands in your terminal:

```bash
# Check Node.js version
node --version
# Should output: v14.0.0 or higher

# Check npm version
npm --version
# Should output: 6.0.0 or higher
```

### 📥 **Download the Project**

#### Option 1: Direct Download
1. Download the project files to your computer
2. Extract the files to a folder (e.g., `boxo-calendar`)

#### Option 2: Git Clone (if using version control)
```bash
git clone <repository-url>
cd boxo-calendar
```

### 🔧 **Install Dependencies**

Navigate to the backend folder and install required packages:

```bash
# Navigate to the backend directory
cd backend

# Install all required dependencies
npm install
```

This command will install:
- Express.js (web server)
- SQLite3 (database)
- bcrypt (password security)
- CORS (cross-origin requests)
- body-parser (request handling)

### 🗄️ **Database Setup**

The SQLite database will be created automatically when you first run the server. No manual database setup is required!

---

## 🚀 Quick Start

### 🎬 **Step-by-Step Launch**

1. **Open Terminal/Command Prompt**
   ```bash
   cd path/to/boxo-calendar/backend
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Look for Success Message**
   ```
   Server running on http://localhost:3000
   Database connected successfully
   ```

4. **Open Your Browser**
   - Main Calendar: http://localhost:3000
   - Admin Login: http://localhost:3000/login.html

### 🎯 **Default Admin Account**

For your first login, use these credentials:
```
Username: admin
Password: boxo2025
```

**⚠️ Important:** Change this password immediately after first login!

### 🌐 **Application URLs**

| Page | URL | Purpose |
|------|-----|---------|
| **Student Calendar** | `http://localhost:3000` | Main calendar view for students |
| **Admin Login** | `http://localhost:3000/login.html` | Administrator authentication |
| **Admin Registration** | `http://localhost:3000/register.html` | Create new admin accounts |
| **Admin Dashboard** | `http://localhost:3000/admin-panel.html` | Event management interface |

---

## 📖 User Guide

### 🎓 **For Students and General Users**

#### 📅 **Viewing the Calendar**

1. **Navigate to the Main Page**
   - Open `http://localhost:3000` in your browser
   - The current month's calendar will display automatically

2. **Navigate Between Months**
   - Click the **left arrow (◀)** to go to the previous month
   - Click the **right arrow (▶)** to go to the next month
   - The month and year are displayed at the top

3. **Understanding Event Display**
   - **Red dots** = Assignments and deadlines
   - **Green dots** = Webinars and online sessions  
   - **Orange dots** = Workshops and hands-on activities
   - Numbers on dates show how many events occur that day

#### 🔍 **Filtering Events**

1. **Event Type Filters**
   - **All Events**: Shows all upcoming events (default view)
   - **Assignments**: Shows only assignments and deadlines
   - **Webinars**: Shows only webinars and online sessions
   - **Workshops**: Shows only workshops and practical sessions

2. **How to Filter**
   - Click any filter button at the top of the events list
   - The calendar and events list will update automatically
   - Active filter is highlighted in color

#### 📱 **Getting Notifications**

1. **Enable Browser Notifications**
   - Click the **"Enable Notifications"** button
   - Allow notifications when your browser asks
   - You'll see a confirmation message

2. **Notification Timing**
   - **24 hours before** an event starts
   - **1 hour before** an event starts
   - Notifications include event title and start time

#### 👁️ **Viewing Event Details**

1. **Click on Any Event** in the events list
2. **Event Modal Will Show:**
   - Event title and description
   - Date and time
   - Event type with appropriate icon
   - Color-coded based on event type

#### 📱 **Mobile Usage**

The calendar is fully responsive and works perfectly on mobile devices:
- **Touch navigation** for month switching
- **Tap events** to view details
- **Responsive layout** adapts to screen size
- **Optimized performance** for mobile browsers

---

## 🛠️ Admin Guide

### 🔐 **Administrator Authentication**

#### 🚪 **Logging In**

1. **Navigate to Admin Login**
   - Go to `http://localhost:3000/login.html`
   - Enter your username and password
   - Click **"Login"** button

2. **First-Time Login**
   - Use default credentials: `admin` / `boxo2025`
   - **Important**: Change password immediately after first login

3. **Security Features**
   - Sessions expire automatically for security
   - Invalid login attempts are logged
   - Passwords are securely hashed (never stored in plain text)

#### 👤 **Creating New Admin Accounts**

1. **Navigate to Registration**
   - Go to `http://localhost:3000/register.html`
   - Must be logged in as existing admin

2. **Registration Requirements**
   - **Username**: 3-20 characters, alphanumeric only
   - **Password**: Minimum 8 characters
   - **Confirmation**: Must match password exactly

3. **Account Creation Process**
   - Fill out the registration form
   - Click **"Register"** button
   - New admin can immediately log in

### 📊 **Admin Dashboard Overview**

#### 🎛️ **Dashboard Components**

1. **Statistics Cards**
   - **Total Events**: Shows count of all events in system
   - **Assignments**: Count of assignment-type events
   - **Webinars**: Count of webinar-type events
   - **Workshops**: Count of workshop-type events

2. **Today's Events Section**
   - Shows all events scheduled for today
   - Updates automatically based on current date
   - Quick overview for daily planning

3. **Event Management Interface**
   - Create new events
   - Edit existing events
   - Delete events
   - Search through all events

### ➕ **Creating Events**

#### 📝 **Event Creation Process**

1. **Click "Create Event" Button**
2. **Fill Out Event Form:**
   - **Title**: Descriptive name for the event (required)
   - **Description**: Detailed information about the event
   - **Date**: Select date using date picker
   - **Time**: Set start time in HH:MM format
   - **Type**: Choose from dropdown (Assignment, Webinar, Workshop)

3. **Submit Event**
   - Click **"Create Event"** button
   - Event appears immediately in calendar
   - Success notification confirms creation

#### ✅ **Event Validation Rules**

- **Title**: Must be 1-100 characters long
- **Date**: Cannot be in the past
- **Time**: Must be valid 24-hour format (HH:MM)
- **Type**: Must be one of the three valid types
- **Description**: Optional, but recommended for clarity

### ✏️ **Editing Events**

#### 🔄 **Edit Process**

1. **Find the Event**
   - Use search box to locate event quickly
   - Or scroll through the events list

2. **Click Edit Button**
   - Click the blue **"Edit"** button next to event
   - Form pre-fills with current event data

3. **Make Changes**
   - Modify any field as needed
   - All validation rules still apply

4. **Save Changes**
   - Click **"Update Event"** button
   - Changes are reflected immediately

### 🗑️ **Deleting Events**

#### ❌ **Deletion Process**

1. **Locate Event** to delete
2. **Click Red "Delete" Button**
3. **Confirm Deletion** in popup dialog
4. **Event Removed** immediately from system

**⚠️ Warning**: Deletion is permanent and cannot be undone!

### 🔍 **Searching Events**

#### 🔎 **Search Functionality**

1. **Search Box Location**: Top of admin panel
2. **Search Criteria**: Searches through:
   - Event titles
   - Event descriptions
   - Event types

3. **Real-Time Results**: Updates as you type
4. **Clear Search**: Delete search text to show all events

### 🔐 **Session Management**

#### 🕐 **Session Security**

- **Automatic Timeout**: Sessions expire after inactivity
- **Secure Tokens**: Each session uses unique, secure tokens
- **Manual Logout**: Always log out when finished
- **Session Verification**: Each admin action verifies valid session

#### 🚪 **Logging Out**

1. Click **"Logout"** button in navigation
2. Session is invalidated immediately
3. Redirected to login page
4. Must log in again to access admin features


**Required Features:**
- ES6+ JavaScript support
- CSS Grid & Flexbox
- Browser Notifications API
- Local Storage

---

## 🔧 **Configuration**

### **Environment Variables**
```bash
PORT=3000                    # Server port (default: 3000)
NODE_ENV=production          # Environment mode
```

### **Database Configuration**
- **Type**: SQLite
- **File**: `backend/boxo_calendar.db`
- **Auto-creation**: Yes
- **Tables**: users, events, sessions

-
## 🚀 **Deployment**

### **📦 Production Build**
```bash
cd backend
npm install --production
npm start
```

## � **Troubleshooting**

### **Common Issues**

**Server won't start**
```bash
# Check if port 3000 is available
netstat -an | findstr 3000

# Install dependencies
cd backend && npm install
```

**Database errors**
```bash
# Database auto-creates, check permissions
ls -la backend/boxo_calendar.db
```

**Authentication issues**
```bash
# Clear browser storage
localStorage.clear()
```

---


## 📄 License

This project is licensed under the **MIT License**.


## 🔮 Future Roadmap

### 🎯 **Version 1.1** (Next Release)
- [ ] **Email Notifications** - Send event reminders via email
- [ ] **Event Attachments** - Upload files to events (PDFs, documents)
- [ ] **Recurring Events** - Weekly/monthly repeating events
- [ ] **Event Categories** - Custom tags and color coding
- [ ] **Calendar Export** - Download as ICS format
- [ ] **Bulk Operations** - Import/export multiple events

### 🚀 **Version 2.0** (Future Vision)
- [ ] **User Roles** - Student/Teacher/Admin permission levels
- [ ] **Multi-tenant** - Support multiple institutions
- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **Advanced Analytics** - Attendance tracking, engagement metrics
- [ ] **Integration APIs** - Connect with LMS systems (Moodle, Canvas)
- [ ] **Real-time Updates** - WebSocket-based live updates

### 🌟 **Long-term Goals**
- [ ] **AI-powered Scheduling** - Smart event conflict detection
- [ ] **Accessibility Features** - Full WCAG 2.1 compliance
- [ ] **Offline Support** - Progressive Web App capabilities
- [ ] **Multi-language** - Internationalization support
- [ ] **Advanced Notifications** - SMS, Slack, Discord integrations

---

<div align="center">

