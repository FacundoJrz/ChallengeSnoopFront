import { GoogleLogin } from '@react-oauth/google';
import { Container, Box, Typography, Paper } from '@mui/material';
import { useGameStore } from '../store/useGameStore';
import api from '../api';

/**
 * Componente Login
 * Muestra el botón de "Sign in with Google"
 * Al hacer login, envía el token a /api/Auth/google y almacena el JWT en Zustand
 */
function Login() {
  const setAuth = useGameStore((state) => state.setAuth);
  const connectToHub = useGameStore((state) => state.connectToHub);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      // Enviar el token de Google al backend
      const response = await api.post('/api/Auth/google', {
        token: credentialResponse.credential
      });

      const { user, jwtToken } = response.data;

      // Guardar usuario y JWT en el store
      setAuth(user, jwtToken);

      // Conectar al hub de SignalR después de obtener el JWT
      await connectToHub();

      console.log('Login exitoso:', user);
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión. Intenta de nuevo.');
    }
  };

  const handleLoginError = () => {
    console.error('Login failed');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 3
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            width: '100%'
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Ta-Te-Ti Arena
          </Typography>
          <Typography variant="body1" color="textSecondary" textAlign="center">
            Real-Time Multiplayer Tic-Tac-Toe
          </Typography>

          <Box sx={{ mt: 3 }}>
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
