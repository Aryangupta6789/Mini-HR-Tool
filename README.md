# Mini HR Tool 🏢

A comprehensive HR management system built with the MERN stack for managing employee attendance, leave requests, and generating administrative reports.

---

## 📋 Project Overview

**Mini HR Tool** is a full-stack web application designed to streamline HR operations in small to medium-sized organizations. The system provides separate portals for employees and administrators, enabling efficient management of daily attendance, leave applications, and comprehensive reporting.

### Key Features

#### Employee Portal
- **Dashboard**: Overview of attendance statistics, leave balance, and recent activities
- **Attendance Management**: Mark daily attendance with calendar visualization
- **Leave Application**: Submit leave requests (Casual, Sick, Paid Leave)
- **History Tracking**: View attendance and leave history with filtering options
- **Real-time Notifications**: Toast notifications for all actions

#### Admin Portal
- **Admin Dashboard**: Statistics overview with quick action cards
- **Leave Management**: Approve/reject employee leave requests with email notifications
- **Attendance Monitoring**: View and filter all employee attendance records
- **Employee Management**: Access employee details and leave balances
- **Monthly Reports**: Generate and download CSV reports for payroll/analytics
- **Email Notifications**: Automated professional HTML emails for leave status updates

#### Additional Features
- **Dark Mode**: System-wide theme toggle with persistent preference
- **Responsive Design**: Mobile-friendly with hamburger menu navigation
- **Role-Based Access Control**: Separate permissions for employees and admins
- **JWT Authentication**: Secure token-based authentication
- **Professional UI**: Gradient themes, glassmorphism effects, smooth animations

---

## 🛠️ Tech Stack & Justification

### Frontend

| Technology | Version | Justification |
|------------|---------|---------------|
| **React** | 18.3.1 | Component-based architecture for reusable UI, virtual DOM for performance, large ecosystem |
| **Vite** | 5.4.11 | Lightning-fast dev server, optimized builds, better DX than Create React App |
| **React Router** | 7.1.1 | Client-side routing, protected routes, seamless navigation |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS, rapid development, consistent design system, smaller bundle size |
| **Axios** | 1.7.9 | Promise-based HTTP client, interceptors for auth, better error handling than fetch |
| **React Calendar** | 5.1.0 | Customizable calendar component for attendance visualization |
| **React Toastify** | 11.0.3 | Non-intrusive notifications, customizable, better UX |
| **date-fns** | 4.1.0 | Lightweight date manipulation, tree-shakeable, modern alternative to Moment.js |

### Backend

| Technology | Version | Justification |
|------------|---------|---------------|
| **Node.js** | - | Non-blocking I/O, JavaScript everywhere, large package ecosystem |
| **Express.js** | 4.21.2 | Minimal, flexible, robust routing, middleware support |
| **MongoDB** | - | NoSQL flexibility, JSON-like documents, horizontal scalability, fast queries |
| **Mongoose** | 8.9.3 | Schema validation, middleware hooks, query building, relationship management |
| **JWT** | 9.0.2 | Stateless authentication, scalable, works well with REST APIs |
| **Bcrypt** | 5.1.1 | Industry-standard password hashing, salt rounds for security |
| **Nodemailer** | 6.9.17 | Email sending, HTML templates, Gmail integration |
| **dotenv** | 16.4.7 | Environment variable management, keeps secrets out of code |
| **cors** | 2.8.5 | Cross-origin resource sharing, enables frontend-backend communication |

### Architecture Decisions

- **Services Layer**: Organized API calls into domain-specific services for better separation of concerns
- **Context API**: Used for global state management (Auth, Theme) instead of Redux for simplicity
- **Axios Interceptors**: Automatic token injection for all API requests
- **Compound Indexes**: MongoDB indexes on `userId + date` for fast attendance queries
- **JWT Expiry**: 30-day token expiration for balance between security and UX

---

## 📦 Installation Steps

### Prerequisites
- **Node.js**: v14.0.0 or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **Gmail Account**: For email notifications (with App Password enabled)
- **Git**: For cloning the repository

### 1. Clone the Repository
```bash
git clone https://github.com/Aryangupta6789/Mini-HR-Tool.git
cd Mini-HR-Tool
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (see Environment Variables section below)
# Copy .env.example to .env and fill in your values

# Start the backend server
npm start
```

