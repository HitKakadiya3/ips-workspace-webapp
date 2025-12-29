import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import AuthLayout from "../components/layouts/AuthLayout";
import { login } from "../services/api";

const loginSchema = yup.object().shape({
    email: yup.string().required("Email is required").email("Please enter a valid email address"),
    password: yup.string().required("Password is required"),
});

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
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
            await loginSchema.validate(formData, { abortEarly: false });
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
            const response = await login(formData.email, formData.password);

            // Store authentication token
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            // Store user information for dashboard
            if (response.data.user) {
                localStorage.setItem('userId', response.data.user.id || response.data.user._id);
                localStorage.setItem('name', response.data.user.name);
                localStorage.setItem('email', response.data.user.email);
            }

            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Invalid username or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p className="text-gray-500">Sign in to continue to your workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
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
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 block">
                            Password
                        </label>
                        <a href="#" className="text-sm text-indigo-600 font-medium hover:text-indigo-700 hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
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

                {/* Error */}
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
                    {loading ? "Signing in..." : "Sign in"}
                </button>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-8">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
                    >
                        Create account
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login;
