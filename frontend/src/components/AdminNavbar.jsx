import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import ConfirmationModal from './ConfirmationModal';

const AdminNavbar = () => {
    const { logout } = useAuth();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const confirmLogout = () => {
        logout();
        setIsLogoutModalOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <nav className="bg-gradient-to-r from-cyan-50 via-cyan-50/80 to-blue-50 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Portal</h1>
                            </div>
                            <div className="hidden md:flex gap-2">
                                <Link
                                    to="/admin-dashboard"
                                    className={`${isActive('/admin-dashboard') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-300'} px-3 py-2 rounded-lg text-sm transition-all`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/admin/leave-requests"
                                    className={`${isActive('/admin/leave-requests') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-300'} px-3 py-2 rounded-lg text-sm transition-all`}
                                >
                                    Leave Requests
                                </Link>
                                <Link
                                    to="/admin/attendance-logs"
                                    className={`${isActive('/admin/attendance-logs') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-300'} px-3 py-2 rounded-lg text-sm transition-all`}
                                >
                                    Attendance Logs
                                </Link>
                                <Link
                                    to="/admin/employees"
                                    className={`${isActive('/admin/employees') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-300'} px-3 py-2 rounded-lg text-sm transition-all`}
                                >
                                    Employees
                                </Link>
                                <Link
                                    to="/admin/reports"
                                    className={`${isActive('/admin/reports') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-300'} px-3 py-2 rounded-lg text-sm transition-all`}
                                >
                                    Monthly Reports
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <button onClick={() => setIsLogoutModalOpen(true)} className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                                Logout
                            </button>
                            
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                        <div className="px-4 py-3 space-y-1">
                            <Link
                                to="/admin-dashboard"
                                onClick={closeMobileMenu}
                                className={`${isActive('/admin-dashboard') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'} block px-3 py-2 rounded-lg text-sm transition-all`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/admin/leave-requests"
                                onClick={closeMobileMenu}
                                className={`${isActive('/admin/leave-requests') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'} block px-3 py-2 rounded-lg text-sm transition-all`}
                            >
                                Leave Requests
                            </Link>
                            <Link
                                to="/admin/attendance-logs"
                                onClick={closeMobileMenu}
                                className={`${isActive('/admin/attendance-logs') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'} block px-3 py-2 rounded-lg text-sm transition-all`}
                            >
                                Attendance Logs
                            </Link>
                            <Link
                                to="/admin/employees"
                                onClick={closeMobileMenu}
                                className={`${isActive('/admin/employees') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'} block px-3 py-2 rounded-lg text-sm transition-all`}
                            >
                                Employees
                            </Link>
                            <Link
                                to="/admin/reports"
                                onClick={closeMobileMenu}
                                className={`${isActive('/admin/reports') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'} block px-3 py-2 rounded-lg text-sm transition-all`}
                            >
                                Monthly Reports
                            </Link>
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => {
                                        closeMobileMenu();
                                        setIsLogoutModalOpen(true);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            <ConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={confirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to log out of your account?"
                confirmText="Logout"
                isDestructive={true}
            />
        </>
    );
};

export default AdminNavbar;
