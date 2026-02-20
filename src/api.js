import axios from 'axios';
import { useGameStore } from './store/useGameStore';

/**
 * Instancia de Axios configurada con interceptor para JWT
 * El interceptor inyecta el token en el header Authorization de todas las peticiones
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
});

// Interceptor para inyectar el JWT desde el store de Zustand
api.interceptors.request.use(
  (config) => {
    const token = useGameStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado, limpiar sesión
      useGameStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
