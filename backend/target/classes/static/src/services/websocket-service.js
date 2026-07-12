import { WS_BASE } from '../config.js';
import { AuthService } from './auth-service.js';
import { Toast } from '../components/toast.js';

let stompClient = null;
let reconnectDelay = 1000; // start with 1 second
const maxReconnectDelay = 10000; // max 10 seconds
let isConnected = false;
let subscriptions = new Map();

export const WebSocketService = {
    connect(onConnectedCallback) {
        if (isConnected) {
            if (onConnectedCallback) onConnectedCallback();
            return;
        }

        const token = AuthService.getToken();
        if (!token) {
            console.warn('Cannot connect to WebSocket: No JWT token found');
            return;
        }

        // Connect with SockJS, appending token to URL as fallback
        const socketUrl = `${WS_BASE}?token=${encodeURIComponent(token)}`;
        const socket = new SockJS(socketUrl);
        stompClient = Stomp.over(socket);
        
        // Suppress debug console logs from Stomp to keep console clean
        stompClient.debug = () => {};

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        stompClient.connect(headers, 
            (frame) => {
                isConnected = true;
                reconnectDelay = 1000; // Reset reconnect delay on successful connection
                console.log('WebSocket Connected Successfully');
                
                // Resubscribe to previous topics
                subscriptions.forEach((value, topic) => {
                    this.subscribe(topic, value.callback);
                });

                if (onConnectedCallback) onConnectedCallback();
            },
            (error) => {
                isConnected = false;
                console.error('WebSocket Error:', error);
                
                // Check if connection failed because token might be expired/invalid
                if (error && error.headers && error.headers.message && error.headers.message.toLowerCase().includes('expired')) {
                    Toast.show('Session expired. Logging out...', 'error');
                    AuthService.clearSession();
                    window.dispatchEvent(new CustomEvent('auth-expired'));
                    return;
                }

                // Retry connection with exponential backoff
                this.scheduleReconnect(onConnectedCallback);
            }
        );
    },

    scheduleReconnect(onConnectedCallback) {
        console.log(`WebSocket attempting reconnect in ${reconnectDelay / 1000} seconds...`);
        Toast.show(`Real-time engine disconnected. Retrying in ${reconnectDelay / 1000}s...`, 'warning');
        
        setTimeout(() => {
            reconnectDelay = Math.min(reconnectDelay * 2, maxReconnectDelay);
            this.connect(onConnectedCallback);
        }, reconnectDelay);
    },

    subscribe(topic, callback) {
        const existing = subscriptions.get(topic);
        if (existing && existing.stompSubscription) {
            existing.stompSubscription.unsubscribe();
        }

        let stompSubscription = null;
        if (isConnected && stompClient) {
            stompSubscription = stompClient.subscribe(topic, (message) => {
                try {
                    const payload = JSON.parse(message.body);
                    callback(payload);
                } catch (e) {
                    console.error('Error parsing WebSocket message payload:', e);
                }
            });
        }

        subscriptions.set(topic, { callback, stompSubscription });
    },

    unsubscribe(topic) {
        const existing = subscriptions.get(topic);
        if (existing && existing.stompSubscription) {
            existing.stompSubscription.unsubscribe();
        }
        subscriptions.delete(topic);
    },

    disconnect() {
        if (stompClient) {
            stompClient.disconnect(() => {
                isConnected = false;
                subscriptions.forEach((value) => {
                    if (value.stompSubscription) value.stompSubscription.unsubscribe();
                });
                subscriptions.clear();
                console.log('WebSocket Disconnected');
            });
        }
    }
};
