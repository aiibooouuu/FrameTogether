import EVENTS from "./events.js";

import {
    getRoom,
    getSession,
    updateSession,
    updateSessionState,
    lockSession,
    saveCaptureFrame,
    resetCaptures,
    unlockSession,
    nextPhoto,
    finishSession,
    setCountdownValue
} from "../services/roomManager.js";

/**
 * ==========================================================
 * FrameTogether
 * Session Socket
 * ==========================================================
 *
 * Handles:
 *
 * ✔ Session Synchronization (filter/timer/layout/photoCount)
 * ✔ Lock / Start
 * ✔ Server-owned Countdown
 * ✔ Shared Capture + Preview
 * ✔ Session Completion
 *
 * ==========================================================
 */

export default function registerSessionSocket(io, socket) {

    socket.on(
        EVENTS.SESSION_UPDATE,
        ({ roomCode, key, value }) => {
            const session = updateSession(roomCode, key, value);
            if (!session) return;
            io.to(roomCode).emit(EVENTS.SESSION_STATE, session);
        }
    );

    /**
     * ==========================================
     * Lock Session — freezes settings, starts flow
     * ==========================================
     */
    socket.on(
        EVENTS.SESSION_LOCKED,
        ({ roomCode }) => {
            const currentSession = getSession(roomCode);
            if (!currentSession) return;
            if (currentSession.locked) return;

            resetCaptures(roomCode);

            const session = lockSession(roomCode, socket.id);

            io.to(roomCode).emit(EVENTS.SESSION_STATE, session);
            io.to(roomCode).emit(EVENTS.SESSION_LOCKED, {
                roomCode,
                startedBy: socket.id
            });
            io.to(roomCode).emit(EVENTS.SESSION_STARTED, { roomCode });

            startCountdown(io, roomCode);
        }
    );

    /**
     * ==========================================
     * Photo Captured
     * ==========================================
     *
     * Each device sends its own frame for the
     * *current* photo slot. The server figures out
     * whether the sender is host or guest — clients
     * never get to declare their own role.
     *
     * Once both frames for a slot are in, the server
     * advances the session and either starts the next
     * countdown or marks the session complete.
     *
     * ==========================================
     */
    socket.on(
        EVENTS.PHOTO_CAPTURED,
        ({ roomCode, image }) => {
            const room = getRoom(roomCode);
            const session = getSession(roomCode);
            if (!room || !session) return;

            const index = session.currentPhoto;
            const role = room.host === socket.id ? "host" : "guest";

            const capture = saveCaptureFrame(roomCode, index, role, image);
            if (!capture) return;

            /*
            --------------------------------------
            Broadcast partial or full progress —
            lets the other device show "waiting on
            partner" even before both are in.
            --------------------------------------
            */
            io.to(roomCode).emit(EVENTS.PREVIEW_UPDATED, {
                roomCode,
                index,
                capture
            });

            const bothCaptured = Boolean(capture.host) && Boolean(capture.guest);
            if (!bothCaptured) return;

            const updatedSession = nextPhoto(roomCode);
            io.to(roomCode).emit(EVENTS.SESSION_STATE, updatedSession);

            const isDone = updatedSession.currentPhoto >= updatedSession.photoCount;

            if (isDone) {
                finishSession(roomCode);
                io.to(roomCode).emit(EVENTS.SESSION_STATE, getSession(roomCode));
                io.to(roomCode).emit(EVENTS.SESSION_COMPLETED, { roomCode });
                return;
            }

            startCountdown(io, roomCode);
        }
    );

    socket.on(
        EVENTS.PHOTO_RETAKE,
        ({ roomCode }) => {
            const session = getSession(roomCode);
            if (!session) return;

            resetCaptures(roomCode);
            setCountdownValue(roomCode, null);
            unlockSession(roomCode);

            io.to(roomCode).emit(EVENTS.SESSION_STATE, getSession(roomCode));
            io.to(roomCode).emit(EVENTS.PHOTO_RETAKE, { roomCode });
        }
    );

    socket.on(
        EVENTS.SESSION_STATE,
        ({ roomCode }) => {
            const session = getSession(roomCode);
            if (!session) return;
            socket.emit(EVENTS.SESSION_STATE, session);
        }
    );
}

/**
 * ==========================================================
 * Countdown Sequence
 * ==========================================================
 *
 * Server owns time. Clients only render whatever number
 * they're told to render.
 *
 * ==========================================================
 */
function startCountdown(io, roomCode) {
    const session = getSession(roomCode);
    if (!session) return;

    let count = session.timer;

    updateSessionState(roomCode, "countdown");
    setCountdownValue(roomCode, count);
    io.to(roomCode).emit(EVENTS.SESSION_STATE, session);
    io.to(roomCode).emit(EVENTS.COUNTDOWN_START, { roomCode, timer: count });

    const tick = () => {
        setCountdownValue(roomCode, count);
        io.to(roomCode).emit(EVENTS.SESSION_STATE, getSession(roomCode));
        io.to(roomCode).emit(EVENTS.COUNTDOWN_TICK, { roomCode, count });

        if (count <= 1) {
            setTimeout(() => {
                setCountdownValue(roomCode, null);
                io.to(roomCode).emit(EVENTS.SESSION_STATE, getSession(roomCode));
                io.to(roomCode).emit(EVENTS.COUNTDOWN_FINISHED, { roomCode });
                updateSessionState(roomCode, "capturing");
                io.to(roomCode).emit(EVENTS.CAPTURE_TRIGGER, { roomCode });
            }, 1000);
            return;
        }

        count -= 1;
        setTimeout(tick, 1000);
    };

    tick();
}