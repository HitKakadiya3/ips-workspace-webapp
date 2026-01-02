import {
    LayoutDashboard,
    Calendar,
    Briefcase,
    FileText,
    Clock,
    Timer,
    Users,
    Plane,
    Home,
    BarChart2,
    Megaphone,
    Info,
    Ticket,
    ChevronRight,
    Search,
    Bell,
    Menu,
    ChevronLeft,
    User,
    LogOut,
    ChevronDown,
    CheckCircle2
} from 'lucide-react';

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to = "#", active = false, hasSubmenu = false, collapsed = false, isOpen = false, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 cursor-pointer transition-colors ${active ? 'bg-indigo-600 text-white border-l-4 border-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        <div className={`flex items-center gap-3 ${active ? '-ml-1' : ''}`}>
            <Icon size={20} />
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
        </div>
        {!collapsed && hasSubmenu && (
            <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
    </div>
);

const SidebarLink = ({ icon: Icon, label, to = "#", active = false, collapsed = false }) => (
    <Link to={to} className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 cursor-pointer transition-colors ${active ? 'bg-indigo-600 text-white border-l-4 border-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
        <div className={`flex items-center gap-3 ${active ? '-ml-1' : ''}`}>
            {Icon && <Icon size={20} />}
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
        </div>
    </Link>
);

const SubMenuItem = ({ label, to, active, collapsed }) => (
    <Link
        to={to}
        className={`flex items-center gap-3 py-2.5 cursor-pointer transition-colors ${collapsed ? 'justify-center px-2' : 'pl-12 pr-4'} ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
    >
        {!collapsed && (
            <>
                <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-indigo-500' : 'bg-gray-600'}`}></span>
                <span className="text-sm">{label}</span>
            </>
        )}
    </Link>
);

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({ leaveManagement: false });
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Admin';

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const isLeaveManagementActive = location.pathname.startsWith('/leave');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                bg-[#1e1e2d] flex flex-col h-full 
                fixed md:relative z-30 inset-y-0 left-0
                transform transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
                ${isCollapsed ? 'md:w-20' : 'md:w-64 w-64'}
            `}>
                {/* Logo */}
                <Link to="/dashboard" className={`h-16 flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-6'} border-b border-gray-800 transition-all hover:bg-gray-800/50 cursor-pointer group`}>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
                        <span className="text-white font-bold">I</span>
                    </div>
                    {!isCollapsed && (
                        <div className="ml-3 overflow-hidden whitespace-nowrap">
                            <h1 className="text-white font-bold text-lg tracking-wider">IPS</h1>
                            <p className="text-[10px] text-gray-400 tracking-[0.2em] -mt-1">WORKSPACE</p>
                        </div>
                    )}
                </Link>

                {/* Menu */}
                <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
                    <nav className="space-y-0.5">
                        <SidebarLink
                            icon={LayoutDashboard}
                            label="Dashboard"
                            to="/dashboard"
                            active={location.pathname === '/dashboard'}
                            collapsed={isCollapsed}
                        />
                        <SidebarLink
                            icon={Calendar}
                            label="Calendar"
                            to="/calendar"
                            active={location.pathname === '/calendar'}
                            collapsed={isCollapsed}
                        />
                        <SidebarLink icon={Briefcase} label="Projects" to="#" collapsed={isCollapsed} />
                        <SidebarLink icon={FileText} label="Document Sharing" to="/document-sharing" active={location.pathname === '/document-sharing'} collapsed={isCollapsed} />
                        <SidebarLink icon={Users} label="Attendance" to="#" collapsed={isCollapsed} />
                        <SidebarItem icon={Timer} label="Timesheet" hasSubmenu collapsed={isCollapsed} />
                        <SidebarItem icon={Users} label="Client Timesheet" hasSubmenu collapsed={isCollapsed} />

                        {/* Leave Management with Submenu */}
                        <SidebarItem
                            icon={Plane}
                            label="Leave Management"
                            hasSubmenu
                            collapsed={isCollapsed}
                            isOpen={openMenus.leaveManagement}
                            onClick={() => toggleMenu('leaveManagement')}
                            active={isLeaveManagementActive}
                        />
                        {(openMenus.leaveManagement || isLeaveManagementActive) && !isCollapsed && (
                            <div className="bg-gray-900/50">
                                {!isAdmin ? (
                                    <>
                                        <SubMenuItem
                                            label="Apply Leave"
                                            to="/leave/apply"
                                            active={location.pathname === '/leave/apply'}
                                            collapsed={isCollapsed}
                                        />
                                        <SubMenuItem
                                            label="Leave Details"
                                            to="/leave/details"
                                            active={location.pathname === '/leave/details'}
                                            collapsed={isCollapsed}
                                        />
                                    </>
                                ) : (
                                    <SubMenuItem
                                        label="Leave Approval"
                                        to="/admin/leave-approval"
                                        active={location.pathname === '/admin/leave-approval'}
                                        collapsed={isCollapsed}
                                    />
                                )}
                            </div>
                        )}

                        {isAdmin && (
                            <SidebarLink
                                icon={CheckCircle2}
                                label="Leave Approval"
                                to="/admin/leave-approval"
                                active={location.pathname === '/admin/leave-approval'}
                                collapsed={isCollapsed}
                            />
                        )}

                        <SidebarLink icon={Home} label="Work From Home" to="#" collapsed={isCollapsed} />
                        <SidebarItem icon={BarChart2} label="KPI" hasSubmenu collapsed={isCollapsed} />
                        <SidebarLink icon={Megaphone} label="Announcements" to="#" collapsed={isCollapsed} />
                        <SidebarLink icon={Info} label="Notice and Appreciation" to="#" collapsed={isCollapsed} />
                        <SidebarLink icon={Ticket} label="Tickets" to="#" collapsed={isCollapsed} />
                    </nav>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-800 text-center">
                    {!isCollapsed && <p className="text-xs text-gray-600">V.1.0.0</p>}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
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
                                                location.pathname === '/calendar' ? 'Calendar' : 'Dashboard'}
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

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
