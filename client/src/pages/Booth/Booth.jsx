import "./Booth.css";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

import socket from "../../socket/socket";
import EVENTS from "../../socket/event";
import useWebRTC from "../../hooks/useWebRTC";
import useSession from "../../hooks/useSession";
import { FILTERS, getFilterLabels } from "../../camera/filter";

import {
  FaCopy,
  FaCheck,
  FaCircle,
  FaPaperPlane,
  FaCameraRetro,
} from "react-icons/fa6";
import { HiMiniUserGroup } from "react-icons/hi2";
import PreviewModal from "../../pages/Preview/PreviewModal";

/**
 * ==========================================================
 * Static Config
 * ==========================================================
 */

const TIMERS = ["3s", "5s", "10s"];
const PHOTO_COUNTS = ["4"];

const LAYOUT_META = [{ cols: 1, rows: 4, label: "4 × 1" }];

function Booth() {
  const navigate = useNavigate();
  const location = useLocation();

  const shutterRef = useRef(null);
  if (!shutterRef.current) {
    shutterRef.current = new Audio("/sounds/shutter.mp3");
  }

  const room = location.state;
  const roomName = location.state?.roomName || "Unknown Room";
  const roomCode = location.state?.roomCode || "--------";
  const username = location.state?.username || "You";

  /**
   * ========================================================
   * Hooks
   * ========================================================
   */
  const {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    captureFrame,
  } = useWebRTC(roomCode);

  const {
    session,
    updateSession,
    startSession,
    submitCapture,
    requestRetake,
    isLocked,
    countdown,
    capturing,
    setCapturing,
    previewPhotos,
    sessionComplete,
  } = useSession(roomCode);

  /**
   * ========================================================
   * Local UI State
   * ========================================================
   */
  const [participants, setParticipants] = useState([
    { name: "You", connected: true },
    { name: "Waiting...", connected: false },
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "System", time: "Now", text: "Welcome to FrameTogether." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const timerIndex = TIMERS.indexOf(`${session.timer}s`);
  const photoIndex = PHOTO_COUNTS.indexOf(String(session.photoCount));
  const remoteConnected = Boolean(remoteStream);

  /**
   * ========================================================
   * Room Join / Leave + Chat + Participants
   * ========================================================
   */
  useEffect(() => {
    if (!room) return;

    let joined = false;

    const doJoin = () => {
      if (joined) return;
      joined = true;
      socket.emit(EVENTS.JOIN_ROOM, { roomCode, username });
    };

    socket.connect();

    if (socket.connected) {
      doJoin();
    } else {
      socket.once("connect", doJoin);
    }

    const onParticipantsUpdated = (data) => setParticipants(data.participants);
    const onRoomError = (error) => toast.error(error.message);
    const onReceiveMessage = (message) =>
      setChatMessages((prev) => [...prev, message]);

    socket.on(EVENTS.PARTICIPANTS_UPDATED, onParticipantsUpdated);
    socket.on(EVENTS.ROOM_ERROR, onRoomError);
    socket.on(EVENTS.RECEIVE_MESSAGE, onReceiveMessage);

    return () => {
      socket.off("connect", doJoin);
      if (joined) {
        socket.emit(EVENTS.LEAVE_ROOM);
      }
      socket.off(EVENTS.PARTICIPANTS_UPDATED, onParticipantsUpdated);
      socket.off(EVENTS.ROOM_ERROR, onRoomError);
      socket.off(EVENTS.RECEIVE_MESSAGE, onReceiveMessage);
      socket.disconnect();
    };
  }, [room, roomCode, username]);

  /**
   * ========================================================
   * Redirect Home If Room State Is Missing
   * ========================================================
   */
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location, navigate]);

  /**
   * ========================================================
   * Capture Sequence
   * ========================================================
   */
  useEffect(() => {
    if (!capturing) return;

    console.log("📸 Capturing with filter:", session.filter);

    setFlash(true);
    shutterRef.current.currentTime = 0;
    shutterRef.current.play();

    const image = captureFrame(session.filter);

    const timeout = setTimeout(() => {
      setFlash(false);
      submitCapture(image);
      setCapturing(false);
    }, 120);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturing, session.filter]);

  /**
   * ========================================================
   * Actions
   * ========================================================
   */
  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    setCopied(true);
    toast.success("Room code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    socket.emit(EVENTS.SEND_MESSAGE, {
      roomCode,
      text: chatInput.trim(),
      sender: username,
    });

    setChatInput("");
  };

  const capturedCount = previewPhotos.filter(
    (slot) => slot && slot.host && slot.guest
  ).length;

  const canRetake =
    (session.currentPhoto > 0 || sessionComplete) && !capturing && !countdown;

  const handleCaptureButtonClick = () => {
    if (canRetake) {
      requestRetake();
      return;
    }

    if (sessionComplete) return;

    startSession();
  };

  const captureButtonLabel = () => {
    if (countdown) return `Get Ready... ${countdown}`;
    if (capturing) return "Capturing...";
    if (canRetake) return "Retake Photos";
    if (isLocked) return "Session Starting...";
    return `Take Session (${capturedCount}/${previewPhotos.length})`;
  };

  /**
   * ========================================================
   * Render
   * ========================================================
   */
  return (
    <main className="booth">
      <div className="booth-shell">
        <BoothHeader
          roomName={roomName}
          roomCode={roomCode}
          onLeave={() => navigate("/")}
        />

        <div className="booth-layout">
          <Sidebar
            roomCode={roomCode}
            copied={copied}
            onCopyCode={copyCode}
            participants={participants}
            chatMessages={chatMessages}
            chatInput={chatInput}
            onChatInputChange={setChatInput}
            onSendMessage={sendMessage}
            username={username}
          />

          <section className="workspace">
            {countdown && <div className="countdown-overlay">{countdown}</div>}
            {flash && <div className="flash-overlay" />}

            <div className="cameras">
              <CameraCard
                label="You"
                online={Boolean(localStream)}
                videoRef={localVideoRef}
                muted
                filter={FILTERS[session.filter]}
              />
              <CameraCard
                label="Person 2"
                online={remoteConnected}
                videoRef={remoteVideoRef}
                fallback={
                  <div className="waiting">
                    <HiMiniUserGroup className="waiting-icon" />
                    <p className="waiting-title">Waiting for your friend</p>
                    <p className="waiting-sub">Share your room code</p>
                    <span className="waiting-code">{roomCode}</span>
                  </div>
                }
              />
            </div>

            <ProgressBar completed={capturedCount} total={previewPhotos.length} />

            <button
              className="capture-btn"
              onClick={handleCaptureButtonClick}
              disabled={capturing || Boolean(countdown) || !canRetake && isLocked}
            >
              <FaCameraRetro />
              {captureButtonLabel()}
            </button>
          </section>

          <Controls
            isLocked={isLocked}
            session={session}
            timerIndex={timerIndex}
            photoIndex={photoIndex}
            previewPhotos={previewPhotos}
            capturedCount={capturedCount}
            onCreatePreview={() => setShowPreviewModal(true)}
            onSelectFilter={(name) => updateSession("filter", name)}
            onSelectTimer={(seconds) => updateSession("timer", seconds)}
            onSelectPhotoCount={(count) => updateSession("photoCount", count)}
          />
        </div>
      </div>



      <PreviewModal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        photos={previewPhotos}
      />
    </main>
  );
}

