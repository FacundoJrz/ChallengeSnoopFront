# 🔐 Guía de Configuración: Google OAuth + SignalR

Esta guía te ayudará a configurar correctamente la autenticación con Google y la conexión a SignalR.

## 1️⃣ Configurar Google OAuth

### Paso 1: Crear Google Cloud Project
1. Ve a https://console.cloud.google.com/
2. Crea un nuevo proyecto (Project > NEW PROJECT)
3. Dale un nombre (ej: "Ta-Te-Ti Arena")

### Paso 2: Habilitar Google+ API
1. Ve a **APIs & Services** > **Library**
2. Busca "Google+ API" y haz click
3. Haz click en "ENABLE"

### Paso 3: Crear OAuth 2.0 Credentials
1. Ve a **APIs & Services** > **Credentials**
2. Haz click en "CREATE CREDENTIALS" > "OAuth client ID"
3. Si te pide, configura primero la "OAuth consent screen":
   - Elige "External"
   - Rellena: App name, User support email, Developer contact info
   - Agrega scopes: `openid`, `email`, `profile`
   - Agrega usuarios de prueba (tu email)
4. Vuelve a Credentials > CREATE CREDENTIALS > OAuth client ID
5. Selecciona "Web application"
6. Bajo "Authorized JavaScript origins" agrega:
   - `http://localhost:5173` (desarrollo)
   - `http://localhost:3000` (si usas otro puerto)
7. Bajo "Authorized redirect URIs" agrega:
   - `http://localhost:5173` (opcional, puede dejar vacío)

### Paso 4: Copiar tu Client ID
1. En la página de credentials, encontrarás tu **Client ID**
2. Cópialo y pégalo en `.env.local`:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   ```

## 2️⃣ Integración Frontend con Google

El archivo `src/components/Login.jsx` maneja automáticamente:
- Mostrar botón de Google Login
- Enviar el token de Google al backend (`POST /api/Auth/google`)
- Almacenar el JWT en Zustand
- Conectar a SignalR Hub

## 3️⃣ Configurar SignalR

### Variables de Entorno
```env
# En .env.local
VITE_API_BASE_URL=http://localhost:5000
```

### Flujo de Conexión
1. Usuario hace login con Google
2. Backend devuelve JWT
3. Frontend almacena JWT en Zustand
4. Frontend conecta a SignalR Hub (`/gamehub`) pasando el JWT como token

### Store Zustand (`useGameStore.js`)
El store maneja automáticamente:
- **Conexión**: `connectToHub()` - Establece conexión a SignalR
- **Desconexión**: `disconnectFromHub()` - Cierra la conexión
- **Eventos**: Escucha `GameStarted`, `MoveMade`, `GameOver`
- **Acciones**: `MakeMove()`, `FindMatch()`

## 4️⃣ Interceptor de Axios

El archivo `src/api.js` inyecta automáticamente el JWT en todos los requests:

```javascript
Authorization: Bearer <token_from_zustand>
```

Si el token expira (401), automáticamente limpia la sesión.

## 5️⃣ Backend Esperado

El backend debe tener estos endpoints:

### POST /api/Auth/google
```javascript
// Request
{
  token: "google_oauth_token"
}

// Response
{
  user: {
    id: "uuid",
    name: "John Doe",
    email: "john@example.com",
    avatar: "url"
  },
  jwtToken: "eyJhbGciOiJIUzI1NiIs..."
}
```

### GET /api/Profile/stats
```javascript
// Response
{
  totalWins: 5,
  totalLosses: 2,
  totalDraws: 1,
  winRate: 0.625,
  matchHistory: [
    {
      date: "2024-02-19T10:30:00Z",
      opponentName: "Jane",
      yourSymbol: "X",
      result: "Win",
      durationSeconds: 120
    }
  ]
}
```

### SignalR Hub: /gamehub

#### Eventos que el Frontend **Escucha**:
- `GameStarted`: { matchId, currentTurn, yourSymbol, opponent }
- `MoveMade`: { position, symbol, nextTurn }
- `GameOver`: { winner } // 'X', 'O', o 'Draw'

#### Métodos que el Frontend **Invoca**:
- `FindMatch()`: Busca un oponente
- `MakeMove(position, symbol)`: Realiza una jugada

## 6️⃣ Verificar que todo funcione

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env.local con tus valores
cp .env.example .env.local
# Editar VITE_GOOGLE_CLIENT_ID y VITE_API_BASE_URL

# 3. Ejecutar frontend
npm run dev
# Debería estar en http://localhost:5173

# 4. Verificar en consola del navegador
# - No debería haber errores de CORS
# - Debería poder hacer click en "Sign in with Google"
# - Después de login, debería conectarse a SignalR
```

## 🆘 Common Issues

### "Invalid Client ID"
- Verifica que copiaste correctamente el Client ID del Google Cloud Console
- Asegúrate que está en `.env.local` (no en `.env.example`)

### "CORS Error"
- El backend debe permitir requests desde `http://localhost:5173`
- Verifica la configuración de CORS en el backend

### "SignalR connection failed"
- Verifica que el backend está ejecutándose en `http://localhost:5000`
- Verifica que el JWT es válido (no expirado)
- Abre la consola del navegador para ver el error exacto

### "Google Login button not showing"
- Verifica que `VITE_GOOGLE_CLIENT_ID` está correcto
- Asegúrate que `main.jsx` tiene el `GoogleOAuthProvider` wrapeando el `App`

## 📚 Recursos

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [SignalR JavaScript Client](https://learn.microsoft.com/en-us/aspnet/core/signalr/javascript-client)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)
