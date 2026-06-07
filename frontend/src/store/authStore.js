import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('twistea_user') || 'null'),
  token: localStorage.getItem('twistea_token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('twistea_token', data.token);
      localStorage.setItem('twistea_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  register: async (name, email, password, phone) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password, phone });
      localStorage.setItem('twistea_token', data.token);
      localStorage.setItem('twistea_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem('twistea_token');
    localStorage.removeItem('twistea_user');
    set({ user: null, token: null });
  },

  updateUser: (user) => {
    localStorage.setItem('twistea_user', JSON.stringify(user));
    set({ user });
  },

  isAdmin: () => get().user?.role === 'admin',
  isAuthenticated: () => !!get().token,
}));

export default useAuthStore;
