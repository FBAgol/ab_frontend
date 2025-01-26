// socket.ts oder in deinem Store
import { io } from 'socket.io-client';
import { tokenStore } from './tockenStorage';  // Importiere den tokenStore

export const initializeSocket = async () => {
  const tStore = tokenStore();  // Instanziiere den tokenStore
  const token = tStore.tocken;  // Hol das Token aus dem Pinia Store

  if (!token) {
    console.error('Kein Auth-Token gefunden!');
    return;
  }

  // WebSocket-Verbindung mit dem Token
  const socket = io('http://localhost:8000', {
    auth: {
      token: token,  // Auth-Token an den Server senden
    },
  });

  return socket;
};
