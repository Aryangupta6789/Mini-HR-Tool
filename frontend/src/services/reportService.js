import api from '../utils/api';

// All report-related API calls
export const reportService = {
    // Get monthly report (admin only)
    getMonthlyReport: async (month, year) => {
        const { data } = await api.get(`/reports/monthly?month=${month}&year=${year}`);
        return data;
    }
};

export default reportService;
