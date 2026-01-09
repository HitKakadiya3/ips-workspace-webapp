import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Plus, Eye, Calendar, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { useGetTimesheetsQuery } from '../store/api/timesheetApi';

const TimesheetDetails = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Pending');
    const [showDescription, setShowDescription] = useState(false);

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
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">TIME</th>
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
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{getText(row.timeEntry || row.time, '')}</td>
                                        <td className="px-6 py-4">
                                            <button className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded hover:bg-indigo-50">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimesheetDetails;
