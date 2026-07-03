/**
 * ==========================================================
 * FrameTogether
 * Socket Event Names
 * ==========================================================
 *
 * Shared event names used by the React frontend.
 *
 * These should always match the backend events.
 *
 * ==========================================================
 */
const EVENTS = {
    /* Connection */
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    /* Rooms */
    CREATE_ROOM: "create-room",
    JOIN_ROOM: "join-room",
    LEAVE_ROOM: "leave-room",
    ROOM_JOINED: "room-joined",
    ROOM_LEFT: "room-left",
    ROOM_UPDATED: "room-updated",
    ROOM_ERROR: "room-error",
    /* Participants */
    PARTICIPANT_JOINED: "participant-joined",
    PARTICIPANT_LEFT: "participant-left",
    PARTICIPANTS_UPDATED: "participants-updated",
    /* Chat */
    SEND_MESSAGE: "send-message",
    RECEIVE_MESSAGE: "receive-message",
    /* Ready */
    USER_READY: "user-ready",
    USER_NOT_READY: "user-not-ready",
    SESSION_READY: "session-ready",
    /* Countdown */
    COUNTDOWN_START: "countdown-start",
    COUNTDOWN_TICK: "countdown-tick",
    COUNTDOWN_FINISHED: "countdown-finished",
    /* Camera */
    CAPTURE_PHOTO: "capture-photo",
    PHOTO_CAPTURED: "photo-captured",
    SESSION_COMPLETED: "session-completed",
    /* WebRTC */
    OFFER: "offer",
    ANSWER: "answer",
    ICE_CANDIDATE: "ice-candidate",
    // session 
    SESSION_UPDATE: "session-update",
    SESSION_LOCKED: "session-locked",
    SESSION_STARTED: "session-started",
    SESSION_STATE: "session-state",
    SESSION_FINISHED: "session-finished",
    PHOTO_PREVIEW: "photo-preview",
    PHOTO_ACCEPTED: "photo-accepted",
    PHOTO_RETAKE: "photo-retake",
    //capture
    CAPTURE_TRIGGER: "capture-trigger",
    CAPTURE_COMPLETE: "capture-complete",
    PREVIEW_UPDATED: "preview-updated",
};
export default EVENTS;