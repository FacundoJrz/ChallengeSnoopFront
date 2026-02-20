# 🧪 Testing & Debugging Guide

Guía para testear el frontend sin tener todo el backend completamente integrado.

## 🧩 Mock Data para Desarrollo

### 1. Mockear Auth (Zustand)

Si el backend no está listo, puedes setear el store manualmente en la consola del navegador (F12):

```javascript
import { useGameStore } from './store/useGameStore.js'

// Simular login exitoso
useGameStore.setState({
  user: {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'https://...
  },
  token: 'fake_jwt_token_12345'
})

// Verifica que funciona
console.log(useGameStore.getState().user) // Debería ver el usuario
```

### 2. Mockear Stats del Dashboard

```javascript
// Cargar stats mock
useGameStore.setState({
  stats: {
    totalWins: 5,
    totalLosses: 2,
    totalDraws: 1,
    winRate: 0.625,
    matchHistory: [
      {
        date: new Date().toISOString(),
        opponentName: 'Ana',
        yourSymbol: 'X',
        result: 'Win',
        durationSeconds: 120
      }
    ]
  }
})
```

### 3. Mockear Partida (Game Board)

```javascript
// Simular que hay una partida en progreso
useGameStore.setState({
  matchId: 'match_123',
  board: [' X', null, 'O', null, 'X', null, null, 'O', null],
  currentTurn: 'X',
  playerSymbol: 'X',
  opponent: {
    id: 'opp_123',
    name: 'Opponent Name',
    avatar: 'https://...'
  },
  gameStatus: 'playing',
  winner: null
})
```

## 🔍 Testing Manual Checklist

### Login Component
```
[ ] Botón "Sign in with Google" se ve correctamente
[ ] Click en botón abre popup de Google
[ ] Después de seleccionar cuenta, se cierra popup
[ ] Se redirige a Dashboard
[ ] No hay errores de CORS en console
```

### Dashboard Component
```
[ ] Se ve el nombre del usuario
[ ] Se ve el email
[ ] Se cargan las 4 stats (wins, losses, draws, win rate)
[ ] Se muestra tabla de historial de partidas
[ ] Botón "Find Match" está habilitado
[ ] Botón "Find Match" está deshabilitado mientras busca
[ ] Botón "Logout" limpia el store
```

### Board Component
```
[ ] Se ve el tablero 3x3
[ ] Se ve el match ID
[ ] Se ve el símbolo del jugador (X o O)
[ ] Se ve el nombre del oponente
[ ] Muestra "Your Turn" cuando es tu turno
[ ] Los botones están deshabilitados cuando no es tu turno
[ ] Click en celda vacía registra la jugada
[ ] Celda con X/O no se puede clickear
[ ] Se muestra resultado al terminar
```

### Store (Zustand) Testing
```javascript
// Ver estado completo
useGameStore.getState()

// Ver si hay token
useGameStore.getState().token

// Ver tablero
useGameStore.getState().board

// Ver si está conectado a SignalR
useGameStore.getState().isConnected
```

## 🔗 Testear APIs sin Backend Completo

### Mockear Axios responses

Crear un archivo `src/mocks/apiMocks.js`:

```javascript
import api from '../api';

// Mock exitoso para /api/Auth/google
api.post = jest.fn(() =>
  Promise.resolve({
    data: {
      user: {
        id: '123',
        name: 'Test User',
        email: 'test@test.com'
      },
      jwtToken: 'test_token'
    }
  })
);

// Mock para /api/Profile/stats
api.get = jest.fn((url) => {
  if (url === '/api/Profile/stats') {
    return Promise.resolve({
      data: {
        totalWins: 5,
        totalLosses: 2,
        totalDraws: 1,
        winRate: 0.625,
        matchHistory: []
      }
    });
  }
});
```

## 📝 Console Commands para Testing

```javascript
// ===== TESTING ZUSTAND =====

// Ver estado completo
useGameStore.getState()

// Cambiar usuario (simular login)
useGameStore.setState({ 
  user: { id: '1', name: 'Test', email: 'test@test.com' },
  token: 'test_token'
})

// Simular cambio de turno
useGameStore.setState({ currentTurn: 'O' })

// Hacer una jugada (sin SignalR)
useGameStore.setState(state => ({
  board: state.board.map((v, i) => i === 0 ? 'X' : v)
}))

// Simular fin de partida
useGameStore.setState({ 
  gameStatus: 'finished',
  winner: 'X'
})

// Limpiar sesión
useGameStore.getState().logout()

// ===== TESTING SIGNALR =====

// Ver estado de conexión
useGameStore.getState().isConnected
useGameStore.getState().hubConnection

// Simular evento GameStarted
const { hubConnection } = useGameStore.getState()
hubConnection?.listeners?.GameStarted?.[0]?.({
  matchId: 'test_match',
  currentTurn: 'X',
  yourSymbol: 'X',
  opponent: { id: '2', name: 'Opponent' }
})

// ===== TESTING AXIOS =====

// Ver si JWT se inyecta
useGameStore.getState().token // Debe tener valor

// Interceptores están configurados
console.log(api.interceptors.request.handlers)
console.log(api.interceptors.response.handlers)
```

