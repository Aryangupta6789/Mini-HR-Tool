import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import Pagination from '../components/Pagination';
import AdminNavbar from '../components/AdminNavbar';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [monthlyReports, setMonthlyReports] = useState(null);
    const [activeTab, setActiveTab] = useState('leaves'); // leaves, attendance, employees, reports
    const [leaveFilter, setLeaveFilter] = useState('All');
    const [attendanceFilter, setAttendanceFilter] = useState({ startDate: '', endDate: '', employee: '' });
    
    // Report Filters
    const currentDate = new Date();
    const [reportMonth, setReportMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, '0'));
    const [reportYear, setReportYear] = useState(String(currentDate.getFullYear()));

    // Pagination State
    const [leavesPage, setLeavesPage] = useState(1);
    const [attendancePage, setAttendancePage] = useState(1);
    const [usersPage, setUsersPage] = useState(1);
    const itemsPerPage = 10;

    const fetchData = async () => {
        try {
            const [usersRes, leavesRes, attendanceRes] = await Promise.all([
                api.get('/auth/users'),
                api.get('/leaves'),
                api.get('/attendance')
            ]);
            setUsers(usersRes.data);
            setLeaves(leavesRes.data);
            setAttendance(attendanceRes.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch admin data');
        }
    };

    const fetchMonthlyReports = async () => {
        try {
            const { data } = await api.get(`/reports/monthly?month=${reportMonth}&year=${reportYear}`);
            setMonthlyReports(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch monthly reports');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (activeTab === 'reports') {
            fetchMonthlyReports();
        }
    }, [activeTab, reportMonth, reportYear]);

    const handleLeaveAction = async (id, status) => {
        try {
            await api.put(`/leaves/${id}`, { status });
            toast.success(`Leave ${status} & Email Notification Sent`);
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    // Calculate Stats
    const totalEmployees = users.length;
    const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
    const presentToday = attendance.filter(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'Present').length;


    // CSV Export Functions
    const generateCSV = (reports) => {
        // CSV Header
        const headers = ['Employee Name', 'Email', 'Total Days', 'Present', 'Absent', 'Attendance %', 'Total Leaves', 'Casual', 'Sick', 'Earned'];
        const csvRows = [headers.join(',')];

        // CSV Data Rows
        reports.forEach(report => {
            const row = [
                `"${report.fullName}"`,
                `"${report.email}"`,
                report.attendance.totalDays,
                report.attendance.present,
                report.attendance.absent,
                report.attendance.percentage,
                report.leaves.totalDays,
                report.leaves.casual,
                report.leaves.sick,
                report.leaves.earned
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    };

    const downloadCSV = (csvContent, filename) => {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    };

    // Filter Logic
    const filteredLeaves = leaves.filter(leave => leaveFilter === 'All' || leave.status === leaveFilter);
    const filteredAttendance = attendance.filter(record => {
        const recordDate = record.date;
        const matchesStartDate = !attendanceFilter.startDate || recordDate >= attendanceFilter.startDate;
        const matchesEndDate = !attendanceFilter.endDate || recordDate <= attendanceFilter.endDate;
        const matchesEmployee = !attendanceFilter.employee || 
            record.userId?.fullName?.toLowerCase().includes(attendanceFilter.employee.toLowerCase());
        return matchesStartDate && matchesEndDate && matchesEmployee;
    });

    // Pagination Logic
    const paginate = (items, page) => {
        const start = (page - 1) * itemsPerPage;
        return items.slice(start, start + itemsPerPage);
    };

    const paginatedLeaves = paginate(filteredLeaves, leavesPage);
    const paginatedAttendance = paginate(filteredAttendance, attendancePage);
    const paginatedUsers = paginate(users, usersPage);


    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50/30 to-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-gray-900 dark:to-gray-950">
            <AdminNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-5">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Total Employees</div>
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{totalEmployees}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-5">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Pending Requests</div>
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{pendingLeaves}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-5">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Present Today</div>
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">{presentToday}</div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                    {activeTab === 'leaves' && (
                        <div>
                            <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Leave Management</h2>
                                <select
                                    value={leaveFilter}
                                    onChange={(e) => { setLeaveFilter(e.target.value); setLeavesPage(1); }}
                                    className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm p-2"
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
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Duration</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Days</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Reason</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {paginatedLeaves.map((leave) => (
                                            <tr key={leave._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-5 py-3 text-sm text-gray-900 dark:text-white">{leave.userId?.fullName}</td>
                                                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{leave.leaveType}</td>
                                                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">
                                                    {format(new Date(leave.startDate), 'MMM d')} - {format(new Date(leave.endDate), 'MMM d')}
                                                </td>
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
                                                <td className="px-5 py-3 text-sm">
                                                    {leave.status === 'Pending' && (
                                                        <div className="flex gap-3">
                                                            <button 
                                                                onClick={() => handleLeaveAction(leave._id, 'Approved')}
                                                                className="text-green-600 dark:text-green-500 hover:text-green-800 dark:hover:text-green-400"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button 
                                                                onClick={() => handleLeaveAction(leave._id, 'Rejected')}
                                                                className="text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredLeaves.length === 0 && (
                                            <tr><td colSpan="7" className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No requests found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                                <Pagination
                                    totalItems={filteredLeaves.length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={leavesPage}
                                    onPageChange={setLeavesPage}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'attendance' && (
                        <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700 gap-4">
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Daily Attendance Logs</h2>
                                <div className="flex flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">From:</span>
                                        <input
                                            type="date"
                                            value={attendanceFilter.startDate}
                                            onChange={(e) => { setAttendanceFilter({...attendanceFilter, startDate: e.target.value}); setAttendancePage(1); }}
                                            className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm p-2"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">To:</span>
                                        <input
                                            type="date"
                                            value={attendanceFilter.endDate}
                                            onChange={(e) => { setAttendanceFilter({...attendanceFilter, endDate: e.target.value}); setAttendancePage(1); }}
                                            className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm p-2"
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        value={attendanceFilter.employee}
                                        onChange={(e) => { setAttendanceFilter({...attendanceFilter, employee: e.target.value}); setAttendancePage(1); }}
                                        className="border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm p-2"
                                        placeholder="Search Employee..."
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {paginatedAttendance.map((record) => (
                                            <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{record.date}</td>
                                                <td className="px-5 py-3 text-sm text-gray-900 dark:text-white">{record.userId?.fullName}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`text-xs px-2 py-1 rounded ${
                                                        record.status === 'Present' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                                    }`}>
                                                        {record.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredAttendance.length === 0 && (
                                            <tr><td colSpan="3" className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No attendance records found</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                                <Pagination
                                    totalItems={filteredAttendance.length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={attendancePage}
                                    onPageChange={setAttendancePage}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div>
                            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Registered Employees</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Joined Date</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Leave Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {paginatedUsers.map((u) => (
                                            <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-5 py-3 text-sm text-gray-900 dark:text-white">{u.fullName}</td>
                                                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{u.email}</td>
                                                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400 capitalize">{u.role}</td>
                                                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{format(new Date(u.dateOfJoining), 'yyyy-MM-dd')}</td>
                                                <td className="px-5 py-3 text-sm text-gray-900 dark:text-white font-semibold">{u.leaveBalance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-700">
                                <Pagination
                                    totalItems={users.length}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={usersPage}
                                    onPageChange={setUsersPage}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div>
                            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Monthly Reports</h2>
                                    <div className="flex gap-3">
                                        <select
                                            value={reportMonth}
                                            onChange={(e) => setReportMonth(e.target.value)}
                                            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                                        >
                                            <option value="01">January</option>
                                            <option value="02">February</option>
                                            <option value="03">March</option>
                                            <option value="04">April</option>
                                            <option value="05">May</option>
                                            <option value="06">June</option>
                                            <option value="07">July</option>
                                            <option value="08">August</option>
                                            <option value="09">September</option>
                                            <option value="10">October</option>
                                            <option value="11">November</option>
                                            <option value="12">December</option>
                                        </select>
                                        <select
                                            value={reportYear}
                                            onChange={(e) => setReportYear(e.target.value)}
                                            className="px-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md"
                                        >
                                            {[2024, 2025, 2026, 2027].map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={() => {
                                                if (monthlyReports?.reports && monthlyReports.reports.length > 0) {
                                                    const csv = generateCSV(monthlyReports.reports);
                                                    downloadCSV(csv, `Monthly_Report_${monthlyReports.monthName}_${monthlyReports.year}.csv`);
                                                    toast.success('Report downloaded successfully!');
                                                } else {
                                                    toast.error('No data to export');
                                                }
                                            }}
                                            disabled={!monthlyReports || monthlyReports.reports?.length === 0}
                                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors"
                                        >
                                            Download CSV
                                        </button>
                                    </div>
                                </div>
                                {monthlyReports && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Showing report for {monthlyReports.monthName} {monthlyReports.year}
                                    </p>
                                )}
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Employee</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Present</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Absent</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Att. %</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Leaves</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Casual</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Sick</th>
                                            <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Earned</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {monthlyReports?.reports?.map((report) => (
                                            <tr key={report.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <td className="px-5 py-3">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{report.fullName}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{report.email}</div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3 text-sm text-green-600 dark:text-green-400 font-semibold">{report.attendance.present}</td>
                                                <td className="px-5 py-3 text-sm text-red-600 dark:text-red-400 font-semibold">{report.attendance.absent}</td>
                                                <td className="px-5 py-3">
                                                    <span className={`text-sm font-semibold ${
                                                        report.attendance.percentage >= 90 ? 'text-green-600 dark:text-green-400' :
                                                        report.attendance.percentage >= 75 ? 'text-yellow-600 dark:text-yellow-400' :
                                                        'text-red-600 dark:text-red-400'
                                                    }`}>
                                                        {report.attendance.percentage}%
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3 text-sm text-gray-900 dark:text-white">{report.leaves.totalDays} day(s)</td>
                                                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{report.leaves.casual}</td>
                                                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{report.leaves.sick}</td>
                                                <td className="px-5 py-3 text-sm text-gray-600 dark:text-gray-400">{report.leaves.earned}</td>
                                            </tr>
                                        ))}
                                        {(!monthlyReports || monthlyReports.reports?.length === 0) && (
                                            <tr>
                                                <td colSpan="8" className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    {!monthlyReports ? 'Loading reports...' : 'No reports available for this month'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
