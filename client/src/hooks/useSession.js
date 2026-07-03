import { useEffect, useState, useCallback } from "react";

import socket from "../socket/socket";
import EVENTS from "../socket/event";

/**
 * ==========================================================
 * FrameTogether
 * useSession Hook
 * ==========================================================
 *
 * Owns everything related to the synchronized booth session:
 *
 * ✔ Session state (filter, timer, layout, photoCount...)
 * ✔ Lock / Start
 * ✔ Server-driven countdown
 * ✔ Shared capture + preview (source of truth is the server)
 * ✔ Session completion
 *
 * Booth.jsx never computes time, decides when the session
 * starts, or maintains its own preview grid — it only reads
 * values from this hook and calls captureFrame() itself via
 * useWebRTC.
 *
 * ==========================================================
 */

const DEFAULT_SESSION = {
    state: "waiting",
    locked: false,
    startedBy: null,
    timer: 3,
    filter: "classic",
    layout: "polaroid",
    photoCount: 4,
    currentPhoto: 0,
};

export default function useSession(roomCode) {
    const [session, setSession] = useState(DEFAULT_SESSION);
    const [countdown, setCountdown] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [previewPhotos, setPreviewPhotos] = useState(
        Array(DEFAULT_SESSION.photoCount).fill(null)
    );
    const [sessionComplete, setSessionComplete] = useState(false);

    /**
     * ========================================================
     * Reset The Preview Grid Whenever Photo Count Changes
     * (also covers the very first session state arriving)
     * ========================================================
     */
    useEffect(() => {
        setPreviewPhotos(Array(session.photoCount).fill(null));
        setSessionComplete(false);
    }, [session.photoCount]);

    /**
     * ========================================================
     * Socket Listeners
     * ========================================================
     */
    useEffect(() => {
        if (!roomCode) return;

        const requestSessionState = () => {
            socket.emit(EVENTS.SESSION_STATE, { roomCode });
        };

        requestSessionState();

        const onReconnect = () => {
            requestSessionState();
        };

        socket.io.on("reconnect", onReconnect);

        const onSessionState = (newSession) => {
            setSession(newSession);

            if (newSession.state === "countdown") {
                setCountdown(newSession.countdownValue);
            }

            if (newSession.state !== "countdown") {
                setCountdown(null);
            }
        };

        const onSessionLocked = () => {
            // Settings are frozen. COUNTDOWN_START drives the rest.
        };

        const onCountdownStart = ({ timer }) => {
            setCountdown(timer);
        };

        const onCountdownTick = ({ count }) => {
            setCountdown(count);
        };

        const onCountdownFinished = () => {
            setCountdown(null);
        };

        const onCaptureTrigger = () => {
            setCapturing(true);
        };

        const onPreviewUpdated = ({ index, capture }) => {
            setPreviewPhotos((prev) => {
                const updated = [...prev];
                updated[index] = capture;
                return updated;
            });
        };

        const onPhotoRetake = () => {
            setCountdown(null);
            setCapturing(false);
            setSessionComplete(false);
            setPreviewPhotos((prev) => Array(prev.length).fill(null));
        };

        const onSessionCompleted = () => {
            setSessionComplete(true);
            setCapturing(false);
        };

        socket.on(EVENTS.SESSION_STATE, onSessionState);
        socket.on(EVENTS.SESSION_LOCKED, onSessionLocked);
        socket.on(EVENTS.COUNTDOWN_START, onCountdownStart);
        socket.on(EVENTS.COUNTDOWN_TICK, onCountdownTick);
        socket.on(EVENTS.COUNTDOWN_FINISHED, onCountdownFinished);
        socket.on(EVENTS.CAPTURE_TRIGGER, onCaptureTrigger);
        socket.on(EVENTS.PREVIEW_UPDATED, onPreviewUpdated);
        socket.on(EVENTS.PHOTO_RETAKE, onPhotoRetake);
        socket.on(EVENTS.SESSION_COMPLETED, onSessionCompleted);

        return () => {
            socket.off("reconnect", onReconnect);
            socket.off(EVENTS.SESSION_STATE, onSessionState);
            socket.off(EVENTS.SESSION_LOCKED, onSessionLocked);
            socket.off(EVENTS.COUNTDOWN_START, onCountdownStart);
            socket.off(EVENTS.COUNTDOWN_TICK, onCountdownTick);
            socket.off(EVENTS.COUNTDOWN_FINISHED, onCountdownFinished);
            socket.off(EVENTS.CAPTURE_TRIGGER, onCaptureTrigger);
            socket.off(EVENTS.PREVIEW_UPDATED, onPreviewUpdated);
            socket.off(EVENTS.PHOTO_RETAKE, onPhotoRetake);
            socket.off(EVENTS.SESSION_COMPLETED, onSessionCompleted);
        };
    }, [roomCode]);

    /**
     * ========================================================
     * Actions
     * ========================================================
     */

    // updateSession("timer", 5)
    // updateSession("filter", "vintage")
    const updateSession = useCallback(
        (key, value) => {
            if (!roomCode) return;
            socket.emit(EVENTS.SESSION_UPDATE, { roomCode, key, value });
        },
        [roomCode]
    );

    const startSession = useCallback(() => {
        if (!roomCode) return;
        socket.emit(EVENTS.SESSION_LOCKED, { roomCode });
    }, [roomCode]);

    const requestRetake = useCallback(() => {
        if (!roomCode) return;
        socket.emit(EVENTS.PHOTO_RETAKE, { roomCode });
    }, [roomCode]);

    // Called by Booth.jsx once it has grabbed its own frame via
    // useWebRTC's captureFrame(). The server decides whether this
    // came from the host or guest.
    const submitCapture = useCallback(
        (image) => {
            if (!roomCode) return;
            socket.emit(EVENTS.PHOTO_CAPTURED, { roomCode, image });
        },
        [roomCode]
    );

    /**
     * ========================================================
     * Derived Helpers
     * ========================================================
     */
    const isLocked = session.locked;
    const isWaiting = session.state === "waiting";
    const isFinished = session.state === "finished";

    /**
     * ========================================================
     * Exports
     * ========================================================
     */
    return {
        session,
        updateSession,
        startSession,
        requestRetake,
        submitCapture,

        isLocked,
        isWaiting,
        isFinished,

        countdown,
        capturing,
        setCapturing,

        previewPhotos,
        sessionComplete,
    };
}