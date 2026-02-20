# 📡 Backend API Examples

Este archivo contiene ejemplos de las respuestas esperadas del backend para que el frontend sea compatible.

## 1. POST /api/Auth/google

**Request:**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjExZjY1ZWRmYTJhN..."
}
```

**Response (Success - 200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Juan García",
    "email": "juan.garcia@example.com",
    "avatar": "https://lh3.googleusercontent.com/a/default-user-avatar"
  },
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJuYW1lIjoiSnVhbiBHYXLDrWEiLCJlbWFpbCI6Imp1YW4uZ2FyY2lhQGV4YW1wbGUuY29tIiwiaWF0IjoxNjA5NDU5MjAwLCJleHAiOjE2MDk1NDU2MDB9.signature"
}
```

**Response (Error - 400):**
```json
{
  "message": "Invalid Google token"
}
```

## 2. GET /api/Profile/stats

**Headers Required:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "totalWins": 8,
  "totalLosses": 3,
  "totalDraws": 2,
  "winRate": 0.6666666666666666,
  "matchHistory": [
    {
      "matchId": "550e8400-e29b-41d4-a716-446655440000",
      "date": "2024-02-19T14:30:00Z",
      "opponentName": "Ana López",
      "yourSymbol": "X",
      "result": "Win",
      "durationSeconds": 245
    },
    {
      "matchId": "550e8400-e29b-41d4-a716-446655440001",
      "date": "2024-02-18T10:15:00Z",
      "opponentName": "Carlos Martín",
      "yourSymbol": "O",
      "result": "Loss",
      "durationSeconds": 189
    },
    {
      "matchId": "550e8400-e29b-41d4-a716-446655440002",
      "date": "2024-02-17T22:45:00Z",
      "opponentName": "María Rodríguez",
      "yourSymbol": "X",
      "result": "Draw",
      "durationSeconds": 156
    }
  ]
}
```

**Response (Unauthorized - 401):**
```json
{
  "message": "Unauthorized"
}
```

## 3. SignalR Hub: /gamehub

### 3.1 FindMatch (Invoke)

**Frontend invoca:**
```javascript
hubConnection.invoke('FindMatch').catch(err => console.error(err));
```

**Backend responde con evento:**
El backend debe emitir el evento `GameStarted` cuando encuentre un oponente.

### 3.2 GameStarted (Recibido)

**Payload enviado por el backend:**
```json
{
  "matchId": "550e8400-e29b-41d4-a716-446655440000",
  "currentTurn": "X",
  "yourSymbol": "X",
  "opponent": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Laura Pérez",
    "avatar": "https://lh3.googleusercontent.com/a/default-user-avatar"
  }
}
```

**Acciones en el frontend:**
- Se actualiza `matchId` en el store
- Se establece el turno inicial
- Se asigna el símbolo ('X' u 'O')
- Se navega automáticamente al componente `Board`

### 3.3 MakeMove (Invoke)

**Frontend invoca:**
```javascript
hubConnection.invoke('MakeMove', {
  position: 0,        // 0-8 (tablero 3x3 plano)
  symbol: "X"
}).catch(err => console.error(err));
```

### 3.4 MoveMade (Recibido)

**Payload enviado por el backend:**
```json
{
  "position": 0,
  "symbol": "X",
  "nextTurn": "O"
}
```

**Acciones en el frontend:**
- Se actualiza la posición en el tablero
- Se cambia el turno
- Si `nextTurn !== playerSymbol`, el usuario espera

### 3.5 GameOver (Recibido)

**Payload cuando alguien gana:**
```json
{
  "winner": "X"
}
```

**Payload en caso de empate:**
```json
{
  "winner": "Draw"
}
```

**Acciones en el frontend:**
- Se establece `gameStatus` a 'finished'
- Se muestra el resultado (Win/Loss/Draw)
- El botón del tablero se desactiva
- Se redirige al usuario a Dashboard después de un tiempo

## 4. Error Handling

Todos los endpoints pueden retornar errores comunes:

**400 Bad Request:**
```json
{
  "message": "Invalid request",
  "errors": {
    "token": ["Token is required"]
  }
}
```

**401 Unauthorized:**
```json
{
  "message": "Token is invalid or expired"
}
```

**403 Forbidden:**
```json
{
  "message": "You don't have permission to access this resource"
}
```

**500 Internal Server Error:**
```json
{
  "message": "An error occurred while processing your request"
}
```

## 5. Notas Importantes

1. **JWT Token**: El token debe incluir al menos:
   - `sub` (subject): User ID
   - `exp` (expiration): Timestamp de expiración
   - `email`: Email del usuario

2. **SignalR Connection**: El token se pasa con el query parameter o header en la URL:
   ```javascript
   {
     accessTokenFactory: () => token
   }
   ```

3. **Reconnection**: El cliente SignalR intentará reconectarse automáticamente si la conexión se pierde.

4. **Concurrency**: El backend debe asegurar que:
   - Solo un jugador pueda hacer una jugada por turno
   - Los movimientos sean válidos (celda vacía)
   - La partida termina cuando hay ganador o el tablero está lleno

5. **Match Timeout**: Se recomienda que el backend implemente un timeout (ej: 5 minutos) para partidas inactivas.

## 6. Validación en Frontend

El store de Zustand valida:
- ✅ No permitir mover si no es tu turno
- ✅ Solo actualizar tablero con movimientos válidos
- ✅ Mostrar estado "waiting" mientras esperas oponente
- ✅ Mostrar errores de conexión en la consola

El backend debe validar:
- ✅ Que la posición sea 0-8
- ✅ Que la celda esté vacía
- ✅ Que sea el turno del jugador actual
- ✅ Que el token sea válido
