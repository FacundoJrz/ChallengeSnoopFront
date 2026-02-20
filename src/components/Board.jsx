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
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        {/* Información del juego */}
        <Paper elevation={2} sx={{ p: 2, mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Match ID: {matchId}
          </Typography>
          <Typography variant="body1" gutterBottom>
            You are: <strong>{playerSymbol}</strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
            Opponent: <strong>{opponent?.name || 'Unknown'}</strong>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              color: isMyTurn ? '#4caf50' : '#1976d2',
              fontWeight: 'bold'
            }}
          >
            {gameFinished ? (
              <>
                Game Over {' '}
                {winner === 'Draw' ? (
                  <span style={{ color: '#ff9800' }}>- Draw</span>
                ) : winner === playerSymbol ? (
                  <span style={{ color: '#4caf50' }}>- You Won!</span>
                ) : (
                  <span style={{ color: '#f44336' }}>- You Lost</span>
                )}
              </>
            ) : isMyTurn ? (
              'Your Turn 🎮'
            ) : (
              `${opponent?.name || 'Opponent'}'s Turn ⏳`
            )}
          </Typography>
        </Paper>

        {/* Tablero 3x3 */}
        <Grid container spacing={1} sx={{ mb: 3 }}>
          {board.map((_, index) => (
            <Grid item xs={4} key={index}>
              {renderCell(index)}
            </Grid>
          ))}
        </Grid>

        {/* Información adicional */}
        {gameFinished && (
          <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
            <Typography variant="body2" color="textSecondary">
              Return to dashboard to play again
            </Typography>
          </Paper>
        )}
      </Box>
    </Container>
  );
}

export default Board;
