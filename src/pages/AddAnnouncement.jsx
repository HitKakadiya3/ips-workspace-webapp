import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Megaphone, Type, FileText, Paperclip, X, CheckCircle2 } from 'lucide-react';
import { createAnnouncement } from '../services/announcementService';

const AddAnnouncement = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        type: 'News',
        description: '',
        attachment: null
    });

    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await createAnnouncement(formData);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error creating announcement:', error);
            alert('Failed to create announcement. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/announcements')}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <ArrowLeft size={24} className="text-gray-600 group-hover:text-indigo-600" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Create New Announcement</h2>
                        <p className="text-gray-500 text-sm">Post a new update or policy for the organization</p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Title Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <Megaphone size={16} className="text-indigo-500" />
                            Announcement Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Upcoming Holiday or New Policy Update"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Type Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Type size={16} className="text-indigo-500" />
                                Announcement Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="News">News</option>
                                <option value="Policy">Policy</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Attachment Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Paperclip size={16} className="text-indigo-500" />
                                Attachment (Optional)
                            </label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="attachment"
                                />
                                <label
                                    htmlFor="attachment"
                                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer group-hover:border-indigo-400 group-hover:bg-indigo-50/30 transition-all"
                                >
                                    <span className="text-sm text-gray-500 truncate max-w-[200px]">
                                        {formData.attachment ? formData.attachment.name : 'Choose file...'}
                                    </span>
                                    <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase">
                                        {formData.attachment ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setFormData(prev => ({ ...prev, attachment: null }));
                                                }}
                                                className="p-1 hover:bg-indigo-100 rounded"
                                            >
                                                <X size={14} />
                                            </button>
                                        ) : (
                                            <>
                                                <span>Upload</span>
                                                <Paperclip size={14} />
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Description Field */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                            <FileText size={16} className="text-indigo-500" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="6"
                            placeholder="Provide detailed information about the announcement..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                        ></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 whitespace-nowrap ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={20} />
                            )}
                            <span>{loading ? 'Creating...' : 'Post Announcement'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fadeIn"
                        onClick={() => navigate('/announcements')}
                    />
                    <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-scaleIn">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center animate-bounce">
                                <CheckCircle2 size={48} className="text-green-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                        <p className="text-gray-500 mb-8">
                            Your announcement has been posted successfully to the organization.
                        </p>
                        <button
                            onClick={() => navigate('/announcements')}
                            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                        >
                            Back to Announcements
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAnnouncement;
