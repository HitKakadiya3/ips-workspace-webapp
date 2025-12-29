// src/components/AuthLayout.jsx
import React from "react";

const AuthLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Left Side - Brand & Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900 justify-center items-center">
                {/* Background Image / Gradient */}
                <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-blue-700 opacity-90 z-0"></div>

                {/* Abstract Shapes */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>

                {/* Content */}
                <div className="relative z-10 p-12 text-center text-white max-w-lg">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/30">
                        <span className="font-bold text-2xl">IPS</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-6 tracking-tight">Manage Your Workspace</h2>
                    <p className="text-lg text-indigo-100 leading-relaxed font-light">
                        Experience a new way of organizing your tasks and projects.
                        Simple, beautiful, and efficient.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-24 bg-white">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
