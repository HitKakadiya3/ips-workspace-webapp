import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { AlertCircle, Loader2, User } from 'lucide-react';
import { getProfile, updateProfile } from '../services/api';

const Profile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        dateOfJoining: '',
        dateOfBirth: '',
        jobTitle: '',
        primaryTechnology1: '',
        primaryTechnology2: '',
        intermediateTechnology: '',
        database: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getProfile();
            const userData = response.data.user || response.data;

            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                mobileNumber: userData.mobileNumber || userData.mobile || '',
                dateOfJoining: userData.dateOfJoining ? userData.dateOfJoining.split('T')[0] : '',
                dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
                jobTitle: userData.jobTitle || userData.designation || '',
                primaryTechnology1: userData.primaryTechnology1 || '',
                primaryTechnology2: userData.primaryTechnology2 || '',
                intermediateTechnology: userData.intermediateTechnology || '',
                database: userData.database || ''
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError(null);
            setSuccess(false);

            const userId = localStorage.getItem('userId');
            await updateProfile(userId, formData);

            // Update localStorage name if changed
            localStorage.setItem('name', formData.name);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.response?.data?.message || err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    if (error && !formData.email) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px] animate-fadeIn">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Error Loading Profile</h2>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={fetchProfile}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto animate-fadeIn">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center overflow-hidden">
                            {formData.name ? (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&size=80`}
                                    alt={formData.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{formData.name || 'User'}</h2>
                            <p className="text-gray-500">{formData.jobTitle || 'Employee'}</p>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
                        ✓ Profile updated successfully!
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fadeIn">
                        {error}
                    </div>
                )}

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                                E-Mail
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
                                readOnly
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Date of Joining */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                                Date of Joining
                            </label>
                            <input
                                type="date"
                                name="dateOfJoining"
                                value={formData.dateOfJoining}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Primary Technology 1 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                                Primary Technology 1
                            </label>
                            <select
                                name="primaryTechnology1"
                                value={formData.primaryTechnology1}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select Technology</option>
                                <option value="ReactJS">ReactJS</option>
                                <option value="Angular">Angular</option>
                                <option value="VueJS">VueJS</option>
                                <option value="NodeJS">NodeJS</option>
                                <option value="Python">Python</option>
                                <option value="Java">Java</option>
                                <option value=".NET">.NET</option>
                                <option value="PHP">PHP</option>
                            </select>
                        </div>

                        {/* Primary Technology 2 */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                                Primary Technology 2
                            </label>
                            <select
                                name="primaryTechnology2"
                                value={formData.primaryTechnology2}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select Technology</option>
                                <option value="ReactJS">ReactJS</option>
                                <option value="Angular">Angular</option>
                                <option value="VueJS">VueJS</option>
                                <option value="NodeJS">NodeJS</option>
                                <option value="Python">Python</option>
                                <option value="Java">Java</option>
                                <option value=".NET">.NET</option>
                                <option value="Laravel">Laravel</option>
                            </select>
                        </div>

                        {/* Intermediate Technology */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                                Intermediate Technology
                            </label>
                            <select
                                name="intermediateTechnology"
                                value={formData.intermediateTechnology}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select Technology</option>
                                <option value="NodeJS">NodeJS</option>
                                <option value="ExpressJS">ExpressJS</option>
                                <option value="NestJS">NestJS</option>
                                <option value="Django">Django</option>
                                <option value="Flask">Flask</option>
                                <option value="Spring Boot">Spring Boot</option>
                            </select>
                        </div>

                        {/* Database */}
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">
                                Database
                            </label>
                            <select
                                name="database"
                                value={formData.database}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            >
                                <option value="">Select Database</option>
                                <option value="MySQL">MySQL</option>
                                <option value="PostgreSQL">PostgreSQL</option>
                                <option value="MongoDB">MongoDB</option>
                                <option value="SQL Server">SQL Server</option>
                                <option value="Oracle">Oracle</option>
                                <option value="Redis">Redis</option>
                            </select>
                        </div>
                    </div>

                    {/* Update Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Updating Profile...
                                </>
                            ) : (
                                'Update Profile'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
