// frontend/src/utils/auth.js

export const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // ✅ cohérent avec SessionManager
  'Content-Type': 'application/json'
});

