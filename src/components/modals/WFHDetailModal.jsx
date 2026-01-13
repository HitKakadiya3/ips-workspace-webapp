import React from 'react';
import { X, Calendar, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const WFHDetailModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const calculateDays = (start, end) => {
        if (!start || !end) return '-';
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Rejected': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock size={14} className="animate-pulse" />;
            case 'Approved': return <CheckCircle2 size={14} />;
            case 'Rejected': return <XCircle size={14} />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scaleIn transform">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-white font-bold text-lg">Work From Home Details</h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-6">
                        {/* User/Type Info */}
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
                                {(data.name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-800">{data.name || 'Request Detail'}</p>
                                <p className="text-sm text-indigo-600 font-semibold">{data.type}</p>
                            </div>
                        </div>

                        {/* Grid Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Duration</p>
                                <p className="text-gray-700 font-semibold">
                                    {calculateDays(data.startDate, data.endDate)} Days
                                </p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 border ${getStatusStyle(data.status)}`}>
                                    {getStatusIcon(data.status)}
                                    {data.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Start Date</p>
                                <div className="flex items-center gap-2 text-gray-700 font-medium">
                                    <Calendar size={14} className="text-gray-400" />
                                    {formatDate(data.startDate)}
                                </div>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">End Date</p>
                                <div className="flex items-center gap-2 justify-end text-gray-700 font-medium">
                                    <Calendar size={14} className="text-gray-400" />
                                    {formatDate(data.endDate)}
                                </div>
                            </div>
                        </div>

                        {/* Reason */}
                        <div className="space-y-1 pb-4 border-b border-gray-100">
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Reason</p>
                            <p className="text-gray-700 text-sm leading-relaxed italic">
                                "{data.reason || 'No reason provided'}"
                            </p>
                        </div>

                        {/* Metadata */}
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-medium pt-2">
                            <p>ID: {data._id || data.id}</p>
                            <p>Applied on {formatDate(data.createdAt)}</p>
                        </div>

                        {/* Actions */}
                        <div className="pt-4 flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WFHDetailModal;
