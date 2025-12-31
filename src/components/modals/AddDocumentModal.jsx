import React, { useState } from 'react';
import { X, Upload, Lock, Globe, Plus } from 'lucide-react';
import { useAddDocumentMutation } from '../../store/api/documentApi';

const AddDocumentModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        accessType: 'Private',
        shareWith: ''
    });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [addDocument, { isLoading }] = useAddDocumentMutation();

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || selectedFiles.length === 0) return;

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('accessType', formData.accessType);
        data.append('shareWith', formData.shareWith);
        selectedFiles.forEach(file => {
            data.append('files', file);
        });

        try {
            await addDocument(data).unwrap();
            onClose();
        } catch (err) {
            console.error('Failed to add document:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl animate-scaleIn overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-800">Add Document</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Title */}
                    <div className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            className="col-span-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                            placeholder="Enter Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    {/* Description */}
                    <div className="grid grid-cols-3 gap-4 items-start">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider text-right pt-2">
                            Description
                        </label>
                        <textarea
                            className="col-span-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none min-h-[100px] resize-none"
                            placeholder="Enter Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Access Type */}
                    <div className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">
                            Access Type <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-2 flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="accessType"
                                    value="Private"
                                    checked={formData.accessType === 'Private'}
                                    onChange={(e) => setFormData({ ...formData, accessType: e.target.value })}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Private</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="accessType"
                                    value="Public"
                                    checked={formData.accessType === 'Public'}
                                    onChange={(e) => setFormData({ ...formData, accessType: e.target.value })}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Public</span>
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div />
                        <p className="col-span-2 text-xs text-gray-400 -mt-2">
                            Note: Public means this file can be accessed by anyone from the Workspace.
                        </p>
                    </div>

                    {/* Share With */}
                    {formData.accessType === 'Private' && (
                        <div className="grid grid-cols-3 gap-4 items-center animate-fadeIn">
                            <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">
                                Share With
                            </label>
                            <input
                                type="text"
                                className="col-span-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                                placeholder="Team Member"
                                value={formData.shareWith}
                                onChange={(e) => setFormData({ ...formData, shareWith: e.target.value })}
                            />
                        </div>
                    )}

                    {/* File Picker */}
                    <div className="grid grid-cols-3 gap-4 items-center">
                        <label className="text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">
                            File <span className="text-red-500">*</span>
                        </label>
                        <div className="col-span-2 relative group">
                            <div className="flex items-stretch">
                                <label className="cursor-pointer bg-indigo-50 text-indigo-600 px-4 py-2 rounded-l-lg border border-indigo-200 border-r-0 hover:bg-indigo-100 transition-colors flex items-center gap-2">
                                    <Upload size={18} />
                                    <span className="text-sm font-medium">Choose Files</span>
                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <div className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-r-lg text-sm text-gray-500 flex items-center truncate">
                                    {selectedFiles.length > 0
                                        ? `${selectedFiles.length} file(s) selected`
                                        : 'No file chosen'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div />
                        <p className="col-span-2 text-xs text-gray-400 -mt-2">
                            Note: You can upload multiple files; on hover you can see uploaded file.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium flex items-center gap-2 shadow-lg shadow-indigo-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDocumentModal;
