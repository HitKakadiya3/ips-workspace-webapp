import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Tag, FileText, Calendar, ShieldAlert, Award, Info, Loader2, CheckCircle2 } from 'lucide-react';
import { useAddNoticeAppreciationMutation } from '../store/api/noticeAppreciationApi';
import { getAllUsers } from '../services/api';
import { getProjects } from '../services/projectService';

const AddNoticeAppreciation = () => {
    const navigate = useNavigate();
    const [addNoticeAppreciation, { isLoading: isSubmitting }] = useAddNoticeAppreciationMutation();

    const [form, setForm] = useState({
        user: '',
        type: 'Notice',
        subType: '',
        project: '',
        kpiCategory: '',
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        severity: 'Low'
    });

    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, projectsRes] = await Promise.all([
                    getAllUsers(),
                    getProjects()
                ]);

                const usersData = usersRes.data?.data || usersRes.data?.users || usersRes.data;
                setUsers(Array.isArray(usersData) ? usersData : []);

                const projectsData = projectsRes.data || projectsRes;
                setProjects(Array.isArray(projectsData) ? projectsData : []);
            } catch (error) {
                console.error('Error fetching dependency data:', error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...form };
            if (!payload.project) delete payload.project;

            await addNoticeAppreciation(payload).unwrap();
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to create notice/appreciation:', error);
            alert(error?.data?.message || 'Failed to create record. Please try again.');
        }
    };

    if (loadingData) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto animate-fadeIn pb-20">

            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className={`h-2 ${form.type === 'Notice' ? 'bg-red-500' : 'bg-green-500'} transition-colors duration-500`} />
                <form onSubmit={handleSubmit} className="p-8 space-y-8">

                    {/* Basic Info Group */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Record Type Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Tag size={16} className="text-indigo-500" />
                                Record Type
                            </label>
                            <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-50 rounded-2xl border border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, type: 'Notice' }))}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${form.type === 'Notice' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <ShieldAlert size={16} />
                                    Notice
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm(prev => ({ ...prev, type: 'Appreciation' }))}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${form.type === 'Appreciation' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    <Award size={16} />
                                    Appreciation
                                </button>
                            </div>
                        </div>

                        {/* Employee Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <User size={16} className="text-indigo-500" />
                                Select Employee
                            </label>
                            <select
                                name="user"
                                value={form.user}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer font-medium"
                            >
                                <option value="">Choose an employee...</option>
                                {users.map(u => (
                                    <option key={u._id} value={u._id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Sub type */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700">Sub Type</label>
                            <select
                                name="subType"
                                value={form.subType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium cursor-pointer"
                            >
                                <option value="">Select Sub Type</option>
                                <option value="Performance">Performance</option>
                                <option value="Behavior">Behavior</option>
                                <option value="Teamwork">Teamwork</option>
                                <option value="Project Delivery">Project Delivery</option>
                                <option value="Attendance">Attendance</option>
                                <option value="Policy Violation">Policy Violation</option>
                                <option value="Timesheet">Timesheet</option>
                                <option value="Leave">Leave</option>
                                <option value="Quality">Quality</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Date */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Calendar size={16} className="text-indigo-500" />
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    {/* Secondary Info Group */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Project Selection */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700">Project (Optional)</label>
                            <select
                                name="project"
                                value={form.project}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer font-medium"
                            >
                                <option value="">Select Project</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* KPI Category */}
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700">KPI Category</label>
                            <input
                                type="text"
                                name="kpiCategory"
                                value={form.kpiCategory}
                                onChange={handleChange}
                                placeholder="e.g. Quality, Timely Delivery"
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>

                        {/* Severity - Only for Notice */}
                        <div className="space-y-3">
                            <label className={`text-sm font-bold text-gray-700 transition-opacity ${form.type === 'Appreciation' ? 'opacity-40' : ''}`}>Severity</label>
                            <select
                                name="severity"
                                value={form.severity}
                                onChange={handleChange}
                                disabled={form.type === 'Appreciation'}
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Content Group */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700">Title / Subject</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                placeholder="Brief heading for this record..."
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <FileText size={16} className="text-indigo-500" />
                                Detailed Description
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Explain the reasons or details for this notice/appreciation..."
                                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium resize-none shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-8 flex items-center justify-between border-t border-gray-100 mt-10">
                        <div className="flex items-center gap-2 text-gray-400">
                            <Info size={16} />
                            <p className="text-xs font-medium">This record will be visible to the employee on their dashboard.</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/notice-appreciation')}
                                className="px-8 py-3.5 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 border border-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`flex items-center gap-2 px-10 py-3.5 rounded-2xl text-white font-bold transition-all shadow-lg active:scale-95 ${form.type === 'Notice' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isSubmitting ? 'Saving...' : 'Save & Publish'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fadeIn" />
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-10 text-center animate-scaleIn">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={56} className="text-green-500" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">Record Saved!</h3>
                        <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                            The {form.type.toLowerCase()} has been successfully created and the employee has been notified.
                        </p>
                        <button
                            onClick={() => navigate('/notice-appreciation')}
                            className="w-full py-4.5 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-[0.98]"
                        >
                            View All Records
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddNoticeAppreciation;
