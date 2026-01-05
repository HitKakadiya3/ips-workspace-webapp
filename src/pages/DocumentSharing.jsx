import React, { useState } from 'react';
import { Search, Plus, Lock, Globe, FileText, ChevronDown, Download, Calendar, Paperclip, MoreVertical, Trash2 } from 'lucide-react';

import AddDocumentModal from '../components/modals/AddDocumentModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';
import { useGetDocumentsQuery, useDeleteDocumentMutation } from '../store/api/documentApi';

const DocumentSharing = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [docToDelete, setDocToDelete] = useState(null);

    const { data: documents = [], isLoading } = useGetDocumentsQuery({
        ...(searchTerm && { search: searchTerm }),
        ...(filterType !== 'All' && { type: filterType })
    });

    const [deleteDocument, { isLoading: isDeleting }] = useDeleteDocumentMutation();

    const categories = ['All', 'Private', 'Public'];

    const handleDownload = (file) => {
        if (!file || !file.path) return;
        // Assuming the backend serves the uploads folder. 
        // We might need to adjust the path depending on how the server is configured.
        const fileName = file.path.split('\\').pop() || file.path.split('/').pop();
        const downloadUrl = `http://localhost:5000/uploads/documents/${fileName}`;
        window.open(downloadUrl, '_blank');
    };

    const handleDeleteClick = (doc) => {
        setDocToDelete(doc);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!docToDelete) return;
        try {
            await deleteDocument(docToDelete._id).unwrap();
            setIsDeleteModalOpen(false);
            setDocToDelete(null);
        } catch (error) {
            console.error('Failed to delete document:', error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <>
            <div className="p-1 space-y-6">
                {/* Filters and Search Header */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by Title"
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-sm text-gray-700"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter Toggle */}
                        <div className="relative group">
                            <select
                                className="appearance-none bg-gray-50 border border-transparent h-full px-4 py-2 pr-10 rounded-lg text-sm font-medium text-gray-600 focus:bg-white focus:border-indigo-500 transition-all outline-none cursor-pointer"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-semibold active:scale-95 shrink-0"
                    >
                        <Plus size={20} />
                        <span>Add Document</span>
                    </button>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Title</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Description</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Files</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Access</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Uploaded By</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-48" /></td>
                                            <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded-full mx-auto" /></td>
                                            <td className="px-6 py-4 flex justify-center"><div className="h-6 w-6 bg-gray-100 rounded-full" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                                            <td className="px-6 py-4"><div className="h-6 w-6 bg-gray-100 rounded mx-auto" /></td>
                                        </tr>
                                    ))
                                ) : documents.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                                    <FileText size={32} />
                                                </div>
                                                <div className="text-gray-500 font-medium">No documents found</div>
                                                <p className="text-sm text-gray-400 max-w-xs">Start by adding your first document to share it with the team.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    documents.map((doc) => (
                                        <tr key={doc._id} className="group hover:bg-indigo-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors truncate max-w-[150px]" title={doc.title}>
                                                    {doc.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-500 line-clamp-1 max-w-[200px]" title={doc.description}>
                                                    {doc.description || '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 items-center">
                                                    {doc.files && doc.files.length > 0 ? (
                                                        doc.files.map((file, idx) => (
                                                            <div key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-[10px] text-gray-600 max-w-[120px]">
                                                                <Paperclip size={10} className="shrink-0" />
                                                                <span className="truncate">{file.originalName}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No files</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    {doc.accessType === 'Private' ? (
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-bold">
                                                            <Lock size={12} />
                                                            <span>PRIVATE</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold">
                                                            <Globe size={12} />
                                                            <span>PUBLIC</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold border border-indigo-200">
                                                        {doc.uploadedBy?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-700 leading-none">{doc.uploadedBy?.name || 'User'}</span>
                                                        <span className="text-[10px] text-gray-400 mt-1">{doc.uploadedBy?.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {formatDate(doc.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {doc.files && doc.files.length > 0 && (
                                                        <button
                                                            onClick={() => handleDownload(doc.files[0])}
                                                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="Download First File"
                                                        >
                                                            <Download size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteClick(doc)}
                                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete Document"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination or Footer */}
                    {!isLoading && documents.length > 0 && (
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Showing {documents.length} results</span>
                            <div className="flex gap-2">
                                <button className="p-1 px-3 text-xs border border-gray-200 rounded text-gray-400 cursor-not-allowed">Previous</button>
                                <button className="p-1 px-3 text-xs border border-gray-200 rounded text-gray-400 cursor-not-allowed">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddDocumentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={docToDelete?.title || 'this document'}
                isLoading={isDeleting}
            />
        </>
    );
};

export default DocumentSharing;
