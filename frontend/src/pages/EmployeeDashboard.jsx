import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Link, useLocation } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import { format } from 'date-fns';
import ThemeToggle from '../components/ThemeToggle';
import EmployeeNavbar from '../components/EmployeeNavbar';

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [balance, setBalance] = useState(0);
    const location = useLocation();

    // Fetch Data
    const fetchData = async () => {
        try {
            const [leavesRes, attendanceRes, userRes] = await Promise.all([
                api.get('/leaves/my'),
                api.get('/attendance/my-attendance'),
                api.get('/auth/me')
            ]);
            setLeaves(leavesRes.data);
            setAttendance(attendanceRes.data);
            setBalance(userRes.data.leaveBalance);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    // Stats for cards
    const presentToday = attendance.some(a => a.date === new Date().toISOString().split('T')[0] && a.status === 'Present');
    const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
    const daysPresent = attendance.filter(a => a.status === 'Present').length;
    const recentLeaves = leaves.slice(0, 5);
    const recentAttendance = attendance.slice(0, 5);

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50/30 to-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-gray-900 dark:to-gray-950">
            <EmployeeNavbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Welcome, {user?.fullName?.split(' ')[0]}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <div className="bg-white dark:bg-blue-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Leave Balance</span>
                            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{balance}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">days remaining</p>
                    </div>

                    <div className="bg-white dark:bg-green-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Days Present</span>
                            <div className="w-8 h-8 bg-green-50 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{daysPresent}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">total days</p>
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
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{pendingLeaves}</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">awaiting approval</p>
                    </div>

                    <div className="bg-white dark:bg-purple-900/20 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Today's Status</span>
                            <div className={`w-8 h-8 ${presentToday ? 'bg-green-50 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-700'} rounded-lg flex items-center justify-center`}>
                                <svg className={`w-4 h-4 ${presentToday ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className={`text-lg font-semibold ${presentToday ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {presentToday ? 'Present' : 'Not Marked'}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">attendance status</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wide">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link to="/employee/attendance" className="bg-white dark:bg-blue-900/15 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Mark Attendance</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Record your attendance for today</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/employee/leaves/apply" className="bg-white dark:bg-purple-900/15 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-purple-600 dark:hover:border-purple-500 hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50 transition-colors">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">Apply for Leave</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Submit a new leave request</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/employee/leaves" className="bg-white dark:bg-orange-900/15 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-orange-600 dark:hover:border-orange-500 hover:shadow-md transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/30 rounded-xl flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/50 transition-colors">
                                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">View Leave History</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Check status of your requests</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Attendance */}
                    <div className="bg-white dark:bg-teal-900/15 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Recent Attendance</h3>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentAttendance.map((record) => (
                                <div key={record._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <span className="text-sm text-gray-900 dark:text-white">{format(new Date(record.date), 'MMM dd, yyyy')}</span>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                        record.status === 'Present' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                    }`}>
                                        {record.status}
                                    </span>
                                </div>
                            ))}
                            {attendance.length === 0 && (
                                <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No attendance records found</div>
                            )}
                        </div>
                    </div>

                    {/* Recent Leave Requests */}
                    <div className="bg-white dark:bg-indigo-900/15 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Recent Leave Requests</h3>
                            <Link to="/employee/leaves" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentLeaves.map((leave) => (
                                <div key={leave._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">{leave.leaveType}</span>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                            leave.status === 'Approved' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                                            leave.status === 'Rejected' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                            'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
                                        }`}>
                                            {leave.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}</span>
                                        <span>•</span>
                                        <span>{leave.totalDays} days</span>
                                    </div>
                                </div>
                            ))}
                            {leaves.length === 0 && (
                                <div className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No leave requests found</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
