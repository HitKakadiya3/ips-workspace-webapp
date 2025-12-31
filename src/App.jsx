import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ApplyLeave from './pages/ApplyLeave';
import LeaveDetails from './pages/LeaveDetails';
import DocumentSharing from './pages/DocumentSharing';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';

function App() {
  return (
    <BrowserRouter>
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

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/leave/apply" element={
          <ProtectedRoute>
            <ApplyLeave />
          </ProtectedRoute>
        } />
        <Route path="/leave/details" element={
          <ProtectedRoute>
            <LeaveDetails />
          </ProtectedRoute>
        } />
        <Route path="/document-sharing" element={
          <ProtectedRoute>
            <DocumentSharing />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