/**
 * ==========================================================
 * Subcomponents
 * ==========================================================
 */

function BoothHeader({ roomName, roomCode, onLeave }) {
  return (
    <header className="booth-header">
      <div className="header-left">
        <h1>FrameTogether</h1>
        <span className="divider" />
        <p className="room-name">{roomName}</p>
        <span className="room-code-pill">{roomCode}</span>
      </div>

      <div className="header-right">
        <span className="status">
          <FaCircle className="status-dot" />
          Connected
        </span>
        <button className="leave-btn" onClick={onLeave}>
          Leave Booth
        </button>
      </div>
    </header>
  );
}

function Sidebar({
  roomCode,
  copied,
  onCopyCode,
  participants,
  chatMessages,
  chatInput,
  onChatInputChange,
  onSendMessage,
  username,
}) {
  return (
    <aside className="sidebar">
      <section className="panel-section">
        <h3>Room</h3>
        <div className="room-code">
          <span>{roomCode}</span>
          <button onClick={onCopyCode} aria-label="Copy room code">
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>
      </section>

      <section className="panel-section">
        <h3>Participants</h3>
        {participants.map((p, index) => (
          <div className="participant" key={index}>
            <FaCircle className={p.connected ? "online" : "offline"} />
            <span>{p.name}</span>
          </div>
        ))}
      </section>

      <section className="panel-section chat">
        <h3>Chat</h3>
        <div className="messages">
          {chatMessages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender === username ? "me" : "other"}`}
            >
              <div className="message-meta">
                <span className="message-sender">{msg.sender}</span>
                <span className="message-time">{msg.time}</span>
              </div>
              <p className="message-text">{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            placeholder="Message..."
            value={chatInput}
            onChange={(e) => onChatInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSendMessage();
            }}
          />
          <button aria-label="Send message" onClick={onSendMessage}>
            <FaPaperPlane />
          </button>
        </div>
      </section>
    </aside>
  );
}

function CameraCard({
  label,
  online,
  videoRef,
  muted = false,
  fallback = null,
  filter = null,
}) {
  return (
    <div className="camera-card">
      <div className="camera-title">
        <FaCircle className={online ? "online" : "offline"} />
        {label}
      </div>
      <video
        ref={videoRef}
        autoPlay
        muted={muted}
        playsInline
        className="camera"
        style={{
          filter: filter?.css || "none",
          display: fallback ? (online ? "block" : "none") : undefined,
        }}
      />
      {fallback && !online && fallback}
    </div>
  );
}

function ProgressBar({ completed, total }) {
  return (
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${(completed / total) * 100}%` }}
      />
      <span className="progress-label">
        {completed} / {total}
      </span>
    </div>
  );
}

