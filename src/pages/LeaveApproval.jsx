import React, { useState } from 'react';
import { Check, X, Eye, Loader2, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { useGetAllLeavesQuery, useUpdateLeaveStatusMutation } from '../store/api/leaveApi';

const LeaveApproval = () => {
    const { data: leaves = [], isLoading, isError, refetch } = useGetAllLeavesQuery();
    const [updateStatus, { isLoading: updating }] = useUpdateLeaveStatusMutation();
    const [filterStatus, setFilterStatus] = useState('Pending');
    const [successModal, setSuccessModal] = useState({ open: false, message: '' });
    const [errorModal, setErrorModal] = useState({ open: false, message: '' });

    const handleUpdateStatus = async (leaveId, status) => {
        try {
            await updateStatus({ leaveId, status }).unwrap();
            setSuccessModal({
                open: true,
                message: `Leave request has been successfully ${status.toLowerCase()}.`
            });
        } catch (err) {
            console.error('Failed to update leave status:', err);
            setErrorModal({
                open: true,
                message: err.data?.message || 'Failed to update leave status. Please try again.'
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

    const filteredLeaves = leaves.filter(leave =>
        filterStatus === 'All' ? true : leave.status === filterStatus
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Approved':
            case 'Accepted':
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
            case 'Accepted':
                return <CheckCircle2 size={14} />;
            case 'Rejected':
                return <XCircle size={14} />;
            default:
                return null;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fadeIn">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Leave Approvals</h2>
                        <p className="text-gray-500 text-sm mt-1">Review and manage employee leave requests</p>
                    </div>

                    <div className="flex items-center bg-white p-1 rounded-xl border border-gray-100 shadow-xs">
                        {['Pending', 'Approved', 'Rejected', 'All'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
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

                {/* Main Content Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {isLoading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                            <p className="text-gray-500 font-medium">Loading leave requests...</p>
                        </div>
                    ) : isError ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4 text-red-500">
                            <AlertCircle className="w-12 h-12" />
                            <p className="text-lg font-semibold">Error loading leaves</p>
                            <button onClick={() => refetch()} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors">
                                Try Again
                            </button>
                        </div>
                    ) : filteredLeaves.length === 0 ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 opacity-20" />
                            </div>
                            <p className="text-lg font-medium">No {filterStatus.toLowerCase()} requests found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Leave Type</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Duration</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Dates</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredLeaves.map((leave) => (
                                        <tr key={leave._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                        {(leave.user?.name || leave.userName || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-800">{leave.user?.name || leave.userName || 'Unknown User'}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium">Applied on {formatDate(leave.createdAt)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm font-medium text-gray-600">{leave.leaveType}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-700">
                                                        {leave.leaveDuration || leave.duration || leave.days || 1} {(leave.leaveDuration || leave.duration || leave.days || 1) <= 1 ? 'Day' : 'Days'}
                                                    </span>
                                                    {leave.isHalfDay && (
                                                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-tight">
                                                            {leave.partOfDay || 'Half Day'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-gray-500 font-medium">
                                                    <p>{formatDate(leave.startDate)}</p>
                                                    {leave.endDate && leave.endDate !== leave.startDate && (
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <div className="w-1 h-3 bg-gray-200 rounded-full"></div>
                                                            <p>{formatDate(leave.endDate)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex justify-center">
                                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${getStatusStyle(leave.status)}`}>
                                                        {getStatusIcon(leave.status)}
                                                        {leave.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {leave.status === 'Pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateStatus(leave._id, 'Approved')}
                                                                disabled={updating}
                                                                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all duration-200 shadow-xs border border-emerald-100 disabled:opacity-50"
                                                                title="Approve"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleUpdateStatus(leave._id, 'Rejected')}
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
                                                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                                        <Eye size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Success Modal */}
                {successModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSuccessModal({ open: false, message: '' })} />
                        <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-scaleIn transform">
                            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Operation Successful</h3>
                            <p className="text-gray-500 mb-8">{successModal.message}</p>
                            <button
                                onClick={() => setSuccessModal({ open: false, message: '' })}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                Great, thanks!
                            </button>
                        </div>
                    </div>
                )}

                {/* Error Modal */}
                {errorModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setErrorModal({ open: false, message: '' })} />
                        <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-scaleIn transform">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Action Failed</h3>
                            <p className="text-gray-500 mb-8">{errorModal.message}</p>
                            <button
                                onClick={() => setErrorModal({ open: false, message: '' })}
                                className="w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-black transition-all"
                            >
                                Understand
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default LeaveApproval;
