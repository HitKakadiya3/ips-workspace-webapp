import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Info, AlertCircle, Loader2 } from 'lucide-react';
import { getDashboardData } from '../services/api';

const StatCard = ({ value, label, subtext, highlightColor = 'blue', isLoading = false }) => {
    const colorClasses = {
        blue: 'text-blue-600',
        orange: 'text-orange-500',
        green: 'text-emerald-500',
        purple: 'text-purple-600',
        cyan: 'text-cyan-500',
        red: 'text-red-500'
    };

    const textColor = colorClasses[highlightColor] || 'text-gray-900';

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center h-full min-h-35 animate-pulse">
                <div className="h-8 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center h-full transition-all hover:shadow-md hover:scale-105 duration-300 min-h-35 animate-fadeIn">
            <h3 className={`text-3xl font-bold ${textColor} mb-2`}>{value || '0'}</h3>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
        </div>
    );
};

const SectionData = ({ title, children, rightTitle }) => (
    <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
            {rightTitle && <h3 className="text-lg font-semibold text-gray-700">{rightTitle}</h3>}
        </div>
        {children}
    </div>
);

const Dashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Get userId from localStorage (stored during login)
                const userId = localStorage.getItem('userId');

                if (!userId) {
                    throw new Error('User ID not found. Please login again.');
                }

                const response = await getDashboardData(userId);
                setDashboardData(response.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-100 animate-fadeIn">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    // Extract data from the new API structure
    const widgets = dashboardData?.data?.widgets || {};
    const lists = dashboardData?.data?.lists || {};

    const projects = widgets.projects || {};
    const leaves = widgets.leaves || {};
    const notices = widgets.noticesAndAppreciations || {};
    const generic = widgets.generic || {};

    const additional = {
        overdueProjects: lists.overdueProjects || [],
        reminders: lists.reminders || [],
        announcements: lists.announcements || [],
        internalLinks: lists.internalLinks || [],
        rewards: lists.rewards || [],
        certifications: lists.certifications || [],
        leavesNext5Days: lists.leavesNext5Days || []
    };

    return (
        <DashboardLayout>
            {/* Projects Section */}
            <SectionData title="Projects">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        value={projects.totalAssigned}
                        label="TOTAL PROJECTS ASSIGNED"
                        highlightColor="blue"
                        isLoading={loading}
                    />
                    <StatCard
                        value={projects.overdueCount}
                        label="OVERDUE PROJECTS COUNT"
                        highlightColor={projects.overdueCount > 0 ? 'red' : 'blue'}
                        isLoading={loading}
                    />
                    <StatCard
                        value={projects.billableHours}
                        label="TOTAL BILLABLE HOURS (YEARLY)"
                        highlightColor="blue"
                        isLoading={loading}
                    />
                    <StatCard
                        value={projects.benchHours}
                        label="TOTAL BENCH HOURS (YEARLY)"
                        highlightColor="blue"
                        isLoading={loading}
                    />
                </div>
            </SectionData>

            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Leaves (Yearly)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading ? (
                            <>
                                <StatCard isLoading={true} />
                                <StatCard isLoading={true} />
                                <StatCard isLoading={true} />
                                <StatCard isLoading={true} />
                            </>
                        ) : (
                            <>
                                <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center h-full hover:shadow-md min-h-35 transition-all hover:scale-105 duration-300 animate-fadeIn">
                                    <h3 className="text-2xl font-bold text-cyan-500 mb-2 flex items-center justify-center gap-2">
                                        {leaves.personal || '0/0'}
                                        <Info size={16} className="text-gray-400" />
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium uppercase">PERSONAL LEAVES</p>
                                </div>
                                <StatCard
                                    value={leaves.unpaid || '0/60'}
                                    label="UNPAID LEAVES"
                                    highlightColor="cyan"
                                />
                                <StatCard
                                    value={leaves.taken || 0}
                                    label="TAKEN LEAVES"
                                    highlightColor="cyan"
                                />
                                <StatCard
                                    value={leaves.adHoc || 0}
                                    label="AD-HOC TAKEN LEAVES"
                                    highlightColor="cyan"
                                />
                            </>
                        )}
                    </div>
                </div>
                <div className="lg:w-1/3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">N&A (Yearly)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard
                            value={notices.totalNotices}
                            label="TOTAL NOTICES"
                            highlightColor={notices.totalNotices > 0 ? 'orange' : 'cyan'}
                            isLoading={loading}
                        />
                        <StatCard
                            value={notices.totalAppreciations}
                            label="TOTAL APPRECIATIONS"
                            highlightColor="green"
                            isLoading={loading}
                        />
                    </div>
                </div>
            </div>

            {/* Generic Section */}
            <SectionData title="Generic">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        value={generic.shortDays}
                        label="SHORT DAYS (YEARLY)"
                        highlightColor="orange"
                        isLoading={loading}
                    />
                    <StatCard
                        value={generic.timesheetNotFilled}
                        label="TIMESHEET NOT FILLED (YEARLY)"
                        highlightColor={generic.timesheetNotFilled > 0 ? 'red' : 'orange'}
                        isLoading={loading}
                    />

                    {/* Team Members on Leave Today */}
                    {loading ? (
                        <StatCard isLoading={true} />
                    ) : (
                        <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center h-full hover:shadow-md min-h-35 transition-all hover:scale-105 duration-300 animate-fadeIn">
                            <div className="space-y-1 mb-2 max-h-20 overflow-y-auto w-full">
                                {generic.teamOnLeaveToday?.slice(0, 3).map((member, idx) => (
                                    <p key={idx} className="text-orange-500 font-medium text-sm">{member}</p>
                                ))}
                                {(!generic.teamOnLeaveToday || generic.teamOnLeaveToday.length === 0) && (
                                    <p className="text-gray-300 text-sm">No one on leave</p>
                                )}
                            </div>
                            {generic.teamOnLeaveToday?.length > 3 && (
                                <a href="#" className="text-blue-600 text-xs font-bold uppercase hover:underline">
                                    +{generic.teamOnLeaveToday.length - 3} More
                                </a>
                            )}
                            <p className="text-xs text-gray-500 font-medium uppercase mt-2">TEAM MEMBERS ON LEAVE TODAY</p>
                        </div>
                    )}

                    {/* Team Members on Leave Next 5 Days */}
                    {loading ? (
                        <StatCard isLoading={true} />
                    ) : (
                        <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center h-full hover:shadow-md min-h-35 transition-all hover:scale-105 duration-300 animate-fadeIn">
                            <div className="space-y-1 mb-2 max-h-20 overflow-y-auto w-full">
                                {generic.teamOnLeaveNext5Days?.slice(0, 3).map((member, idx) => (
                                    <p key={idx} className="text-orange-500 font-medium text-sm">{member}</p>
                                ))}
                                {(!generic.teamOnLeaveNext5Days || generic.teamOnLeaveNext5Days.length === 0) && (
                                    <p className="text-gray-300 text-sm">No upcoming leaves</p>
                                )}
                            </div>
                            {generic.teamOnLeaveNext5Days?.length > 3 && (
                                <a href="#" className="text-blue-600 text-xs font-bold uppercase hover:underline">
                                    +{generic.teamOnLeaveNext5Days.length - 3} More
                                </a>
                            )}
                            <p className="text-xs text-gray-500 font-medium uppercase mt-2">TEAM MEMBERS ON LEAVE IN NEXT 5 WORKING DAYS</p>
                        </div>
                    )}
                </div>
            </SectionData>

            {/* Additional Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Overdue Project List */}
                <ContentCard title="Overdue Project List" isLoading={loading}>
                    {additional.overdueProjects?.length > 0 ? (
                        <ul className="space-y-2">
                            {additional.overdueProjects.map((project, idx) => (
                                <li key={idx} className="flex gap-2 items-start">
                                    <span className="text-red-600 font-bold text-sm">{idx + 1}.</span>
                                    <p className="text-sm text-red-600">
                                        {typeof project === 'string' ? project : (project.name || project.title || 'Unnamed Project')}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState />
                    )}
                </ContentCard>

                {/* Today's Reminder */}
                <ContentCard title="Today's Reminder" isLoading={loading}>
                    {additional.reminders?.length > 0 ? (
                        <ul className="space-y-2">
                            {additional.reminders.map((reminder, idx) => (
                                <li key={idx} className="flex gap-2 items-start">
                                    <span className="text-purple-600 font-bold text-sm">{idx + 1}.</span>
                                    <div className="text-sm text-purple-600">
                                        <p className="font-semibold">{typeof reminder === 'object' ? reminder.title : reminder}</p>
                                        {typeof reminder === 'object' && reminder.description && (
                                            <p className="text-xs text-purple-500 mt-1">{reminder.description}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState />
                    )}
                </ContentCard>

                {/* Latest Announcements */}
                <ContentCard title="Latest Announcements" isLoading={loading}>
                    {additional.announcements?.length > 0 ? (
                        <ul className="space-y-3">
                            {additional.announcements.map((announcement, idx) => (
                                <li key={idx} className="flex gap-2 items-start">
                                    <span className="text-blue-600 font-bold text-sm">{idx + 1}.</span>
                                    <div className="text-sm text-blue-600">
                                        <p className="font-semibold">{typeof announcement === 'object' ? announcement.title : announcement}</p>
                                        {typeof announcement === 'object' && announcement.description && (
                                            <p className="text-xs text-blue-500 mt-1">{announcement.description}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState message="No announcements" />
                    )}
                </ContentCard>

                {/* Internal Links */}
                <ContentCard title="Internal Links" isLoading={loading}>
                    {additional.internalLinks?.length > 0 ? (
                        <ul className="space-y-3">
                            {additional.internalLinks.map((link, idx) => (
                                <li key={idx} className="flex gap-2 items-center">
                                    <span className="text-blue-600 font-bold text-sm">{idx + 1}.</span>
                                    <a
                                        href={typeof link === 'object' ? (link.url || '#') : '#'}
                                        className="text-sm text-blue-600 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {typeof link === 'object' ? (link.name || link.title || 'Link') : link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState message="No links available" />
                    )}
                </ContentCard>

                {/* Latest Rewards */}
                <ContentCard title="Latest Rewards" isLoading={loading}>
                    {additional.rewards?.length > 0 ? (
                        <ul className="space-y-2">
                            {additional.rewards.map((reward, idx) => (
                                <li key={idx} className="flex gap-2 items-start">
                                    <span className="text-green-600 font-bold text-sm">{idx + 1}.</span>
                                    <div className="text-sm text-green-600">
                                        <p className="font-semibold">{typeof reward === 'object' ? (reward.title || reward.name) : reward}</p>
                                        {typeof reward === 'object' && reward.description && (
                                            <p className="text-xs text-green-500 mt-1">{reward.description}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState />
                    )}
                </ContentCard>

                {/* Latest Certification */}
                <ContentCard title="Latest Certification" isLoading={loading}>
                    {additional.certifications?.length > 0 ? (
                        <ul className="space-y-2">
                            {additional.certifications.map((cert, idx) => (
                                <li key={idx} className="flex gap-2 items-start">
                                    <span className="text-purple-600 font-bold text-sm">{idx + 1}.</span>
                                    <div className="text-sm text-purple-600">
                                        <p className="font-semibold">{typeof cert === 'object' ? (cert.title || cert.name) : cert}</p>
                                        {typeof cert === 'object' && cert.description && (
                                            <p className="text-xs text-purple-500 mt-1">{cert.description}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState />
                    )}
                </ContentCard>
            </div>
        </DashboardLayout>
    );
};

const ContentCard = ({ title, children, isLoading = false }) => (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 flex flex-col h-full hover:shadow-md overflow-hidden transition-all duration-300 animate-fadeIn">
        <div className="p-4 border-b border-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center min-h-25">
                    <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                </div>
            ) : (
                children
            )}
        </div>
    </div>
);

const EmptyState = ({ message = "No data found" }) => (
    <div className="flex-1 flex items-center justify-center min-h-25">
        <p className="text-gray-300 text-lg font-medium">{message}</p>
    </div>
);

export default Dashboard;
