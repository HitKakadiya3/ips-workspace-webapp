import React, { useState } from 'react';
import { Plus, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import WorkFromHomeModal from '../components/modals/WorkFromHomeModal';

const WorkFromHome = () => {
    const [activeTab, setActiveTab] = useState('Expired');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data based on image
    const requests = [
        { id: 1, name: 'Hitendra Kakadiya', type: 'Multiple Days', startDate: '01-12-2025', endDate: '31-12-2025', days: 23, appliedDate: '01-12-2025', status: 'Expired' },
        { id: 2, name: 'Hitendra Kakadiya', type: 'Multiple Days', startDate: '27-10-2025', endDate: '30-11-2025', days: 26, appliedDate: '27-10-2025', status: 'Expired' },
        { id: 3, name: 'Hitendra Kakadiya', type: 'Multiple Days', startDate: '06-09-2025', endDate: '30-09-2025', days: 17, appliedDate: '05-09-2025', status: 'Expired' },
        { id: 4, name: 'Hitendra Kakadiya', type: 'Multiple Days', startDate: '01-09-2025', endDate: '30-09-2025', days: 22, appliedDate: '01-09-2025', status: 'Expired' },
        { id: 5, name: 'Hitendra Kakadiya', type: 'Multiple Days', startDate: '01-08-2025', endDate: '31-08-2025', days: 21, appliedDate: '30-07-2025', status: 'Expired' },
        { id: 6, name: 'Hitendra Kakadiya', type: 'Multiple Days', startDate: '09-07-2025', endDate: '31-07-2025', days: 24, appliedDate: '09-07-2025', status: 'Expired' },
    ];

    const tabs = ['Pending Approval', 'Approved', 'Rejected', 'Expired'];

    return (
        <div className="p-6 max-w-[1400px] mx-auto">


            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[600px] p-6">

                {/* Actions Row */}
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
                                <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 pl-4 text-sm text-indigo-600 font-medium">{request.name}</td>
                                    <td className="py-4 text-sm text-gray-600">{request.type}</td>
                                    <td className="py-4 text-sm text-gray-600">{request.startDate}</td>
                                    <td className="py-4 text-sm text-gray-600">{request.endDate}</td>
                                    <td className="py-4 text-sm text-gray-600">{request.days}</td>
                                    <td className="py-4 text-sm text-gray-600">{request.appliedDate}</td>
                                    <td className="py-4 text-sm text-gray-500">{request.status}</td>
                                    <td className="py-4">
                                        <button className="text-indigo-600 hover:text-indigo-800 transition-colors">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
