import api from './axiosConfig';

// Policies
export const createPolicy = (data) => api.post('/api/admin/policy', data);
export const addCoverage = (data) => api.post('/api/admin/policy/coverage', data);

// Claims
export const getAllClaims = () => api.get('/api/admin/claims');

// Assign Surveyor
export const assignSurveyor = (data) => api.put('/api/admin/assign-surveyor', data);
export const getAvailableSurveyors = () => api.get('/api/admin/surveyors/available');
