import api from './api';

export const getAnnouncements = async () => {
    try {
        const response = await api.get('/api/announcements');
        return response.data;
    } catch (error) {
        console.error('Error fetching announcements:', error);
        throw error;
    }
};

export const createAnnouncement = async (announcementData) => {
    try {
        // If there is an attachment, we should use FormData
        let data = announcementData;
        let headers = { 'Content-Type': 'application/json' };

        if (announcementData.attachment) {
            data = new FormData();
            data.append('title', announcementData.title);
            data.append('type', announcementData.type || 'News');
            data.append('description', announcementData.description);
            data.append('attachment', announcementData.attachment);
            headers = { 'Content-Type': 'multipart/form-data' };
        } else {
            data = {
                ...announcementData,
                type: announcementData.type || 'News'
            };
        }

        const response = await api.post('/api/announcements', data, { headers });
        return response.data;
    } catch (error) {
        console.error('Error creating announcement:', error);
        throw error;
    }
};

export const deleteAnnouncement = async (id) => {
    try {
        const response = await api.delete(`/api/announcements/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting announcement with id ${id}:`, error);
        throw error;
    }
};
