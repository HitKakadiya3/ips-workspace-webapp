import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Trees as TreeChristmas, Loader2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { useGetAllLeavesQuery } from '../store/api/leaveApi';

const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // Default to Dec 2025 as per image

    const { data: allLeaves = [], isLoading, isError } = useGetAllLeavesQuery();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1);

    // Group leaves by date
    const processedLeaves = useMemo(() => {
        const grouped = {};
        allLeaves.forEach(leave => {
            if (!leave.startDate) return;

            const start = new Date(leave.startDate);
            start.setHours(0, 0, 0, 0);
            const end = leave.endDate ? new Date(leave.endDate) : new Date(start);
            end.setHours(23, 59, 59, 999);

            let current = new Date(start);
            while (current <= end) {
                const dayOfWeek = current.getDay();
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                if (!isWeekend && current.getMonth() === month && current.getFullYear() === year) {
                    const day = current.getDate();
                    if (!grouped[day]) grouped[day] = [];

                    const session = leave.partOfDay === 'Morning' ? 'AM' :
                        leave.partOfDay === 'AfterNoon' || leave.partOfDay === 'Afternoon' ? 'PM' : '';

                    grouped[day].push({
                        name: leave.user?.name || leave.userName || 'User',
                        session: session,
                        status: leave.status,
                        color: leave.status === 'Approved' ? 'green' : 'red'
                    });
                }
                current.setDate(current.getDate() + 1);
            }
        });
        return grouped;
    }, [allLeaves, month, year]);

    const calendarGrid = [];

    // Prev month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
        calendarGrid.push({
            day: prevMonthDays - i,
            currentMonth: false,
            isWeekend: false
        });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
        const dayOfWeek = (firstDayOfMonth + i - 1) % 7;
        calendarGrid.push({
            day: i,
            currentMonth: true,
            isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
            entries: processedLeaves[i] || []
        });
    }

    // Next month padding
    const remainingCells = 42 - calendarGrid.length;
    for (let i = 1; i <= remainingCells; i++) {
        calendarGrid.push({
            day: i,
            currentMonth: false,
            isWeekend: false
        });
    }

    return (
        <DashboardLayout>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[calc(100vh-140px)] flex flex-col">
                {/* Calendar Header */}
                <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100 shadow-sm">
                            <button
                                onClick={handlePrevMonth}
                                className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-400 hover:text-indigo-600"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button
                                onClick={handleNextMonth}
                                className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-400 hover:text-indigo-600"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                        <button
                            onClick={handleToday}
                            className="px-6 py-2 text-sm font-bold text-indigo-500 bg-indigo-50/50 hover:bg-indigo-600 hover:text-white rounded-lg transition-all border border-indigo-100 shadow-sm active:scale-95"
                        >
                            Today
                        </button>
                    </div>

                    <h2 className="absolute left-1/2 -translate-x-1/2 text-2xl font-black text-gray-600 tracking-[0.15em] uppercase whitespace-nowrap">
                        {months[month]} {year}
                    </h2>
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-auto relative">
                    {isLoading && (
                        <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                                <span className="text-sm font-medium text-gray-500">Loading leaves...</span>
                            </div>
                        </div>
                    )}

                    {isError && (
                        <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="flex flex-col items-center gap-2 text-red-500">
                                <AlertCircle className="w-8 h-8" />
                                <span className="text-sm font-medium">Failed to load leaves</span>
                            </div>
                        </div>
                    )}

                    <table className="w-full border-collapse table-fixed h-full">
                        <thead>
                            <tr className="bg-white border-b border-gray-100">
                                {daysOfWeek.map(day => (
                                    <th key={day} className="py-4 text-sm font-bold text-gray-400 uppercase tracking-[0.2em] text-center border-x border-gray-50">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {[...Array(6)].map((_, weekIndex) => (
                                <tr key={weekIndex} className="min-h-[120px]">
                                    {[...Array(7)].map((_, dayIndex) => {
                                        const cell = calendarGrid[weekIndex * 7 + dayIndex];
                                        if (!cell) return <td key={dayIndex} className="border-x border-gray-50"></td>;

                                        return (
                                            <td
                                                key={dayIndex}
                                                className={`relative p-2 border-x border-gray-50 h-32 align-top transition-colors ${cell.isWeekend ? 'bg-cyan-50/30' : 'bg-white'}`}
                                            >
                                                {/* Date Number */}
                                                <div className={`text-right pr-1 mb-2 text-sm font-bold ${cell.currentMonth ? 'text-gray-400' : 'text-gray-200'}`}>
                                                    {cell.day}
                                                </div>

                                                {/* Weekend Label */}
                                                {cell.isWeekend && cell.currentMonth && (
                                                    <div className="absolute top-2 left-2 text-[10px] font-bold text-cyan-400/60 uppercase italic tracking-widest">
                                                        {dayIndex === 0 ? 'Sunday' : 'Saturday'}
                                                    </div>
                                                )}

                                                {/* Entries */}
                                                <div className="space-y-1 overflow-hidden">
                                                    {cell.entries?.map((entry, idx) => (
                                                        entry.count ? (
                                                            <div key={idx} className="text-[10px] font-bold text-gray-400 pl-2 hover:text-indigo-500 cursor-pointer transition-colors">
                                                                +{entry.count} more
                                                            </div>
                                                        ) : (
                                                            <div
                                                                key={idx}
                                                                className={`px-2 py-0.5 rounded text-[10px] font-bold truncate transition-transform hover:scale-[1.02] cursor-default border shadow-sm ${entry.status === 'Approved' || entry.status === 'Accepted' || entry.status === 'accepted'
                                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                                    : 'bg-red-50 text-red-600 border-red-100'
                                                                    }`}
                                                            >
                                                                {entry.name} {entry.session ? `- ${entry.session}` : ''}
                                                            </div>
                                                        )
                                                    ))}

                                                    {/* Special Icon for Christmas */}
                                                    {cell.currentMonth && month === 11 && cell.day === 25 && (
                                                        <div className="flex justify-center mt-2 animate-bounce">
                                                            <TreeChristmas size={32} className="text-emerald-500 drop-shadow-md" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CalendarPage;
