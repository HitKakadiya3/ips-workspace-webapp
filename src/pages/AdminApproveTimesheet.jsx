import React, { useState } from 'react';
import { Check, X, Eye, Loader2, AlertCircle, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetTimesheetsQuery, useUpdateTimesheetStatusMutation } from '../store/api/timesheetApi';

const AdminApproveTimesheet = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [filterStatus, setFilterStatus] = useState('Pending');

    const { data: timesheetData = {}, isLoading, isError, error, refetch } = useGetTimesheetsQuery({
        userId: 'admin',
        status: 'All',
        page,
        limit
    });

    // Normalize response: API may return an array or an object grouping by status
    const pendingList = Array.isArray(timesheetData.pending) ? timesheetData.pending : Array.isArray(timesheetData) ? timesheetData.filter(t => t.status === 'Pending') : [];
    const approvedList = Array.isArray(timesheetData.approved) ? timesheetData.approved : Array.isArray(timesheetData) ? timesheetData.filter(t => t.status === 'Approved') : [];
    const rejectedList = Array.isArray(timesheetData.rejected) ? timesheetData.rejected : Array.isArray(timesheetData) ? timesheetData.filter(t => t.status === 'Rejected') : [];
    const allList = Array.isArray(timesheetData) ? timesheetData : [...pendingList, ...approvedList, ...rejectedList];

    const displayedList = filterStatus === 'Pending' ? pendingList : filterStatus === 'Approved' ? approvedList : filterStatus === 'Rejected' ? rejectedList : allList;

    const stats = {
        Pending: pendingList.length || 0,
        Approved: approvedList.length || 0,
        Rejected: rejectedList.length || 0,
        All: allList.length || 0,
    };

    const [updateStatus, { isLoading: updating }] = useUpdateTimesheetStatusMutation();

    const [successModal, setSuccessModal] = useState({ open: false, message: '' });
    const [errorModal, setErrorModal] = useState({ open: false, message: '' });
    const [detailModal, setDetailModal] = useState({ open: false, data: null, loading: false });

    const handleUpdateStatus = async (timesheetId, status) => {
        try {
            await updateStatus({ timesheetId, status }).unwrap();
            setSuccessModal({
                open: true,
                message: `Timesheet has been successfully ${status.toLowerCase()}.`
            });
        } catch (err) {
            console.error('Failed to update timesheet status:', err);
            setErrorModal({
                open: true,
                message: err.data?.message || 'Failed to update timesheet status. Please try again.'
            });
        }
    };

    const formatDate = (iso) => {
        if (!iso) return '';
        return new Date(iso).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatField = (field) => {
        if (field == null) return 'N/A';
        if (typeof field === 'string' || typeof field === 'number') return field;
        if (typeof field === 'object') return field.name || field.title || field._id || JSON.stringify(field);
        return String(field);
    };

    const handleFilterStatusChange = (status) => {
        setFilterStatus(status);
        setPage(1); // Reset to first page when filter changes
    };

    const handleViewDetails = (timesheet) => {
        const employeeName = formatField(timesheet.employee || timesheet.user);
        setDetailModal({
            open: true,
            data: { ...timesheet, employeeName },
            loading: false
        });
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

    // Mock pagination for now
    const pagination = {
        total: displayedList.length,
        currentPage: page,
        totalPages: Math.ceil(displayedList.length / limit) || 1
    };

    return (
        <>
            <div className="space-y-6 animate-fadeIn">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Timesheet Approvals</h2>
                        <p className="text-gray-500 text-sm mt-1">Review and manage employee timesheet submissions</p>
                    </div>

                    <div className="flex items-center bg-white p-1 rounded-xl border border-gray-100 shadow-xs">
                        {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
                            <button
                                key={status}
                                onClick={() => handleFilterStatusChange(status)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filterStatus === status
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                                    }`}
                            >
                                {status} ({stats[status]})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                            <p className="text-gray-500 font-medium">Loading timesheet requests...</p>
                        </div>
                    ) : isError ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4 text-red-500">
                            <AlertCircle className="w-12 h-12" />
                            <p className="text-lg font-semibold">Error loading timesheets</p>
                            <p className="text-sm text-gray-500">{error?.data?.message || 'Failed to load timesheets.'}</p>
                            <button onClick={() => refetch()} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                                Try Again
                            </button>
                        </div>
                    ) : displayedList.length === 0 ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 opacity-20" />
                            </div>
                            <p className="text-lg font-medium">No {filterStatus.toLowerCase()} timesheets found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Project</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Task</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Hours</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {displayedList.map((timesheet) => (
                                        <tr key={timesheet._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                        {(formatField(timesheet.employee || timesheet.user) || 'E').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{formatField(timesheet.employee || timesheet.user)}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">Submitted {formatDate(timesheet.createdAt || timesheet.date)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-medium text-indigo-600">{formatField(timesheet.project)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-medium text-gray-600">{formatField(timesheet.task)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-500 font-medium">{formatDate(timesheet.date || timesheet.createdAt)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-700 font-bold">{formatField(timesheet.hours)}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${getStatusStyle(timesheet.status || 'Pending')}`}>
                                                        {getStatusIcon(timesheet.status || 'Pending')}
                                                        {(timesheet.status || 'Pending').toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(timesheet.status || 'Pending') === 'Pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(timesheet._id, 'Approved')}
                                                                disabled={updating}
                                                                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all duration-200 shadow-xs border border-emerald-100 disabled:opacity-50"
                                                                title="Approve"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(timesheet._id, 'Rejected')}
                                                                disabled={updating}
                                                                className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 shadow-xs border border-red-100 disabled:opacity-50"
                                                                title="Reject"
                                                            >
                                                                <X size={18} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-300 font-medium italic pr-2">Processed</span>
                                                    )}
                                                    <button
                                                        onClick={() => handleViewDetails(timesheet)}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination Controls */}
                            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
                                <div className="text-xs font-medium text-gray-500">
                                    Showing <span className="text-gray-800 font-bold">{page}</span> of <span className="text-gray-800 font-bold">{pagination.totalPages}</span> pages
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>

                                    {[...Array(pagination.totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setPage(i + 1)}
                                            className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${page === i + 1
                                                ? 'bg-indigo-600 text-white shadow-sm'
                                                : 'text-gray-500 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-gray-100'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                        disabled={page === pagination.totalPages}
                                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Success Modal */}
            {successModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setSuccessModal({ open: false, message: '' })} />
                    <div className="relative bg-linear-to-br from-white to-emerald-50/30 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn transform">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-400/10 rounded-full blur-3xl"></div>

                        <div className="relative p-8 text-center">
                            {/* Animated icon container */}
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-emerald-200/50 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative w-24 h-24 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30 animate-bounce-slow">
                                    <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Success!</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">{successModal.message}</p>

                            <button
                                onClick={() => setSuccessModal({ open: false, message: '' })}
                                className="w-full py-3.5 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Awesome!
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {errorModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setErrorModal({ open: false, message: '' })} />
                    <div className="relative bg-linear-to-br from-white to-red-50/30 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn transform">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl"></div>

                        <div className="relative p-8 text-center">
                            {/* Animated icon container */}
                            <div className="relative inline-block mb-6">
                                <div className="absolute inset-0 bg-red-200/50 rounded-full blur-xl animate-pulse"></div>
                                <div className="relative w-24 h-24 bg-linear-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/30">
                                    <XCircle className="w-12 h-12 text-white animate-shake" strokeWidth={2.5} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Oops!</h3>
                            <p className="text-gray-600 mb-8 leading-relaxed">{errorModal.message}</p>

                            <button
                                onClick={() => setErrorModal({ open: false, message: '' })}
                                className="w-full py-3.5 bg-linear-to-r from-gray-700 to-gray-900 text-white font-bold rounded-xl hover:from-gray-800 hover:to-black transition-all shadow-lg shadow-gray-500/30 hover:shadow-xl hover:shadow-gray-600/40 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {detailModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center py-6 px-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setDetailModal({ open: false, data: null, loading: false })} />
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-scaleIn transform">
                        {/* Gradient header with decorative elements */}
                        <div className="relative bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-600 px-8 py-6 overflow-hidden shrink-0">
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
                                    <div className="relative p-6 bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl overflow-hidden border border-indigo-100">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
                                        <div className="relative flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-500/30">
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
                                            <p className="text-indigo-700 font-black text-lg">{formatField(detailModal.data.hours || detailModal.data.time)}</p>
                                        </div>
                                        <div className="col-span-2 p-4 bg-linear-to-br from-gray-50 to-indigo-50/30 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                                                Billing Type
                                            </p>
                                            <p className="text-gray-800 font-bold">{formatField(detailModal.data.billingType || detailModal.data.type)}</p>
                                        </div>
                                    </div>

                                    {/* Description section */}
                                    {detailModal.data.description && (
                                        <div className="p-5 bg-linear-to-br from-amber-50 to-orange-50/30 rounded-xl border border-amber-100">
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

                                    {/* Action buttons with enhanced styling */}
                                    <div className="pt-6 flex gap-3">
                                        {(detailModal.data.status || 'Pending') === 'Pending' && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        handleUpdateStatus(detailModal.data._id, 'Approved');
                                                        setDetailModal({ open: false, data: null, loading: false });
                                                    }}
                                                    className="flex-1 py-4 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                                                >
                                                    <Check size={20} strokeWidth={3} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleUpdateStatus(detailModal.data._id, 'Rejected');
                                                        setDetailModal({ open: false, data: null, loading: false });
                                                    }}
                                                    className="flex-1 py-4 bg-linear-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                                                >
                                                    <X size={20} strokeWidth={3} /> Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => setDetailModal({ open: false, data: null, loading: false })}
                                            className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all border-2 border-gray-200 hover:border-gray-300 transform hover:scale-[1.02] active:scale-[0.98]"
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
        </>
    );
};

export default AdminApproveTimesheet;