## 🎬 Escenarios de Testing Automático

### Escenario 1: Login y Dashboard
```javascript
describe('Login to Dashboard flow', () => {
  it('should show login initially', () => {
    // App sin token → mostrar Login
  });
  
  it('should show dashboard after login', () => {
    // Setear token en store → mostrar Dashboard
  });
  
  it('should load stats when board mounts', () => {
    // useEffect en Dashboard debería llamar a API
  });
});
```

### Escenario 2: Juego
```javascript
describe('Game flow', () => {
  it('should show board when matchId exists', () => {
    // Con token + matchId → mostrar Board
  });
  
  it('should allow move when its my turn', () => {
    // currentTurn === playerSymbol → habilitar click
  });
  
  it('should disable move when its opponent turn', () => {
    // currentTurn !== playerSymbol → deshabilitar click
  });
  
  it('should show winner when game is over', () => {
    // gameStatus === 'finished' → mostrar resultado
  });
});
```

## 🐛 Debugging Útil

### Errores Comunes

#### "Cannot read property 'token' of undefined"
```javascript
// Problema: Zustand no está inicializado
// Solución: Verifica que main.jsx importa useGameStore correctamente
import { useGameStore } from './store/useGameStore.js'
```

#### "GoogleLogin component not showing"
```javascript
// Problemático: GoogleOAuthProvider no wrappea App
// Solución: Verifica main.jsx
<GoogleOAuthProvider clientId={...}>
  <App />
</GoogleOAuthProvider>
```

#### "API request failing with CORS"
```javascript
// Problema: Backend no permite requests desde http://localhost:5173
// Solución (Backend):
app.UseCors(builder => builder
  .AllowAnyOrigin()
  .AllowAnyMethod()
  .AllowAnyHeader()
);
```

#### "SignalR connection timeout"
```javascript
// Problema: Hub no está en /gamehub
// Solución: Verifica que backend mapea el hub correctamente
app.MapHub<GameHub>("/gamehub");
```

## 🔬 Network Monitoring

### DevTools Network Tab
1. Abre F12 > Network Tab
2. Filtra por "XHR" para ver requests HTTP
3. Filtra por "WS" para ver websocket (SignalR)

#### Esperado en Network:
- `POST /api/Auth/google` → Status 200 con JWT
- `GET /api/Profile/stats` → Status 200 con stats
- `wss://...` o `ws://...` → WebSocket para SignalR

### Console Errors
```javascript
// Debería estar limpia de errores
// Si ves errores de CORS: solicitar acceso al backend dev
// Si ves "Undefined is not a function": revisar imports
```

## 📊 Herramientas de Debugging

### VS Code Debugger
Crear `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

### React DevTools Extension
```javascript
// Con React DevTools instalado:
// 1. F12 > Components tab
// 2. Ver jerarquía de componentes
// 3. Ver props y state en real-time
```

### Zustand DevTools (opcional)
```bash
npm install zustand/middleware zustand/devtools
```

```javascript
// En useGameStore.js
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const useGameStore = create(
  devtools((set, get) => ({ ... }))
)
```

## ✅ Checklist Final de Testing

```
Frontend
────────
[ ] npm install funciona sin errores
[ ] npm run dev inicia sin errores
[ ] No hay errores de imports
[ ] No hay errores de Zustand
[ ] Componentes renderizan correctamente
[ ] Estilos de MUI se aplican

Google OAuth
────────────
[ ] VITE_GOOGLE_CLIENT_ID está en .env.local
[ ] GoogleOAuthProvider está en main.jsx
[ ] Botón "Sign in with Google" aparece
[ ] Click abre popup de Google

Axios
─────
[ ] Interceptor de request funciona
[ ] JWT se inyecta en headers
[ ] Errores 401 se manejan correctamente

SignalR
───────
[ ] Conexión después de login
[ ] Eventos se escuchan correctamente
[ ] Reconexión automática funciona
[ ] Cierre de conexión al logout

Integración Completa
────────────────────
[ ] Login → API google → JWT → Zustand
[ ] Zustand → Dashboard → Stats API
[ ] Dashboard → Find Match → SignalR
[ ] SignalR GameStarted → Board
[ ] Board → Click → SignalR MoveMade
[ ] SignalR GameOver → Resultado
```

---

**Tip**: Para testing sin backend, puedes usar `console.log()` y setear el store manualmente en la consola del navegador.
