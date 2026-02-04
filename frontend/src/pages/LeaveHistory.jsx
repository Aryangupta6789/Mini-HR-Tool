import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Pagination from '../components/Pagination';
import EmployeeNavbar from '../components/EmployeeNavbar';

const LeaveHistory = () => {
    const [leaves, setLeaves] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchLeaves = async () => {
        try {
            const { data } = await api.get('/leaves/my');
            setLeaves(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch leave history');
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = leaves.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50/30 to-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-gray-900 dark:to-gray-950">
            <EmployeeNavbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Leave History</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View your leave requests and status</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Start Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">End Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Days</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Reason</th>
                                    <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {currentItems.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-5 py-3 text-sm text-gray-900 dark:text-white">{leave.leaveType}</td>
                                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{format(new Date(leave.startDate), 'MMM dd, yyyy')}</td>
                                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{format(new Date(leave.endDate), 'MMM dd, yyyy')}</td>
                                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.totalDays}</td>
                                        <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{leave.reason || '-'}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2 py-1 rounded ${
                                                leave.status === 'Approved' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                                leave.status === 'Rejected' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                            }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {leaves.length === 0 && (
                                    <tr><td colSpan="6" className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No leave requests found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            totalItems={leaves.length}
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

export default LeaveHistory;
