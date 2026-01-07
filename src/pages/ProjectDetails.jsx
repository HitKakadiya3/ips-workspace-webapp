import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Briefcase, CheckCircle2, Clock, DollarSign, Building2 } from 'lucide-react';
import { getProjectById } from '../services/projectService';


const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            setLoading(true);
            try {
                const response = await getProjectById(id);
                setProject(response.data || response);
            } catch (err) {
                console.error('Error fetching project details:', err);
                setError('Failed to load project details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProjectDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 flex items-center gap-3">
                <span>{error || 'Project not found'}</span>
                <button onClick={() => navigate('/projects')} className="underline font-medium">Back to Projects</button>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            }).format(new Date(dateString));
        } catch (e) {
            return 'Invalid Date';
        }
    };


    const getStatusStyle = (status) => {
        switch (status) {
            case 'In Progress': return 'text-green-600 bg-green-50 border-green-100';
            case 'Completed': return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'On Hold': return 'text-orange-600 bg-orange-50 border-orange-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/projects')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(project.status)}`}>
                                    {project.status}
                                </span>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                    <Briefcase size={14} />
                                    {project.projectType}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            Project Overview
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Client Name</p>
                                        <p className="text-lg font-semibold text-gray-800">{project.clientName || project.client || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Project Manager</p>
                                        <p className="text-lg font-semibold text-gray-800">{project.pmName || project.pm || 'Not Assigned'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
                                        <DollarSign size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Billing Status</p>
                                        <p className={`text-lg font-semibold ${project.isBillable ? 'text-green-600' : 'text-gray-600'}`}>
                                            {project.isBillable ? 'Billable' : 'Non-Billable'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Current Status</p>
                                        <p className="text-lg font-semibold text-gray-800">{project.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info - Timeline */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                            Timeline & Deadlines
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">Created At</p>
                                    <p className="text-sm font-semibold text-gray-700">{formatDate(project.createdAt)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">Start Date</p>
                                    <p className="text-sm font-semibold text-gray-700">{formatDate(project.startDate)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-400 uppercase">Deadline</p>
                                    <p className="text-sm font-semibold text-gray-700">{formatDate(project.deadline)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar (Optional Visual) */}
                        <div className="mt-8 pt-8 border-t border-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Project Health</span>
                                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">On Track</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
