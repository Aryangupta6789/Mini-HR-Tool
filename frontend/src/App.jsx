import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LeaveRequests from './pages/LeaveRequests';
import AttendanceLogs from './pages/AttendanceLogs';
import EmployeeManagement from './pages/EmployeeManagement';
import MonthlyReports from './pages/MonthlyReports';
import { ToastContainer } from 'react-toastify';
import { LoadingProvider } from './context/LoadingContext';
import 'react-toastify/dist/ReactToastify.css';

import LeaveHistory from './pages/LeaveHistory';
import MarkAttendance from './pages/MarkAttendance';
import ApplyLeave from './pages/ApplyLeave';
import AttendanceHistory from './pages/AttendanceHistory';

const HomeRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return user.role === 'admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="/employee-dashboard" />;
};

function App() {
  return (
    <ThemeProvider>
        <LoadingProvider>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    <Route path="/" element={<HomeRedirect />} />

                    {/* Employee Routes */}
                    <Route element={<PrivateRoute allowedRoles={['employee']} />}>
                        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                        <Route path="/employee/leaves" element={<LeaveHistory />} />
                        <Route path="/employee/attendance" element={<MarkAttendance />} />
                        <Route path="/employee/attendance-history" element={<AttendanceHistory />} />
                        <Route path="/employee/leaves/apply" element={<ApplyLeave />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="/admin/leave-requests" element={<LeaveRequests />} />
                        <Route path="/admin/attendance-logs" element={<AttendanceLogs />} />
                        <Route path="/admin/employees" element={<EmployeeManagement />} />
                        <Route path="/admin/reports" element={<MonthlyReports />} />
                    </Route>
                </Routes>
                <ToastContainer />
            </AuthProvider>
        </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;
