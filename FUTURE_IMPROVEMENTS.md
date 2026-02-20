# 🚀 Future Improvements & Extensions

Sugerencias de mejoras y extensiones para evolucionar el proyecto más allá de la versión Trainee.

## 📈 Mejoras de Corto Plazo

### 1. Persistencia de Sesión
**Problema**: Se pierde el token al refrescar la página
**Solución**: Persistir el store en localStorage

```javascript
// useGameStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useGameStore = create(
  persist(
    (set, get) => ({ ... }),
    {
      name: 'game-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token
      })
    }
  )
)
```

### 2. Loading States
**Problema**: UX pobre mientras carga datos
**Solución**: Agregar isLoading flags

```javascript
// En useGameStore.js
{
  isLoadingStats: false,
  isSearchingMatch: false,
  
  // En acciones
  async fetchStats() {
    set({ isLoadingStats: true })
    try {
      // ...
    } finally {
      set({ isLoadingStats: false })
    }
  }
}
```

```jsx
// En Dashboard.jsx
{isLoadingStats ? <Skeleton /> : <StatsTable />}
```

### 3. Error Messages
**Problema**: Errores silenciosos que no se ven
**Solución**: Agregar Snackbar de MUI

```jsx
import { Snackbar, Alert } from '@mui/material'

const [error, setError] = useState(null)

<Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
  <Alert severity="error">{error}</Alert>
</Snackbar>
```

### 4. Validación de Entrada
**Problema**: No hay validación de datos del servidor
**Solución**: Usar Zod o Yup para schema validation

```bash
npm install zod
```

```javascript
import { z } from 'zod'

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
})

// En interceptor
const validUser = UserSchema.parse(response.data.user)
```

## 🎨 Mejoras UI/UX

### 1. Dark Mode
```jsx
import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark' // o 'light'
  }
})

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

### 2. Responsive Design
```jsx
sx={{
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
  gap: 2
}}
```

### 3. Animaciones
```bash
npm install framer-motion
```

```jsx
import { motion } from 'framer-motion'

<motion.div animate={{ scale: 1 }} initial={{ scale: 0 }}>
  <Board />
</motion.div>
```

### 4. Notificaciones en Tiempo Real
```jsx
// Mostrar cuando oponente conecta
if (opponent?.isOnline) {
  <Chip label="Opponent Online" color="success" />
}
```

## 🔐 Mejoras de Seguridad

### 1. Refresh Token
**Problema**: JWT expira y sesión termina
**Solución**: Implementar refresh token rotation

```javascript
// useGameStore.js
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const refreshed = await api.post('/api/Auth/refresh')
      useGameStore.setState({ token: refreshed.data.jwtToken })
      return api(error.config)
    }
    throw error
  }
)
```

### 2. Rate Limiting
```javascript
// Esperar entre requests para evitar spam
const throttledFindMatch = throttle(findMatch, 3000)
```

### 3. HTTPS en Producción
```javascript
// vite.config.js
export default {
  server: {
    https: import.meta.env.PROD ? false : true
  }
}
```

## 🧪 Testing

### 1. Unit Tests con Vitest
```bash
npm install --save-dev vitest
```

```javascript
// useGameStore.test.js
import { describe, it, expect } from 'vitest'
import { useGameStore } from './useGameStore'

describe('useGameStore', () => {
  it('should set auth', () => {
    useGameStore.getState().setAuth(user, token)
    expect(useGameStore.getState().user).toEqual(user)
  })
})
```

### 2. Component Tests
```bash
npm install --save-dev @testing-library/react
```

```javascript
import { render, screen } from '@testing-library/react'
import Dashboard from './Dashboard'

test('renders welcome message', () => {
  render(<Dashboard />)
  expect(screen.getByText(/Welcome/)).toBeInTheDocument()
})
```

### 3. E2E Tests con Cypress
```bash
npm install --save-dev cypress
```

## 📊 Analytics

### 1. Seguimiento de eventos
```bash
npm install @react-google-analytics/core
```

```javascript
import { trackEvent } from '@react-google-analytics/core'

