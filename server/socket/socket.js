import { Server } from "socket.io";

import EVENTS from "./events.js";

import registerRoomSocket from "./roomSocket.js";
import registerChatSocket from "./chatSocket.js";
import registerWebRTCSocket from "./webrtcSocket.js";
import registerSessionSocket from "./sessionSocket.js";
/**
 * ==========================================================
 * FrameTogether
 * Socket.IO Initializer
 * ==========================================================
 *
 * Creates the Socket.IO server
 * and registers every socket module.
 *
 * ==========================================================
 */
export default function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.on(EVENTS.CONNECTION, (socket) => {
        console.log(`🟢 Socket Connected : ${socket.id}`);
        /*
        ==========================================
        Register socket modules
        ==========================================
        */
        registerRoomSocket(io, socket);
        registerChatSocket(io, socket);
        registerWebRTCSocket(io, socket);
        registerSessionSocket(io, socket);
        /*
        ==========================================
        Disconnect
        ==========================================
        */
        socket.on(EVENTS.DISCONNECT, () => {
            console.log(`🔴 Socket Disconnected : ${socket.id}`);
        });
    });
    return io;
}