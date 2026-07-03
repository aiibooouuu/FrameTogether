import EVENTS from "./events.js";
import {
    joinRoom,
    getRoom
} from "../services/roomManager.js";
/**
 * ==========================================================
 * FrameTogether
 * Room Socket
 * ==========================================================
 *
 * Handles:
 *
 * - Joining rooms
 * - Leaving rooms
 * - Updating participants
 *
 * ==========================================================
 */
export default function registerRoomSocket(io, socket) {
    /**
     * ==========================================
     * Join Room
     * ==========================================
     */
    socket.on(EVENTS.JOIN_ROOM, ({ roomCode, username }) => {

        console.log("=================================");
        console.log("JOIN_ROOM EVENT");
        console.log("Socket:", socket.id);
        console.log("Room:", roomCode);
        console.log("Username:", username);
        console.log("Current Room:", getRoom(roomCode));
        console.log("=================================");
        try {
            const room = joinRoom(
                roomCode,
                socket.id,
                username
            );
            console.log("Users after join:");
            console.table(room.users);
            socket.join(roomCode);
            socket.data.roomCode = roomCode;
            socket.data.username = username || "Guest";
            io.to(roomCode).emit(
                EVENTS.PARTICIPANTS_UPDATED,
                {
                    roomCode,
                    participants: room.users
                }
            );
            socket.emit(
                EVENTS.ROOM_JOINED,
                room
            );
            socket.to(roomCode).emit(
                EVENTS.PARTICIPANT_JOINED,
                {
                    username: socket.data.username
                }
            );
            console.log(`${socket.data.username} joined ${roomCode}`);
        } catch (error) {
            console.error("JOIN_ROOM ERROR:", error);
            socket.emit(
                EVENTS.ROOM_ERROR,
                {
                    message: error.message
                }
            );
        }
    });
    /**
     * ==========================================
     * Leave Room
     * ==========================================
     */
    socket.on(EVENTS.LEAVE_ROOM, () => {
        const roomCode = socket.data.roomCode;
        if (!roomCode) return;
        socket.leave(roomCode);
        socket.to(roomCode).emit(
            EVENTS.PARTICIPANT_LEFT,
            {
                username: socket.data.username
            }
        );
        console.log(
            `${socket.data.username} left ${roomCode}`
        );
    });
    /**
     * ==========================================
     * Disconnect
     * ==========================================
     */
    socket.on(EVENTS.DISCONNECT, () => {
        const roomCode = socket.data.roomCode;
        if (!roomCode) return;
        socket.leave(roomCode);
        socket.to(roomCode).emit(
            EVENTS.PARTICIPANT_LEFT,
            {
                username: socket.data.username
            }
        );
        console.log(
            `${socket.data.username} disconnected`
        );
    });
}