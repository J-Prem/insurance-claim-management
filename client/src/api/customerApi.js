import api from './axiosConfig';

// Profile
export const getMyProfile = () => api.get('/api/customer/profile');
export const saveProfile = (data) => api.post('/api/customer/profile', data);

// Documents
export const uploadDocument = (documentType, file) => {
    const formData = new FormData();
    formData.append('type', documentType);
    formData.append('file', file);
    return api.post('/api/customer/document/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
export const downloadDocument = (documentType) =>
    api.get('/api/customer/document/download', {
        params: { type: documentType },
        responseType: 'blob',
    });

// Policies
export const getActivePolicies = () => api.get('/api/customer/policies');
export const applyPolicy = (data) => api.post('/api/customer/apply-policy', data);
export const getMyPolicies = () => api.get('/api/customer/my-policies');
export const getMyCoverage = () => api.get('/api/customer/policy/coverage');

// Claims
export const raiseClaim = (data) => api.post('/api/customer/raise-claim', data);
export const getMyClaims = () => api.get('/api/customer/claims');
