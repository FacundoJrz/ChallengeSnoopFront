import { Box, Grid, Button, Typography, Container, Paper, CircularProgress } from '@mui/material';
import { useGameStore } from '../store/useGameStore';

/**
 * Componente Board
 * Renderiza un tablero 3x3 de Ta-Te-Ti
 * Permite hacer click en las celdas para jugar
 * Muestra información del turno actual y el oponente
 */
function Board() {
  const matchId = useGameStore((state) => state.matchId);
  const board = useGameStore((state) => state.board);
  const currentTurn = useGameStore((state) => state.currentTurn);
  const playerSymbol = useGameStore((state) => state.playerSymbol);
  const opponent = useGameStore((state) => state.opponent);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const winner = useGameStore((state) => state.winner);
  const makeMove = useGameStore((state) => state.makeMove);

  // Si el juego aún no ha comenzado
  if (!matchId) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Waiting for opponent...
          </Typography>
        </Box>
      </Container>
    );
  }

  const isMyTurn = currentTurn === playerSymbol;
  const gameFinished = gameStatus === 'finished';

  // Renderizar una celda del tablero
  const renderCell = (index) => {
    const value = board[index];
    const isClickable = !value && isMyTurn && !gameFinished;

    return (
      <Button
        key={index}
        onClick={() => isClickable && makeMove(index)}
        disabled={gameFinished || !isClickable}
        sx={{
          width: '100%',
          height: '100px',
          fontSize: '2rem',
          fontWeight: 'bold',
          border: '2px solid #1976d2',
          backgroundColor: value ? '#f0f0f0' : '#ffffff',
          color: value === 'X' ? '#1976d2' : '#ff6f00',
          cursor: isClickable ? 'pointer' : 'default',
          '&:hover': {
            backgroundColor: isClickable ? '#e3f2fd' : '#f0f0f0'
          },
          '&:disabled': {
            backgroundColor: '#f0f0f0',
            color: value === 'X' ? '#1976d2' : '#ff6f00'
          }
        }}
      >
        {value}
      </Button>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center', minWidth: 350 }}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Match ID: {matchId}
        </Typography>
        <Typography variant="h6">
          You are: <strong style={{ color: '#1976d2' }}>{playerSymbol || 'X'}</strong>
        </Typography>
        <Typography variant="h6">
          Opponent: <strong>{opponent || 'Player 2'}</strong>
        </Typography>

        {/* Mensaje dinámico de Turno o Fin de juego */}
        {gameStatus === 'finished' ? (
          <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold', color: '#ff9800' }}>
            {winner ? `Game Over! Winner: ${winner}` : "Game Over! It's a Draw!"}
          </Typography>
        ) : (
          <Typography
            variant="h5"
            sx={{
              mt: 2,
              fontWeight: 'bold',
              color: currentTurn === playerSymbol ? '#2e7d32' : '#d32f2f'
            }}
          >
            {currentTurn === playerSymbol ? 'Your Turn 🎮' : "Opponent's Turn ⏳"}
          </Typography>
        )}
      </Paper>

      {/* El Tablero: Corregido para que no se deforme */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 100px)', // 3 columnas fijas de 100px
          gridTemplateRows: 'repeat(3, 100px)',    // 3 filas fijas de 100px
          gap: 1.5,
          margin: 'auto'
        }}
      >
        {board.map((cell, index) => (
          <Button
            key={index}
            variant="outlined"
            onClick={() => makeMove(index)}
            // Se bloquea si ya tiene símbolo O si el juego ya terminó
            disabled={cell !== null || gameStatus === 'finished'} 
            sx={{
              fontSize: '3rem', // Tamaño de fuente un poco más pequeño para que entre bien
              fontWeight: 'bold',
              height: '100%',
              width: '100%',
              padding: 0, // Evita que el padding interno empuje la caja
              color: cell === 'X' ? '#1976d2' : '#d32f2f',
              backgroundColor: '#f8f9fa',
              '&:hover': { backgroundColor: '#e9ecef' }
            }}
          >
            {cell}
          </Button>
        ))}
      </Box>
    </Box>
  );
}

export default Board;
