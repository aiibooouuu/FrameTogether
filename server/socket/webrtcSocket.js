import EVENTS from "./events.js";

/**
 * ==========================================================
 * FrameTogether
 * WebRTC Socket
 * ==========================================================
 *
 * Pure signaling relay. This server never inspects offers,
 * answers, or ICE candidates — it just forwards them to the
 * other participant in the room. All negotiation logic lives
 * on the client (useWebRTC.js).
 *
 * ==========================================================
 */
export default function registerWebRTCSocket(io, socket) {
    socket.on(EVENTS.OFFER, ({ roomCode, offer }) => {
            if (!roomCode || !offer) return;
            console.log(`OFFER relayed in ${roomCode} from ${socket.id}`);
            socket.to(roomCode).emit(EVENTS.OFFER, {
            offer,
            from: socket.id,
        });
    });

    socket.on(EVENTS.ANSWER, ({ roomCode, answer }) => {
        if (!roomCode || !answer) return;
        console.log(`ANSWER relayed in ${roomCode} from ${socket.id}`);
        socket.to(roomCode).emit(EVENTS.ANSWER, {
            answer,
            from: socket.id,
            });
    });

    socket.on(EVENTS.ICE_CANDIDATE, ({ roomCode, candidate }) => {
        if (!roomCode || !candidate) return;
        socket.to(roomCode).emit(EVENTS.ICE_CANDIDATE, {
            candidate,
            from: socket.id,
            });
    });
}