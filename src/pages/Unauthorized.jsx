import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                {/* Icon Container */}
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-25"></div>
                    <div className="relative bg-white p-5 rounded-full shadow-lg border border-red-50 flex items-center justify-center">
                        <ShieldAlert size={48} className="text-red-500" />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Access Denied
                    </h1>
                    <p className="text-lg text-gray-600">
                        you are not aauthenticate
                    </p>
                    <p className="text-sm text-gray-400 max-w-xs mx-auto">
                        You don't have permission to access this page. Please contact your administrator if you think this is a mistake.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <button
                        onClick={() => navigate('/projects')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        <ArrowLeft size={18} />
                        Go to Projects
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-indigo-200 shadow-lg active:scale-95"
                    >
                        <Home size={18} />
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
