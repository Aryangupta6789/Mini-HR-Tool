# Mini HR Tool 

> **A modern, full-stack HR management system for efficient employee tracking.**

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://mini-hr-tool-frontend.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/atlas)

---

## 🚀 Live Demo

- **Frontend (Application):** [https://mini-hr-tool-frontend.vercel.app/](https://mini-hr-tool-frontend.vercel.app/)
- **Backend (API):** [https://mini-hr-tool-psi.vercel.app/](https://mini-hr-tool-psi.vercel.app/)

> **Valid Test Credentials:**
> - **Admin Email:** `admin@example.com`
> - **Password:** `admin123`

---

## 📌 Project Overview

**Mini HR Tool** is a comprehensive solution designed to replace manual HR tracking with a digital, role-based system. It bridges the gap between management and employees by providing a clear interface for attendance, leave management, and reporting.

### Key Features

| Category | Features |
|----------|----------|
| **For Admins** | • **Dashboard:** Overview of total employees, leaves, and attendance stats.<br>• **Leave Management:** Approve/Reject pending requests with one click.<br>• **Reports:** View and Export monthly attendance reports.<br>• **Notifications:** Automated email triggers on status changes. |
| **For Employees** | • **Self Service:** Mark attendance daily with location/time validation.<br>• **Leave Application:** Apply for leaves (Casual, Sick, Paid) with date validation.<br>• **History:** View personal attendance and leave history. |
| **System** | • **RBAC:** Strictly separated Admin vs Employee routes.<br>• **Security:** JWT Authentication & BCrypt hashing.<br>• **Validation:** Prevents future dates, duplicate attendance, and past-date leave applications. |

---

## 🛠 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Context API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud)
- **Services:** Nodemailer (Email), JWT (Auth), Vercel (Hosting)

---

## ⚙️ Installation & Setup

Follow these steps to run the complete system locally.

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mini-hr-tool
```

### 2. Backend Setup
The backend handles the API, Database connection, and Email services.

```bash
# Install dependencies (Root + Backend)
npm install

# Setup Environment Variables
# Create a file named .env in the ROOT directory (or backend/.env)
```

**Required `.env` Variables:**
```env
NODE_ENV=development
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here

# Admin Seeding (First run only)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Email Service (Gmail App Password)
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_16_char_app_password
```

**Start the Server:**
```bash
# Run from root
npm start
# OR run dev mode
npm run server
```
*Server runs on `http://localhost:4000`*

### 3. Frontend Setup
The frontend provides the user interface.

```bash
cd frontend
npm install
```

**Configure Environment:**
Create `.env` in `frontend/`:
```env
VITE_API_URL=http://localhost:4000/api
```

**Start the Application:**
```bash
npm run dev
```
*App runs on `http://localhost:5173`*

---

## 📡 API Reference

### Authentication
- `POST /api/auth/login` - Login (Admin/Employee)
- `GET /api/auth/me` - Get current user profile

### Leaves
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves/my-leaves` - Employee history
- `GET /api/leaves` - Admin: All requests
- `PUT /api/leaves/:id` - Admin: Approve/Reject (Triggers Email)

### Attendance
- `POST /api/attendance` - Mark Present
- `GET /api/attendance/today` - Check status
- `GET /api/attendance/report` - Admin: Monthly Report

---

## 🧪 Deployment (Vercel)

This project is configured for **Zero-Config Vercel Deployment**.

1.  **Frontend:** Deployed as a Vite Single Page App.
2.  **Backend:** Deployed as Serverless Functions (`api/index.js`).
3.  **Structure:** Monorepo-style structure adapted for Vercel.

**Note on MongoDB:** When deploying to Vercel, ensure your **MongoDB Atlas IP Access List** allows `0.0.0.0/0` (Allow Anywhere) because Serverless functions use dynamic IPs.


## 🤖 AI Tools Declaration & Usage

This project was developed with a hybrid approach, leveraging AI as a productivity tool while retaining full control over architectural decisions and core logic.

| Component | Tool Used | Contribution Detail |
| :--- | :--- | :--- |
| **System Architecture** | Manual | Designed the MVC folder structure, API routing, and Database Relational Schema. |
| **Auth & Security** | Manual | Implemented JWT validation, Password Hashing (Bcrypt), and Role-Based Access Control logic. |
| **Service Layer (Frontend)** | Copilot | Generated robust Axios interceptors (`api.js`) and report handling services. |
| **UI Components** | Claude | Assisted in creating responsive, accessible Tailwind CSS components. |
| **Documentation** | ChatGPT | Structured the professional README layout and technical project documentation. |
| **Deployment Config** | Manual | Configured Vercel serverless functions, environment variables, and CORS policies. |

> **Statement of Originality:** AI tools were strictly used for boilerplate generation (like service files) and documentation formatting. All business rules, validation logic, and system integration were implemented and verified manually.

### ⚙️ Optimization & Scalability Considerations
- **Serverless Architecture:** Utilizes Vercel's "Scale-to-Zero" infrastructure. While highly cost-efficient, this may introduce occasional cold-start latency during idle periods.
- **SMTP Gateway:** Currently configured with Gmail SMTP for rapid development. The email service layer is decoupled and ready for drop-in replacement with enterprise providers like SendGrid or AWS SES.

---

<p align="center">
  Built with ❤️ by Aryan Gupta
</p>