trackEvent({
  action: 'game_started',
  value: matchId
})
```

### 2. Performance Monitoring
```javascript
// Medir tiempo de carga de stats
console.time('fetchStats')
await api.get('/api/Profile/stats')
console.timeEnd('fetchStats')
```

## 🎯 Características Nuevas

### 1. Chat en Partida
```python
# Backend: Otro hub para chat
# Frontend: Agregar componente Chat al Board

<Chat matchId={matchId} />
```

### 2. Ranking Global
```jsx
// Nueva ruta /leaderboard
<Leaderboard />

// GET /api/Leaderboard/top100
```

### 3. Sistema de Recompensas
```javascript
// Badges por victorias
{
  "3-win-streak": { icon: "🔥", name: "On Fire" },
  "10-wins": { icon: "⭐", name: "Rookie" }
}
```

### 4. Replay de Partidas
```javascript
// Guardar movimientos en orden
// Reproducir tablero movimiento por movimiento

const replay = (moves) => {
  moves.forEach((move, index) => {
    setTimeout(() => {
      applyMove(move)
    }, index * 500)
  })
}
```

### 5. Torneos
```jsx
// Integrar bracket system
<Tournament roundId={roundId} />

// GET /api/Tournament/{id}
```

## 📱 Progressive Web App (PWA)

```bash
npm install --save-dev vite-plugin-pwa
```

```javascript
// vite.config.js
import { VitePWA } from 'vite-plugin-pwa/frameworks'

plugins: [react(), VitePWA({
  registerType: 'autoUpdate',
  devOptions: { enabled: true }
})]
```

## 🔧 DevOps & Deployment

### 1. Build Optimizaciones
```bash
# Analyze bundle
npm run build -- --analyzeBundle
```

### 2. Environment Configurations
```env
# .env.production
VITE_API_BASE_URL=https://api.prod.example.com
VITE_GOOGLE_CLIENT_ID=prod_client_id
```

### 3. Docker
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

### 4. CI/CD (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run lint
```

## 🏗️ Arquitectura Avanzada

### 1. Separación por Features
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── store/
│   │   └── api/
│   ├── game/
│   │   ├── components/
│   │   ├── store/
│   │   └── utils/
│   └── profile/
```

### 2. Custom Hooks Reutilizables
```javascript
// hooks/useGame.js
export const useGame = () => {
  const matchId = useGameStore(s => s.matchId)
  const board = useGameStore(s => s.board)
  
  const isWinning = () => checkWin(board)
  
  return { matchId, board, isWinning }
}

// Components
const { isWinning } = useGame()
```

### 3. Error Boundaries
```jsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    console.log('Error:', error)
    this.setState({ hasError: true })
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorPage />
    }
  }
}
```

## 📚 Documentación Estandarizada

### 1. JSDoc Comments
```javascript
/**
 * Realiza una jugada en el tablero mediante SignalR
 * @param {number} position - Posición en el tablero (0-8)
 * @throws {Error} Si no es el turno del jugador
 * @returns {Promise<void>}
 */
export const makeMove = (position) => { ... }
```

### 2. Storybook para Componentes
```bash
npx sb init
```

```javascript
// Board.stories.jsx
export const InProgress = {
  args: {
    matchId: 'test',
    board: ['X', null, 'O', null, null, null, null, null, null],
    currentTurn: 'X'
  }
}
```

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Zustand Patterns](https://docs.pmnd.rs/zustand/)
- [SignalR Client](https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client)
- [Material-UI Advanced](https://material-ui.com/api/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**Roadmap Sugerido**:
1. ✅ MVP Básico (Trainee) - COMPLETADO
2. ⏳ Persistencia + Error Handling (Junior)
3. ⏳ Tests + Animaciones (Mid-level)
4. ⏳ Features nuevas + PWA (Senior)
5. ⏳ Arquitectura escalable + Analytics (Lead)

Cada mejora incrementa el valor y la profesionalidad del proyecto.
