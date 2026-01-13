import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    Briefcase,
    FileText,
    Timer,
    Users,
    Plane,
    Home,
    BarChart2,
    Megaphone,
    Info,
    Ticket,
    ChevronDown,
    CheckCircle2
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false, hasSubmenu = false, collapsed = false, isOpen = false, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center ${collapsed ? 'justify-center px-2' : 'justify-between px-4'} py-3 cursor-pointer transition-colors ${active ? 'bg-indigo-600 text-white border-l-4 border-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
    >
        <div className={`flex items-center gap-3 ${active ? '-ml-1' : ''}`}>
            {Icon && <Icon size={20} />}
            {!collapsed && <span className="text-sm font-medium">{label}</span>}
        </div>
        {!collapsed && hasSubmenu && (
            <>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </>
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
                <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-indigo-50' : 'bg-gray-600'}`}></span>
                <span className="text-sm">{label}</span>
            </>
        )}
    </Link>
);

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, isCollapsed, openMenus, toggleMenu, user }) => {
    const location = useLocation();
    const isAdmin = user.role === 'Admin';
    const isLeaveManagementActive = location.pathname.startsWith('/leave');
    const isTimesheetActive = location.pathname.startsWith('/timesheet');

    return (
        <>
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
                            icon={CalendarIcon}
                            label="Calendar"
                            to="/calendar"
                            active={location.pathname === '/calendar'}
                            collapsed={isCollapsed}
                        />
                        <SidebarLink
                            icon={Briefcase}
                            label="Projects"
                            to="/projects"
                            active={location.pathname === '/projects'}
                            collapsed={isCollapsed}
                        />
                        <SidebarLink icon={FileText} label="Document Sharing" to="/document-sharing" active={location.pathname === '/document-sharing'} collapsed={isCollapsed} />
                        <SidebarLink icon={Users} label="Attendance" to="#" collapsed={isCollapsed} />

                        {/* Timesheet with Submenu */}
                        <SidebarItem
                            icon={Timer}
                            label="Timesheet"
                            hasSubmenu
                            collapsed={isCollapsed}
                            isOpen={openMenus.timesheet}
                            onClick={() => toggleMenu('timesheet')}
                            active={isTimesheetActive}
                            isAdmin={isAdmin}
                        />
                        {(openMenus.timesheet || isTimesheetActive) && !isCollapsed && (
                            <div className="bg-gray-900/50">
                                {!isAdmin ? (
                                    <>
                                        <SubMenuItem
                                            label="Add Timesheet"
                                            to="/timesheet/add"
                                            active={location.pathname === '/timesheet/add'}
                                            collapsed={isCollapsed}
                                        />
                                        <SubMenuItem
                                            label="Timesheet Details"
                                            to="/timesheet/details"
                                            active={location.pathname === '/timesheet/details'}
                                            collapsed={isCollapsed}
                                        />
                                    </>
                                ) : (
                                    <SubMenuItem
                                        label="Approve Timesheets"
                                        to="/admin/approve-timesheets"
                                        active={location.pathname === '/admin/approve-timesheets'}
                                        collapsed={isCollapsed}
                                    />
                                )}
                            </div>
                        )}

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

                        {!isAdmin && (
                            <SidebarLink icon={Home} label="Work From Home" to="/work-from-home" active={location.pathname === '/work-from-home'} collapsed={isCollapsed} />
                        )}
                        {isAdmin && (
                            <SidebarLink icon={CheckCircle2} label="WFH Approvals" to="/admin/wfh-approval" active={location.pathname === '/admin/wfh-approval'} collapsed={isCollapsed} />
                        )}
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
        </>
    );
};

export default Sidebar;
