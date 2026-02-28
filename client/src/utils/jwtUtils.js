import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'insurance_token';

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const decodeToken = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = () => {
  const decoded = decodeToken();
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
};

export const getUserRole = () => {
  const decoded = decodeToken();
  if (!decoded) return null;
  // Spring Security stores roles/authorities in different fields
  return decoded.role || decoded.roles?.[0] || null;
};

export const getUsername = () => {
  const decoded = decodeToken();
  return decoded?.sub || decoded?.username || null;
};
