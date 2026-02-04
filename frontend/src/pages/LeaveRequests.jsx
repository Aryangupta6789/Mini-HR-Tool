import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Pagination from '../components/Pagination';
import AdminNavbar from '../components/AdminNavbar';

const LeaveRequests = () => {
    const [leaves, setLeaves] = useState([]);
    const [leaveFilter, setLeaveFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const { data } = await api.get('/leaves');
            setLeaves(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch leave requests');
        }
    };

    const handleLeaveAction = async (id, status) => {
        try {
            await api.put(`/leaves/${id}`, { status });
            toast.success(`Leave ${status} & Email Notification Sent`);
            fetchLeaves();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    // Filter Logic
    const filteredLeaves = leaves.filter(leave => leaveFilter === 'All' || leave.status === leaveFilter);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedLeaves = filteredLeaves.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50/30 to-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-gray-900 dark:to-gray-950">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Leave Requests</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage employee leave applications</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">All Leave Requests</h2>
                        <select
                            value={leaveFilter}
                            onChange={(e) => { setLeaveFilter(e.target.value); setCurrentPage(1); }}
                            className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm px-4 py-2"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Days</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Reason</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedLeaves.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{leave.userId?.fullName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{leave.leaveType}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d, yyyy')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{leave.totalDays}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{leave.reason || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                                leave.status === 'Approved' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                                leave.status === 'Rejected' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                            }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {leave.status === 'Pending' && (
                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={() => handleLeaveAction(leave._id, 'Approved')}
                                                        className="text-green-600 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400 font-medium transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleLeaveAction(leave._id, 'Rejected')}
                                                        className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 font-medium transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredLeaves.length === 0 && (
                                    <tr><td colSpan="7" className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No leave requests found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            totalItems={filteredLeaves.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeaveRequests;
