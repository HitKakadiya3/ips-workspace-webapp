import React, { useState } from 'react';
import { Eye, ChevronDown } from 'lucide-react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Link } from 'react-router-dom';
import { useGetLeaveCountsQuery, useGetLeaveHistoryQuery, useLazyGetLeaveDetailQuery } from '../store/api/leaveApi';

const initialDisplayItems = [
  { type: 'Personal', key: 'Personal', total: 16 },
  { type: 'Unpaid', key: 'Unpaid', total: 60 },
  { type: 'Ad-hoc', key: 'Ad-hoc', total: 0 }
];

const formatDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toISOString().split('T')[0];
};

const calcDuration = (l) => {
  const isHalf = l.partOfDay || l.partOfday || l.part_of_day || l.duration === 0.5 || l.leaveDuration === 0.5 || l.isHalfDay || l.session === 1 || l.session === 2;
  if (isHalf) {
    const part = l.partOfDay || l.partOfday || l.part_of_day;
    if (part === 'Morning' || part === 'AM' || l.session === 1) return '0.5 - AM';
    if (part === 'AfterNoon' || part === 'Afternoon' || part === 'PM' || l.session === 2) return '0.5 - PM';
    return '0.5';
  }
  if (l.hours) return `${l.hours} Hours`;
  if (!l.startDate) return '';
  const s = new Date(l.startDate);
  const e = l.endDate ? new Date(l.endDate) : s;
  const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  return diff <= 1 ? '1 Day' : `${diff} Days`;
};

const LeaveDetails = () => {
  const userId = localStorage.getItem('userId') || '6942550bbaccb92db0ed143d';
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [detailModal, setDetailModal] = useState({ open: false, data: null, loading: false });

  const { data: reduxCounts, isLoading: countsLoading } = useGetLeaveCountsQuery({ userId, year: selectedYear });
  const { data: leaves = [], isLoading: historyLoading } = useGetLeaveHistoryQuery({ userId, year: selectedYear });
  const [triggerGetDetail] = useLazyGetLeaveDetailQuery();

  const loading = countsLoading || historyLoading;

  const counts = initialDisplayItems.map(item => ({
    ...item,
    used: (reduxCounts && (reduxCounts[item.key] || reduxCounts[item.type])) || 0
  }));

  const fetchLeaveDetail = async (id) => {
    setDetailModal({ open: true, data: null, loading: true });
    try {
      const res = await triggerGetDetail(id).unwrap();
      if (res) {
        setDetailModal({ open: true, data: res, loading: false });
      } else {
        setDetailModal({ open: true, data: null, loading: false });
      }
    } catch (err) {
      console.error('fetchLeaveDetail error', err);
      setDetailModal({ open: true, data: null, loading: false });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">All Leaves</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-200 rounded text-sm appearance-none pr-8 focus:outline-none"
              >
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            </div>
            <Link to="/leave/apply" className="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50">+ Apply Leave</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {counts.map((c, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-start gap-2">
              <div className="text-sm text-gray-600">{c.type} Leave</div>
              <div className="text-3xl font-semibold text-gray-700">{c.used}/{c.total}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-500 border-b">
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">LEAVE CATEGORY</th>
                  <th className="py-3 px-4">LEAVE DATE</th>
                  <th className="py-3 px-4">DURATION</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">APPLIED BY</th>
                  <th className="py-3 px-4">APPLIED ON</th>
                  <th className="py-3 px-4">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} className="p-6 text-center">Loading...</td></tr>
                ) : leaves.length === 0 ? (
                  <tr><td colSpan={8} className="p-6 text-center text-sm text-gray-500">No leaves found for {selectedYear}.</td></tr>
                ) : (
                  leaves.map((l) => (
                    <tr key={l._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-red-500">{localStorage.getItem('name') || 'User'}</td>
                      <td className="py-3 px-4 text-sm">{l.leaveType}</td>
                      <td className="py-3 px-4 text-sm text-red-400">{l.startDate && formatDate(l.startDate)}{l.endDate && l.endDate !== l.startDate ? ` To ${formatDate(l.endDate)}` : ''}</td>
                      <td className="py-3 px-4 text-sm">{calcDuration(l)}</td>
                      <td className="py-3 px-4 text-sm"><span className={`px-2 py-1 text-xs rounded-full ${l.status === 'Approved' || l.status === 'accepted' || l.status === 'Accepted' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{l.status}</span></td>
                      <td className="py-3 px-4 text-sm">{localStorage.getItem('name') || 'User'}</td>
                      <td className="py-3 px-4 text-sm text-red-400">{l.createdAt ? formatDate(l.createdAt) : ''}</td>
                      <td className="py-3 px-4 text-sm text-indigo-600">
                        <button onClick={() => fetchLeaveDetail(l._id)} title="View details">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {detailModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailModal({ open: false, data: null, loading: false })} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 z-10">
            {detailModal.loading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : detailModal.data ? (
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Leave Details</h4>
                <div className="mt-3 text-sm text-gray-700 space-y-2">
                  <div><strong>Type:</strong> {detailModal.data.leaveType}</div>
                  <div><strong>Start Date:</strong> {detailModal.data.startDate ? formatDate(detailModal.data.startDate) : ''}</div>
                  <div><strong>End Date:</strong> {detailModal.data.endDate ? formatDate(detailModal.data.endDate) : ''}</div>
                  <div><strong>Duration:</strong> {calcDuration(detailModal.data)}</div>
                  <div><strong>Status:</strong> {detailModal.data.status}</div>
                  <div><strong>Reason:</strong> {detailModal.data.reason || '-'}</div>
                  <div><strong>Applied On:</strong> {detailModal.data.createdAt ? formatDate(detailModal.data.createdAt) : ''}</div>
                </div>
                <div className="mt-4 text-right">
                  <button onClick={() => setDetailModal({ open: false, data: null, loading: false })} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Close</button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center">Could not load details.</div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default LeaveDetails;
