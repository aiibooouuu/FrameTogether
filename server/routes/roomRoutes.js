import express from "express";

import {
    createRoomController,
    getRoomController
} from "../controllers/roomController.js";

/**
 * ==========================================================
 * FrameTogether
 * Room Routes
 * ==========================================================
 *
 * Maps HTTP routes to controller functions.
 *
 * ==========================================================
 */

const router = express.Router();

/**
 * Create a new room
 *
 * POST
 * /api/rooms/create
 */

router.post(
    "/create",
    createRoomController
);

/**
 * Get room information
 *
 * GET
 * /api/rooms/:roomCode
 */

router.get(
    "/:roomCode",
    getRoomController
);

export default router;