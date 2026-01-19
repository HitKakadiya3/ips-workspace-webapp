import React, { useState } from 'react';
import { Eye, Search, Filter, RotateCcw, Calendar, ChevronDown, Info, Megaphone, Heart } from 'lucide-react';

const NoticeAppreciation = () => {
    const [filters, setFilters] = useState({
        type: '',
        subType: '',
        date: ''
    });

    const mockData = [
        { id: 1, employee: 'Hitendra Kakadiya', type: 'NOTICE', subType: 'Leave', project: '-', kpiCategory: '', createdAt: '2025-12-16' },
        { id: 2, employee: 'Hitendra Kakadiya', type: 'NOTICE', subType: 'Timesheet', project: '-', kpiCategory: '', createdAt: '2025-11-18' },
        { id: 3, employee: 'Hilendra Kakadiya', type: 'NOTICE', subType: 'Leave', project: '-', kpiCategory: '', createdAt: '2025-11-12' },
        { id: 4, employee: 'Hilendra Kakadiya', type: 'NOTICE', subType: 'Leave', project: '-', kpiCategory: '', createdAt: '2025-11-11' },
        { id: 5, employee: 'Hilendra Kakadiya', type: 'NOTICE', subType: 'Leave', project: '-', kpiCategory: '', createdAt: '2025-11-06' },
        { id: 6, employee: 'Hitendra Kakadiya', type: 'NOTICE', subType: 'Timesheet', project: '-', kpiCategory: '', createdAt: '2025-10-12' },
        { id: 7, employee: 'Hitendra Kakadiya', type: 'NOTICE', subType: 'Leave', project: '-', kpiCategory: '', createdAt: '2025-09-05' },
        { id: 8, employee: 'Hitendra Kakadiya', type: 'NOTICE', subType: 'Timesheet', project: '-', kpiCategory: '', createdAt: '2025-07-12' },
        { id: 9, employee: 'Hilendra Kakadiya', type: 'NOTICE', subType: 'Leave', project: '-', kpiCategory: '', createdAt: '2025-07-11' },
        { id: 10, employee: 'Hitendra Kakadiya', type: 'NOTICE', subType: 'Leave', project: '-', kpiCategory: '', createdAt: '2025-07-02' },
        { id: 11, employee: 'Hitendra Kakadiya', type: 'NOTICE', subType: 'Leave', project: '-', kpiCategory: '', createdAt: '2025-05-29' },
        { id: 12, employee: 'Hitendra Kakadiya', type: 'NOTICE', subType: 'Leave', project: '-', kpiCategory: '', createdAt: '2025-05-28' },
        { id: 13, employee: 'Hitendra Kakadiya', type: 'NOTICE', subType: 'Leave', project: '-', kpiCategory: '', createdAt: '2025-05-19' },
    ];

    const handleReset = () => {
        setFilters({ type: '', subType: '', date: '' });
    };

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
                                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                            >
                                <option value="">Select Type</option>
                                <option value="NOTICE">Notice</option>
                                <option value="APPRECIATION">Appreciation</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative min-w-[200px]">
                            <select
                                className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                                value={filters.subType}
                                onChange={(e) => setFilters({ ...filters, subType: e.target.value })}
                            >
                                <option value="">Select Sub Type</option>
                                <option value="Leave">Leave</option>
                                <option value="Timesheet">Timesheet</option>
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
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            />
                        </div>

                        <button
                            onClick={handleReset}
                            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                        >
                            <RotateCcw size={16} />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
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
                            {mockData.map((item, index) => (
                                <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                                                {item.employee.charAt(0)}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">{item.employee}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${item.type === 'NOTICE'
                                            ? 'bg-red-500 text-white shadow-sm shadow-red-200'
                                            : 'bg-green-500 text-white shadow-sm shadow-green-200'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.subType}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{item.project}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{item.kpiCategory || '-'}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.createdAt}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all group/btn">
                                            <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination Placeholder */}
                <div className="p-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                    <p>Showing {mockData.length} records</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-gray-50 rounded hover:bg-gray-100 transition-colors">Previous</button>
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoticeAppreciation;