function Controls({
  isLocked,
  session,
  timerIndex,
  photoIndex,
  previewPhotos,
  capturedCount,
  onCreatePreview,
  onSelectFilter,
  onSelectTimer,
  onSelectPhotoCount,
}) {
  return (
    <aside className="controls">
      <div className="control">
        <label>Filter</label>
        <div className="filter-deck" role="radiogroup" aria-label="Filter">
          {getFilterLabels().map(({ key, label, description, preview, category }) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={session.filter === key}
              className={`filter-card filter-card--${key} ${
                session.filter === key ? "active" : ""
              }`}
              onClick={() => onSelectFilter(key)}
              disabled={isLocked}
              data-category={category}
              style={{ "--filter-preview": preview }}
            >
              <span className="filter-swatch" />
              <span className="filter-text">{label}</span>
              <span className="filter-meta">{description}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="control">
        <label>Timer</label>
        <div className="switch-deck" role="radiogroup" aria-label="Timer">
          {TIMERS.map((t, index) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={timerIndex === index}
              className={`switch-key ${timerIndex === index ? "active" : ""}`}
              onClick={() => onSelectTimer(parseInt(t))}
              disabled={isLocked}
            >
              <span className="switch-face">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="control">
        <label>Layout</label>
        <div className="layout-deck" role="radiogroup" aria-label="Photo layout">
          <button
            type="button"
            role="radio"
            aria-checked="true"
            className="layout-card active"
            disabled
          >
            <div className="layout-grid" style={{ gridTemplateColumns: "1fr" }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <span className="layout-dot" key={i} />
              ))}
            </div>
            <div className="layout-info">
              <span className="layout-title">4 × 1</span>
              <span className="layout-subtitle">4 Frames</span>
            </div>
          </button>
        </div>
      </div>

      <div className="control preview-control">
        <label>Session Preview</label>
        <div className="preview-grid">
          {previewPhotos.map((slot, index) => (
            <div key={index} className="preview-box">
              {slot && slot.host && slot.guest ? (
                <div className="preview-pair">
                  <img src={slot.host} alt={`Host photo ${index + 1}`} />
                  <img src={slot.guest} alt={`Guest photo ${index + 1}`} />
                </div>
              ) : slot && (slot.host || slot.guest) ? (
                <>
                  <span className="preview-number">{index + 1}</span>
                  <span className="preview-placeholder">Waiting on partner...</span>
                </>
              ) : (
                <>
                  <span className="preview-number">{index + 1}</span>
                  <span className="preview-placeholder">Empty</span>
                </>
              )}
            </div>
          ))}
        </div>

        <p className="preview-count">
          {capturedCount} / {previewPhotos.length} Photos
        </p>

        {capturedCount === previewPhotos.length && (
          <button className="create-preview-btn" onClick={onCreatePreview}>
            Create Together Image
          </button>
        )}
      </div>
    </aside>
  );
}

export default Booth;