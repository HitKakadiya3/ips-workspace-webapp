import React, { useState } from 'react';
import { useApplyWorkFromHomeMutation } from '../../store/api/wfhApi';
import { X, Calendar } from 'lucide-react';

const WorkFromHomeModal = ({ isOpen, onClose }) => {
    const [type, setType] = useState('Single Day');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const [applyWorkFromHome, { isLoading }] = useApplyWorkFromHomeMutation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await applyWorkFromHome({
                userId: user._id || user.id,
                type,
                startDate,
                endDate: type === 'Multiple Days' ? endDate : undefined,
                reason
            }).unwrap();

            // Reset form
            setType('Single Day');
            setStartDate('');
            setEndDate('');
            setReason('');

            onClose();
        } catch (error) {
            console.error('Failed to apply for WFH:', error);
            // Ideally handle error state here
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all p-6 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-700">Apply For Work From Home</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type Selection */}
                    <div className="flex items-center space-x-8">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">TYPE <span className="text-red-500">*</span></label>
                        <div className="flex items-center space-x-6">
                            <label className="flex items-center cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 transition-colors ${type === 'Single Day' ? 'border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'}`}>
                                    {type === 'Single Day' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                                </div>
                                <span className={`text-sm ${type === 'Single Day' ? 'text-gray-900' : 'text-gray-500'}`}>Single Day</span>
                                <input
                                    type="radio"
                                    name="type"
                                    value="Single Day"
                                    checked={type === 'Single Day'}
                                    onChange={(e) => setType(e.target.value)}
                                    className="hidden"
                                />
                            </label>

                            <label className="flex items-center cursor-pointer group">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-2 transition-colors ${type === 'Multiple Days' ? 'border-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'}`}>
                                    {type === 'Multiple Days' && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />}
                                </div>
                                <span className={`text-sm ${type === 'Multiple Days' ? 'text-gray-900' : 'text-gray-500'}`}>Multiple Days</span>
                                <input
                                    type="radio"
                                    name="type"
                                    value="Multiple Days"
                                    checked={type === 'Multiple Days'}
                                    onChange={(e) => setType(e.target.value)}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Date Fields */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">START DATE <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400"
                                    placeholder="dd-mm-yyyy"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                        </div>

                        {type === 'Multiple Days' && (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">END DATE <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder-gray-400"
                                        placeholder="dd-mm-yyyy"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Reason Field */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">REASON <span className="text-red-500">*</span></label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className="w-full p-4 rounded-lg border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-indigo-600 text-white px-8 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-sm font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkFromHomeModal;
