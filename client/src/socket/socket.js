import { io } from "socket.io-client";

/**
 * ==========================================================
 * FrameTogether
 * Socket.IO Client
 * ==========================================================
 *
 * Creates a single shared Socket.IO client
 * for the entire React application.
 *
 * Connects to the same origin serving the page (Vite),
 * which proxies /socket.io through to the Express server.
 * This works whether the page is loaded via localhost,
 * LAN IP, or an ngrok HTTPS URL — no hardcoded host needed.
 *
 * ==========================================================
 */

const socket = io(window.location.origin, {
  autoConnect: false,
  transports: ["polling", "websocket"], // allow polling fallback before upgrading
});

export default socket;