The backend server will run on `http://localhost:4000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file (see Environment Variables section below)

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **Admin Login**: Use seeded admin credentials (see Admin Credentials section)

---

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/mini-hr-tool
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/mini-hr-tool

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Admin Seeding (default admin account)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Email Setup Instructions:**
1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use the generated 16-character password in `EMAIL_PASS`

### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
# API Base URL
VITE_API_URL=http://localhost:4000/api
```

**For Production:**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new employee |
| POST | `/auth/login` | Public | User login (returns JWT token) |
| GET | `/auth/users` | Admin | Get all registered users |
| GET | `/auth/me` | Private | Get current user profile |

### Leave Routes (`/api/leaves`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/leaves` | Admin | Get all leave requests |
| GET | `/leaves/my` | Employee | Get current user's leaves |
| POST | `/leaves` | Employee | Apply for new leave |
| PUT | `/leaves/:id` | Admin | Update leave status (approve/reject) |
| PUT | `/leaves/:id/cancel` | Employee | Cancel own leave request |

### Attendance Routes (`/api/attendance`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/attendance` | Admin | Get all attendance records |
| GET | `/attendance/my` | Employee | Get current user's attendance |
| POST | `/attendance` | Employee | Mark attendance for a date |

### Report Routes (`/api/reports`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/reports/monthly?month=MM&year=YYYY` | Admin | Generate monthly report |

**Example Request:**
```bash
GET /api/reports/monthly?month=02&year=2026
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Format:**
```json
{
  "month": "02",
  "year": "2026",
  "monthName": "February",
  "reports": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "attendance": {
        "totalDays": 28,
        "present": 22,
        "absent": 6,
        "percentage": 78.57
      },
      "leaves": {
        "totalDays": 3,
        "casual": 1,
        "sick": 1,
        "paid": 1
      }
    }
  ]
}
```

---

## 🗄️ Database Models

### User Model

```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcrypt),
  role: String (enum: ['employee', 'admin'], default: 'employee'),
  dateOfJoining: Date (default: Date.now),
  leaveBalance: Number (default: 20),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Relationships:**
- One-to-Many with Leave (userId references User)
- One-to-Many with Attendance (userId references User)

### Leave Model

