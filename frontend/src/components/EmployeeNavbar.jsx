import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import ConfirmationModal from './ConfirmationModal';

const EmployeeNavbar = () => {
    const { user, logout } = useAuth();
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
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Portal</h1>
                            </div>
                            <div className="hidden md:flex gap-2">
                                <Link
                                    to="/employee-dashboard"
                                    className={`${isActive('/employee-dashboard') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-300'} px-3 py-2 rounded-lg text-sm transition-all`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/employee/attendance"
                                    className={`${isActive('/employee/attendance') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-300'} px-3 py-2 rounded-lg text-sm transition-all`}
                                >
                                    Mark Attendance
                                </Link>
                                <Link
                                    to="/employee/attendance-history"
                                    className={`${isActive('/employee/attendance-history') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-300'} px-3 py-2 rounded-lg text-sm transition-all`}
                                >
                                    Attendance History
                                </Link>
                                <Link
                                    to="/employee/leaves/apply"
                                    className={`${isActive('/employee/leaves/apply') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-300'} px-3 py-2 rounded-lg text-sm transition-all`}
                                >
                                    Apply Leave
                                </Link>
                                <Link
                                    to="/employee/leaves"
                                    className={`${isActive('/employee/leaves') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-300'} px-3 py-2 rounded-lg text-sm transition-all`}
                                >
                                    Leave History
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 backdrop-blur-sm">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.fullName}</span>
                            </div>
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
                                to="/employee-dashboard"
                                onClick={closeMobileMenu}
                                className={`${isActive('/employee-dashboard') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'} block px-3 py-2 rounded-lg text-sm transition-all`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/employee/attendance"
                                onClick={closeMobileMenu}
                                className={`${isActive('/employee/attendance') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'} block px-3 py-2 rounded-lg text-sm transition-all`}
                            >
                                Mark Attendance
                            </Link>
                            <Link
                                to="/employee/attendance-history"
                                onClick={closeMobileMenu}
                                className={`${isActive('/employee/attendance-history') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'} block px-3 py-2 rounded-lg text-sm transition-all`}
                            >
                                Attendance History
                            </Link>
                            <Link
                                to="/employee/leaves/apply"
                                onClick={closeMobileMenu}
                                className={`${isActive('/employee/leaves/apply') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'} block px-3 py-2 rounded-lg text-sm transition-all`}
                            >
                                Apply Leave
                            </Link>
                            <Link
                                to="/employee/leaves"
                                onClick={closeMobileMenu}
                                className={`${isActive('/employee/leaves') ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium' : 'text-gray-600 dark:text-gray-400'} block px-3 py-2 rounded-lg text-sm transition-all`}
                            >
                                Leave History
                            </Link>
                            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="font-medium">{user?.fullName}</span>
                                </div>
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

export default EmployeeNavbar;
