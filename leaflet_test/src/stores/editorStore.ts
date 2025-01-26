import { ref } from 'vue';
import { defineStore } from 'pinia';
import { initializeSocket } from '@/stores/socket';  // Importiere die initializeSocket-Funktion

export const editorStore = defineStore('editor', () => {
    const companyName = ref<string>('');
    const projects = ref<string[]>([]);
    const companyEditorEmail = ref<string>('');
    const telekomEditorNotifications = ref<any[]>([]);  // Benachrichtigungen als Array von Objekten

    let socket: any = null;

    // Methode zum Hinzufügen einer neuen Benachrichtigung
    const addNotification = (notification: any) => {
        const exists = telekomEditorNotifications.value.some(
            (n) => n.id === notification.id  // Vergleiche anhand einer eindeutigen ID
        );
        if (!exists) {
            telekomEditorNotifications.value.push(notification);
        }
    };

    // WebSocket-Event-Listener initialisieren
    const initializeSocketListener = async () => {
        if (!socket) {  // Prüfen, ob der Socket bereits existiert
            socket = await initializeSocket();  // Socket initialisieren
            socket.on('notification', (data: any) => {
                addNotification(data);  // Benachrichtigung hinzufügen
            });
        }
    };

    // Methode zum Entfernen des Event-Listeners
    const cleanupSocketListener = () => {
        if (socket) {
            socket.off('notification');  // Listener entfernen
            socket.disconnect();         // Verbindung schließen
            socket = null;               // Referenz zurücksetzen
        }
    };

    return {
        companyName,
        projects,
        companyEditorEmail,
        telekomEditorNotifications,
        addNotification,
        initializeSocketListener,
        cleanupSocketListener,
    };
});
