import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Pagination from '../components/Pagination';
import AdminNavbar from '../components/AdminNavbar';

const AttendanceLogs = () => {
    const [attendance, setAttendance] = useState([]);
    const [attendanceFilter, setAttendanceFilter] = useState({ startDate: '', endDate: '', employee: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const { data } = await api.get('/attendance');
            setAttendance(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch attendance logs');
        }
    };

    // Filter Logic
    const filteredAttendance = attendance.filter(record => {
        const recordDate = record.date;
        const matchesStartDate = !attendanceFilter.startDate || recordDate >= attendanceFilter.startDate;
        const matchesEndDate = !attendanceFilter.endDate || recordDate <= attendanceFilter.endDate;
        const matchesEmployee = !attendanceFilter.employee || 
            record.userId?.fullName?.toLowerCase().includes(attendanceFilter.employee.toLowerCase());
        return matchesStartDate && matchesEndDate && matchesEmployee;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedAttendance = filteredAttendance.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50/30 to-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-gray-900 dark:to-gray-950">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Attendance Logs</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View daily attendance records</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700 gap-4">
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">All Attendance Records</h2>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">From:</span>
                                <input
                                    type="date"
                                    value={attendanceFilter.startDate}
                                    onChange={(e) => { setAttendanceFilter({...attendanceFilter, startDate: e.target.value}); setCurrentPage(1); }}
                                    className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm px-3 py-2"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 dark:text-gray-400">To:</span>
                                <input
                                    type="date"
                                    value={attendanceFilter.endDate}
                                    onChange={(e) => { setAttendanceFilter({...attendanceFilter, endDate: e.target.value}); setCurrentPage(1); }}
                                    className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm px-3 py-2"
                                />
                            </div>
                            <input
                                type="text"
                                value={attendanceFilter.employee}
                                onChange={(e) => { setAttendanceFilter({...attendanceFilter, employee: e.target.value}); setCurrentPage(1); }}
                                className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm px-3 py-2"
                                placeholder="Search Employee..."
                            />
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {paginatedAttendance.map((record) => (
                                    <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{format(new Date(record.date), 'MMM dd, yyyy')}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{record.userId?.fullName}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                                record.status === 'Present' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {filteredAttendance.length === 0 && (
                                    <tr><td colSpan="3" className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No attendance records found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                        <Pagination
                            totalItems={filteredAttendance.length}
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

export default AttendanceLogs;
