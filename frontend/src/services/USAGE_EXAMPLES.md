# How to Use Services - Example

## Before (Old way - Direct API calls in components)

```javascript
// LeaveRequests.jsx - OLD WAY ❌
import api from '../utils/api';

const LeaveRequests = () => {
    const [leaves, setLeaves] = useState([]);

    const fetchLeaves = async () => {
        try {
            const { data } = await api.get('/leaves');  // Direct API call
            setLeaves(data);
        } catch (error) {
            toast.error('Failed to fetch leave requests');
        }
    };

    const handleLeaveAction = async (id, status) => {
        try {
            await api.put(`/leaves/${id}`, { status });  // Direct API call
            toast.success(`Leave ${status}`);
            fetchLeaves();
        } catch (error) {
            toast.error('Action failed');
        }
    };

    return (/* UI code */);
};
```

---

## After (New way - Using Services) ✅

```javascript
// LeaveRequests.jsx - NEW WAY ✅
import { leaveService } from '../services/leaveService';

const LeaveRequests = () => {
    const [leaves, setLeaves] = useState([]);

    const fetchLeaves = async () => {
        try {
            const data = await leaveService.getAllLeaves();  // Using service
            setLeaves(data);
        } catch (error) {
            toast.error('Failed to fetch leave requests');
        }
    };

    const handleLeaveAction = async (id, status) => {
        try {
            await leaveService.updateLeaveStatus(id, status);  // Using service
            toast.success(`Leave ${status}`);
            fetchLeaves();
        } catch (error) {
            toast.error('Action failed');
        }
    };

    return (/* UI code */);
};
```

---

## More Examples

### ApplyLeave Component
```javascript
import { leaveService } from '../services/leaveService';

const handleSubmit = async (formData) => {
    try {
        await leaveService.applyLeave(formData);
        toast.success('Leave applied successfully!');
        navigate('/employee/leaves');
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to apply leave');
    }
};
```

### AttendanceLogs Component
```javascript
import { attendanceService } from '../services/attendanceService';

const fetchAttendance = async () => {
    try {
        const data = await attendanceService.getAllAttendance();
        setAttendance(data);
    } catch (error) {
        toast.error('Failed to fetch attendance logs');
    }
};
```

### MonthlyReports Component
```javascript
import { reportService } from '../services/reportService';

const fetchMonthlyReports = async () => {
    try {
        const data = await reportService.getMonthlyReport(reportMonth, reportYear);
        setMonthlyReports(data);
    } catch (error) {
        toast.error('Failed to fetch monthly reports');
    }
};
```

### Login Component
```javascript
import { authService } from '../services/authService';

const handleLogin = async (credentials) => {
    try {
        const data = await authService.login(credentials);
        // Store token and user data
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/dashboard');
    } catch (error) {
        toast.error('Invalid credentials');
    }
};
```

---

## Benefits

✅ **Cleaner Components** - Components focus on UI, not API details  
✅ **Reusable** - Same service function used in multiple components  
✅ **Easy to Test** - Mock services instead of mocking API calls  
✅ **Single Source of Truth** - All API endpoints in one place  
✅ **Easy to Update** - Change API endpoint in one file, affects all components  

---

## Interview Talking Points

> "I organized all API calls into a services layer. Each service file contains domain-specific API functions. For example, `leaveService.js` has all leave-related API calls like `getAllLeaves()`, `applyLeave()`, and `updateLeaveStatus()`. Components import these services instead of making direct API calls. This follows the Separation of Concerns principle and makes the codebase more maintainable and testable."
