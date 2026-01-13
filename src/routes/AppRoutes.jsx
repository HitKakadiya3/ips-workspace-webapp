import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import ApplyLeave from '../pages/ApplyLeave';
import LeaveDetails from '../pages/LeaveDetails';
import LeaveApproval from '../pages/LeaveApproval';
import DocumentSharing from '../pages/DocumentSharing';
import CalendarPage from '../pages/Calendar';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import CreateProject from '../pages/CreateProject';
import AddTimesheet from '../pages/AddTimesheet';
import TimesheetDetails from '../pages/TimesheetDetails';
import Unauthorized from '../pages/Unauthorized';
import AdminApproveTimesheet from '../pages/AdminApproveTimesheet';
import WorkFromHome from '../pages/WorkFromHome';



import ProtectedRoute from '../components/auth/ProtectedRoute';
import PublicRoute from '../components/auth/PublicRoute';
import RoleRoute from '../components/auth/RoleRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />

            <Route path="/register" element={
                <PublicRoute>
                    <Register />
                </PublicRoute>
            } />

            <Route element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/projects/create" element={<CreateProject />} />


                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/leave/apply" element={<ApplyLeave />} />
                <Route path="/leave/details" element={<LeaveDetails />} />
                <Route path="/admin/leave-approval" element={
                    <RoleRoute allowedRoles={['Admin']}>
                        <LeaveApproval />
                    </RoleRoute>
                } />
                <Route path="/document-sharing" element={<DocumentSharing />} />
                <Route path="/timesheet/add" element={<AddTimesheet />} />
                <Route path="/timesheet/details" element={<TimesheetDetails />} />
                <Route path="/admin/approve-timesheets" element={<AdminApproveTimesheet />} />
                <Route path="/work-from-home" element={<WorkFromHome />} />
            </Route>
            <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>

    );
};

export default AppRoutes;
