import React, { useEffect, useState } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Info, ChevronDown } from 'lucide-react';

const ApplyLeave = () => {
    const [formData, setFormData] = useState({
        category: '',
        duration: 'single',
        startDate: '',
        endDate: '',
        hours: '',
        reason: ''
    });
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const leaveCategories = [
        'Personal Leave',
        'Unpaid Leave',
        'Appreciation Leave (C-Off)'
    ];

    const initialDisplayItems = [
        { type: 'Personal', key: 'Personal', total: 16 },
        { type: 'Unpaid', key: 'Unpaid', total: 60 },
        { type: 'Ad-hoc', key: 'Ad-hoc', total: 0 }
    ];

    const [leaveDetails, setLeaveDetails] = useState(
        initialDisplayItems.map(item => ({ type: item.type, used: 0, total: item.total }))
    );

    // fetch leave counts and update state
    const fetchLeaveCounts = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const res = await api.get(`/api/leaves/${userId}/count`);
            if (res?.data?.success && res.data.data) {
                const data = res.data.data;
                const mapped = initialDisplayItems.map(item => ({
                    type: item.type,
                    used: Number(data[item.key]) || 0,
                    total: item.total
                }));
                setLeaveDetails(mapped);
            }
        } catch (err) {
            console.error('Failed to fetch leave counts', err);
        }
    };

    useEffect(() => {
        fetchLeaveCounts();
    }, []);

    const totalLeaves = leaveDetails.reduce((acc, item) => ({
        used: acc.used + item.used,
        total: acc.total + item.total
    }), { used: 0, total: 0 });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [submitting, setSubmitting] = useState(false);
    const [successModal, setSuccessModal] = useState({ open: false, message: '' });

    const mapCategoryToLeaveType = (category) => {
        if (!category) return '';
        const c = category.toLowerCase();
        if (c.includes('personal')) return 'Personal';
        if (c.includes('unpaid')) return 'Unpaid';
        if (c.includes('appreciation') || c.includes('c-off') || c.includes('ad')) return 'Ad-hoc';
        if (c.includes('sick')) return 'Sick';
        if (c.includes('casual')) return 'Casual';
        return 'Other';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        try {
            const userId = localStorage.getItem('userId') || '6942550bbaccb92db0ed143d';
            const leaveType = mapCategoryToLeaveType(formData.category);
            const payload = {
                leaveType,
                startDate: formData.startDate,
                endDate: formData.duration === 'multiple' ? formData.endDate : formData.startDate,
                reason: formData.reason,
                year: new Date(formData.startDate).getFullYear(),
                hours: formData.duration === 'hours' ? formData.hours : undefined
            };

            const res = await api.post(`/api/leaves/${userId}`, payload);
            if (res?.data?.success) {
                console.log('Leave saved', res.data.data);
                setFormData({
                    category: '',
                    duration: 'single',
                    startDate: '',
                    endDate: '',
                    hours: '',
                    reason: ''
                });
                fetchLeaveCounts();
                // show success modal
                setSuccessModal({ open: true, message: 'Leave request submitted successfully.' });
            } else {
                console.error('Failed to save leave', res?.data);
                alert('Failed to submit leave');
            }
        } catch (err) {
            console.error('Submit error', err);
            alert('Error submitting leave');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col lg:flex-row gap-6">
                {successModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setSuccessModal({ open: false, message: '' })} />
                        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10">
                            <h4 className="text-lg font-semibold text-gray-800">Success</h4>
                            <p className="text-sm text-gray-600 mt-2">{successModal.message}</p>
                            <div className="mt-4 text-right">
                                <button
                                    onClick={() => setSuccessModal({ open: false, message: '' })}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Left Section - Form */}
                <div className="flex-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        {/* Notice */}
                        <div className="mb-6">
                            <p className="text-indigo-600 text-sm">
                                Request leave for all days at once. Saturdays, Sundays, or holidays will not be included in the calculation.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Select Category */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                                <label className="text-sm font-medium text-gray-600 sm:w-32 text-right whitespace-nowrap">
                                    SELECT CATEGORY <span className="text-red-500">*</span>
                                </label>
                                <div className="flex-1">
                                    <div className="relative">
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700"
                                            required
                                        >
                                            <option value="">Select Leave Category</option>
                                            {leaveCategories.map((category, idx) => (
                                                <option key={idx} value={category}>{category}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                                <label className="text-sm font-medium text-gray-600 sm:w-32 text-right whitespace-nowrap">
                                    DURATION <span className="text-red-500">*</span>
                                </label>
                                <div className="flex-1">
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="duration"
                                                value="single"
                                                checked={formData.duration === 'single'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700">Single Day</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="duration"
                                                value="multiple"
                                                checked={formData.duration === 'multiple'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700">Multiple Day</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="duration"
                                                value="hours"
                                                checked={formData.duration === 'hours'}
                                                onChange={handleInputChange}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700">Hours</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Start Date */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                                <label className="text-sm font-medium text-gray-600 sm:w-32 text-right whitespace-nowrap">
                                    START DATE <span className="text-red-500">*</span>
                                </label>
                                <div className="flex-1">
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                                        required
                                    />
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        <Info size={12} />
                                        Click on the icon to open picker
                                    </p>
                                </div>
                            </div>

                            {/* End Date - Only show for multiple days */}
                            {formData.duration === 'multiple' && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                                    <label className="text-sm font-medium text-gray-600 sm:w-32 text-right whitespace-nowrap">
                                        END DATE <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex-1">
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Hours - Only show for hours duration */}
                            {formData.duration === 'hours' && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                                    <label className="text-sm font-medium text-gray-600 sm:w-32 text-right whitespace-nowrap">
                                        HOURS <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex-1">
                                        <input
                                            type="number"
                                            name="hours"
                                            value={formData.hours}
                                            onChange={handleInputChange}
                                            placeholder="Enter hours"
                                            min="1"
                                            max="8"
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700"
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Reason */}
                            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
                                <label className="text-sm font-medium text-gray-600 sm:w-32 text-right whitespace-nowrap pt-2">
                                    REASON
                                </label>
                                <div className="flex-1">
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        placeholder="Enter Reason"
                                        rows={4}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-700 resize-y"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                                <div className="sm:w-32"></div>
                                <div className="flex-1">
                                    <button
                                        type="submit"
                                        className="px-8 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Section - Leave Details */}
                <div className="lg:w-80">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 flex items-center justify-between border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-700">My Leave Details</h3>
                            <div className="relative">
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="px-3 py-1 border border-gray-200 rounded text-sm appearance-none pr-7 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value={2025}>2025</option>
                                    <option value={2024}>2024</option>
                                    <option value={2023}>2023</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                            </div>
                        </div>

                        {/* Leave List */}
                        <div className="divide-y divide-gray-50">
                            {leaveDetails.map((item, idx) => (
                                <div key={idx} className="px-4 py-3 flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{item.type}</span>
                                    <span className="text-sm font-medium text-gray-700">{item.used}/{item.total}</span>
                                </div>
                            ))}
                        </div>

                        {/* Total */}
                        <div className="px-4 py-3 bg-gray-100 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Total:</span>
                            <span className="text-sm font-bold text-gray-800">{totalLeaves.used}/{totalLeaves.total}</span>
                        </div>

                        {/* Note */}
                        <div className="px-4 py-3">
                            <p className="text-xs text-gray-400">
                                Note: The leave count only includes approved leaves.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ApplyLeave;
