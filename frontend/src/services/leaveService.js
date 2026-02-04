import api from '../utils/api';

// All leave-related API calls
export const leaveService = {
    // Get all leaves (admin only)
    getAllLeaves: async () => {
        const { data } = await api.get('/leaves');
        return data;
    },

    // Get my leaves (employee)
    getMyLeaves: async () => {
        const { data } = await api.get('/leaves/my');
        return data;
    },

    // Apply for leave
    applyLeave: async (leaveData) => {
        const { data } = await api.post('/leaves', leaveData);
        return data;
    },

    // Update leave status (approve/reject) - admin only
    updateLeaveStatus: async (leaveId, status) => {
        const { data } = await api.put(`/leaves/${leaveId}`, { status });
        return data;
    },

    // Cancel leave
    cancelLeave: async (leaveId) => {
        const { data } = await api.put(`/leaves/${leaveId}/cancel`);
        return data;
    }
};

export default leaveService;
