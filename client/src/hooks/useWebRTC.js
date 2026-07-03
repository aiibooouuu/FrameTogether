import { useRef, useEffect, useState, useCallback } from "react";
import socket from "../socket/socket";
import EVENTS from "../socket/event";
import captureFrameUtil from "../camera/captureFrame";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

/**
 * ==========================================================
 * FrameTogether
 * useWebRTC (Milestones 1-3)
 * ==========================================================
 *
 * Owns the entire media + peer connection subsystem:
 *
 *  - getUserMedia()      → local camera
 *  - RTCPeerConnection    → peer link
 *  - Offer / Answer       → session negotiation
 *  - ICE candidates        → NAT traversal
 *  - ontrack               → remote video
 *
 * Booth.jsx never touches any of this directly — it just
 * reads the returned refs/state.
 *
 * ==========================================================
 */
export default function useWebRTC(roomCode) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionState, setConnectionState] = useState("new");

  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const tracksAddedRef = useRef(false);
  const pendingOfferRef = useRef(false);
  const pendingCandidatesRef = useRef([]);

  // ---------------------------------------------------------
  // Peer connection (created lazily, reused across the session)
  // ---------------------------------------------------------
  const ensurePeer = useCallback(() => {
    if (peerRef.current) return peerRef.current;

    const peer = new RTCPeerConnection(ICE_SERVERS);

    peer.onicecandidate = (event) => {
      if (event.candidate && roomCode) {
        socket.emit(EVENTS.ICE_CANDIDATE, {
          roomCode,
          candidate: event.candidate,
        });
      }
    };

    peer.ontrack = (event) => {
      const [stream] = event.streams;
      console.log("Remote Track Received");
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    peer.onconnectionstatechange = () => {
      console.log("Peer Connection State:", peer.connectionState);
      setConnectionState(peer.connectionState);
    };

    peerRef.current = peer;
    tracksAddedRef.current = false;
    return peer;
  }, [roomCode]);

  const addLocalTracks = useCallback(() => {
    const peer = ensurePeer();
    const stream = localStreamRef.current;

    if (!stream || tracksAddedRef.current) return;

    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream);
    });

    tracksAddedRef.current = true;
  }, [ensurePeer]);

  const flushPendingCandidates = useCallback(async () => {
    const peer = peerRef.current;
    if (!peer) return;

    const queued = pendingCandidatesRef.current;
    pendingCandidatesRef.current = [];

    for (const candidate of queued) {
      try {
        await peer.addIceCandidate(candidate);
      } catch (error) {
        console.error("Add Queued ICE Candidate Error:", error);
      }
    }
  }, []);

  // ---------------------------------------------------------
  // Local camera
  // ---------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        console.log("Camera Started");
        addLocalTracks();

        // If a peer already asked us to connect before the camera
        // was ready, send the offer now that we have tracks.
        if (pendingOfferRef.current) {
          pendingOfferRef.current = false;
          createOffer();
        }
      } catch (error) {
        console.error("Camera Error:", error);
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      const stream = localStreamRef.current;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      localStreamRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------
  // Negotiation
  // ---------------------------------------------------------
    const createOffer = useCallback(async () => {
      if (!roomCode) return;

      if (!localStreamRef.current) {
        // Camera isn't ready yet — remember to offer once it is.
        pendingOfferRef.current = true;
        return;
      }

      const peer = ensurePeer();
      addLocalTracks();

      try {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        socket.emit(EVENTS.OFFER, {
          roomCode,
          offer: peer.localDescription,
        });

        console.log("Offer Sent");
      } catch (error) {
        console.error("Create Offer Error:", error);
      }
    }, [roomCode, ensurePeer, addLocalTracks]);

  const handleOffer = useCallback(
    async ({ offer }) => {
      if (!roomCode) return;

      const peer = ensurePeer();
      addLocalTracks();

      try {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        await flushPendingCandidates();

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.emit(EVENTS.ANSWER, {
          roomCode,
          answer: peer.localDescription,
        });

        console.log("Answer Sent");
      } catch (error) {
        console.error("Handle Offer Error:", error);
      }
    },
    [roomCode, ensurePeer, addLocalTracks, flushPendingCandidates]
  );

  const handleAnswer = useCallback(
    async ({ answer }) => {
      const peer = peerRef.current;
      if (!peer) return;

      try {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
        await flushPendingCandidates();
        console.log("Answer Received");
      } catch (error) {
        console.error("Handle Answer Error:", error);
      }
    },
    [flushPendingCandidates]
  );

  const handleIceCandidate = useCallback(async ({ candidate }) => {
    if (!candidate) return;

    const iceCandidate = new RTCIceCandidate(candidate);
    const peer = peerRef.current;

    // If the remote description isn't set yet, ICE candidates that
    // arrive early can't be added — queue them and flush once the
    // offer/answer exchange completes.
    if (peer && peer.remoteDescription) {
      try {
        await peer.addIceCandidate(iceCandidate);
      } catch (error) {
        console.error("Add ICE Candidate Error:", error);
      }
    } else {
      pendingCandidatesRef.current.push(iceCandidate);
    }
  }, []);

  const resetPeer = useCallback(() => {
    const peer = peerRef.current;
    if (peer) {
      peer.close();
    }
    peerRef.current = null;
    tracksAddedRef.current = false;
    pendingCandidatesRef.current = [];
    setRemoteStream(null);
    setConnectionState("new");
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, []);


  /**
 * ==========================================================
 * Capture Current Frame
 * ==========================================================
 *
 * Captures the current frame from the
 * local video stream with an optional filter.
 *
 * @param {string} filterKey - Filter preset name
 * @returns {string|null} Base64 PNG Image
 *
 * ==========================================================
 */

const captureFrame = (filterKey = "classic") => {
  if (!localVideoRef.current) {
    console.warn("Local video is not ready.");
    return null;
  }
  return captureFrameUtil(localVideoRef.current, filterKey);
};

  // ---------------------------------------------------------
  // Signaling listeners
  // ---------------------------------------------------------
  useEffect(() => {
    if (!roomCode) return;

    const onParticipantJoined = () => {
      console.log("Participant joined — creating offer");
      createOffer();
    };

    const onParticipantLeft = () => {
      console.log("Participant left — resetting peer connection");
      resetPeer();
    };

    socket.on(EVENTS.PARTICIPANT_JOINED, onParticipantJoined);
    socket.on(EVENTS.PARTICIPANT_LEFT, onParticipantLeft);
    socket.on(EVENTS.OFFER, handleOffer);
    socket.on(EVENTS.ANSWER, handleAnswer);
    socket.on(EVENTS.ICE_CANDIDATE, handleIceCandidate);

    return () => {
      socket.off(EVENTS.PARTICIPANT_JOINED, onParticipantJoined);
      socket.off(EVENTS.PARTICIPANT_LEFT, onParticipantLeft);
      socket.off(EVENTS.OFFER, handleOffer);
      socket.off(EVENTS.ANSWER, handleAnswer);
      socket.off(EVENTS.ICE_CANDIDATE, handleIceCandidate);
    };
  }, [roomCode, createOffer, handleOffer, handleAnswer, handleIceCandidate, resetPeer]);

  // ---------------------------------------------------------
  // Full teardown on unmount (leaving the Booth page)
  // ---------------------------------------------------------
  useEffect(() => {
    return () => {
      resetPeer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    connectionState,
    captureFrame,  // Now accepts optional filterKey parameter
  };
}