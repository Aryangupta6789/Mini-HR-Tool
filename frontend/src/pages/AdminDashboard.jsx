import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import AdminNavbar from '../components/AdminNavbar';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEmployees: 0,
        pendingLeaves: 0,
        presentToday: 0,
        totalLeaves: 0
    });
    const [recentLeaves, setRecentLeaves] = useState([]);
    const [recentAttendance, setRecentAttendance] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [usersRes, leavesRes, attendanceRes] = await Promise.all([
                api.get('/auth/users'),
                api.get('/leaves'),
                api.get('/attendance')
            ]);

            const users = usersRes.data;
            const leaves = leavesRes.data;
            const attendance = attendanceRes.data;

            // Calculate stats
            const today = new Date().toISOString().split('T')[0];
            const presentToday = attendance.filter(a => a.date === today && a.status === 'Present').length;
            const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

            setStats({
                totalEmployees: users.length,
                pendingLeaves: pendingLeaves,
                presentToday: presentToday,
                totalLeaves: leaves.length
            });

            // Get recent leaves (last 5)
            setRecentLeaves(leaves.slice(0, 5));

            // Get recent attendance (last 5)
            setRecentAttendance(attendance.slice(0, 5));

        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch dashboard data');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50/30 to-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-gray-900 dark:to-gray-950">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {user?.fullName}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white dark:bg-blue-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Employees</span>
                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">registered users</p>
                    </div>

                    <div className="bg-white dark:bg-yellow-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Pending Requests</span>
                            <div className="w-8 h-8 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pendingLeaves}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">awaiting approval</p>
                    </div>

                    <div className="bg-white dark:bg-green-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Present Today</span>
                            <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.presentToday}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">employees present</p>
                    </div>

                    <div className="bg-white dark:bg-purple-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Leaves</span>
                            <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLeaves}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">all time requests</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link to="/admin/leave-requests" className="bg-white dark:bg-blue-900/15 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Leave Requests</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage leave applications</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/admin/attendance-logs" className="bg-white dark:bg-green-900/15 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-green-600 dark:hover:border-green-500 hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Attendance Logs</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">View attendance records</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/admin/employees" className="bg-white dark:bg-purple-900/15 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-purple-600 dark:hover:border-purple-500 hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Employees</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Manage employee data</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/admin/reports" className="bg-white dark:bg-orange-900/15 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-orange-600 dark:hover:border-orange-500 hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors">
                                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Monthly Reports</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Generate reports</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Leave Requests */}
                    <div className="bg-white dark:bg-indigo-900/15 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Recent Leave Requests</h3>
                            <Link to="/admin/leave-requests" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentLeaves.map((leave) => (
                                <div key={leave._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{leave.userId?.fullName}</span>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                            leave.status === 'Approved' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                            leave.status === 'Rejected' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                            'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                        }`}>
                                            {leave.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{leave.leaveType}</span>
                                        <span>•</span>
                                        <span>{format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd')}</span>
                                        <span>•</span>
                                        <span>{leave.totalDays} days</span>
                                    </div>
                                </div>
                            ))}
                            {recentLeaves.length === 0 && (
                                <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No recent leave requests</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Attendance */}
                    <div className="bg-white dark:bg-teal-900/15 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Recent Attendance</h3>
                            <Link to="/admin/attendance-logs" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentAttendance.map((record) => (
                                <div key={record._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div>
                                        <span className="text-sm text-gray-900 dark:text-white block">{record.userId?.fullName}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(record.date), 'MMM dd, yyyy')}</span>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                        record.status === 'Present' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                    }`}>
                                        {record.status}
                                    </span>
                                </div>
                            ))}
                            {recentAttendance.length === 0 && (
                                <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No recent attendance records</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
