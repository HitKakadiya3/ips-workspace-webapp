import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Search, Users, CheckCircle2 } from 'lucide-react';
import { getAllUsers } from '../services/api';
import { createProject } from '../services/projectService';

const CreateProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        pmName: '',
        clientName: '',
        status: 'In Progress',
        projectType: 'Dedicated',
        startDate: new Date().toISOString().split('T')[0],
        deadline: '',
        isBillable: true,
        assignees: []
    });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                const usersData = response.data?.data || response.data?.users || response.data;
                setUsers(Array.isArray(usersData) ? usersData : []);
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAssigneeToggle = (userId) => {
        setFormData(prev => {
            const isSelected = prev.assignees.includes(userId);
            if (isSelected) {
                return { ...prev, assignees: prev.assignees.filter(id => id !== userId) };
            } else {
                return { ...prev, assignees: [...prev.assignees, userId] };
            }
        });
    };

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const name = (user.name || user.fullName || user.username || '').toLowerCase();
            const email = (user.email || '').toLowerCase();
            const query = searchQuery.toLowerCase();
            return name.includes(query) || email.includes(query);
        });
    }, [users, searchQuery]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createProject(formData);
            navigate('/projects');
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto py-8 px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/projects')}
                        className="p-2.5 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-indigo-600 border border-transparent hover:border-indigo-100 shadow-sm hover:shadow-indigo-50"
                        title="Go Back"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
                        <p className="text-gray-500 text-sm">Configure project details and assign your team</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/projects')}
                        className="px-6 py-2.5 text-sm font-bold text-gray-600 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-70"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        {loading ? 'Processing...' : 'Save Project'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Project Details */}
                <div className="xl:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-black">1</span>
                                Project Information
                            </h2>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Project Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                                        placeholder="Enter project name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        PIA / Project Manager <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="pmName"
                                        required
                                        value={formData.pmName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                                        placeholder="Internal PM name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Client Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="clientName"
                                        required
                                        value={formData.clientName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                                        placeholder="Full client/company name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                                        >
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                            <option value="Planning">Planning</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                                        <select
                                            name="projectType"
                                            value={formData.projectType}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white"
                                        >
                                            <option value="Dedicated">Dedicated</option>
                                            <option value="T & M">T & M</option>
                                            <option value="Fixed">Fixed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Start Date <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            required
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white appearance-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Deadline <span className="text-red-500">*</span></label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            required
                                            value={formData.deadline}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white appearance-none"
                                        />
                                    </div>
                                </div>

                                <div className="group relative flex items-center gap-4 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 transition-all hover:bg-indigo-50 hover:border-indigo-200 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="isBillable"
                                        name="isBillable"
                                        checked={formData.isBillable}
                                        onChange={handleChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className={`shrink-0 w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all ${formData.isBillable ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-indigo-200 group-hover:border-indigo-300'
                                        }`}>
                                        <CheckCircle2 size={16} className={`text-white transition-opacity ${formData.isBillable ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="isBillable" className="text-sm font-bold text-indigo-900 cursor-pointer block">
                                            Billable Project
                                        </label>
                                        <p className="text-xs text-indigo-400 mt-0.5 font-medium leading-tight">Include this in financial reports and billing</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Team Assignment */}
                <div className="xl:col-span-1">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-8 flex flex-col max-h-[calc(100vh-100px)]">
                        <div className="p-8 border-b border-gray-50">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-black">2</span>
                                    Assign Team
                                </h2>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black">
                                    {formData.assignees.length} SELECTED
                                </span>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50/50 focus:bg-white text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(user => {
                                    const userId = user._id || user.id;
                                    const isSelected = formData.assignees.includes(userId);
                                    return (
                                        <div
                                            key={userId}
                                            onClick={() => handleAssigneeToggle(userId)}
                                            className={`group flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all border ${isSelected
                                                ? 'bg-indigo-50 border-indigo-100 shadow-sm'
                                                : 'border-transparent hover:bg-gray-50 hover:border-gray-100'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-110' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-indigo-600'
                                                }`}>
                                                {(user.name || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-indigo-800' : 'text-gray-700'}`}>
                                                    {user.name || user.fullName || user.username || 'Unknown'}
                                                </h4>
                                                <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-indigo-400 font-bold' : 'text-gray-400'}`}>
                                                    {user.email || 'no-email@ips.com'}
                                                </p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-gray-200 group-hover:border-indigo-200'
                                                }`}>
                                                {isSelected && <CheckCircle2 size={12} className="text-white" />}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="py-12 flex flex-col items-center text-center px-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                        <Users size={32} />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-700">No members found</h3>
                                    <p className="text-xs text-gray-400 mt-1">Try searching with a different name or email</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E7EB;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D5DB;
                }
            `}} />
        </div>
    );
};

export default CreateProject;
