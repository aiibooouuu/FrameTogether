import rooms from "../memory/rooms.js";
import generateRoomCode from "../utils/generateRoomCode.js";

/**
 * ==========================================================
 * FrameTogether
 * Room Manager
 * ==========================================================
 */

export function createRoom(roomName, socketId) {
    const roomCode = generateRoomCode();
    const room = {
        roomCode,
        roomName,
        createdAt: Date.now(),
        status: "waiting",
        host: null,
        users: [],
        captures: [],
        selectedLayout: null,
        sessionFinished: false,
        session: {
            state: "waiting",
            locked: false,
            startedBy: null,
            timer: 3,
            countdownValue: null,
            filter: "classic",
            layout: "polaroid",
            photoCount: 4,
            currentPhoto: 0
        }
    };
    rooms.set(roomCode, room);
    return room;
}

export function setCountdownValue(roomCode, value) {
    const room = rooms.get(roomCode);
    if (!room) return null;
    room.session.countdownValue = value;
    return room.session;
}

export function joinRoom(roomCode, socketId, username = "Guest") {
    const room = rooms.get(roomCode);
    if (!room) throw new Error("Room not found");
    if (room.users.length >= 2) throw new Error("Room is full");
    if (room.users.length === 0) {
        room.host = socketId;
    }
    room.users.push({ socketId, name: username, ready: false, connected: true });
    room.status = "connected";
    return room;
}

export function leaveRoom(roomCode, socketId) {
    const room = rooms.get(roomCode);
    if (!room) return;
    room.users = room.users.filter((user) => user.socketId !== socketId);
    if (room.users.length === 0) {
        rooms.delete(roomCode);
        return;
    }
    room.status = "waiting";
}

export function getRoom(roomCode) {
    return rooms.get(roomCode);
}

export function roomExists(roomCode) {
    return rooms.has(roomCode);
}

export function getSession(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return null;
    return room.session;
}

export function updateSession(roomCode, key, value) {
    const room = rooms.get(roomCode);
    if (!room) return null;
    room.session[key] = value;
    return room.session;
}

export function updateSessionState(roomCode, state) {
    const room = rooms.get(roomCode);
    if (!room) return null;
    room.session.state = state;
    return room.session;
}

export function lockSession(roomCode, socketId) {
    const room = rooms.get(roomCode);
    if (!room) return null;
    if (room.session.locked) return null;
    room.session.locked = true;
    room.session.startedBy = socketId;
    room.session.state = "locked";
    return room.session;
}

export function unlockSession(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return null;
    room.session.locked = false;
    room.session.startedBy = null;
    room.session.state = "waiting";
    room.session.currentPhoto = 0;
    room.captures = [];
    room.sessionFinished = false;
    return room.session;
}

export function nextPhoto(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return null;
    room.session.currentPhoto++;
    return room.session;
}

export function markReady(roomCode, socketId) {
    const room = rooms.get(roomCode);
    if (!room) return;
    const user = room.users.find((user) => user.socketId === socketId);
    if (!user) return;
    user.ready = true;
}

export function everyoneReady(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return false;
    if (room.users.length !== 2) return false;
    return room.users.every((user) => user.ready);
}

/**
 * ==========================================================
 * Captures
 * ==========================================================
 *
 * captures: [
 *   { index: 0, host: null, guest: null }
 * ]
 *
 * One entry per photo slot. Filled in as each participant's
 * camera submits its frame for that slot.
 *
 * ==========================================================
 */

export function saveCaptureFrame(roomCode, index, role, image) {
    const room = rooms.get(roomCode);
    if (!room) return null;

    if (!room.captures[index]) {
        room.captures[index] = { index, host: null, guest: null };
    }

    room.captures[index][role] = image;
    return room.captures[index];
}

export function resetCaptures(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return;
    room.captures = [];
}

export function finishSession(roomCode) {
    const room = rooms.get(roomCode);
    if (!room) return;
    room.sessionFinished = true;
    room.session.state = "finished";
}