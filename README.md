# Mini HR Tool 🏢

A comprehensive HR management system built with the MERN stack (MongoDB, Express.js, React, Node.js) for managing employee attendance, leave requests, and generating reports.

## 🚀 Features

### Employee Portal
- ✅ **Dashboard** - Overview of attendance, leave balance, and recent activities
- ✅ **Mark Attendance** - Daily attendance marking with calendar view
- ✅ **Attendance History** - View past attendance records
- ✅ **Apply Leave** - Submit leave requests (Casual, Sick, Paid)
- ✅ **Leave History** - Track leave applications and status
- ✅ **Dark Mode** - Toggle between light and dark themes

### Admin Portal
- ✅ **Admin Dashboard** - Statistics and quick actions overview
- ✅ **Leave Management** - Approve/reject employee leave requests
- ✅ **Attendance Logs** - View all employee attendance records
- ✅ **Employee Management** - View registered employees and their details
- ✅ **Monthly Reports** - Generate and download CSV reports
- ✅ **Email Notifications** - Automatic email alerts for leave approvals/rejections

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Calendar** - Calendar component
- **React Toastify** - Notifications
- **Date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

## 📁 Project Structure

```
mini-hr-tool/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React Context (Auth, Theme)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── utils/           # Utility functions (api.js)
│   │   └── App.jsx          # Main app component
│   └── package.json
├── backend/
│   ├── controllers/         # Business logic
│   ├── models/              # Database schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & error handling
│   ├── utils/               # Helper functions
│   └── server.js            # Entry point
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Gmail account (for email notifications)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/mini-hr-tool.git
cd mini-hr-tool
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

Start backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:4000/api
```

Start frontend dev server:
```bash
npm run dev
```

## 🔐 Authentication

The application uses **JWT-based authentication** with the following flow:

1. User logs in with email/password
2. Backend validates credentials and generates JWT token
3. Token is stored in localStorage
4. Axios interceptor automatically attaches token to all API requests
5. Backend middleware verifies token and authorizes requests

**Default Admin Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

## 📧 Email Configuration

To enable email notifications:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Add credentials to backend `.env` file

## 🎨 Features Showcase

### Responsive Design
- Mobile-friendly hamburger menu
- Adaptive layouts for all screen sizes
- Consistent gradient theme across the app

### Dark Mode
- System-wide dark mode toggle
- Persistent theme preference
- Smooth transitions

### Professional UI
- Gradient backgrounds (cyan → blue → white)
- Glassmorphism effects
- Smooth animations and transitions
- Color-coded status indicators

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/users` - Get all users (admin)

### Leaves
- `GET /api/leaves` - Get all leaves (admin)
- `GET /api/leaves/my` - Get my leaves
- `POST /api/leaves` - Apply for leave
- `PUT /api/leaves/:id` - Update leave status (admin)
- `PUT /api/leaves/:id/cancel` - Cancel leave

### Attendance
- `GET /api/attendance` - Get all attendance (admin)
- `GET /api/attendance/my` - Get my attendance
- `POST /api/attendance` - Mark attendance

### Reports
- `GET /api/reports/monthly` - Generate monthly report (admin)

## 🏗️ Architecture Highlights

### Services Layer
Organized API calls into domain-specific services:
- `leaveService.js` - Leave management
- `attendanceService.js` - Attendance tracking
- `authService.js` - Authentication
- `reportService.js` - Report generation

### Context API
- `AuthContext` - User authentication state
- `ThemeContext` - Dark/light mode preference

### Middleware
- `protect` - Verify JWT token
- `admin` - Check admin role

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd backend
# Set environment variables
# Deploy to platform
```

## 📝 License

MIT License - feel free to use this project for learning or personal use.

## 👨‍💻 Author

Built with ❤️ by [Your Name]

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Note:** This is a learning project demonstrating full-stack development with the MERN stack, JWT authentication, and modern React patterns.
