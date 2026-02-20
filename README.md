# Ta-Te-Ti Real-Time Arena - Frontend

Frontend desarrollado con **React + Vite** para un juego de Ta-Te-Ti (Tic-Tac-Toe) multiplayer en tiempo real.

## 🛠️ Stack Tecnológico

- **Framework**: React 19 + Vite
- **Estado Global**: Zustand
- **UI**: Material-UI (MUI)
- **HTTP**: Axios con Interceptors
- **Real-Time**: SignalR (@microsoft/signalr)
- **Autenticación**: Google OAuth (@react-oauth/google)

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Google OAuth Client ID (obtener en [Google Cloud Console](https://console.cloud.google.com/))
- Backend ejecutándose en http://localhost:5000

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Copiar el archivo `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus valores:
```env
# Google OAuth - obtener del Google Cloud Console
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# URL del backend
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Ejecutar el servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
src/
├── api.js                    # Instancia de Axios con interceptores
├── components/
│   ├── Login.jsx            # Componente de login con Google
│   ├── Dashboard.jsx        # Panel de perfil y estadísticas
│   └── Board.jsx            # Tablero de juego 3x3
├── store/
│   └── useGameStore.js      # Store global con Zustand
├── App.jsx                  # Lógica de navegación principal
├── main.jsx                 # Entrada de la aplicación
├── index.css                # Estilos globales
└── App.css                  # Estilos adicionales
```

## 🎮 Flujo de la Aplicación

### 1. **Login**
- Usuario inicia sesión con Google
- Se envía el token de Google a `POST /api/Auth/google`
- Backend devuelve JWT y datos del usuario
- Se almacena en Zustand y se conecta a SignalR

### 2. **Dashboard**
- Muestra perfil del usuario (nombre, email)
- Estadísticas: wins, losses, draws, win rate
- Tabla con historial de partidas
- Botón "Find Match" para buscar oponente

### 3. **Board**
- Tablero 3x3 interactivo
- Shows current turn y información del oponente
- Realiza jugadas mediante SignalR
- Muestra resultado final (Win/Loss/Draw)

## 🔌 Integración con SignalR

El store de Zustand maneja automáticamente:

**Eventos recibidos:**
- `GameStarted`: Inicia una partida con el oponente y símbolo asignado
- `MoveMade`: Actualiza el tablero con la jugada del oponente
- `GameOver`: Finaliza la partida y muestra el resultado

**Acciones a servidor:**
- `MakeMove`: Envía una jugada (posición y símbolo)
- `FindMatch`: Busca un oponente disponible

## 🔐 Interceptor de Axios

El archivo `api.js` configura automáticamente:
- Inyección de JWT en header `Authorization: Bearer <token>` en todas las peticiones
- Limpieza de sesión si el token expire (401)

## 📋 API Endpoints Esperados

### Autenticación
```
POST /api/Auth/google
Body: { token: "google_token" }
Response: { user: {...}, jwtToken: "..." }
```

### Estadísticas
```
GET /api/Profile/stats
Response: {
  totalWins: number,
  totalLosses: number,
  totalDraws: number,
  winRate: number,
  matchHistory: [
    {
      date: ISO string,
      opponentName: string,
      yourSymbol: "X" | "O",
      result: "Win" | "Loss" | "Draw",
      durationSeconds: number
    }
  ]
}
```

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
```

## 📝 Notas de Desarrollo

- El store de Zustand persiste la conexión SignalR mientras hay sesión activa
- La reconexión a SignalR es automática si se pierde la conexión
- Los CSS de MUI se cargan automáticamente en los componentes
- El tablero se renderiza como grid 3x3 usando MUI Grid

## 🤝 Contribuir

Este es un proyecto educativo nivel Trainee. Mantén el código limpio y bien documentado.

## 📄 Licencia

MIT

