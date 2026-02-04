import { useState } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import EmployeeNavbar from '../components/EmployeeNavbar';

const ApplyLeave = () => {
    const [leaveForm, setLeaveForm] = useState({ leaveType: 'Casual', startDate: '', endDate: '', reason: '' });

    const handleLeaveSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/leaves', leaveForm);
            toast.success('Leave request submitted!');
            setLeaveForm({ leaveType: 'Casual', startDate: '', endDate: '', reason: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Submission failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50/30 to-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-gray-900 dark:to-gray-950">
            <EmployeeNavbar />

            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Apply for Leave</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit a new leave request</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-6">
                    <form onSubmit={handleLeaveSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Leave Type</label>
                            <select
                                value={leaveForm.leaveType}
                                onChange={(e) => setLeaveForm({...leaveForm, leaveType: e.target.value})}
                                className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm"
                            >
                                <option value="Casual">Casual Leave</option>
                                <option value="Sick">Sick Leave</option>
                                <option value="Paid">Paid Leave</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={leaveForm.startDate}
                                    onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})}
                                    className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={leaveForm.endDate}
                                    onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})}
                                    className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Reason (Optional)</label>
                            <textarea
                                rows="4"
                                placeholder="Please provide a reason for your leave request..."
                                value={leaveForm.reason}
                                onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})}
                                className="w-full p-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm"
                            />
                        </div>

                        <button type="submit" className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors">
                            Submit Leave Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ApplyLeave;
