import axios from 'axios';

// Usamos la variable de entorno de Vite o un fallback seguro
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use(
  async (config) => {
    // Importamos el store dinámicamente dentro de la función para evitar dependencias circulares
    const { useGameStore } = await import('./store/useGameStore');
    const token = useGameStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;