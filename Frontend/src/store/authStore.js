import { create } from "zustand";
import axios from "axios";

const API = "https://ai-resume-analyzer-team-1.onrender.com/commonApi";

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCred) => {
    try {
      set({ loading: true });

      const res = await axios.post(`${API}/login`, userCred, {
        withCredentials: true,
      });

      set({
        currentUser: res.data?.user,
        loading: false,
        isAuthenticated: true,
        error: null,
      });

      return { success: true };
    } catch (err) {
      set({
        loading: false,
        currentUser: null,
        isAuthenticated: false,
        error: err.response?.data?.message || "Login failed",
      });

      return { success: false };
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true });

      const res = await axios.post(`${API}/register`, userData, {
        withCredentials: true,
      });

      set({
        currentUser: res.data?.user,
        loading: false,
        isAuthenticated: true,
        error: null,
      });

      return { success: true };
    } catch (err) {
      set({
        loading: false,
        isAuthenticated: false,
        currentUser: null,
        error: err.response?.data?.message || "Registration failed",
      });

      return { success: false };
    }
  },

  logout: async () => {
    try {
      set({ loading: true });

      await axios.get(`${API}/logout`, {
        withCredentials: true,
      });

      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false };
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });

      const res = await axios.get(`${API}/check-auth`, {
        withCredentials: true,
      });

      if (!res.data?.payload) throw new Error();

      set({
        currentUser: res.data.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      });

      return { success: true };
    } catch (err) {
      set({
        currentUser: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });

      return { success: false };
    }
  },
}));
