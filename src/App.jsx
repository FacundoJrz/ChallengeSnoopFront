import { useEffect } from 'react';
import { Box } from '@mui/material';
import { useGameStore } from './store/useGameStore';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Board from './components/Board';

/**
 * Componente principal App
 * Controla la navegación basada en el estado de autenticación y el estado del juego:
 * - Sin token: mostrar Login
 * - Con token, sin matchId: mostrar Dashboard
 * - Con token y matchId: mostrar Board
 */
function App() {
  const token = useGameStore((state) => state.token);
  const matchId = useGameStore((state) => state.matchId);
  const connectToHub = useGameStore((state) => state.connectToHub);
  const isConnected = useGameStore((state) => state.isConnected);

  // Reconectar al hub si se pierde la conexión y hay token
  useEffect(() => {
    if (token && !isConnected) {
      connectToHub();
    }
  }, [token, isConnected, connectToHub]);

  // Si no hay token, mostrar login
  if (!token) {
    return <Login />;
  }

  // Si hay token pero no hay matchId en progreso, mostrar dashboard
  if (!matchId) {
    return <Dashboard />;
  }

  // Si hay token y matchId, mostrar el tablero
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Board />
    </Box>
  );
}

export default App;
