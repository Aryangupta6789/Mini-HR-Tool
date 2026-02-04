# Services Folder - API Calls Organization

This folder contains all API service files that handle communication with the backend.

## Structure

```
services/
├── leaveService.js       - Leave management API calls
├── attendanceService.js  - Attendance tracking API calls
├── authService.js        - Authentication API calls
└── reportService.js      - Report generation API calls
```

## Usage Example

```javascript
// In your component
import { leaveService } from '../services/leaveService';

const fetchLeaves = async () => {
    try {
        const data = await leaveService.getAllLeaves();
        setLeaves(data);
    } catch (error) {
        toast.error('Failed to fetch leaves');
    }
};
```

## Benefits

- **Separation of Concerns**: API logic separated from UI components
- **Reusability**: Service functions can be used across multiple components
- **Maintainability**: All API endpoints organized in one place
- **Testability**: Easy to mock services for unit testing
- **Type Safety**: Ready for TypeScript integration

## Available Services

### leaveService
- `getAllLeaves()` - Get all leave requests (admin)
- `getMyLeaves()` - Get current user's leaves
- `applyLeave(leaveData)` - Submit new leave request
- `updateLeaveStatus(leaveId, status)` - Approve/reject leave (admin)
- `cancelLeave(leaveId)` - Cancel leave request

### attendanceService
- `getAllAttendance()` - Get all attendance records (admin)
- `getMyAttendance()` - Get current user's attendance
- `markAttendance(attendanceData)` - Mark attendance for a date

### authService
- `login(credentials)` - User login
- `register(userData)` - User registration
- `getAllUsers()` - Get all users (admin)
- `getProfile()` - Get current user profile

### reportService
- `getMonthlyReport(month, year)` - Generate monthly report (admin)
