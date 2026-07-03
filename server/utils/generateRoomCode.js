import rooms from "../memory/rooms.js";

/**
 * ==========================================================
 * FrameTogether
 * Room Code Generator
 * ==========================================================
 *
 * Generates unique room codes for every booth.
 *
 * Example:
 *
 * FT-7K2A-XP
 * FT-A91L-QM
 * FT-Z8BX-KT
 *
 * The function checks the in-memory room store
 * to guarantee that every generated code is unique.
 *
 * ==========================================================
 */

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * Generates a random alphanumeric string.
 *
 * @param {number} length
 * @returns {string}
 */

function randomBlock(length) {
let result = "";
for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
    result += CHARACTERS[randomIndex];
}
return result;
}
/**
 * Generates a room code.
 *
 * Format:
 *
 * FT-AB12-CD
 *
 * @returns {string}
 */
function createRoomCode() {
return `FT-${randomBlock(4)}-${randomBlock(2)}`;
}

/**
 * Generates a UNIQUE room code.
 *
 * Keeps generating until a code
 * doesn't already exist.
 *
 * @returns {string}
 */

export default function generateRoomCode() {
let roomCode;
do {
    roomCode = createRoomCode();
} while (rooms.has(roomCode));
return roomCode;
}