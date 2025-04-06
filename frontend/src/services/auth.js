import api from '../config/services';


export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    console.log('Login response:', response.data);
    localStorage.setItem('token', response.data.token)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await api.post('/register', { name, email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async (token) => {
  try {
    const response = await api.post('/refresh-token', { token });
    return response.data;
  } catch (error) {
    throw error;
  }
};