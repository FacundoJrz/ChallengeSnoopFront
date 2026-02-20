# 📝 Cheat Sheet - Referencia Rápida

Referencia rápida de comandos, snippets y patrones más usados en el proyecto.

## 🛠️ Comandos Esenciales

```bash
# Instalación
npm install

# Desarrollo
npm run dev                 # Inicia servidor en localhost:5173

# Build
npm run build              # Build para producción
npm run preview            # Preview del build

# Linting
npm run lint               # Revisar código

# Configuración
cp .env.example .env.local # Copiar variables de entorno
```

## 📦 Imports Comunes

```javascript
// Zustand Store
import { useGameStore } from './store/useGameStore'

// Components
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Board from './components/Board'

// Axios
import api from './api'

// Material-UI
import { Box, Button, Container, Typography, Grid, Table, Card, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'

// Google OAuth
import { GoogleLogin } from '@react-oauth/google'

// SignalR
import * as signalR from '@microsoft/signalr'

// React
import { useState, useEffect, useCallback } from 'react'
```

## 🏪 Zustand Selectors

```javascript
// Forma 1: Selector específico (recomendado)
const token = useGameStore((state) => state.token)
const board = useGameStore((state) => state.board)

// Forma 2: Múltiples selectores
const { matchId, currentTurn, playerSymbol } = useGameStore(
  (state) => ({
    matchId: state.matchId,
    currentTurn: state.currentTurn,
    playerSymbol: state.playerSymbol
  })
)

// Forma 3: Acciones
const logout = useGameStore((state) => state.logout)
```

## 🎣 Zustand Side Effects

```javascript
// useEffect para reaccionar a cambios
useEffect(() => {
  if (token && !isConnected) {
    connectToHub()
  }
}, [token, isConnected, connectToHub])
```

## 🔌 Axios Requests

```javascript
// GET
const response = await api.get('/api/Profile/stats')
console.log(response.data)

// POST
const response = await api.post('/api/Auth/google', {
  token: googleToken
})

// Error handling
try {
  await api.get('/endpoint')
} catch (error) {
  if (error.response?.status === 401) {
    // Token expirado
  }
  console.error(error.message)
}
```

## 📡 SignalR Eventos

```javascript
// Escuchar evento
hubConnection.on('GameStarted', (data) => {
  console.log('Partida iniciada:', data)
  // Actualizar store
})

// Invocar método
hubConnection.invoke('FindMatch').catch(err => console.error(err))

// Desconectar
hubConnection.stop()
```

## 🎨 Material-UI Patterns

```jsx
// Container
<Container maxWidth="lg">
  {/* Contenedor responsivo */}
</Container>

// Box (div genérico con sx prop)
<Box sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
  {/* p = padding, mb = margin-bottom */}
</Box>

// Grid (layout)
<Grid container spacing={2}>
  <Grid item xs={12} sm={6} md={4}>
    Toma 100% en móvil, 50% en tablet, 33% en desktop
  </Grid>
</Grid>

// Typography
<Typography variant="h3">Heading 3</Typography>
<Typography variant="body1">Cuerpo de texto</Typography>
<Typography variant="caption" color="textSecondary">Texto pequeño</Typography>

// Button
<Button variant="contained" color="primary" onClick={handleClick}>
  Click me
</Button>

// Card
<Card>
  <CardContent>
    {/* Contenido */}
  </CardContent>
</Card>

// Table
<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Header</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {/* Filas */}
    </TableBody>
  </Table>
</TableContainer>
```

## 🎮 Tablero 3x3

```javascript
// Mapeo de posiciones
const board = [
  0, 1, 2,     // Fila 1
  3, 4, 5,     // Fila 2
  6, 7, 8      // Fila 3
]

// Renderizar
{board.map((value, index) => (
  <Button key={index} onClick={() => makeMove(index)}>
    {value}
  </Button>
))}

// Verificar ganador (ejemplo)
const checkWin = (board) => {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columnas
    [0, 4, 8], [2, 4, 6]              // Diagonales
  ]
  
  return wins.some(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  )
}
```

## 🔒 Autenticación

```javascript
// Obtener usuario actual
const user = useGameStore((state) => state.user)
console.log(user?.name)

// Obtener token
const token = useGameStore((state) => state.token)
console.log(`Bearer ${token}`)

// Logout
const logout = useGameStore((state) => state.logout)
logout() // Limpia todo

// Login
const handleLoginSuccess = async (credentialResponse) => {
  const response = await api.post('/api/Auth/google', {
    token: credentialResponse.credential
  })
  setAuth(response.data.user, response.data.jwtToken)
}
```

