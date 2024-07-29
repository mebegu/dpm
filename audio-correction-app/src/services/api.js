import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8080", // Use the environment variable
});

export const uploadAudio = (formData) => {
    return api.post('/upload', formData);
};

export const getProcessStatus = (id) => {
    return api.get(`/status/${id}`);
};

export const listProcesses = () => {
    return api.get('/status');
};

export const downloadProcessedAudio = (id) => {
    return api.get(`/download/${id}`, { responseType: 'blob' });
};
