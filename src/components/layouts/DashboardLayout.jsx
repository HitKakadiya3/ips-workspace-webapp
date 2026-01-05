import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openMenus, setOpenMenus] = useState({ leaveManagement: false });
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const toggleMenu = (menu) => {
        setOpenMenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isCollapsed={isCollapsed}
                openMenus={openMenus}
                toggleMenu={toggleMenu}
                user={user}
            />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Header
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    user={user}
                    handleLogout={handleLogout}
                />

                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
