import {
    createRoom,
    getRoom
} from "../services/roomManager.js";
/**
 * ==========================================================
 * FrameTogether
 * Room Controller
 * ==========================================================
 *
 * Handles HTTP requests.
 *
 * Business logic belongs inside roomManager.js
 *
 * ==========================================================
 */
/**
 * POST
 *
 * /api/rooms/create
 */
export function createRoomController(req, res) {
    try {
        const {
            roomName,
            socketId
        } = req.body;
        if (!roomName) {
            return res.status(400).json({
                success: false,
                message: "Room name is required."
            });
        }
        const room = createRoom(
            roomName,
            socketId || null
        );
        return res.status(201).json({
            success: true,
            message: "Room created successfully.",
            room
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
/**
 * GET
 *
 * /api/rooms/:roomCode
 */
export function getRoomController(req, res) {
    try {
        const {
            roomCode
        } = req.params;
        const room = getRoom(roomCode);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found."
            });
        }
        return res.status(200).json({
            success: true,
            room
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}