// Frontend Configuration module
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const isDevServer = isLocalhost && window.location.port !== '3000' && window.location.port !== '80';

export const API_BASE = isDevServer 
    ? 'http://localhost:8080/api/v1' 
    : '/api/v1';

export const WS_BASE = isDevServer 
    ? 'http://localhost:8080/ws' 
    : '/ws';
