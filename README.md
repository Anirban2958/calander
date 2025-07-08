# 📅 Boxo Event Calendar & Notification System

<div align="center">

![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-Production%20Ready-success.svg)

**A comprehensive Event Calendar & Notification System designed for educational institutions**

*Complete event management solution with intuitive interface, secure authentication, and real-time notifications*

[🚀 Quick Start](#-quick-start) • [📖 User Guide](#-user-guide) • [🛠️ Admin Guide](#️-admin-guide) • [⚙️ Installation](#️-installation) • [🔧 API Docs](#-api-documentation)

</div>

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [⚙️ Installation](#️-installation)
- [🚀 Quick Start](#-quick-start)
- [📖 User Guide](#-user-guide)
- [🛠️ Admin Guide](#️-admin-guide)
- [🎨 Customization](#-customization)
- [🔧 API Documentation](#-api-documentation)
- [🚀 Deployment](#-deployment)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🤝 Contributing](#-contributing)

---

## 🌟 Overview

The **Boxo Event Calendar** is a full-featured web application designed specifically for educational institutions to manage and display events. It provides a clean, intuitive interface for students to view upcoming events and a powerful admin panel for event management.

### 🎯 Who is this for?

- **Educational Institutions** looking for event management solutions
- **Students** who need to track assignments, webinars, and workshops
- **Administrators** who manage educational content and schedules
- **Developers** seeking a well-documented calendar application

### 🌈 What makes it special?

- **Zero-dependency frontend** - Pure JavaScript, no frameworks required
- **Secure by design** - Industry-standard authentication and data protection
- **Mobile-first** - Responsive design that works on all devices
- **Easy deployment** - Single command setup with SQLite database
- **Comprehensive documentation** - Every line of code is explained

---

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

### 🗄️ **Database Schema**

#### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Events Table
```sql
CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Sessions Table
```sql
CREATE TABLE sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

---

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

---

## 🎨 Customization

### 🌈 **Event Types and Styling**

The system supports three main event types, each with distinct visual styling:

| **Type** | **Icon** | **Color** | **CSS Class** | **Use Cases** |
|----------|----------|-----------|---------------|---------------|
| **📄 Assignment** | `fas fa-file-alt` | Red (#ff6b6b) | `.assignment` | Homework, projects, deadlines, submissions |
| **🎥 Webinar** | `fas fa-video` | Green (#48bb78) | `.webinar` | Online lectures, live streams, presentations |
| **🛠️ Workshop** | `fas fa-tools` | Orange (#ed8936) | `.workshop` | Hands-on sessions, labs, practical work |

### 🎨 **Customizing Colors and Appearance**

#### 📝 **Modifying Event Colors**

To change event colors, edit the CSS variables in `frontend/styles.css`:

```css
/* Event Type Colors */
:root {
    --assignment-color: #ff6b6b;    /* Red for assignments */
    --webinar-color: #48bb78;       /* Green for webinars */  
    --workshop-color: #ed8936;      /* Orange for workshops */
}
```

#### 🎭 **Changing Icons**

Event icons use FontAwesome classes. To modify them, update the icon classes in `frontend/calendar.js`:

```javascript
// Event type icon mapping
const eventIcons = {
    'assignment': 'fas fa-file-alt',     // Document icon
    'webinar': 'fas fa-video',           // Video icon
    'workshop': 'fas fa-tools'           // Tools icon
};
```

#### 🖼️ **Adding New Event Types**

1. **Update the database enum** (if using strict typing)
2. **Add new color variable** in CSS
3. **Define new icon** in JavaScript
4. **Update form dropdown** in admin panel
5. **Add styling rules** for the new type

### 🎯 **UI Customization Options**

#### 🌈 **Theme Colors**

Main application colors can be modified in the CSS root variables:

```css
:root {
    --primary-color: #667eea;        /* Main blue */
    --secondary-color: #764ba2;      /* Purple accent */
    --success-color: #48bb78;        /* Green for success */
    --danger-color: #f56565;         /* Red for danger */
    --warning-color: #ed8936;        /* Orange for warnings */
}
```

#### 📱 **Layout Modifications**

- **Calendar Grid**: Modify in `.calendar-grid` class
- **Sidebar Width**: Adjust `.events-sidebar` width
- **Card Styling**: Update `.event-card` properties
- **Modal Appearance**: Customize `.modal` classes

### 🔧 **Configuration Options**

#### ⏰ **Notification Timing**

Modify notification schedules in `frontend/calendar.js`:

```javascript
// Notification timing (in milliseconds)
const NOTIFICATION_TIMES = {
    firstReminder: 24 * 60 * 60 * 1000,  // 24 hours
    secondReminder: 60 * 60 * 1000        // 1 hour
};
```

#### 🗄️ **Database Configuration**

Database settings can be modified in `backend/database.js`:

```javascript
// Database configuration
const DB_CONFIG = {
    filename: 'boxo_calendar.db',      // Database file name
    mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    verbose: console.log               // Enable query logging
};
```

#### 🌐 **Server Configuration**

Server settings in `backend/server.js`:

```javascript
// Server configuration
const CONFIG = {
    port: process.env.PORT || 3000,    // Server port
    sessionTimeout: 24 * 60 * 60 * 1000,  // 24 hours
    corsOrigins: ['http://localhost:3000']  // Allowed origins
};
```

---

## 🔒 **Security Features**

- ✅ **Password Hashing**: bcrypt with salt rounds
- ✅ **Session Tokens**: Secure authentication tokens
- ✅ **Input Validation**: Server-side data validation
- ✅ **SQL Injection Protection**: Prepared statements
- ✅ **CORS Configuration**: Controlled cross-origin requests
- ✅ **Session Expiration**: Automatic timeout handling

---

## 🛡️ **API Documentation**

### **🔓 Public Endpoints**
```http
GET  /api/events                    # Retrieve all events
```

### **🔒 Protected Endpoints (Admin Only)**
```http
POST   /api/auth/register           # Register new admin
POST   /api/auth/login              # Admin login
GET    /api/auth/verify             # Verify session
POST   /api/auth/logout             # Admin logout

POST   /api/events                  # Create new event
PUT    /api/events/:id              # Update existing event
DELETE /api/events/:id              # Delete event
```

### **📋 Event Object Schema**
```json
{
  "id": 1,
  "title": "JavaScript Workshop",
  "description": "Advanced JavaScript concepts and best practices",
  "date": "2025-07-15",
  "time": "14:00",
  "type": "workshop"
}
```

---

## 📱 **Browser Compatibility**

| **Browser** | **Version** | **Status** |
|-------------|-------------|------------|
| **Chrome** | ≥ 88 | ✅ Fully Supported |
| **Firefox** | ≥ 85 | ✅ Fully Supported |
| **Safari** | ≥ 14 | ✅ Fully Supported |
| **Edge** | ≥ 88 | ✅ Fully Supported |

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

---

## 🚀 **Deployment**

### **📦 Production Build**
```bash
cd backend
npm install --production
npm start
```

### **🌐 Hosting Options**
- **Heroku**: Simple deployment with SQLite
- **Vercel**: Frontend + Serverless functions
- **DigitalOcean**: Full control VPS deployment
- **AWS**: EC2 or Elastic Beanstalk

---

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

## 🛣️ **Roadmap**

### **🎯 Version 1.1** (Planned)
- [ ] Email notifications
- [ ] Event attachments
- [ ] Recurring events
- [ ] Event categories/tags

### **🎯 Version 2.0** (Future)
- [ ] User roles & permissions
- [ ] Calendar export (ICS)
- [ ] Mobile app
- [ ] Advanced analytics

---

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

### **📝 Development Guidelines**
- Follow existing code style
- Test all functionality
- Update documentation
- Ensure mobile responsiveness

---

## 📄 License

This project is licensed under the **MIT License**.

### What this means:
- ✅ **Commercial use** - You can use this for commercial projects
- ✅ **Modification** - You can modify the code as needed
- ✅ **Distribution** - You can distribute original or modified versions
- ✅ **Private use** - You can use privately without sharing changes
- ❗ **License and copyright notice** - Must include MIT license in distributions
- ❗ **No warranty** - Software provided "as is" without guarantees

---

## 🙏 Acknowledgments

### 🛠️ **Technology Partners**
- **[FontAwesome](https://fontawesome.com/)** - Professional iconography system
- **[Google Fonts](https://fonts.google.com/)** - Inter typography family
- **[Express.js](https://expressjs.com/)** - Fast, unopinionated web framework
- **[SQLite](https://www.sqlite.org/)** - Reliable, embedded database engine

### 👥 **Community**
- **Open Source Community** - For inspiration and best practices
- **Educational Sector** - For feedback and real-world testing
- **Developer Community** - For code reviews and suggestions

### 🎓 **Educational Impact**
This project was designed with educational institutions in mind, helping to:
- **Streamline event management** for administrators
- **Improve student engagement** with timely notifications
- **Reduce missed deadlines** through proactive reminders
- **Enhance communication** between educators and students

---

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

## 🎓 Built with ❤️ for Education

**Boxo Event Calendar & Notification System**

*Empowering educational institutions with modern event management*

---

### 📊 **Project Stats**

![Lines of Code](https://img.shields.io/badge/Lines%20of%20Code-2000%2B-blue)
![Files](https://img.shields.io/badge/Files-8-green)
![Documentation](https://img.shields.io/badge/Documentation-100%25-brightgreen)
![Test Coverage](https://img.shields.io/badge/Comments-Comprehensive-yellow)

---

### 🌐 **Quick Links**

**🚀 [Get Started](#-quick-start)** • **📖 [User Guide](#-user-guide)** • **🛠️ [Admin Guide](#️-admin-guide)** • **🔧 [API Docs](#-api-documentation)**

**📱 [Mobile Guide](#-user-guide)** • **🎨 [Customize](#-customization)** • **🚀 [Deploy](#-deployment)** • **🤝 [Contribute](#-contributing)**

---

### 📞 **Support & Contact**

- **📧 Technical Support**: [support@boxo.com](mailto:support@boxo.com)
- **💬 Community**: [Join our discussions](https://github.com/boxo/discussions)
- **🐛 Bug Reports**: [Report issues](https://github.com/boxo/issues)
- **💡 Feature Requests**: [Suggest features](https://github.com/boxo/issues/new)

---

**Last Updated:** July 8, 2025 | **Version:** 1.0.0 | **Status:** ✅ Production Ready

*Made with passion for education technology*

</div>
