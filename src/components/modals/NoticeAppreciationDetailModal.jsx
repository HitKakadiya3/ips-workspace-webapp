import React from 'react';
import { X, Calendar, User, Tag, FileText, Info, Award, AlertTriangle, ShieldAlert } from 'lucide-react';

const NoticeAppreciationDetailModal = ({ isOpen, onClose, data }) => {
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

    const getSeverityStyle = (severity) => {
        switch (severity) {
            case 'Critical': return 'bg-red-600 text-white shadow-red-200';
            case 'High': return 'bg-orange-500 text-white shadow-orange-200';
            case 'Medium': return 'bg-amber-400 text-white shadow-amber-200';
            case 'Low': return 'bg-blue-500 text-white shadow-blue-200';
            default: return 'bg-gray-500 text-white shadow-gray-200';
        }
    };

    const isNotice = data.type === 'Notice';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden animate-scaleIn transform transition-all">
                {/* Header */}
                <div className={`${isNotice ? 'bg-red-600' : 'bg-green-600'} px-6 py-4 flex items-center justify-between shadow-lg`}>
                    <div className="flex items-center gap-3">
                        {isNotice ? <ShieldAlert className="text-white" size={24} /> : <Award className="text-white" size={24} />}
                        <h3 className="text-white font-bold text-lg uppercase tracking-wider">{data.type} Details</h3>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-all">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-8">
                        {/* Title Section */}
                        <div className="border-b border-gray-100 pb-4">
                            <h4 className="text-2xl font-bold text-gray-800 leading-tight mb-2">{data.title}</h4>
                            <div className="flex flex-wrap gap-2 mt-3">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isNotice ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                                    {data.subType}
                                </span>
                                {isNotice && data.severity && (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getSeverityStyle(data.severity)}`}>
                                        {data.severity} SEVERITY
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Employee & Awarder Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-3">Employee</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-indigo-200 p-0.5 shadow-sm">
                                        <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden">
                                            {data.user?.profileImage ? (
                                                <img src={data.user.profileImage} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                data.user?.name?.charAt(0) || '?'
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{data.user?.name || 'Unknown'}</p>
                                        <p className="text-xs text-gray-500 font-medium">Recipient</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50">
                                <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-3">Issued By</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white border-2 border-amber-200 flex items-center justify-center text-amber-600 font-bold shadow-sm">
                                        {data.awardedBy?.name?.charAt(0) || 'A'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{data.awardedBy?.name || 'Administrator'}</p>
                                        <p className="text-xs text-gray-500 font-medium">{isNotice ? 'Issued on' : 'Awarded on'} {formatDate(data.date)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Project & KPI Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    <Tag size={12} className="text-indigo-400" />
                                    Project
                                </div>
                                <p className="text-gray-700 font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100/80 inline-block text-sm">
                                    {data.project?.name || 'General / Non-Project'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    <Info size={12} className="text-indigo-400" />
                                    KPI Category
                                </div>
                                <p className="text-gray-700 font-bold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100/80 inline-block text-sm">
                                    {data.kpiCategory || '-'}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110" />
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                <FileText size={14} className="text-indigo-400" />
                                Message / Description
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed relative z-10 font-medium italic">
                                "{data.description || 'No additional details provided'}"
                            </p>
                        </div>

                        {/* Footer Info */}
                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold pt-4 border-t border-gray-50 italic">
                            <p className="flex items-center gap-1">
                                <Calendar size={12} />
                                Recorded at: {new Date(data.createdAt).toLocaleString()}
                            </p>
                            <p>Ref ID: {data._id?.slice(-8).toUpperCase()}</p>
                        </div>

                        {/* Action */}
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-[0.98]"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeAppreciationDetailModal;
