import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://hemoverse.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred';
    if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

// AUTH & OTP API CALLS
export const sendOtpApi = async (email, purpose = 'register') => {
  const response = await api.post('/users/send-otp', { email, purpose });
  return response.data;
};

export const forgotPasswordSendOtpApi = async (email) => {
  const response = await api.post('/users/forgot-password-otp', { email });
  return response.data;
};

export const resetPasswordApi = async (email, otp, newPassword) => {
  const response = await api.post('/users/reset-password', { email, otp, newPassword });
  return response.data;
};

export const registerUserApi = async (formData) => {
  // formData contains: firstName, middleName, lastName, email, password, otp, avatar (file)
  const response = await api.post('/users/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const loginUserApi = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  const data = response.data?.data;
  if (data) {
    const userObj = data.user || data;
    const token = data.accessToken;
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    localStorage.setItem('user', JSON.stringify(userObj));
    return { ...response.data, data: userObj };
  }
  return response.data;
};

export const logoutUserApi = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

// DONOR API CALLS
export const sendDonorOtpApi = async (email) => {
  const response = await api.post('/donors/send-otp', { email });
  return response.data;
};

export const getAllDonorsApi = async () => {
  const response = await api.get('/donors/get');
  return response.data?.data || [];
};

export const addDonorApi = async (formData) => {
  const response = await api.post('/donors/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const editDonorApi = async (donorId, updateData) => {
  const response = await api.post(`/donors/edit/${donorId}`, updateData);
  return response.data;
};

export const removeDonorApi = async (donorId) => {
  const response = await api.delete(`/donors/remove/${donorId}`);
  return response.data;
};

// BLOOD REQUEST API CALLS
export const sendRequestOtpApi = async (email) => {
  const response = await api.post('/bloodrequests/send-otp', { email });
  return response.data;
};

export const getAllBloodRequestsApi = async () => {
  const response = await api.get('/bloodrequests/get');
  return response.data?.data || [];
};

export const addBloodRequestApi = async (requestData) => {
  const response = await api.post('/bloodrequests/add', requestData);
  return response.data;
};

export const editBloodRequestApi = async (requestId, updateData) => {
  const response = await api.post(`/bloodrequests/edit/${requestId}`, updateData);
  return response.data;
};

export const removeBloodRequestApi = async (requestId) => {
  const response = await api.delete(`/bloodrequests/remove/${requestId}`);
  return response.data;
};

export default api;