```javascript
{
  userId: ObjectId (ref: 'User', required),
  leaveType: String (enum: ['Casual', 'Sick', 'Paid'], required),
  startDate: Date (required),
  endDate: Date (required),
  totalDays: Number (required, calculated),
  status: String (enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending'),
  reason: String (optional),
  appliedAt: Date (default: Date.now),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Business Logic:**
- `totalDays` is calculated as: `(endDate - startDate) + 1`
- Leave balance is deducted only when status is 'Approved'
- Email notification sent on status change (Approved/Rejected)

### Attendance Model

```javascript
{
  userId: ObjectId (ref: 'User', required),
  date: String (format: 'YYYY-MM-DD', required),
  status: String (enum: ['Present', 'Absent'], required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Indexes:**
- Compound unique index on `(userId, date)` to prevent duplicate entries

**Constraints:**
- One attendance record per user per day
- Date stored as string for easy querying and uniqueness

### Database Relationships Diagram

```
User (1) ──────< (Many) Leave
  │
  └──────< (Many) Attendance
```

---

## 👤 Admin Credentials

The system automatically seeds an admin account on first run.

**Default Admin Login:**
- **Email**: `admin@example.com`
- **Password**: `admin123`

**⚠️ IMPORTANT**: Change these credentials in production by updating the `.env` file:
```env
ADMIN_EMAIL=your_admin@company.com
ADMIN_PASSWORD=your_secure_password
```

The admin account is created with:
- Role: `admin`
- Leave Balance: `0` (admins don't take leaves in this system)
- Full access to all admin routes

---

## 🤖 AI Tools Declaration

This project was developed with assistance from the following AI tools:

### Google Gemini (Primary AI Assistant)
- **Contribution**: ~70% of development assistance
- **Usage**:
  - Architecture design and project structure planning
  - Code generation for React components and backend controllers
  - Debugging and error resolution
  - API endpoint design and implementation
  - Database schema design
  - Authentication flow implementation
  - UI/UX improvements and Tailwind CSS styling
  - Documentation writing (README, code comments)
  - Best practices guidance

### Specific AI-Assisted Features
1. **Services Layer Architecture**: AI suggested and implemented the services pattern for API calls
2. **JWT Authentication Flow**: Complete implementation with interceptors
3. **Email Templates**: Professional HTML email design for leave notifications
4. **Responsive Design**: Mobile hamburger menu and responsive layouts
5. **Dark Mode**: Theme context and persistent storage implementation
6. **CSV Export**: Report generation and download functionality
7. **Error Handling**: Try-catch blocks and user-friendly error messages

### Human Contributions
- Project requirements and feature specifications
- Business logic decisions (leave types, approval workflow)
- Testing and quality assurance
- Environment configuration
- Deployment decisions
- Final code review and refinements

**Transparency Note**: While AI tools significantly accelerated development, all code was reviewed, tested, and understood by the developer. The AI served as a coding assistant and knowledge resource, not a replacement for developer judgment.

---

## ⚠️ Known Limitations

### Current Limitations

1. **Token Refresh**: JWT tokens expire after 30 days with no refresh mechanism
   - **Impact**: Users must re-login after 30 days
   - **Future Fix**: Implement refresh token rotation

2. **LocalStorage Security**: Authentication tokens stored in localStorage
   - **Impact**: Vulnerable to XSS attacks
   - **Future Fix**: Consider httpOnly cookies for production

3. **Email Dependency**: Requires Gmail SMTP configuration
   - **Impact**: Email notifications won't work without proper Gmail setup
   - **Future Fix**: Support multiple email providers or use SendGrid/AWS SES

4. **No Password Reset**: Missing "Forgot Password" functionality
   - **Impact**: Users can't reset passwords without admin intervention
   - **Future Fix**: Add password reset flow with email verification

5. **Single Admin Role**: No role hierarchy (e.g., HR Manager, Department Head)
   - **Impact**: All admins have equal permissions
   - **Future Fix**: Implement role-based permissions system

6. **No File Uploads**: Leave applications don't support document attachments
   - **Impact**: Can't attach medical certificates or other documents
   - **Future Fix**: Add file upload with cloud storage (AWS S3/Cloudinary)

7. **Basic Reporting**: Limited to monthly CSV exports
   - **Impact**: No advanced analytics or charts
   - **Future Fix**: Add dashboard charts and custom date range reports

8. **No Audit Trail**: No logging of who approved/rejected leaves
   - **Impact**: Can't track admin actions
   - **Future Fix**: Add audit log table

### Browser Compatibility
- **Tested**: Chrome 120+, Firefox 120+, Edge 120+
- **Not Tested**: Safari, older browser versions
- **Known Issue**: Calendar component may have styling issues in Safari

### Performance Considerations
- **Database**: Not optimized for >10,000 users
- **Pagination**: Frontend pagination only (loads all data)
- **File Size**: No image optimization for future file uploads

---

## ⏱️ Time Spent

**Total Development Time**: ~40 hours

### Breakdown by Phase

| Phase | Time | Details |
|-------|------|---------|
| **Planning & Design** | 4 hours | Requirements gathering, database schema design, API planning |
| **Backend Development** | 12 hours | Models, controllers, routes, middleware, authentication |
| **Frontend Development** | 16 hours | Components, pages, routing, state management, styling |
| **Integration & Testing** | 5 hours | API integration, bug fixes, cross-browser testing |
| **UI/UX Refinement** | 2 hours | Dark mode, responsive design, animations, gradients |
| **Documentation** | 1 hour | README, code comments, API documentation |

### Development Timeline
- **Week 1**: Backend setup, authentication, database models
- **Week 2**: Frontend components, employee portal
- **Week 3**: Admin portal, email notifications, reports
- **Week 4**: UI polish, responsive design, testing, documentation

---

## 🚀 Future Enhancements

- [ ] Password reset functionality
- [ ] Refresh token implementation
- [ ] Advanced analytics dashboard with charts
- [ ] File upload for leave applications
- [ ] Multi-language support
- [ ] Push notifications
- [ ] Export reports in PDF format
- [ ] Attendance geolocation tracking
- [ ] Department-wise organization
- [ ] Holiday calendar management
- [ ] Shift management system

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Aryan Gupta**
- GitHub: [@Aryangupta6789](https://github.com/Aryangupta6789)
- Project Link: [Mini HR Tool](https://github.com/Aryangupta6789/Mini-HR-Tool)

---

## 🙏 Acknowledgments

- **Google Gemini AI** for development assistance
- **MongoDB** for excellent documentation
- **React** and **Tailwind CSS** communities for resources
- **Stack Overflow** for problem-solving support

---

**Built with ❤️ using the MERN Stack**
