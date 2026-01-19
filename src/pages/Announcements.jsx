import React, { useState, useEffect } from 'react';
import { Eye, Download, X, Calendar, User, Tag, FileText, Megaphone, Plus, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAnnouncements, deleteAnnouncement } from '../services/announcementService';
import { BASE_URL } from '../services/api';

const Announcements = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'Admin' || user.role === 'admin';

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const data = await getAnnouncements();
            // Assuming the API returns an array or an object with a data property
            setAnnouncements(data.data || data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch announcements. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDrawerOpen(true);
    };

    const handleAttachmentClick = (attachmentPath) => {
        if (!attachmentPath || attachmentPath === '-') return;

        // Ensure BASE_URL and attachmentPath are joined with exactly one slash
        const cleanPath = attachmentPath.startsWith('/') ? attachmentPath.slice(1) : attachmentPath;
        const url = attachmentPath.startsWith('http') ? attachmentPath : `${BASE_URL}/${cleanPath}`;

        const extension = attachmentPath.split('.').pop().toLowerCase();
        const openInTabExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];

        if (openInTabExtensions.includes(extension)) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            const link = document.createElement('a');
            link.href = url;
            link.download = attachmentPath.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleDelete = async (id) => {
        try {
            setIsDeleting(true);
            await deleteAnnouncement(id);
            setAnnouncements(prev => prev.filter(a => (a.id || a._id) !== id));
            setAnnouncementToDelete(null);
        } catch (err) {
            alert('Failed to delete announcement. Please try again.');
        } finally {
            setIsDeleting(false);
        }
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
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 size={32} className="text-indigo-600 animate-spin" />
                                            <p className="text-gray-500 font-medium">Loading announcements...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3 text-red-500">
                                            <AlertCircle size={32} />
                                            <p className="font-medium">{error}</p>
                                            <button
                                                onClick={fetchAnnouncements}
                                                className="px-4 py-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-sm font-bold"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : announcements.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Megaphone size={32} className="text-gray-300" />
                                            <p className="text-gray-500 font-medium">No announcements found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                announcements.map((item, index) => (
                                    <tr key={item._id || item.id || index} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 overflow-hidden">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.authorName || item.announcedBy?.name || item.announcedBy || 'User')}&background=random&color=fff`}
                                                        alt={item.authorName || item.announcedBy?.name || item.announcedBy}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{item.authorName || item.announcedBy?.name || item.announcedBy}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-700 font-medium line-clamp-1 max-w-xs">{item.title}</p>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${(item.type || 'News') === 'Policy'
                                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                }`}>
                                                {item.type || 'News'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.attachment && item.attachment !== '-' ? (
                                                <div
                                                    onClick={() => handleAttachmentClick(item.attachment)}
                                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group/attach"
                                                >
                                                    <Download size={14} className="group-hover/attach:translate-y-0.5 transition-transform" />
                                                    <span className="text-xs font-medium underline underline-offset-4 decoration-indigo-200 group-hover/attach:decoration-indigo-600">
                                                        {typeof item.attachment === 'string' ? item.attachment.split('/').pop() : 'Attachment'}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-500 line-clamp-1 max-w-md italic">{item.description}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(item)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all group/btn"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                                                </button>
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => setAnnouncementToDelete(item)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all group/del"
                                                        title="Delete Announcement"
                                                    >
                                                        <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
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
                                        <span className="flex-1 text-sm font-medium text-gray-700">{selectedAnnouncement.type || 'News'}</span>
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
                                                    ) : (
                                                        <span key={i}>{part}</span>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <span className="w-28 text-sm font-semibold text-gray-500">Announced By:</span>
                                        <span className="flex-1 text-sm font-medium text-gray-700">{selectedAnnouncement.authorName || selectedAnnouncement.announcedBy?.name || selectedAnnouncement.announcedBy}</span>
                                    </div>

                                    {selectedAnnouncement.attachment && selectedAnnouncement.attachment !== '-' && (
                                        <div className="flex gap-4 border-t border-gray-50 pt-6">
                                            <span className="w-28 text-sm font-semibold text-gray-500">Attachment:</span>
                                            <div className="flex-1">
                                                <div
                                                    onClick={() => handleAttachmentClick(selectedAnnouncement.attachment)}
                                                    className="inline-flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100 group cursor-pointer hover:bg-gray-100 transition-colors"
                                                >
                                                    <Download size={14} className="text-gray-400 group-hover:text-indigo-600" />
                                                    <span className="text-xs font-bold text-gray-700">
                                                        {typeof selectedAnnouncement.attachment === 'string' ? selectedAnnouncement.attachment.split('/').pop() : 'Attachment'}
                                                    </span>
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

            {/* Delete Confirmation Modal */}
            {announcementToDelete && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fadeIn"
                        onClick={() => !isDeleting && setAnnouncementToDelete(null)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-scaleIn">
                        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Announcement?</h3>
                        <p className="text-gray-500 text-center text-sm mb-6">
                            Are you sure you want to delete <span className="font-bold text-gray-700">"{announcementToDelete.title}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setAnnouncementToDelete(null)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(announcementToDelete.id || announcementToDelete._id)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcements;
