import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as signalR from '@microsoft/signalr';

/**
 * Store global de Zustand para manejar:
 * - Sesión (usuario y token JWT)
 * - Estado del juego (matchId, tablero, turno, oponente)
 * - Conexión y eventos de SignalR
 */
export const useGameStore = create(
  persist(
    (set, get) => ({  // ===== SESIÓN =====
  user: null,
  token: null,

  // ===== ESTADO DEL JUEGO =====
  matchId: null,
  board: Array(9).fill(null), // Tablero 3x3 plano (índices 0-8)
  currentTurn: null, // 'X' o 'O'
  playerSymbol: null, // Símbolo del jugador actual ('X' o 'O')
  opponent: null, // Datos del oponente
  gameStatus: null, // 'waiting', 'playing', 'finished'
  winner: null,
  stats: null, // Estadísticas del usuario

  // ===== SIGNALR CONNECTION =====
  hubConnection: null,
  isConnected: false,

  /**
   * Acciones de autenticación
   */
  setAuth: (user, token) => {
    set({ user, token });
  },

  logout: () => {
    const { hubConnection } = get();
    if (hubConnection) {
      hubConnection.stop();
    }
    set({
      user: null,
      token: null,
      matchId: null,
      board: Array(9).fill(null),
      currentTurn: null,
      playerSymbol: null,
      opponent: null,
      gameStatus: null,
      winner: null,
      hubConnection: null,
      isConnected: false
    });
  },

/**
   * Conectar al hub de SignalR
   */
  connectToHub: async () => {
      const { token } = get();
      if (!token) {
        console.error('No hay token para conectar al hub');
        return;
      }

      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        
        const hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(`${backendUrl}/gamehub?access_token=${token}`)
          .withAutomaticReconnect()
          .build();

        // 1. Escuchar cuando encontramos rival
        hubConnection.on('GameStarted', (data) => {
          set({
            matchId: data.matchId,
            board: Array(9).fill(null),
            currentTurn: 'X', // Siempre empieza la X
            playerSymbol: 'X', // Dato temporal
            gameStatus: 'playing',
            winner: null
          });
        });

        // 2. Escuchar cuando alguien hace un movimiento
        hubConnection.on('MoveMade', (data) => {
          console.log('MoveMade event received:', data);
          const { board } = get();
          const newBoard = [...board];
          
          // Convertimos fila/columna devuelta por C# al índice plano de React
          const index = (data.row * 3) + data.col; 
          
          // TRUCO: Deducimos si es X o O contando los movimientos actuales
          const movesCount = newBoard.filter(c => c !== null).length;
          const playedSymbol = movesCount % 2 === 0 ? 'X' : 'O';

          newBoard[index] = playedSymbol;
          
          set({
            board: newBoard,
            currentTurn: playedSymbol === 'X' ? 'O' : 'X' // Pasamos el turno al siguiente
          });
        });

        // 3. Escuchar cuando termina la partida
        hubConnection.on('GameOver', (data) => {
          console.log('GameOver event received:', data);
          set({
            gameStatus: 'finished',
            winner: data.winnerId
          });
        });

        // 4. (Opcional) Escuchar cuando entras a la sala de espera
        hubConnection.on('WaitingForOpponent', (msg) => {
          console.log(msg);
        });

        await hubConnection.start();
        set({ hubConnection, isConnected: true });
        console.log('SignalR connection established');
      } catch (error) {
        console.error('Error connecting to SignalR hub:', error);
      }
    },

  /**
   * Desconectar del hub de SignalR
   */
  disconnectFromHub: async () => {
    const { hubConnection } = get();
    if (hubConnection) {
      await hubConnection.stop();
      set({ hubConnection: null, isConnected: false });
    }
  },

  /**
   * Enviar una jugada al servidor mediante SignalR
   */
  makeMove: (index) => {
    const { hubConnection, currentTurn, playerSymbol, matchId } = get();
    
    // (Descomenta esta validación cuando implementes los turnos)
    // if (!hubConnection || currentTurn !== playerSymbol) {
    //  console.error('No puedes hacer una jugada en este momento');
    //  return;
    // }

    // Convertimos el índice plano de React (0-8) a fila (0-2) y columna (0-2)
    const row = Math.floor(index / 3);
    const col = index % 3;

    // Llamamos a MakeMove en C#
    hubConnection.invoke('MakeMove', matchId, row, col)
      .catch(err => console.error('Error making move:', err));
  },

  /**
   * Buscar una partida (emitir evento al servidor)
   */
  findMatch: () => {
    const { hubConnection } = get();
    if (!hubConnection) {
      console.error('No connection to hub');
      return;
    }
    
    set({ gameStatus: 'waiting' });
    hubConnection.invoke('FindMatch').catch(err => console.error('Error finding match:', err));
  },

  /**
   * Cargar estadísticas del perfil
   */
  setStats: (stats) => {
    set({ stats });
  }
}),
    {
      name: 'tateti-auth-storage', // El nombre de la key en el localStorage
      // 3. ¡LA MAGIA!: Le decimos a Zustand que SOLO guarde el user y el token
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token 
      }),
    }
  )
);
