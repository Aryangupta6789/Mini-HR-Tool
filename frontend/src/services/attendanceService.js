import api from '../utils/api';

// All attendance-related API calls
export const attendanceService = {
    // Get all attendance records (admin only)
    getAllAttendance: async () => {
        const { data } = await api.get('/attendance');
        return data;
    },

    // Get my attendance records (employee)
    getMyAttendance: async () => {
        const { data } = await api.get('/attendance/my');
        return data;
    },

    // Mark attendance
    markAttendance: async (attendanceData) => {
        const { data } = await api.post('/attendance', attendanceData);
        return data;
    }
};

export default attendanceService;
