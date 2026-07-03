import API_BASE_URL from "./api";

/**
 * ==========================================================
 * FrameTogether
 * Room API
 * ==========================================================
 *
 * Handles all communication between the React frontend
 * and the Express backend.
 *
 * Endpoints
 *
 * POST /rooms/create
 * GET  /rooms/:roomCode
 *
 * ==========================================================
 */


/**
 * Create a room
 */

export async function createRoom(roomName) {

    try {

        const response = await fetch(

            `${API_BASE_URL}/rooms/create`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    roomName

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        return data;

    }

    catch (error) {

        console.error(error);

        throw error;

    }

}


/**
 * Get Room
 */

export async function getRoom(roomCode) {

    try {

        const response = await fetch(

            `${API_BASE_URL}/rooms/${roomCode}`

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        return data;

    }

    catch (error) {

        console.error(error);

        throw error;

    }

}