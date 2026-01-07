import api from './api';

// Mock data for development when backend is not ready
const MOCK_PROJECTS = [
    {
        id: 1,
        name: 'FutureStack Labs',
        pm: 'Jignesh',
        client: 'IPS Internal',
        status: 'In Progress',
        type: 'Dedicated',
        assignees: ['694a43267cd54f179267f7b7'] // Employee 1
    },
    {
        id: 2,
        name: 'Laravel Team Sessions',
        pm: 'Jignesh',
        client: 'IPS Internal',
        status: 'In Progress',
        type: 'Dedicated',
        assignees: ['694a43267cd54f179267f7b7'] // Employee 1
    },
    {
        id: 3,
        name: 'CG Meeting',
        pm: 'Rajendra',
        client: 'IPS Internal',
        status: 'In Progress',
        type: 'Dedicated',
        assignees: ['694a43267cd54f179267f7b7'] // Employee 1
    },
    {
        id: 4,
        name: 'Presales',
        pm: 'Jignesh',
        client: 'IPS Internal',
        status: 'In Progress',
        type: 'Dedicated',
        assignees: ['694a8ab27cd54f179267f7ca'] // Employee 2
    },
    {
        id: 5,
        name: 'EnProwess Projects Development',
        pm: 'Jinkal',
        client: 'Chirayu J',
        status: 'Completed',
        type: 'Dedicated',
        assignees: ['694a8ab27cd54f179267f7ca'] // Employee 2
    },
    {
        id: 6,
        name: 'Laravel Packages & Library',
        pm: 'Jignesh',
        client: 'IPS Internal',
        status: 'Completed',
        type: 'T & M',
        assignees: ['694a8ab27cd54f179267f7ca'] // Employee 2
    },
    {
        id: 7,
        name: 'ORS',
        pm: 'Keyul',
        client: 'Lakshmi V',
        status: 'On Hold',
        type: 'Dedicated',
        assignees: ['694a8ab27cd54f179267f7ca'] // Employee 2
    }
];

export const getProjects = async (filters = {}, userContext = {}) => {
    try {
        let endpoint = '/api/projects';

        // If user is not admin and has a userId, use the user-specific endpoint
        if (userContext.role !== 'Admin' && userContext.userId) {
            endpoint = `/api/projects/user/${userContext.userId}`;
        }

        const response = await api.get(endpoint, {
            params: {
                status: filters.status !== 'all' ? filters.status : undefined,
                type: filters.type !== 'all' ? filters.type : undefined,
                search: filters.search || undefined
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export const createProject = async (projectData) => {
    try {
        const response = await api.post('/api/projects', projectData);
        return response.data;
    } catch (error) {
        console.error('Error creating project:', error);
        throw error;
    }
};
export const getProjectById = async (id) => {
    try {
        const response = await api.get(`/api/projects/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching project with id ${id}:`, error);
        throw error;
    }
};
