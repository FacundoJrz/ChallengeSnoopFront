# ⚡ Quick Start Guide

Sigue estos pasos para tener la aplicación funcionando en 5 minutos.

## 📋 Pre-requisitos
- Node.js 18+ instalado
- Google Cloud Account (para OAuth)
- Backend ejecutándose en `http://localhost:5000`

## 🚀 Pasos de Configuración

### 1. Instalar dependencias (30 segundos)
```bash
npm install
```

### 2. Configurar Google OAuth (3 minutos)
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto: **"Ta-Te-Ti Arena"**
3. Ve a **APIs & Services** > **Library** y habilita **Google+ API**
4. Ve a **Credentials** > **Create Credentials** > **OAuth 2.0 Client ID**
   - Tipo: Web application
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: (puede dejar vacío)
5. Copia el **Client ID**

### 3. Crear archivo `.env.local` (1 minuto)
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```env
VITE_GOOGLE_CLIENT_ID=your_client_id_from_google_console
VITE_API_BASE_URL=http://localhost:5000
```

⚠️ **Importante**: Reemplaza `your_client_id_from_google_console` con tu Client ID real.

### 4. Ejecutar frontend (15 segundos)
```bash
npm run dev
```

Abirá automáticamente en `http://localhost:5173`

## ✅ Verificar que todo funcione

### En el navegador:
1. La página debería mostrar "Ta-Te-Ti Arena" con un botón de Google
2. Haz click en "Sign in with Google"
3. Selecciona tu cuenta Google
4. Deberías ver el Dashboard con tu perfil y botón "Find Match"

### En la consola del navegador (F12):
```javascript
// Debería mostrar
"SignalR connection established"

// Si hay error, verás
"Error connecting to SignalR hub:"
```

## 📁 Estructura de archivos clave

```
src/
├── api.js                      # Axios + interceptor de JWT
├── store/useGameStore.js       # Zustand store (sesión + juego)
├── components/
│   ├── Login.jsx              # Pantalla de login
│   ├── Dashboard.jsx          # Perfil + estadísticas
│   └── Board.jsx              # Tablero 3x3
└── App.jsx                    # Router lógico
```

## 🎮 Cómo jugar

1. **Login**: Inicia sesión con tu cuenta Google
2. **Dashboard**: Haz click en "Find Match" para buscar oponente
3. **Board**: Cuando encuentres oponente, aparecerá el tablero
4. **Jugar**: Haz click en las celdas vacías para colocar tu símbolo
5. **Resultado**: Al ganar/perder/empatar, verás el resultado

## 🔧 Estructura del código

### Store de Zustand (`useGameStore.js`)
- **Estado**: Usuario, token, matchId, tablero, turno, oponente
- **Acciones**: `setAuth()`, `logout()`, `connectToHub()`, `makeMove()`, `findMatch()`
- **Eventos SignalR**: `GameStarted`, `MoveMade`, `GameOver`

### Interceptor de Axios (`api.js`)
- Inyecta JWT automáticamente en todas las peticiones
- Limpia sesión si token expira (401)

### Componentes
- **Login.jsx**: Botón Google OAuth → envía token → obtiene JWT
- **Dashboard.jsx**: Perfil + estadísticas + botón buscar partida
- **Board.jsx**: Tablero 3x3 interactivo + información del turno

## 🐛 Troubleshooting

### "Invalid Client ID"
```
✗ El Client ID no es correcto
✓ Verifica que copiaste bien el ID del Google Cloud Console
✓ Asegúrate que `.env.local` tiene el valor correcto
✓ Recarga la página (Ctrl+R o Cmd+R)
```

### "Failed to fetch" en login
```
✗ El backend no está respondiendo
✓ Verifica que backend está corriendo en http://localhost:5000
✓ Verifica que VITE_API_BASE_URL es correcto en .env.local
```

### "SignalR connection failed"
```
✗ No se puede conectar al hub
✓ Verifica que backend tiene el hub en /gamehub
✓ Verifica que el JWT es válido
✓ Abre F12 > Console para ver el error exacto
```

### Botón Google no aparece
```
✗ El GoogleOAuthProvider no está configurado
✓ Verifica que main.jsx tiene GoogleOAuthProvider
✓ Verifica que VITE_GOOGLE_CLIENT_ID está en .env.local
✓ Asegúrate que reloadaste npm run dev
```

## 📚 Documentación detallada

- **SETUP.md**: Configuración completa de Google OAuth y SignalR
- **BACKEND_API_EXAMPLES.md**: Ejemplos de payloads esperados
- **README.md**: Documentación del proyecto

## 🎯 Próximos pasos

1. **Verificar conexión con backend**
   ```bash
   # En otra terminal, ejecuta el backend (.NET 8)
   ```

2. **Probar login**
   - Click en "Sign in with Google"
   - Selecciona tu cuenta

3. **Probar juego**
   - Find Match
   - Espera un oponente (en desarrollo, puedes usar dos navegadores)
   - Juega

4. **Ver estadísticas**
   - Las estadísticas se cargan del endpoint `GET /api/Profile/stats`

## 💡 Tips de Desarrollo

```bash
# Scripts útiles
npm run dev      # Desarrollo (hot reload)
npm run build    # Build para producción
npm run lint     # Revisar código
npm run preview  # Preview del build

# Ver el estado de Zustand (en consola)
import { useGameStore } from './store/useGameStore'
useGameStore.getState() // Ver estado completo
```

## ❓ ¿Necesitas ayuda?

1. Revisa los archivos SETUP.md y BACKEND_API_EXAMPLES.md
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que backend está ejecutándose
4. Asegúrate que .env.local tiene valores correctos

---

**¡Listo!** 🎉 Tu frontend de Ta-Te-Ti Arena está configurado.
