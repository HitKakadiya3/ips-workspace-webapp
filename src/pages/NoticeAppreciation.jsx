import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Eye, Search, Filter, RotateCcw, Calendar, ChevronDown, Info, Megaphone, Heart, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useGetNoticeAppreciationsQuery, useDeleteNoticeAppreciationMutation } from '../store/api/noticeAppreciationApi';
import NoticeAppreciationDetailModal from '../components/modals/NoticeAppreciationDetailModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';

const NoticeAppreciation = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Admin' || user.role === 'admin';

    const [page, setPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteNoticeAppreciation, { isLoading: isDeleting }] = useDeleteNoticeAppreciationMutation();
    const [filters, setFilters] = useState({
        type: '',
        subType: '',
        date: ''
    });

    const { data, isLoading, isError, error, refetch } = useGetNoticeAppreciationsQuery({
        ...filters,
        page,
        limit: 10
    });

    const handleReset = () => {
        setFilters({ type: '', subType: '', date: '' });
        setPage(1);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteNoticeAppreciation(itemToDelete._id).unwrap();
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
        } catch (error) {
            console.error('Failed to delete:', error);
            alert(error?.data?.message || 'Failed to delete record');
        }
    };

    const listData = data?.data || [];
    const pagination = data?.pagination || { totalItems: 0, totalPages: 0, currentPage: 1, limit: 10 };

    return (
        <div className="p-6 max-w-[1600px] mx-auto animate-fadeIn">
            {/* Main Content Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters Section */}
                <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative min-w-[200px]">
                            <select
                                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                value={filters.type}
                                onChange={(e) => handleFilterChange({ ...filters, type: e.target.value })}
                            >
                                <option value="">Select Type</option>
                                <option value="Notice">Notice</option>
                                <option value="Appreciation">Appreciation</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative min-w-[200px]">
                            <select
                                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                value={filters.subType}
                                onChange={(e) => handleFilterChange({ ...filters, subType: e.target.value })}
                            >
                                <option value="">Select Sub Type</option>
                                <option value="Performance">Performance</option>
                                <option value="Behavior">Behavior</option>
                                <option value="Teamwork">Teamwork</option>
                                <option value="Project Delivery">Project Delivery</option>
                                <option value="Attendance">Attendance</option>
                                <option value="Policy Violation">Policy Violation</option>
                                <option value="Timesheet">Timesheet</option>
                                <option value="Leave">Leave</option>
                                <option value="Quality">Quality</option>
                                <option value="Other">Other</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative min-w-[150px]">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                                <Calendar size={16} />
                            </div>
                            <input
                                type="date"
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                                value={filters.date}
                                onChange={(e) => handleFilterChange({ ...filters, date: e.target.value })}
                            />
                        </div>

                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>

                        {isAdmin && (
                            <button
                                onClick={() => navigate('/notice-appreciation/add')}
                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 ml-auto"
                            >
                                <Plus size={16} />
                                Add Record
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">No</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Sub Type</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">KPI Category</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Created At</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 size={32} className="text-indigo-600 animate-spin" />
                                            <p className="text-gray-500 font-medium">Loading records...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-red-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <AlertCircle size={32} />
                                            <p className="font-semibold">Failed to load data</p>
                                            <p className="text-sm">{error?.data?.message || 'Something went wrong'}</p>
                                            <button onClick={() => refetch()} className="mt-2 px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Retry</button>
                                        </div>
                                    </td>
                                </tr>
                            ) : listData.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2 italic">
                                            <Info size={32} className="text-gray-300" />
                                            <p>No records found matching your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                listData.map((item, index) => (
                                    <tr key={item._id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                            {(pagination.currentPage - 1) * pagination.limit + index + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase overflow-hidden">
                                                    {item.user?.profileImage ? (
                                                        <img src={item.user.profileImage} alt={item.user?.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        item.user?.name?.charAt(0) || '?'
                                                    )}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">{item.user?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.type === 'Notice'
                                                ? 'bg-red-500 text-white shadow-sm shadow-red-200'
                                                : 'bg-green-500 text-white shadow-sm shadow-green-200'
                                                }`}>
                                                {item.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.subType}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{item.project?.name || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-400">{item.kpiCategory || '-'}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                            {new Date(item.date).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(item)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all group/btn"
                                                >
                                                    <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all group/btn"
                                                    >
                                                        <Trash2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination Section */}
                <div className="p-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                    <p>Showing {listData.length} of {pagination.totalItems} records</p>
                    <div className="flex gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            className="px-3 py-1 bg-gray-50 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="flex items-center px-2 font-medium">Page {page} of {pagination.totalPages || 1}</span>
                        <button
                            disabled={page >= pagination.totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            <NoticeAppreciationDetailModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                }}
                data={selectedItem}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title={itemToDelete?.title || `Delete ${itemToDelete?.type || 'Record'} for ${itemToDelete?.user?.name || 'Unknown'}`}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default NoticeAppreciation;
