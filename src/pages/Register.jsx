import React, { useState } from 'react';
import { Eye, EyeOff, Disc } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import AuthLayout from '../components/AuthLayout';
import { register } from '../services/api';

const registerSchema = yup.object().shape({
    name: yup.string().required("Name is required").min(2, "Name must be at least 2 characters long"),
    email: yup.string().required("Email is required").email("Please enter a valid email address"),
    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
});

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});

        try {
            await registerSchema.validate(formData, { abortEarly: false });
        } catch (validationErr) {
            const newErrors = {};
            validationErr.inner.forEach((err) => {
                newErrors[err.path] = err.message;
            });
            setValidationErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            await register(formData.name, formData.password, formData.email);
            navigate('/login');
        } catch (err) {
            console.error(err);
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                <p className="text-gray-500">Join IPS Workspace today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
                {/* Name */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">
                        Name
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name || ''}
                        onChange={(e) => {
                            setFormData({ ...formData, name: e.target.value });
                            if (validationErrors.name) setValidationErrors({ ...validationErrors, name: null });
                        }}
                        className={`w-full px-5 py-4 rounded-xl border ${validationErrors.name ? 'border-red-500 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'} text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 ${validationErrors.name ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all duration-200`}
                    />
                    {validationErrors.name && (
                        <p className="text-sm text-red-600 mt-1 ml-1">{validationErrors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value });
                            if (validationErrors.email) setValidationErrors({ ...validationErrors, email: null });
                        }}
                        className={`w-full px-5 py-4 rounded-xl border ${validationErrors.email ? 'border-red-500 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'} text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 ${validationErrors.email ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all duration-200`}
                    />
                    {validationErrors.email && (
                        <p className="text-sm text-red-600 mt-1 ml-1">{validationErrors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700 block">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value });
                                if (validationErrors.password) setValidationErrors({ ...validationErrors, password: null });
                            }}
                            className={`w-full px-5 py-4 rounded-xl border ${validationErrors.password ? 'border-red-500 bg-red-50/50' : 'border-gray-200 bg-gray-50/50'} text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 ${validationErrors.password ? 'focus:ring-red-500/20 focus:border-red-500' : 'focus:ring-indigo-500/20 focus:border-indigo-500'} transition-all duration-200 pr-12`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition p-1 rounded-md hover:bg-gray-100"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {validationErrors.password && (
                        <p className="text-sm text-red-600 mt-1 ml-1">{validationErrors.password}</p>
                    )}
                </div>

                {/* API Error */}
                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-4 flex items-center gap-2 whitespace-pre-line">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
                        {error}
                    </div>
                )}

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-70 disabled:hover:shadow-none disabled:translate-y-0"
                >
                    {loading ? 'Creating account...' : 'Create Account'}
                </button>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Register;
