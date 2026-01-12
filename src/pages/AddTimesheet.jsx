import React, { useState, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Code, Highlighter, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TimePicker from '../components/ui/TimePicker';
import { getProjects } from '../services/projectService';
import { useAddTimesheetMutation, useGetDailyTimesheetQuery } from '../store/api/timesheetApi';

const AddTimesheet = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id || user._id;
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formData, setFormData] = useState({
        project: '',
        task: '',
        hours: '00:00',
        billingType: 'Billable',
        description: ''
    });

    const [addTimesheet, { isLoading: isSubmitting }] = useAddTimesheetMutation();

    // Get today's date in YYYY-MM-DD format
    const todayDate = new Date().toISOString().split('T')[0];
    const { data: dailyTimesheets = [] } = useGetDailyTimesheetQuery({ userId, date: todayDate }, { skip: !userId });

    const [projectList, setProjectList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Hours tracking - Total is always 8:30 per day
    const TOTAL_HOURS_PER_DAY = 8.5; // 8 hours 30 minutes
    const [filledHoursDecimal, setFilledHoursDecimal] = useState(0); // Store as decimal for calculations

    // Convert decimal hours to HH:MM format
    const formatHoursToTime = (decimalHours) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    // Convert HH:MM format to decimal hours
    const timeToDecimal = (timeString) => {
        if (!timeString) return 0;
        if (typeof timeString === 'number') return timeString;

        const str = String(timeString);
        if (!str.includes(':')) {
            const val = parseFloat(str);
            return isNaN(val) ? 0 : val;
        }

        const [hours, minutes] = str.split(':').map(Number);
        return hours + (minutes / 60);
    };

    // Calculate filled hours when dailyTimesheets data changes
    useEffect(() => {
        if (Array.isArray(dailyTimesheets)) {
            const totalFilled = dailyTimesheets.reduce((sum, entry) => {
                const entryTime = entry.hours || entry.time || "00:00";
                return sum + timeToDecimal(entryTime);
            }, 0);

            setFilledHoursDecimal(totalFilled);
        }
    }, [dailyTimesheets]);

    // Calculate available hours
    const availableHoursDecimal = Math.max(0, TOTAL_HOURS_PER_DAY - filledHoursDecimal);

    // Formatted display values
    const totalHours = formatHoursToTime(TOTAL_HOURS_PER_DAY);
    const filledHours = formatHoursToTime(filledHoursDecimal);
    const availableHours = formatHoursToTime(availableHoursDecimal);

    // Fetch initial data (projects)
    useEffect(() => {
        const loadProjects = async () => {
            setIsLoading(true);
            try {
                // Fetch Projects
                const response = await getProjects({}, {
                    role: user.role,
                    userId
                });
                // Handle direct array or { data: [...] } structure
                const projectsData = response?.data || response;
                setProjectList(Array.isArray(projectsData) ? projectsData : []);
            } catch (error) {
                console.error('Error loading projects:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            loadProjects();
        }
    }, [userId]);

    const tasks = [
        'Development',
        'Code Review',
        'Meeting',
        'Documentation',
        'Testing'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate that time entry is 2 hours or less
        const entryHours = timeToDecimal(formData.hours);
        if (entryHours > 2) {
            alert('Time entry cannot exceed 2 hours per entry. Please enter 2 hours or less.');
            return;
        }

        // Validate that time entry doesn't exceed available hours
        if (entryHours > availableHoursDecimal) {
            alert(`Time entry (${formData.hours}) exceeds available hours (${availableHours})`);
            return;
        }

        console.log('Timesheet data:', formData);

        const saveTimesheet = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                const userId = user.id || user._id;

                if (!userId) {
                    alert('User details not found. Please login again.');
                    return;
                }

                const payload = {
                    user: userId,
                    project: formData.project,
                    task: formData.task,
                    hours: formData.hours,
                    billingType: formData.billingType,
                    description: formData.description
                };

                await addTimesheet(payload).unwrap();
                setShowSuccessModal(true);
            } catch (error) {
                console.error('Error saving timesheet:', error);
                alert(error?.data?.message || 'Failed to save timesheet. Please try again.');
            }
        };

        saveTimesheet();
    };

    const formatToolbarButton = (Icon, title) => (
        <button
            type="button"
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title={title}
        >
            <Icon size={16} className="text-gray-600" />
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Hours Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex items-center gap-8 text-sm">
                    <div>
                        <span className="text-gray-600">Total Hours: </span>
                        <span className="font-semibold text-red-500">{totalHours}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Filled Hours: </span>
                        <span className="font-semibold text-red-500">{filledHours}</span>
                    </div>
                    <div>
                        <span className="text-gray-600">Available Hours: </span>
                        <span className="font-semibold text-gray-800">{availableHours}</span>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative">
                {availableHoursDecimal <= 0 && (
                    <div className="absolute inset-0 z-10 bg-gray-50/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                        <div className="bg-white p-6 rounded-xl shadow-xl border border-red-100 max-w-sm text-center">
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">⏳</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">Daily Limit Reached</h3>
                            <p className="text-gray-600 text-sm">You have completed your 8:30 hours for today. Please come back tomorrow!</p>
                        </div>
                    </div>
                )}
                {/* Form Fields Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {/* Project */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                            Project <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="project"
                            value={formData.project}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-600 bg-white"
                            required
                        >
                            <option value="">{isLoading ? 'Loading projects...' : 'Select Project'}</option>
                            {projectList.map((project) => (
                                <option key={project._id || project.id} value={project._id || project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Task */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                            Task <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="task"
                            value={formData.task}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-600 bg-white"
                            required
                        >
                            <option value="">Select Task</option>
                            {tasks.map((task, idx) => (
                                <option key={idx} value={task}>{task}</option>
                            ))}
                        </select>
                    </div>

                    {/* Time Entry */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                            Time Entry <span className="text-red-500">*</span>
                        </label>
                        <TimePicker
                            name="hours"
                            value={formData.hours}
                            onChange={handleInputChange}
                            maxHours={Math.min(2, availableHoursDecimal)}
                        />
                    </div>

                    {/* Project Billing Type */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                            Project Billing Type <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-6 h-10">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="billingType"
                                    value="Billable"
                                    checked={formData.billingType === 'Billable'}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Billable</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="billingType"
                                    value="Non Billable"
                                    checked={formData.billingType === 'Non Billable'}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700">Non Billable</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase">
                        Description <span className="text-red-500">*</span>
                    </label>

                    {/* Rich Text Editor Toolbar */}
                    <div className="border border-gray-200 rounded-t-lg bg-gray-50 px-3 py-2 flex items-center gap-1">
                        {formatToolbarButton(Bold, 'Bold')}
                        {formatToolbarButton(Italic, 'Italic')}
                        {formatToolbarButton(Underline, 'Underline')}
                        <div className="w-px h-5 bg-gray-300 mx-1"></div>
                        {formatToolbarButton(List, 'Bullet List')}
                        {formatToolbarButton(ListOrdered, 'Numbered List')}
                        <div className="w-px h-5 bg-gray-300 mx-1"></div>
                        <button
                            type="button"
                            className="px-2 py-1 hover:bg-gray-100 rounded transition-colors flex items-center gap-1"
                            title="Highlight"
                        >
                            <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                        </button>
                        <div className="w-px h-5 bg-gray-300 mx-1"></div>
                        {formatToolbarButton(Code, 'Code')}
                    </div>

                    {/* Text Area */}
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-t-0 border-gray-200 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-700 min-h-[200px] resize-y"
                        placeholder="Enter description..."
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-start">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold shadow-lg shadow-indigo-100 active:scale-95 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform transition-all animate-scaleIn">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
                            <p className="text-gray-500 mb-6">
                                Timesheet submitted successfully.
                            </p>
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => {
                                        setShowSuccessModal(false);
                                        setFormData(prev => ({ ...prev, description: '', hours: '00:00' })); // Reset some fields?
                                        // Maybe better to reset form fully or partial
                                    }}
                                    className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Add Another
                                </button>
                                <button
                                    onClick={() => navigate('/timesheet/details')}
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddTimesheet;
