import React, { useState } from 'react';
import { Check, X, Loader2, AlertCircle, Clock, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetAllWfhRequestsQuery, useUpdateWfhStatusMutation } from '../store/api/wfhApi';

const AdminWorkFromHome = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [filterStatus, setFilterStatus] = useState('Pending');

    const { data, isLoading, isError, refetch } = useGetAllWfhRequestsQuery({
        page,
        limit,
        status: filterStatus === 'All' ? undefined : filterStatus
    });

    const requests = data?.wfhRequests || [];
    const pagination = data?.pagination || { total: requests.length, page: 1, totalPages: 1 };

    const totalEntries = pagination.total !== undefined ? pagination.total : requests.length;
    const startEntry = requests.length === 0 ? 0 : (page - 1) * limit + 1;
    const endEntry = (page === 1 && totalEntries < limit) ? totalEntries : page * limit;

    const [updateStatus, { isLoading: updating }] = useUpdateWfhStatusMutation();

    const [successModal, setSuccessModal] = useState({ open: false, message: '' });
    const [errorModal, setErrorModal] = useState({ open: false, message: '' });

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateStatus({ id, status }).unwrap();
            setSuccessModal({
                open: true,
                message: `Work From Home request has been ${status.toLowerCase()}.`
            });
        } catch (err) {
            console.error('Failed to update status:', err);
            setErrorModal({
                open: true,
                message: err.data?.message || 'Failed to update status. Please try again.'
            });
        }
    };

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
        <div className="p-6 max-w-[1400px] mx-auto space-y-6 animate-fadeIn">
            {/* Filters Row */}
            <div className="flex justify-end">
                <div className="flex items-center bg-white p-1 rounded-xl border border-gray-100 shadow-xs">
                    {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
                        <button
                            key={status}
                            onClick={() => { setFilterStatus(status); setPage(1); }}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${filterStatus === status
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                {isLoading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        <p className="text-gray-500 font-medium">Loading requests...</p>
                    </div>
                ) : isError ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-4 text-red-500">
                        <AlertCircle className="w-12 h-12" />
                        <p className="text-lg font-semibold">Error loading requests</p>
                        <button onClick={() => refetch()} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">Try Again</button>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-4 text-gray-400">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 opacity-20" />
                        </div>
                        <p className="text-lg font-medium">No {filterStatus.toLowerCase()} requests found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Duration</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Dates</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {requests.map((req) => (
                                        <tr key={req._id || req.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                        {(req.userName || req.user?.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{req.userName || req.user?.name || 'Unknown User'}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">Applied on {formatDate(req.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-gray-600">{req.type}</td>
                                            <td className="py-4 px-6 text-center text-sm font-bold text-gray-700">
                                                {calculateDays(req.startDate, req.endDate)} Days
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-500 font-medium">
                                                    <p>{formatDate(req.startDate)}</p>
                                                    {req.type === 'Multiple Days' && (
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="w-1 h-3 bg-gray-200 rounded-full"></div>
                                                            <p>{formatDate(req.endDate)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${getStatusStyle(req.status)}`}>
                                                        {getStatusIcon(req.status)}
                                                        {req.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                {req.status === 'Pending' ? (
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleUpdateStatus(req._id || req.id, 'Approved')}
                                                            disabled={updating}
                                                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all duration-200 shadow-xs border border-emerald-100 disabled:opacity-50"
                                                            title="Approve"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(req._id || req.id, 'Rejected')}
                                                            disabled={updating}
                                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 shadow-xs border border-red-100 disabled:opacity-50"
                                                            title="Reject"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-300 font-medium italic pr-2">Processed</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-50 bg-gray-50/30">
                            <div className="text-xs font-medium text-gray-500">
                                Showing <span className="text-gray-800 font-bold">{startEntry}</span> to <span className="text-gray-800 font-bold">{endEntry}</span> of <span className="text-gray-800 font-bold">{totalEntries}</span> entries
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(Math.max(1, page - 1))}
                                    disabled={page === 1}
                                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="text-xs font-bold text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-100">
                                    Page {page} of {Math.max(1, pagination.totalPages || 1)}
                                </span>
                                <button
                                    onClick={() => setPage(Math.min(pagination.totalPages || 1, page + 1))}
                                    disabled={page >= (pagination.totalPages || 1)}
                                    className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all border border-transparent hover:border-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {successModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSuccessModal({ open: false, message: '' })} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-scaleIn">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Success</h3>
                        <p className="text-gray-500 mb-8">{successModal.message}</p>
                        <button onClick={() => setSuccessModal({ open: false, message: '' })} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">OK</button>
                    </div>
                </div>
            )}

            {errorModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setErrorModal({ open: false, message: '' })} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-scaleIn">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
                        <p className="text-gray-500 mb-8">{errorModal.message}</p>
                        <button onClick={() => setErrorModal({ open: false, message: '' })} className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-black transition-all">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminWorkFromHome;
