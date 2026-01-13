import React, { useState } from 'react';
import { Plus, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import WorkFromHomeModal from '../components/modals/WorkFromHomeModal';

import { useGetWfhRequestsQuery } from '../store/api/wfhApi';

const WorkFromHome = () => {
    const [activeTab, setActiveTab] = useState('Expired');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { data: allRequests = [], isLoading, error } = useGetWfhRequestsQuery(user._id || user.id, {
        skip: !user._id && !user.id
    });

    // Filter requests based on active tab
    const requests = allRequests.filter(req => {
        if (activeTab === 'Pending Approval') return req.status === 'Pending';
        if (activeTab === 'Approved') return req.status === 'Approved';
        if (activeTab === 'Rejected') return req.status === 'Rejected';
        if (activeTab === 'Expired') return req.status === 'Expired';
        return true;
    });

    const tabs = ['Pending Approval', 'Approved', 'Rejected', 'Expired'];

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '-');
    };

    const calculateDays = (start, end) => {
        if (!start || !end) return '-';
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] p-6">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex space-x-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                    >
                        <Plus size={18} />
                        <span>Apply Work From Home</span>
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-500">Loading requests...</div>
                    ) : error ? (
                        <div className="text-center py-8 text-red-500">Error loading requests</div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No requests found</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-4 pl-4">Name</th>
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-4">Type</th>
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-4">Start Date</th>
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-4">End Date</th>
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-4">Days</th>
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-4">Applied Date</th>
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-4">Status</th>
                                    <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {requests.map((request) => (
                                    <tr key={request._id || request.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 pl-4 text-sm text-indigo-600 font-medium">{request.name || user.name || 'Unknown'}</td>
                                        <td className="py-4 text-sm text-gray-600">{request.type}</td>
                                        <td className="py-4 text-sm text-gray-600">{formatDate(request.startDate)}</td>
                                        <td className="py-4 text-sm text-gray-600">{formatDate(request.endDate)}</td>
                                        <td className="py-4 text-sm text-gray-600">{calculateDays(request.startDate, request.endDate)}</td>
                                        <td className="py-4 text-sm text-gray-600">{formatDate(request.createdAt || request.appliedDate)}</td>
                                        <td className="py-4 text-sm text-gray-500 capitalize">{request.status}</td>
                                        <td className="py-4">
                                            <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-start mt-6 space-x-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50">
                        <ChevronLeft size={16} />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-sm font-medium">
                        1
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-50">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <WorkFromHomeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default WorkFromHome;
