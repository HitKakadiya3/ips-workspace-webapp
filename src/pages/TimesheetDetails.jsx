import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Plus, Eye, Calendar, ChevronDown, Loader2, AlertCircle, Clock, CheckCircle2, XCircle, X, Trash2 } from 'lucide-react';
import { useGetTimesheetsQuery, useDeleteTimesheetMutation } from '../store/api/timesheetApi';

const TimesheetDetails = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Pending');
    const [showDescription, setShowDescription] = useState(false);
    const [detailModal, setDetailModal] = useState({ open: false, data: null, loading: false });

    // ... (params logic)
    const params = useParams();
    const routeUserId = params.userId || params.id;

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const localUserId = user.id || user._id;
    const queryUserId = routeUserId || localUserId;

    const {
        data: timesheetData = {},
        isLoading,
        isError,
        error,
        refetch
    } = useGetTimesheetsQuery(
        { userId: queryUserId, status: 'All' },
        { skip: !queryUserId }
    );

    const [deleteTimesheet] = useDeleteTimesheetMutation();

    // ... (lists logic)
    // timesheetData may be either:
    // - an object shaped { pending: [...], approved: [...], rejected: [...] }
    // - or an array (older API shape)
    const pendingList = Array.isArray(timesheetData.pending) ? timesheetData.pending : Array.isArray(timesheetData) && status === 'Pending' ? timesheetData : [];
    const approvedList = Array.isArray(timesheetData.approved) ? timesheetData.approved : Array.isArray(timesheetData) && status === 'Approved' ? timesheetData : [];
    const rejectedList = Array.isArray(timesheetData.rejected) ? timesheetData.rejected : Array.isArray(timesheetData) && status === 'Rejected' ? timesheetData : [];

    const displayedRows = status === 'Pending' ? pendingList : status === 'Approved' ? approvedList : rejectedList;

    const stats = {
        Pending: pendingList.length || 0,
        Approved: approvedList.length || 0,
        Rejected: rejectedList.length || 0,
    };

    const getText = (value, fallback = 'N/A') => {
        if (value === null || value === undefined) return fallback;
        if (typeof value === 'string' || typeof value === 'number') return value;
        if (typeof value === 'object') return value.name || value.title || value._id || fallback;
        return String(value);
    };

    const formatDate = (d) => {
        if (!d) return 'N/A';
        if (typeof d === 'string' || typeof d === 'number') {
            const dt = new Date(d);
            if (!isNaN(dt)) return dt.toLocaleDateString();
            return String(d);
        }
        if (typeof d === 'object') {
            if (d.date) return formatDate(d.date);
            if (d.createdAt) return formatDate(d.createdAt);
            return getText(d);
        }
        return String(d);
    };

    const formatField = (field) => {
        if (field == null) return 'N/A';
        if (typeof field === 'string' || typeof field === 'number') return field;
        if (typeof field === 'object') return field.name || field.title || field._id || JSON.stringify(field);
        return String(field);
    };

    const handleViewDetails = (timesheet) => {
        const employeeName = getText(timesheet.employee || timesheet.user || user);
        setDetailModal({
            open: true,
            data: { ...timesheet, employeeName },
            loading: false
        });
    };

    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

    const handleDelete = (id) => {
        setDeleteModal({ open: true, id });
    };

    const confirmDelete = async () => {
        if (deleteModal.id) {
            try {
                await deleteTimesheet(deleteModal.id).unwrap();
                setDeleteModal({ open: false, id: null });
            } catch (error) {
                console.error('Failed to delete timesheet:', error);
                alert('Failed to delete timesheet. Please try again.');
            }
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Approved':
                return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Rejected':
                return 'bg-red-50 text-red-700 border-red-100';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
                return <Clock size={14} className="animate-pulse" />;
            case 'Approved':
                return <CheckCircle2 size={14} />;
            case 'Rejected':
                return <XCircle size={14} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters Row */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <select className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-45">
                            <option>Select Project Type</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <div className="relative">
                        <select className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-45">
                            <option>Select Project</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <div className="relative">
                        <select className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-45">
                            <option>Select Timesheet Type</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-2 pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white cursor-pointer hover:bg-gray-50 transition-colors min-w-35">
                            <Calendar size={16} className="text-gray-400" />
                            <span>This Month</span>
                        </div>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                <button
                    onClick={() => navigate('/timesheet/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium shadow-lg shadow-indigo-100 active:scale-95 whitespace-nowrap"
                >
                    <Plus size={18} />
                    Add Timesheet
                </button>
            </div>

            {/* Status Tabs and Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Object.entries(stats).map(([label, count]) => (
                        <button
                            key={label}
                            onClick={() => setStatus(label)}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${status === label
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-500 hover:bg-white hover:text-gray-700'
                                }`}
                        >
                            {label} ({count})
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={showDescription}
                            onChange={() => setShowDescription(!showDescription)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                    <span className="text-sm text-gray-600">Show timesheet description</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                            <p className="text-sm text-gray-500 font-medium">Loading timesheets...</p>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="p-3 bg-red-50 rounded-full">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="text-center">
                                <h3 className="text-gray-900 font-semibold">Failed to load timesheets</h3>
                                <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">
                                    {error?.data?.message || 'An unexpected error occurred while fetching your timesheets.'}
                                </p>
                            </div>
                            <button
                                onClick={() => refetch()}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : displayedRows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-gray-900 font-semibold italic">No timesheets found</h3>
                            <p className="text-sm text-gray-500 mt-1 italic">
                                {status === 'All'
                                    ? "You haven't added any timesheets yet."
                                    : `You don't have any ${status.toLowerCase()} timesheets.`}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 italic bg-gray-50/30">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">PROJECT</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">TYPE</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">TASK</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">EMPLOYEE</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">DATE</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">HOURS</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {displayedRows.map((row) => (
                                    <tr key={row._id || row.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-indigo-600 font-medium">
                                            {getText(row.project)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{getText(row.billingType || row.type)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm text-gray-700 font-medium">{getText(row.task, '')}</span>
                                                {showDescription && row.description && (
                                                    <div className="text-[13px] text-gray-500 leading-relaxed max-w-md">
                                                        {Array.isArray(row.description) ? (
                                                            <ul className="list-none space-y-0.5">
                                                                {row.description.map((desc, index) => (
                                                                    <li key={index} className="flex items-start gap-1">
                                                                        <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                                                                        <span>{desc}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <div className="flex items-start gap-1">
                                                                <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                                                                <span>{row.description}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {getText(row.user || row.employee || user, 'Employee')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(row.date || row.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{getText(row.hours, '')}</td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleViewDetails(row)}
                                                className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded hover:bg-indigo-50"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(row._id || row.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50 ml-2"
                                                title="Delete Timesheet"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            {detailModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center py-6 px-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setDetailModal({ open: false, data: null, loading: false })} />
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-scaleIn transform">
                        {/* Gradient header with decorative elements */}
                        <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 px-8 py-6 overflow-hidden flex-shrink-0">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>

                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl">Timesheet Details</h3>
                                </div>
                                <button
                                    onClick={() => setDetailModal({ open: false, data: null, loading: false })}
                                    className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all hover:rotate-90 duration-300"
                                >
                                    <X size={20} className="text-white" />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1">
                            {detailModal.loading ? (
                                <div className="py-16 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                                    <p className="text-gray-500 font-medium">Fetching details...</p>
                                </div>
                            ) : detailModal.data ? (
                                <div className="space-y-6">
                                    {/* Employee card with gradient */}
                                    <div className="relative p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl overflow-hidden border border-indigo-100">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
                                        <div className="relative flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">
                                                {(detailModal.data.employeeName || 'E').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xl font-bold text-gray-800 mb-1">{detailModal.data.employeeName}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full">
                                                        <p className="text-sm text-indigo-700 font-bold">{formatField(detailModal.data.project)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info grid with enhanced styling */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                                Task
                                            </p>
                                            <p className="text-gray-800 font-bold text-sm">{formatField(detailModal.data.task)}</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-end">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                                Status
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                            </p>
                                            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-2 border-2 ${getStatusStyle(detailModal.data.status || 'Pending')}`}>
                                                {getStatusIcon(detailModal.data.status || 'Pending')}
                                                {(detailModal.data.status || 'Pending').toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                                Date
                                            </p>
                                            <p className="text-gray-800 font-bold text-sm">{formatDate(detailModal.data.date || detailModal.data.createdAt)}</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-end">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                                Time Entry
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                            </p>
                                            <p className="text-indigo-700 font-black text-lg">{formatField(detailModal.data.hours)}</p>
                                        </div>
                                        <div className="col-span-2 p-4 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                                Billing Type
                                            </p>
                                            <p className="text-gray-800 font-bold">{formatField(detailModal.data.billingType || detailModal.data.type)}</p>
                                        </div>
                                    </div>

                                    {/* Description section */}
                                    {detailModal.data.description && (
                                        <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-xl border border-amber-100">
                                            <p className="text-xs text-amber-700 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                                Description
                                            </p>
                                            <div className="bg-white/60 backdrop-blur-sm p-4 rounded-lg">
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {Array.isArray(detailModal.data.description) ? detailModal.data.description.join(', ') : detailModal.data.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer info */}
                                    <div className="flex justify-between items-center px-4 py-3 bg-gray-50 rounded-xl text-xs text-gray-500 font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                                            <p>ID: <span className="font-mono text-gray-600">{detailModal.data._id}</span></p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className="text-gray-400" />
                                            <p>Submitted {formatDate(detailModal.data.createdAt || detailModal.data.date)}</p>
                                        </div>
                                    </div>

                                    {/* Close button */}
                                    <div className="pt-6">
                                        <button
                                            onClick={() => setDetailModal({ open: false, data: null, loading: false })}
                                            className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-gray-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-12 text-center text-gray-400">
                                    Could not load details.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteModal({ open: false, id: null })}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all animate-scaleIn">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Timesheet?</h3>
                            <p className="text-gray-500 mb-6">
                                Are you sure you want to delete this timesheet entry? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setDeleteModal({ open: false, id: null })}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimesheetDetails;
