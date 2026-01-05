import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Info, ChevronDown } from 'lucide-react';
import { useGetLeaveCountsQuery, useGetLeaveHistoryQuery, useApplyLeaveMutation } from '../store/api/leaveApi';
import { fetchProfile } from '../store/slices/profileSlice';

const ApplyLeave = () => {
    const userId = localStorage.getItem('userId');
    const dispatch = useDispatch();
    const { data: profileData } = useSelector((state) => state.profile);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        if (!profileData) {
            dispatch(fetchProfile());
        }
    }, [dispatch, profileData]);

    const joiningYear = useMemo(() => {
        if (profileData?.dateOfJoining) {
            return new Date(profileData.dateOfJoining).getFullYear();
        }
        return 2023; // Fallback
    }, [profileData]);

    const years = useMemo(() => {
        const currentY = new Date().getFullYear();
        const yearList = [];
        for (let y = currentY; y >= joiningYear; y--) {
            yearList.push(y);
        }
        return yearList;
    }, [joiningYear]);

    const { data: reduxCounts, isLoading: countsLoading } = useGetLeaveCountsQuery({ userId, year: selectedYear });
    const { data: leaveHistory, isLoading: historyLoading } = useGetLeaveHistoryQuery({ userId, year: selectedYear });
    const [applyLeave, { isLoading: submitting }] = useApplyLeaveMutation();

    const [formData, setFormData] = useState({
        category: '',
        duration: 'single',
        startDate: '',
        endDate: '',
        hours: '',
        partOfDay: '',
        partOfday: '',
        reason: ''
    });

    const leaveCategories = [
        'Personal Leave',
        'Unpaid Leave',
        'Appreciation Leave (C-Off)'
    ];

    // Simplified mapping for the UI
    const leaveDetails = reduxCounts ? [
        { type: 'Personal', used: reduxCounts.Personal || 0, total: 16 },
        { type: 'Unpaid', used: reduxCounts.Unpaid || 0, total: 60 },
        { type: 'Ad-hoc', used: reduxCounts.Adhoc || reduxCounts['Ad-hoc'] || 0, total: 0 }
    ] : [];

    const totalLeaves = leaveDetails.reduce((acc, item) => ({
        used: acc.used + item.used,
        total: acc.total + item.total
    }), { used: 0, total: 0 });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value, "leave");
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'partOfDay' ? { partOfday: value } : {})
        }));
    };

    const [successModal, setSuccessModal] = useState({ open: false, message: '' });
    const [warningModal, setWarningModal] = useState({ open: false, message: '' });

    const calculateWorkDays = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        let count = 0;
        let current = new Date(start);
        while (current <= end) {
            const day = current.getDay();
            if (day !== 0 && day !== 6) { // Skip Sat (6) and Sun (0)
                count++;
            }
            current.setDate(current.getDate() + 1);
        }
        return count;
    };

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

    const checkConflict = () => {
        if (!leaveHistory || !formData.startDate) return null;

        const start = new Date(formData.startDate);
        const end = formData.duration === 'multiple' ? new Date(formData.endDate) : start;

        // Reset time to midnight for accurate comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        for (const leave of leaveHistory) {
            const lStart = new Date(leave.startDate);
            const lEnd = leave.endDate ? new Date(leave.endDate) : lStart;

            lStart.setHours(0, 0, 0, 0);
            lEnd.setHours(0, 0, 0, 0);

            // Check if dates overlap
            if (start <= lEnd && end >= lStart) {
                // If the existing leave is a full day, it's always a conflict
                const isExistingHalf = leave.isHalfDay || leave.duration === 0.5 || leave.leaveDuration === 0.5;
                const isNewHalf = formData.duration === 'hours';

                if (!isExistingHalf && !isNewHalf) return "Leave already added for these dates.";

                if (!isExistingHalf && isNewHalf) return "A full-day leave already exists for this date.";

                if (isExistingHalf && !isNewHalf) {
                    // If we are applying for a full day but there's already a half day
                    if (start.getTime() === lStart.getTime()) return "A half-day leave already exists for this date.";
                }

                if (isExistingHalf && isNewHalf) {
                    // Both are half days, check AM/PM
                    if (start.getTime() === lStart.getTime()) {
                        const existingPart = (leave.partOfDay || leave.partOfday || leave.part_of_day || "").toLowerCase();
                        const newPart = formData.partOfDay.toLowerCase();

                        const isExistingAM = existingPart.includes('morning') || existingPart.includes('am') || leave.session === 1;
                        const isExistingPM = existingPart.includes('afternoon') || existingPart.includes('pm') || leave.session === 2;

                        const isNewAM = newPart.includes('morning');
                        const isNewPM = newPart.includes('afternoon');

                        if ((isExistingAM && isNewAM) || (isExistingPM && isNewPM)) {
                            return `A half-day leave (${isExistingAM ? 'Morning' : 'Afternoon'}) already exists for this date.`;
                        }
                    }
                }
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const conflict = checkConflict();
        if (conflict) {
            setWarningModal({ open: true, message: conflict });
            return;
        }

        if (submitting) return;

        try {
            const leaveType = mapCategoryToLeaveType(formData.category);
            const isMultiple = formData.duration === 'multiple';
            const workDays = isMultiple ? calculateWorkDays(formData.startDate, formData.endDate) : (formData.duration === 'hours' ? 0.5 : 1);

            const payload = {
                leaveType,
                startDate: formData.startDate,
                endDate: isMultiple ? formData.endDate : formData.startDate,
                reason: formData.reason,
                year: new Date(formData.startDate).getFullYear(),
                days: workDays,
                noOfDays: workDays,
                hours: formData.duration === 'hours' ? "4" : undefined,
                duration: formData.duration === 'hours' ? 0.5 : workDays,
                leaveDuration: formData.duration === 'hours' ? 0.5 : workDays,
                isHalfDay: formData.duration === 'hours',
                partOfDay: formData.duration === 'hours' ? (formData.partOfDay === 'AfterNoon' ? 'AfterNoon' : 'Morning') : undefined,
                partOfday: formData.duration === 'hours' ? (formData.partOfDay === 'AfterNoon' ? 'AfterNoon' : 'Morning') : undefined,
                part_of_day: formData.duration === 'hours' ? (formData.partOfDay === 'AfterNoon' ? 'PM' : 'AM') : undefined,
                session: formData.duration === 'hours' ? (formData.partOfDay === 'AfterNoon' ? 2 : 1) : undefined
            };

            const res = await applyLeave({ userId, payload }).unwrap();
            if (res?.success) {
                console.log('Leave saved', res.data);
                setFormData({
                    category: '',
                    duration: 'single',
                    startDate: '',
                    endDate: '',
                    hours: '',
                    partOfDay: '',
                    partOfday: '',
                    reason: ''
                });

                // show success modal
                setSuccessModal({ open: true, message: 'Leave request submitted successfully.' });
            } else {
                console.error('Failed to save leave', res);
                setWarningModal({ open: true, message: 'Failed to submit leave. Please try again.' });
            }
        } catch (err) {
            console.error('Submit error', err);
            setWarningModal({ open: true, message: 'Error submitting leave. Please check your connection.' });
        }
    };

    return (
        <>
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
                {warningModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setWarningModal({ open: false, message: '' })} />
                        <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 z-10 border-t-4 border-amber-500">
                            <h4 className="text-lg font-semibold text-amber-600">Warning</h4>
                            <p className="text-sm text-gray-600 mt-2">{warningModal.message}</p>
                            <div className="mt-4 text-right">
                                <button
                                    onClick={() => setWarningModal({ open: false, message: '' })}
                                    className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
                                >
                                    Dismiss
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

                            {/* Part of Day - Only show for hours duration */}
                            {formData.duration === 'hours' && (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
                                    <label className="text-sm font-medium text-gray-600 sm:w-32 text-right whitespace-nowrap">
                                        PART OF DAY <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex-1">
                                        <div className="relative">
                                            <select
                                                name="partOfDay"
                                                value={formData.partOfDay}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700"
                                                required
                                            >
                                                <option value="">Select Part Of Day</option>
                                                <option value="Morning">Morning</option>
                                                <option value="AfterNoon">AfterNoon</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                                        </div>
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
                                    {years.map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
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
        </>
    );
};

export default ApplyLeave;
