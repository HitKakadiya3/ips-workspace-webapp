import React, { useState } from 'react';
import { Eye, Download, X, Calendar, User, Tag, FileText, Megaphone, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Announcements = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Admin' || user.role === 'admin';

    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const mockAnnouncements = [
        {
            id: 1,
            announcedBy: 'Nikunj Ganatra',
            title: '2026 Holiday Calendar',
            type: 'News',
            attachment: '-',
            description: 'List of Holidays in 2026: http://ips-hub.itpathsolutions.com:88/spotlights/225'
        },
        {
            id: 2,
            announcedBy: 'Nikunj Ganatra',
            title: '5th July 2025 - Working Saturday - IPS Hackathon 2025',
            type: 'News',
            attachment: '-',
            description: 'IPS Hackathon 2025 is happening on 4th & 5th July. Please note that 5th July will be a working day for all employees.'
        },
        {
            id: 3,
            announcedBy: 'Nikunj Ganatra',
            title: '10th May 2025 - Working Saturday - Stay Tuned for an Exciting Update!',
            type: 'News',
            attachment: '-',
            description: 'Please note that 10th May will be considered as a working Saturday. Stay tuned for further details.'
        },
        {
            id: 4,
            announcedBy: 'Nikunj Ganatra',
            title: 'Scheduled Working Saturdays for 2025',
            type: 'News',
            attachment: '-',
            description: 'Please note following Saturdays are designated as working days for 2025: May 10, July 5, Sept 13, Nov 22.'
        },
        {
            id: 5,
            announcedBy: 'Nikunj Ganatra',
            title: '2025 Holiday Calendar',
            type: 'News',
            attachment: 'List of holidays 2025.pdf',
            description: '2025 Holiday Calendar'
        },
        {
            id: 6,
            announcedBy: 'Bhavik Shah',
            title: 'Employee Policies',
            type: 'Policy',
            attachment: '-',
            description: 'Updated Employee Policy document: http://ips-hub.itpathsolutions.com:88/spotlights/policies'
        }
    ];

    const handleViewDetails = (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDrawerOpen(true);
    };

    return (
        <div className="p-6 max-w-[1400px] mx-auto animate-fadeIn">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
                    <p className="text-gray-500 text-sm mt-1">Stay updated with latest news and company policies</p>
                </div>
                {isAdmin && (
                    <button
                        onClick={() => navigate('/announcements/add')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={20} />
                        <span>Create Announcement</span>
                    </button>
                )}
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Announced By</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Attachment</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mockAnnouncements.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.announcedBy)}&background=random&color=fff`}
                                                    alt={item.announcedBy}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{item.announcedBy}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-700 font-medium line-clamp-1 max-w-xs">{item.title}</p>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${item.type === 'Policy'
                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                            : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.attachment !== '-' ? (
                                            <div className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group/attach">
                                                <Download size={14} className="group-hover/attach:translate-y-0.5 transition-transform" />
                                                <span className="text-xs font-medium underline underline-offset-4 decoration-indigo-200 group-hover/attach:decoration-indigo-600">{item.attachment}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-500 line-clamp-1 max-w-md italic">{item.description}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleViewDetails(item)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all group/btn"
                                            title="View Details"
                                        >
                                            <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Details Drawer Overlay */}
            {isDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity animate-fadeIn"
                        onClick={() => setIsDrawerOpen(false)}
                    />

                    <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl animate-slideInRight flex flex-col">
                        {/* Drawer Header */}
                        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-indigo-600 flex items-center gap-2">
                                <Megaphone size={20} className="text-indigo-500" />
                                Announcement Details
                            </h3>
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
                            {selectedAnnouncement && (
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <span className="w-28 text-sm font-semibold text-gray-500">Title:</span>
                                        <span className="flex-1 text-sm font-bold text-indigo-700">{selectedAnnouncement.title}</span>
                                    </div>

                                    <div className="flex gap-4">
                                        <span className="w-28 text-sm font-semibold text-gray-500">Type:</span>
                                        <span className="flex-1 text-sm font-medium text-gray-700">{selectedAnnouncement.type}</span>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <div className="flex gap-4">
                                            <span className="w-28 text-sm font-semibold text-gray-500">Description:</span>
                                            <div className="flex-1 text-sm text-gray-600 leading-relaxed">
                                                {/* URL detection and removal of text-indigo if it's already purple-ish in image */}
                                                {selectedAnnouncement.description.split(/(https?:\/\/[^\s]+)/g).map((part, i) => (
                                                    part.match(/^https?:\/\//) ? (
                                                        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-all block mt-2">
                                                            {part}
                                                        </a>
                                                    ) : part
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <span className="w-28 text-sm font-semibold text-gray-500">Announced By:</span>
                                        <span className="flex-1 text-sm font-medium text-gray-700">{selectedAnnouncement.announcedBy}</span>
                                    </div>

                                    {selectedAnnouncement.attachment !== '-' && (
                                        <div className="flex gap-4 border-t border-gray-50 pt-6">
                                            <span className="w-28 text-sm font-semibold text-gray-500">Attachment:</span>
                                            <div className="flex-1">
                                                <div className="inline-flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 group cursor-pointer hover:bg-gray-100 transition-colors">
                                                    <Download size={14} className="text-gray-400 group-hover:text-indigo-600" />
                                                    <span className="text-xs font-bold text-gray-700">{selectedAnnouncement.attachment}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/30 flex justify-end">
                            <button
                                onClick={() => setIsDrawerOpen(false)}
                                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                            >
                                Close Detail
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;
