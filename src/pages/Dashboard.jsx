import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Info } from 'lucide-react';

const StatCard = ({ value, label, subtext, highlightColor = 'blue' }) => {
    // Determine color classes based on the highlightColor prop
    const colorClasses = {
        blue: 'text-blue-600',
        orange: 'text-orange-500',
        green: 'text-emerald-500',
        purple: 'text-purple-600',
        cyan: 'text-cyan-500'
    };

    const textColor = colorClasses[highlightColor] || 'text-gray-900';

    return (
        <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center h-full transition-all hover:shadow-md">
            <h3 className={`text-3xl font-bold ${textColor} mb-2`}>{value}</h3>
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
    return (
        <DashboardLayout>
            {/* Projects Section */}
            <SectionData title="Projects">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard value="7" label="TOTAL PROJECTS ASSIGNED" highlightColor="blue" />
                    <StatCard value="0" label="OVERDUE PROJECTS COUNT" highlightColor="blue" />
                    <StatCard value="1091:20" label="TOTAL BILLABLE HOURS (YEARLY)" highlightColor="blue" />
                    <StatCard value="907:20" label="TOTAL BENCH HOURS (YEARLY)" highlightColor="blue" />
                </div>
            </SectionData>

            <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Leaves (Yearly)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center h-full hover:shadow-md min-h-[140px]">
                            <h3 className="text-2xl font-bold text-cyan-500 mb-2 flex items-center justify-center gap-2">
                                16/16
                                <Info size={16} className="text-gray-400" />
                            </h3>
                            <p className="text-xs text-gray-500 font-medium uppercase">PERSONAL LEAVES</p>
                        </div>
                        <StatCard value="1/60" label="UNPAID LEAVES" highlightColor="cyan" />
                        <StatCard value="17" label="TAKEN LEAVES" highlightColor="cyan" />
                        <StatCard value="9" label="AD-HOC TAKEN LEAVES" highlightColor="cyan" />
                    </div>
                </div>
                <div className="lg:w-1/3">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">N&A (Yearly)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard value="14" label="TOTAL NOTICES" highlightColor="cyan" />
                        <StatCard value="0" label="TOTAL APPRECIATIONS" highlightColor="cyan" />
                    </div>
                </div>
            </div>


            {/* Generic Section */}
            <SectionData title="Generic">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard value="15" label="SHORT DAYS (YEARLY)" highlightColor="orange" />
                    <StatCard value="4" label="TIMESHEET NOT FILLED (YEARLY)" highlightColor="orange" />

                    {/* List Cards - Mocked */}
                    <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center h-full hover:shadow-md min-h-[140px]">
                        <div className="space-y-1 mb-2">
                            <p className="text-orange-500 font-medium text-sm">Nikulash Vaghela</p>
                            <p className="text-orange-500 font-medium text-sm">Dhanik Keraliya</p>
                            <p className="text-orange-500 font-medium text-sm">Lay Khatri</p>
                        </div>
                        <a href="#" className="text-blue-600 text-xs font-bold uppercase hover:underline">+5 More</a>
                        <p className="text-xs text-gray-500 font-medium uppercase mt-2">TEAM MEMBERS ON LEAVE TODAY</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center h-full hover:shadow-md min-h-[140px]">
                        <div className="space-y-1 mb-2">
                            <p className="text-orange-500 font-medium text-sm">Nikulash Vaghela</p>
                            <p className="text-orange-500 font-medium text-sm">Dhanik Keraliya</p>
                            <p className="text-orange-500 font-medium text-sm">Aman Khatri</p>
                        </div>
                        <a href="#" className="text-blue-600 text-xs font-bold uppercase hover:underline">+5 More</a>
                        <p className="text-xs text-gray-500 font-medium uppercase mt-2">TEAM MEMBERS ON LEAVE IN NEXT 5 WORKING DAYS</p>
                    </div>
                </div>
            </SectionData>

            {/* Additional Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Overdue Project List */}
                <ContentCard title="Overdue Project List">
                    <EmptyState />
                </ContentCard>

                {/* Today's Reminder */}
                <ContentCard title="Today's Reminder">
                    <EmptyState />
                </ContentCard>

                {/* Latest Announcements */}
                <ContentCard title="Latest Announcements">
                    <ul className="space-y-3">
                        <li className="flex gap-2 items-start">
                            <span className="text-blue-600 font-bold text-sm">1.</span>
                            <p className="text-sm text-blue-600">
                                5th July 2025 -Working Saturday - IPS Hackathon 2025
                            </p>
                        </li>
                        <li className="flex gap-2 items-start">
                            <span className="text-blue-600 font-bold text-sm">2.</span>
                            <p className="text-sm text-blue-600">
                                10th May 2025 -Working Saturday - Stay Tuned for an Exciting Event!
                            </p>
                        </li>
                        <li className="flex gap-2 items-start">
                            <span className="text-blue-600 font-bold text-sm">3.</span>
                            <p className="text-sm text-blue-600">
                                Scheduled Working Saturdays for 2025
                            </p>
                        </li>
                    </ul>
                </ContentCard>

                {/* Internal Links */}
                <ContentCard title="Internal Links">
                    <ul className="space-y-3">
                        <li className="flex gap-2 items-center">
                            <span className="text-blue-600 font-bold text-sm">1.</span>
                            <a href="#" className="text-sm text-blue-600 hover:underline">Lead Management System (LMS)</a>
                        </li>
                        <li className="flex gap-2 items-center">
                            <span className="text-blue-600 font-bold text-sm">2.</span>
                            <a href="#" className="text-sm text-blue-600 hover:underline">IPS Hub</a>
                        </li>
                        <li className="flex gap-2 items-center">
                            <span className="text-blue-600 font-bold text-sm">3.</span>
                            <a href="#" className="text-sm text-blue-600 hover:underline">All Pass Hub (APH)</a>
                        </li>
                    </ul>
                </ContentCard>

                {/* Latest Rewards */}
                <ContentCard title="Latest Rewards">
                    <EmptyState />
                </ContentCard>

                {/* Latest Certification */}
                <ContentCard title="Latest Certification">
                    <EmptyState />
                </ContentCard>
            </div>
        </DashboardLayout>
    );
};

const ContentCard = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 flex flex-col h-full hover:shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            {children}
        </div>
    </div>
);

const EmptyState = ({ message = "No data found" }) => (
    <div className="flex-1 flex items-center justify-center min-h-[100px]">
        <p className="text-gray-300 text-lg font-medium">{message}</p>
    </div>
);

export default Dashboard;
