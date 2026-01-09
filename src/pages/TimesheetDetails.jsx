import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Eye, Calendar, ChevronDown } from 'lucide-react';

const TimesheetDetails = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Approved');
    const [showDescription, setShowDescription] = useState(false);

    // Mock data based on the image
    const timesheetData = [
        {
            id: 1,
            project: 'FutureStack Labs',
            type: 'NB',
            task: 'Node.Js',
            employee: 'Hitendra Kakadiya',
            date: '08-01-2026',
            time: '00:30:00',
            description: ['Started working on UI for Timesheet Details page']
        },
        {
            id: 2,
            project: 'FutureStack Labs',
            type: 'NB',
            task: 'React.JS',
            employee: 'Hitendra Kakadiya',
            date: '08-01-2026',
            time: '02:00:00',
            description: [
                'Worked on UI for Add Timesheet (Employee page)',
                'Integrated Project Listing API with Add Timesheet page and debugged projectList map is not a function error.'
            ]
        },
        {
            id: 3,
            project: 'FutureStack Labs',
            type: 'NB',
            task: 'Node.Js',
            employee: 'Hitendra Kakadiya',
            date: '08-01-2026',
            time: '02:00:00',
            description: [
                'Integrated rate limiting using Redis across selected APIs.',
                'Learned about storing user sessions in Redis and implemented session storage in APIs.'
            ]
        },
        {
            id: 4,
            project: 'FutureStack Labs',
            type: 'NB',
            task: 'React.JS',
            employee: 'Hitendra Kakadiya',
            date: '08-01-2026',
            time: '02:00:00',
            description: [
                'Implemented search and filter functionality in Project Assigning APIs.',
                'Started learning Redis based rate limiting and its use cases.'
            ]
        },
        {
            id: 5,
            project: 'FutureStack Labs',
            type: 'NB',
            task: 'Node.Js',
            employee: 'Hitendra Kakadiya',
            date: '08-01-2026',
            time: '02:00:00',
            description: ['Setting up initial Redis structure and cacheAccess class.']
        },
    ];

    const stats = {
        Pending: 0,
        Approved: 25,
        Rejected: 0
    };

    return (
        <div className="space-y-6">
            {/* Filters Row */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <select className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-[180px]">
                            <option>Select Project Type</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <div className="relative">
                        <select className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-[180px]">
                            <option>Select Project</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <div className="relative">
                        <select className="appearance-none pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-w-[180px]">
                            <option>Select Timesheet Type</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-2 pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white cursor-pointer hover:bg-gray-50 transition-colors min-w-[140px]">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                    <span className="text-sm text-gray-600">Show timesheet description</span>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
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
                            {timesheetData.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <Link to={`/projects/${row.id}`} className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline font-medium">
                                            {row.project}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{row.type}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-gray-700 font-medium">{row.task}</span>
                                            {showDescription && row.description && row.description.length > 0 && (
                                                <ul className="list-none space-y-0.5">
                                                    {row.description.map((desc, index) => (
                                                        <li key={index} className="text-[13px] text-gray-500 leading-relaxed flex items-start gap-1">
                                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                                                            <span>{desc}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{row.employee}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{row.time}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded hover:bg-indigo-50">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TimesheetDetails;
