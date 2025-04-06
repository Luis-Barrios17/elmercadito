import axios from 'axios';
import cookie from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
const API_URL = process.env.NEXT_PUBLIC_API_URL; // Cambia si tu backend está en producción

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data; // Devuelve los datos del backend
  } catch (error) {
    console.error("Error al conectar con el backend:", error.message);
  }
};

api.interceptors.request.use(
  (config) => {
    const token = cookie.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = cookie.get('refreshToken');
      if (refreshToken) {
        try {
          const response = await api.post('/refresh-token', { token: refreshToken });
          cookie.set('token', response.data.token, { path: '/' });
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          cookie.remove('token');
          cookie.remove('refreshToken');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;