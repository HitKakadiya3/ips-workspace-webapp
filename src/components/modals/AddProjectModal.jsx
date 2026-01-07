import React, { useState } from 'react';
import { X } from 'lucide-react';

import { getAllUsers } from '../../services/api';

const AddProjectModal = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: '',
        pm: '',
        client: '',
        status: 'In Progress',
        type: 'Dedicated',
        assignees: []
    });
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

    // Fetch users when modal opens
    React.useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                const usersData = response.data.data || response.data;
                setUsers(Array.isArray(usersData) ? usersData : []);
            } catch (error) {
                console.error('Error fetching users:', error);
                setUsers([]);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAssigneeChange = (e) => {
        const userId = e.target.value;
        const isChecked = e.target.checked;

        setFormData(prev => {
            if (isChecked) {
                return { ...prev, assignees: [...prev.assignees, userId] };
            } else {
                return { ...prev, assignees: prev.assignees.filter(id => id !== userId) };
            }
        });
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const getSelectedUserNames = () => {
        if (formData.assignees.length === 0) return 'Select Users';
        return users
            .filter(u => formData.assignees.includes(u._id || u.id))
            .map(u => u.name)
            .join(', ');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onAdd(formData);
            onClose();
            setFormData({
                name: '',
                pm: '',
                client: '',
                status: 'In Progress',
                type: 'Dedicated',
                assignees: []
            });
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Error adding project:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200" onClick={() => setIsDropdownOpen(false)}>
                <div className="flex items-center justify-between p-4 border-b" onClick={e => e.stopPropagation()}>
                    <h2 className="text-lg font-semibold text-gray-800">Add New Project</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4" onClick={e => e.stopPropagation()}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Project Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter project name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PIA / PM
                        </label>
                        <input
                            type="text"
                            name="pm"
                            required
                            value={formData.pm}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter project manager name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client
                        </label>
                        <input
                            type="text"
                            name="client"
                            required
                            value={formData.client}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter client name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="Dedicated">Dedicated</option>
                                <option value="T & M">T & M</option>
                                <option value="Fixed">Fixed</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign Users
                        </label>
                        <button
                            type="button"
                            onClick={toggleDropdown}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-left bg-white flex justify-between items-center"
                        >
                            <span className={`block truncate ${formData.assignees.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
                                {getSelectedUserNames()}
                            </span>
                            <span className="pointer-events-none inset-y-0 right-0 flex items-center pr-2">
                                <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {users.map(user => {
                                    const userId = user._id || user.id;
                                    return (
                                        <label
                                            key={userId}
                                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 px-4 py-2"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <input
                                                type="checkbox"
                                                value={userId}
                                                checked={formData.assignees.includes(userId)}
                                                onChange={handleAssigneeChange}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="font-normal block truncate text-gray-900">
                                                {user.name}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg border transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProjectModal;
