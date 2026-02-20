import { create } from 'zustand';
import * as signalR from '@microsoft/signalr';

/**
 * Store global de Zustand para manejar:
 * - Sesión (usuario y token JWT)
 * - Estado del juego (matchId, tablero, turno, oponente)
 * - Conexión y eventos de SignalR
 */
export const useGameStore = create((set, get) => ({
  // ===== SESIÓN =====
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
   * Se ejecuta después de obtener el JWT
   */
  connectToHub: async () => {
    const { token } = get();
    if (!token) {
      console.error('No hay token para conectar al hub');
      return;
    }

    try {
      const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/gamehub`,
          {
            accessTokenFactory: () => token
          }
        )
        .withAutomaticReconnect()
        .build();

      // Evento: Partida iniciada
      hubConnection.on('GameStarted', (data) => {
        console.log('GameStarted event received:', data);
        set({
          matchId: data.matchId,
          board: Array(9).fill(null),
          currentTurn: data.currentTurn,
          playerSymbol: data.yourSymbol,
          opponent: data.opponent,
          gameStatus: 'playing',
          winner: null
        });
      });

      // Evento: Jugada realizada
      hubConnection.on('MoveMade', (data) => {
        console.log('MoveMade event received:', data);
        const { board } = get();
        const newBoard = [...board];
        newBoard[data.position] = data.symbol;
        set({
          board: newBoard,
          currentTurn: data.nextTurn
        });
      });

      // Evento: Partida finalizada
      hubConnection.on('GameOver', (data) => {
        console.log('GameOver event received:', data);
        set({
          gameStatus: 'finished',
          winner: data.winner
        });
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
  makeMove: (position) => {
    const { hubConnection, currentTurn, playerSymbol } = get();
    if (!hubConnection || currentTurn !== playerSymbol) {
      console.error('No puedes hacer una jugada en este momento');
      return;
    }
    hubConnection.invoke('MakeMove', {
      position,
      symbol: playerSymbol
    }).catch(err => console.error('Error making move:', err));
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
}));