## 🎯 Condicionales Comunes

```javascript
// Si no autenticado → Login
if (!token) return <Login />

// Si autenticado pero sin partida → Dashboard
if (token && !matchId) return <Dashboard />

// Si en partida → Board
if (token && matchId) return <Board />

// Si es mi turno
if (currentTurn === playerSymbol) {
  // Habilitar clics
}

// Si partida terminó
if (gameStatus === 'finished') {
  // Mostrar resultado
}
```

## 📊 Estado del Store

```javascript
// Estructura completa
{
  // Auth
  user: { id, name, email, avatar },
  token: string,
  
  // Game
  matchId: string,
  board: Array(9),
  currentTurn: 'X' | 'O',
  playerSymbol: 'X' | 'O',
  opponent: { id, name, avatar },
  gameStatus: 'waiting' | 'playing' | 'finished',
  winner: 'X' | 'O' | 'Draw',
  stats: { totalWins, totalLosses, totalDraws, winRate, matchHistory[] },
  
  // SignalR
  hubConnection: HubConnection,
  isConnected: boolean
}
```

## 🔧 Debugging

```javascript
// Ver estado completo
useGameStore.getState()

// Ver un valor específico
useGameStore.getState().token

// Cambiar estado manualmente
useGameStore.setState({ currentTurn: 'O' })

// Ver listeners de eventos
console.log(useGameStore.subscribe)

// Verificar conexión SignalR
const { hubConnection, isConnected } = useGameStore.getState()
console.log('Connected:', isConnected)
```

## 🎨 Styled Props (sx)

```jsx
<Box sx={{
  // Layout
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
  
  // Spacing
  p: 2,        // padding
  m: 1,        // margin
  mt: 2,       // margin-top
  mb: 3,       // margin-bottom
  px: 2,       // padding horizontal
  py: 1,       // padding vertical
  
  // Colors
  backgroundColor: '#f5f5f5',
  color: '#1a1a1a',
  border: '1px solid #e0e0e0',
  
  // Sizes
  width: '100%',
  maxWidth: 500,
  minHeight: '100vh',
  
  // Responsive
  display: { xs: 'block', md: 'flex' },
  
  // Hover & States
  '&:hover': {
    backgroundColor: '#e0e0e0'
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed'
  }
}}>
  Content
</Box>
```

## 🔄 Ciclo de Vida (useEffect)

```javascript
// Component mount
useEffect(() => {
  console.log('Mounted')
}, [])

// Cuando dependency cambia
useEffect(() => {
  console.log('token cambió:', token)
}, [token])

// Cleanup function
useEffect(() => {
  return () => {
    console.log('Cleanup - component unmounting')
  }
}, [])

// Sin dependencies = corre en cada render
useEffect(() => {
  console.log('Corre siempre')
})
```

## 📱 Responsive Design

```jsx
<Grid container spacing={2}>
  {/* xs: <600px, sm: ≥600px, md: ≥960px, lg: ≥1280px, xl: ≥1920px */}
  <Grid item xs={12} sm={6} md={4}>
    Mobile: 100%, Tablet: 50%, Desktop: 33.33%
  </Grid>
</Grid>

<Box sx={{
  fontSize: { xs: '14px', sm: '16px', md: '18px' },
  padding: { xs: '8px', md: '16px' }
}}>
  Responsive text {width}
</Box>
```

## 🔐 Variables de Entorno

```javascript
// En archivo .env.local
VITE_GOOGLE_CLIENT_ID=...
VITE_API_BASE_URL=http://localhost:5000

// Acceder en código
import.meta.env.VITE_GOOGLE_CLIENT_ID
import.meta.env.VITE_API_BASE_URL
import.meta.env.PROD   // true si es producción
import.meta.env.DEV    // true si es desarrollo
```

## 🚀 Performance Tips

```javascript
// Selector específico (evita re-renders)
const token = useGameStore((state) => state.token)

// Memoizado
const Component = React.memo(({ prop }) => {
  return <div>{prop}</div>
})

// useCallback para evitar recrear funciones
const handleClick = useCallback(() => {
  makeMove(index)
}, [index, makeMove])
```

## 📋 Checklist Antes de Commit

```
[ ] npm run lint sin errores
[ ] npm run build sin errores
[ ] No hay console.error() de warnings
[ ] Variables de entorno están en .env.local
[ ] Backend está corriendo
[ ] Login funciona
[ ] Dashboard carga datos
[ ] Board muestra partida
[ ] Movimientos se envían por SignalR
```

---

**Última actualización**: Febrero 2026
**Stack**: React 19 + Vite + Zustand + MUI + SignalR + Google Auth
