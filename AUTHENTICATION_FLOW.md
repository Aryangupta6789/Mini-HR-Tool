# Complete Authentication Flow - JWT & LocalStorage

## 🔐 Overview

Your application uses **JWT (JSON Web Token)** based authentication with **localStorage** for session persistence. Here's the complete flow:

---

## 📋 Step-by-Step Authentication Flow

### **1. User Registration/Login**

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (Login.jsx)                                        │
│                                                             │
│ User enters: email + password                               │
│ ↓                                                           │
│ login(email, password) from AuthContext                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (AuthContext.jsx)                                  │
│                                                             │
│ const login = async (email, password) => {                 │
│     const { data } = await api.post('/auth/login',         │
│         { email, password });                               │
│     localStorage.setItem('user', JSON.stringify(data));     │
│     setUser(data);                                          │
│ };                                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND (authController.js)                                 │
│                                                             │
│ 1. Find user by email                                       │
│ 2. Compare password with bcrypt                             │
│ 3. Generate JWT token                                       │
│ 4. Return user data + token                                 │
│                                                             │
│ Response: {                                                 │
│     _id: "123",                                             │
│     fullName: "John Doe",                                   │
│     email: "john@example.com",                              │
│     role: "employee",                                       │
│     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."       │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

### **2. Token Storage in LocalStorage**

```javascript
// FRONTEND (AuthContext.jsx - Line 22)
localStorage.setItem('user', JSON.stringify(data));

// What gets stored:
{
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "employee",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNzA0ODAwMCwiZXhwIjoxNzA5NjQwMDAwfQ.xyz123"
}
```

**Why LocalStorage?**
- ✅ Persists across browser sessions (user stays logged in)
- ✅ Survives page refreshes
- ✅ Simple to implement
- ⚠️ Vulnerable to XSS attacks (trade-off for simplicity)

---

### **3. Auto-Login on Page Refresh**

```javascript
// FRONTEND (AuthContext.jsx - Lines 12-18)
useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));  // Restore user state
    }
    setLoading(false);
}, []);
```

**Flow:**
1. App loads
2. Check localStorage for 'user'
3. If found → Parse JSON → Set user state → User is logged in
4. If not found → User sees login page

---

### **4. Automatic Token Injection (Every API Call)**

```javascript
// FRONTEND (api.js - Lines 8-19)
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});
```

**What happens:**
```
Before Interceptor:
GET /api/leaves

After Interceptor:
GET /api/leaves
Headers: {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### **5. Backend Token Verification**

```javascript
// BACKEND (authMiddleware.js - Lines 4-32)
const protect = async (req, res, next) => {
    // 1. Extract token from header
    token = req.headers.authorization.split(' ')[1];
    
    // 2. Verify token with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Get user from database using decoded ID
    req.user = await User.findById(decoded.id).select('-password');
    
    // 4. Attach user to request object
    next();  // Proceed to controller
};
```

**JWT Token Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  ← Header (algorithm)
.
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTcwNzA0ODAwMCwiZXhwIjoxNzA5NjQwMDAwfQ  ← Payload (user ID, issued at, expiry)
.
xyz123  ← Signature (verified with JWT_SECRET)
```

**Decoded Payload:**
```json
{
    "id": "507f1f77bcf86cd799439011",
    "iat": 1707048000,  // Issued at
    "exp": 1709640000   // Expires in 30 days
}
```

---

### **6. Role-Based Access Control**

```javascript
// BACKEND (authMiddleware.js - Lines 34-40)
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();  // Allow access
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
```

**Usage in Routes:**
```javascript
// Employee can access
router.get('/leaves/my', protect, getMyLeaves);

// Only admin can access
router.get('/leaves', protect, admin, getAllLeaves);
```

---

### **7. Logout Flow**

```javascript
// FRONTEND (AuthContext.jsx - Lines 34-37)
const logout = () => {
    localStorage.removeItem('user');  // Delete from storage
    setUser(null);                    // Clear state
};
```

**What happens:**
1. User clicks logout
2. Remove 'user' from localStorage
3. Clear user state
4. User redirected to login page

---

## 🔄 Complete Request Flow Example

```
USER ACTION: Fetch Leave Requests
↓
FRONTEND (LeaveRequests.jsx)
api.get('/leaves')
↓
FRONTEND (api.js Interceptor)
Adds: Authorization: "Bearer eyJhbGc..."
↓
HTTP REQUEST
GET http://localhost:4000/api/leaves
Headers: { Authorization: "Bearer eyJhbGc..." }
↓
BACKEND (server.js)
Routes to /api/leaves
↓
BACKEND (leaveRoutes.js)
router.get('/', protect, admin, getAllLeaves)
↓
BACKEND (authMiddleware.js - protect)
1. Extract token from header
2. Verify token with JWT_SECRET
3. Decode to get user ID
4. Fetch user from database
5. Attach user to req.user
↓
BACKEND (authMiddleware.js - admin)
Check if req.user.role === 'admin'
↓
BACKEND (leaveController.js)
getAllLeaves() executes
Fetch leaves from database
↓
RESPONSE
Return JSON data to frontend
↓
FRONTEND
Display leaves in UI
```

---

## 🔑 Key Components

### **JWT Token Generation**
```javascript
// BACKEND (authController.js - Lines 6-10)
const generateToken = (id) => {
    return jwt.sign(
        { id },                          // Payload: user ID
        process.env.JWT_SECRET,          // Secret key
        { expiresIn: '30d' }             // Token expires in 30 days
    );
};
```

### **Password Hashing (Security)**
```javascript
// BACKEND (authController.js - Lines 30-31)
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

// Passwords are NEVER stored in plain text!
```

---

## 🎯 Interview Talking Points

### **"Explain your authentication system"**

> "I implemented JWT-based authentication with localStorage for session persistence. Here's how it works:
> 
> 1. **Login**: User submits credentials → Backend validates → Generates JWT token → Returns token + user data
> 
> 2. **Storage**: Frontend stores the token and user data in localStorage for persistence across sessions
> 
> 3. **Auto-Authentication**: On every API request, an Axios interceptor automatically attaches the JWT token to the Authorization header
> 
> 4. **Verification**: Backend middleware verifies the token, decodes the user ID, fetches the user from the database, and attaches it to the request object
> 
> 5. **Authorization**: Role-based middleware checks if the user has admin privileges for protected routes
> 
> The token expires in 30 days, and I use bcrypt for password hashing. It's stateless, scalable, and follows industry standards."

### **"Why JWT over sessions?"**

> "JWT is stateless - the server doesn't need to store session data. This makes it scalable for distributed systems. The token contains all necessary user information, so we don't need database lookups for every request. It's also perfect for RESTful APIs and works well with React's component-based architecture."

### **"Security concerns with localStorage?"**

> "I'm aware that localStorage is vulnerable to XSS attacks. In production, I'd consider:
> - Using httpOnly cookies for the token
> - Implementing Content Security Policy (CSP)
> - Adding token refresh mechanism
> - Using shorter expiration times
> 
> For this project's scope, localStorage provides a good balance of simplicity and functionality."

---

## 📊 Data Flow Diagram

```
┌──────────────┐
│   Browser    │
│ (localStorage)│
│              │
│ Stores:      │
│ - User ID    │
│ - Name       │
│ - Email      │
│ - Role       │
│ - JWT Token  │
└──────┬───────┘
       │
       │ Every API Call
       │ Interceptor adds token
       ▼
┌──────────────┐
│  API Request │
│              │
│ Headers:     │
│ Authorization│
│ Bearer token │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Backend    │
│  Middleware  │
│              │
│ 1. Verify    │
│ 2. Decode    │
│ 3. Fetch User│
│ 4. Authorize │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Controller  │
│              │
│ Access to:   │
│ req.user     │
│              │
│ Execute      │
│ Business     │
│ Logic        │
└──────────────┘
```

---

**This is a production-ready authentication system!** 🚀
