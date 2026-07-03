import EVENTS from "./events.js";
import crypto from "crypto";
/**
 * ==========================================================
 * FrameTogether
 * Chat Socket
 * ==========================================================
 */
export default function registerChatSocket(io, socket) {
    socket.on(EVENTS.SEND_MESSAGE, ({ roomCode, text, sender }) => {
        console.log("=================================");
        console.log("CHAT MESSAGE");
        console.log("Room:", roomCode);
        console.log("Sender:", sender);
        console.log("Text:", text);
        console.log("=================================");
        io.to(roomCode).emit(
            EVENTS.RECEIVE_MESSAGE,
            {
                id: crypto.randomUUID(),
                sender,
                text,
                time: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            }
        );
    });
}