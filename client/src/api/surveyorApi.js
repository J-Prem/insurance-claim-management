import api from './axiosConfig';

export const getAssignedClaims = () => api.get('/api/surveyor/claims');

export const approveClaim = (data) => api.put('/api/surveyor/approve', data);

export const rejectClaim = (data) => api.put('/api/surveyor/reject', data);

export const getCoverageForClaim = (claimId) =>
    api.get('/api/surveyor/policy/coverage', { params: { claimId } });
