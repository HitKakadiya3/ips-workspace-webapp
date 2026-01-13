import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ChevronRight, ChevronDown, User, LogOut } from 'lucide-react';

const Header = ({ isSidebarOpen, setIsSidebarOpen, isCollapsed, setIsCollapsed, user, handleLogout }) => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const location = useLocation();

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-10 shrink-0">
            <div className="flex items-center gap-4">
                <button
                    className="md:hidden text-gray-500 hover:text-gray-700"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <Menu size={24} />
                </button>

                <button
                    className="hidden md:flex items-center justify-center p-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <div className="transform rotate-180"><ChevronRight size={18} /></div>}
                </button>

                <h2 className="text-xl font-semibold text-gray-800">
                    {location.pathname === '/profile' ? 'Profile Details' :
                        location.pathname === '/leave/apply' ? 'Apply Leave' :
                            location.pathname === '/leave/details' ? 'Leave Details' :
                                location.pathname === '/document-sharing' ? 'All Documents' :
                                    location.pathname === '/admin/leave-approval' ? 'Leave Approvals' :
                                        location.pathname === '/calendar' ? 'Calendar' :
                                            location.pathname === '/projects' ? 'Project List' :
                                                location.pathname === '/projects/create' ? 'Create Project' :
                                                    location.pathname.startsWith('/projects/') ? 'Project Details' :
                                                        location.pathname === '/timesheet/add' ? 'Add Timesheet' :
                                                            location.pathname === '/timesheet/details' ? 'All Timesheets' :
                                                                location.pathname === '/work-from-home' ? 'Work From Home' : 'Dashboard'}
                </h2>
            </div>

            <div className="flex items-center gap-4 relative">
                {/* Profile Dropdown Trigger */}
                <div
                    className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                        {localStorage.getItem('name') || 'User'}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200 shadow-sm transition-transform group-hover:scale-105">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(localStorage.getItem('name') || 'User')}&background=random`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsProfileOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn origin-top-right">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                            </div>
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <User size={16} />
                                <span>My Profile</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
