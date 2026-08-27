function normalizeApiBase(value) {
  const fallback = 'https://alumnibackendapi.vercel.app/api';
  const raw = (value || fallback).trim();
  try {
    const url = new URL(raw);
    let path = (url.pathname || '').replace(/\/+$/, '');
    path = path.replace(/\/auth\/login$/i, '');
    if (!path || path === '/') path = '/api';
    return `${url.origin}${path}`;
  } catch {
    return fallback;
  }
}

const API_URL = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL);

export async function apiRequest(path, options = {}) {
  const { _retried, ...requestOptions } = options;
  const method = (options.method || 'GET').toUpperCase();
  let csrfToken = typeof document !== 'undefined' ? document.cookie.split('; ').find((item) => item.startsWith('csrftoken='))?.split('=')[1] : null;
  if (typeof window !== 'undefined' && method !== 'GET' && !csrfToken) {
    const csrfResponse = await fetch(`${API_URL}/auth/csrf/`, { credentials: 'include' });
    const csrfData = await csrfResponse.json();
    csrfToken = csrfData.csrfToken;
  }
  const isFormData = typeof FormData !== 'undefined' && requestOptions.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    credentials: 'include',
    headers: { ...(isFormData ? {} : { 'Content-Type': 'application/json' }), ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}), ...requestOptions.headers }
  });

  if (response.status === 401 && !_retried && path !== '/auth/refresh/') {
    const refreshResponse = await fetch(`${API_URL}/auth/refresh/`, {
      method: 'POST',
      credentials: 'include',
      headers: csrfToken ? { 'X-CSRFToken': csrfToken } : undefined
    });
    if (refreshResponse.ok) {
      return apiRequest(path, { ...requestOptions, _retried: true });
    }
  }

  if (response.status === 204 || response.status === 205) {
    return {};
  }

  const contentType = response.headers?.get?.('content-type') || '';
  const hasJsonReader = typeof response.json === 'function';
  const hasTextReader = typeof response.text === 'function';
  const isJson = contentType.includes('application/json') || (hasJsonReader && !hasTextReader);
  const data = isJson
    ? await response.json().catch(() => ({}))
    : hasTextReader
      ? await response.text()
      : {};

  if (!response.ok) {
    if (isJson && data && typeof data === 'object') throw new Error(data.detail || 'Request failed');
    throw new Error((typeof data === 'string' && data.trim()) || 'Request failed');
  }

  return isJson ? data : { value: data };
}

export async function refreshSession() {
  return apiRequest('/auth/refresh/', { method: 'POST' });
}

export async function login(credentials) {
  return apiRequest('/auth/login/',
    { method: 'POST', body: JSON.stringify(credentials) });
}

export const requestPasswordOtp = (email) => apiRequest('/auth/password/forgot/', { method: 'POST', body: JSON.stringify({ email }) });
export const resetPassword = (details) => apiRequest('/auth/password/reset/', { method: 'POST', body: JSON.stringify(details) });
export const changePassword = (details) => apiRequest('/auth/password/change/', { method: 'POST', body: JSON.stringify(details) });

export async function registerAccount(details) {
  return apiRequest('/auth/register/', { method: 'POST', body: JSON.stringify(details) });
}

export const logout = () => apiRequest('/auth/logout/', { method: 'POST' });

export const getEvents = (params = {}) => {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value));
  return apiRequest(`/events/${query.toString() ? `?${query}` : ''}`);
};
export const getEvent = (eventId) => apiRequest(`/events/${eventId}/`);
export const getAlumni = (page = 1) => apiRequest(`/alumni/?page=${page}`);
export const getAlumniProfile = (personId) => apiRequest(`/alumni/${personId}/`);
export const rsvp = (eventId) => apiRequest(`/events/${eventId}/register/`, { method: 'POST' });
export const cancelRsvp = (eventId) => apiRequest(`/events/${eventId}/register/`, { method: 'POST', body: JSON.stringify({ status: 'cancelled' }) });
export const getMyEvents = () => apiRequest('/my-events/');
export const getAttendance = () => apiRequest('/admin/attendance/');
export const getAnalytics = () => apiRequest('/admin/analytics/');
export const updatePerson = (personId, person) => apiRequest(`/admin/people/${personId}/`, { method: 'PUT', body: JSON.stringify(person) });
export async function downloadAttendanceCsv() {
  const response = await fetch(`${API_URL}/admin/attendance/?download=csv`, { credentials: 'include' });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Attendance export failed');
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'attendance.csv';
  link.click();
  URL.revokeObjectURL(url);
}
export const checkIn = (token) => apiRequest('/admin/events/check-in/', { method: 'POST', body: JSON.stringify({ token }) });
export const updateProfile = (profile) => apiRequest('/auth/profile/', { method: 'PUT', body: JSON.stringify(profile) });
export const uploadProfileImages = (files) => { const form = new FormData(); Object.entries(files).forEach(([name, file]) => { if (file) form.append(name, file); }); return apiRequest('/auth/profile/images/', { method: 'POST', body: form }); };
export const adminPeople = () => apiRequest('/admin/people/');
export const adminEvents = (event) => apiRequest('/events/', { method: 'POST', body: JSON.stringify(event) });
export const updateEvent = (eventId, event) => apiRequest(`/admin/events/${eventId}/`, { method: 'PUT', body: JSON.stringify(event) });
export const uploadEventBanner = (file) => { const form = new FormData(); form.append('banner_image', file); return apiRequest('/admin/events/upload-banner/', { method: 'POST', body: form }); };
export const deleteEvent = (eventId) => apiRequest(`/admin/events/${eventId}/`, { method: 'DELETE' });
export const deletePerson = (personId) => apiRequest(`/admin/people/${personId}/`, { method: 'DELETE' });
