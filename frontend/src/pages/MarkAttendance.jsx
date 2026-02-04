import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EmployeeNavbar from '../components/EmployeeNavbar';

const MarkAttendance = () => {
    const [attendance, setAttendance] = useState([]);

    const fetchAttendance = async () => {
        try {
            const { data } = await api.get('/attendance/my-attendance');
            setAttendance(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch attendance');
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    const handleMarkAttendance = async (status) => {
        try {
            await api.post('/attendance', { status });
            toast.success(`Marked as ${status}`);
            fetchAttendance();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to mark attendance');
        }
    };

    // Derived State
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const todayRecord = attendance.find(a => a.date === todayStr);
    const isMarked = !!todayRecord;

    const currentMonthStart = startOfMonth(new Date());
    const currentMonthEnd = endOfMonth(new Date());

    const monthlyRecords = attendance.filter(a => 
        isWithinInterval(new Date(a.date), { start: currentMonthStart, end: currentMonthEnd })
    );

    const totalPresent = monthlyRecords.filter(a => a.status === 'Present').length;
    const totalAbsent = monthlyRecords.filter(a => a.status === 'Absent').length;
    const attendancePercentage = monthlyRecords.length > 0 
        ? Math.round((totalPresent / monthlyRecords.length) * 100) 
        : 0;

    // Tile class name for calendar
    const getTileClassName = ({ date }) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const record = attendance.find(a => a.date === dateStr);
        
        if (record) {
            return record.status === 'Present' ? 'highlight-present' : 'highlight-absent';
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50/30 to-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-gray-900 dark:to-gray-950">
            <EmployeeNavbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Mark Attendance</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Action Cards */}
                    <div className="flex flex-col gap-6">
                        {/* Action Card */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-5">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Today's Attendance</h3>
                            
                            {isMarked ? (
                                <div className="text-center py-4">
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded ${
                                        todayRecord.status === 'Present' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                    }`}>
                                        <div className="w-2 h-2 rounded-full bg-current"></div>
                                        Marked as {todayRecord.status}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Have a great day!</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Please mark your attendance for today</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => handleMarkAttendance('Present')}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
                                        >
                                            Present
                                        </button>
                                        <button 
                                            onClick={() => handleMarkAttendance('Absent')}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Monthly Stats Summary */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-5">
                             <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">This Month</h3>
                             <div className="grid grid-cols-3 gap-3 text-center">
                                 <div className="p-3 rounded bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                                     <div className="text-xl font-semibold text-gray-900 dark:text-white">{totalPresent}</div>
                                     <div className="text-xs text-gray-500 dark:text-gray-400 uppercase mt-1">Present</div>
                                 </div>
                                 <div className="p-3 rounded bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                                     <div className="text-xl font-semibold text-gray-900 dark:text-white">{totalAbsent}</div>
                                     <div className="text-xs text-gray-500 dark:text-gray-400 uppercase mt-1">Absent</div>
                                 </div>
                                 <div className="p-3 rounded bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                                     <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">{attendancePercentage}%</div>
                                     <div className="text-xs text-gray-500 dark:text-gray-400 uppercase mt-1">Rate</div>
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Calendar */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-5 lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Attendance Calendar</h2>
                             <div className="flex gap-4 text-xs">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Present</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span className="text-gray-600 dark:text-gray-400">Absent</span>
                                </div>
                            </div>
                        </div>

                        <Calendar
                            tileClassName={getTileClassName}
                            className="w-full border-0"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarkAttendance;
