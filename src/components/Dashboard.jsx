import { useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { useGameStore } from '../store/useGameStore';
import api from '../api';

/**
 * Componente Dashboard
 * Muestra:
 * - Información del perfil del usuario
 * - Botón "Buscar Partida"
 * - Tabla de estadísticas (victorias, derrotas, empates)
 * - Historial de partidas
 */
function Dashboard() {
  const user = useGameStore((state) => state.user);
  const stats = useGameStore((state) => state.stats);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const setStats = useGameStore((state) => state.setStats);
  const findMatch = useGameStore((state) => state.findMatch);
  const logout = useGameStore((state) => state.logout);

  // Cargar estadísticas del usuario al montar el componente
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/Profile/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [setStats]);

  const handleFindMatch = () => {
    findMatch();
  };

  const handleLogout = () => {
    logout();
  };

  if (!stats) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Encabezado y botones de acción */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h3" component="h1">
              Welcome, {user?.name || 'Player'}!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user?.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleFindMatch}
              disabled={gameStatus === 'waiting' || gameStatus === 'playing'}
            >
              {gameStatus === 'waiting' ? 'Searching...' : 'Find Match'}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Tarjetas de estadísticas generales */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Wins
                </Typography>
                <Typography variant="h5">
                  {stats.wins || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Losses
                </Typography>
                <Typography variant="h5">
                  {stats.losses || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Draws
                </Typography>
                <Typography variant="h5">
                  {stats.draws || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Games
                </Typography>
                <Typography variant="h5">
                  {stats.matchHistory ? stats.matchHistory.length : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Tabla de historial de partidas */}
        <Paper>
          <Typography variant="h6" sx={{ p: 2 }}>
            Match History
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.matchHistory && stats.matchHistory.length > 0 ? (
                  stats.matchHistory.map((match, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(stats.matchHistory[index].date).toLocaleString().split(',')[0]}
                      </TableCell>
                      
                      <TableCell>
                        <Typography
                          sx={{
                            fontWeight: 'bold',
                            color:
                              match.result === 'Win'
                                ? 'green'
                                : match.result === 'Loss'
                                  ? 'red'
                                  : 'orange'
                          }}
                        >
                          {match.result}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">
                        No matches yet. Start playing!
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
}

export default Dashboard;
