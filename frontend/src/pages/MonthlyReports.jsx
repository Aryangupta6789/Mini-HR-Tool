import { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import AdminNavbar from '../components/AdminNavbar';

const MonthlyReports = () => {
    const [monthlyReports, setMonthlyReports] = useState(null);
    const currentDate = new Date();
    const [reportMonth, setReportMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, '0'));
    const [reportYear, setReportYear] = useState(String(currentDate.getFullYear()));

    useEffect(() => {
        fetchMonthlyReports();
    }, [reportMonth, reportYear]);

    const fetchMonthlyReports = async () => {
        try {
            const { data } = await api.get(`/reports/monthly?month=${reportMonth}&year=${reportYear}`);
            setMonthlyReports(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch monthly reports');
        }
    };

    const generateCSV = (reports) => {
        const headers = ['Employee Name', 'Email', 'Total Days', 'Present', 'Absent', 'Attendance %', 'Total Leaves', 'Casual', 'Sick', 'Paid'];
        const csvRows = [headers.join(',')];

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
                report.leaves.paid
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\r\n');
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50/30 to-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-gray-900 dark:to-gray-950">
            <AdminNavbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Monthly Reports</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generate and download monthly attendance and leave reports</p>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Report Data</h2>
                            <div className="flex flex-wrap gap-3">
                                <select
                                    value={reportMonth}
                                    onChange={(e) => setReportMonth(e.target.value)}
                                    className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
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
                                    className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
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
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Employee</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Present</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Absent</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Att. %</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Leaves</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Casual</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sick</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Paid</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {monthlyReports?.reports?.map((report) => (
                                    <tr key={report.userId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{report.fullName}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{report.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400 font-semibold">{report.attendance.present}</td>
                                        <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400 font-semibold">{report.attendance.absent}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-semibold ${
                                                report.attendance.percentage >= 90 ? 'text-green-600 dark:text-green-400' :
                                                report.attendance.percentage >= 75 ? 'text-yellow-600 dark:text-yellow-400' :
                                                'text-red-600 dark:text-red-400'
                                            }`}>
                                                {report.attendance.percentage}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{report.leaves.totalDays} day(s)</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{report.leaves.casual}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{report.leaves.sick}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{report.leaves.paid}</td>
                                    </tr>
                                ))}
                                {(!monthlyReports || monthlyReports.reports?.length === 0) && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                            {!monthlyReports ? 'Loading reports...' : 'No reports available for this month'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyReports;
