// src/components/LiveRoom/WebRTCRoom.jsx
import React, { useEffect, useRef, useState } from "react";
import socket from "../../utils/socket";

/**
 * Minimal WebRTC room:
 * - uses socket.io for signaling
 * - supports publish own stream, subscribe to others
 * - supports screen share
 *
 * This is a simple mesh implementation (suitable for small classes).
 * For many participants switch to SFU (mediasoup / Janus / Jitsi / LiveKit).
 */

export default function WebRTCRoom({ roomId = "main-room", role = "student" }) {
  const localVideoRef = useRef(null);
  const [peers, setPeers] = useState({}); // { peerId: { pc, stream } }
  const [remoteStreams, setRemoteStreams] = useState([]); // array of {id, stream}
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);
  const [sharing, setSharing] = useState(false);
  const localStreamRef = useRef(null);
  const pcsRef = useRef({}); // RTCPeerConnections keyed by socketId

  useEffect(() => {
    // handle events
    socket.on("connect", () => {
      socket.emit("join-room", { roomId });
    });

    socket.on("peers", (peerIds) => {
      // existing peers — create offers to each
      peerIds.forEach((peerId) => {
        if (peerId === socket.id) return;
        createOffer(peerId);
      });
    });

    socket.on("offer", async ({ from, offer }) => {
      await handleOffer(from, offer);
    });

    socket.on("answer", async ({ from, answer }) => {
      await handleAnswer(from, answer);
    });

    socket.on("ice-candidate", async ({ from, candidate }) => {
      const pc = pcsRef.current[from];
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(candidate);
        } catch (e) {
          console.warn("addIceCandidate error", e);
        }
      }
    });

    socket.on("peer-left", ({ id }) => {
      // remove peer
      removePeer(id);
    });

    // cleanup when unmount
    return () => {
      socket.off("connect");
      socket.off("peers");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("peer-left");
      stopAll();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // initial getUserMedia
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        localStreamRef.current = s;
        if (localVideoRef.current) localVideoRef.current.srcObject = s;
      } catch (err) {
        console.error("getUserMedia failed", err);
      }
    })();
  }, []);

  async function createPeerConnection(peerId, isInitiator = true) {
    if (pcsRef.current[peerId]) return pcsRef.current[peerId];

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Add TURN server here for production
      ],
    });

    // add tracks
    if (localStreamRef.current) {
      for (const track of localStreamRef.current.getTracks()) {
        pc.addTrack(track, localStreamRef.current);
      }
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("ice-candidate", { to: peerId, candidate: e.candidate });
      }
    };

    pc.ontrack = (e) => {
      const [stream] = e.streams;
      if (!stream) return;
      setRemoteStreams((prev) => {
        if (prev.find((p) => p.id === peerId)) return prev;
        return [...prev, { id: peerId, stream }];
      });
    };

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "failed" ||
        pc.connectionState === "disconnected" ||
        pc.connectionState === "closed"
      ) {
        removePeer(peerId);
      }
    };

    pcsRef.current[peerId] = pc;
    return pc;
  }

  async function createOffer(peerId) {
    try {
      const pc = await createPeerConnection(peerId, true);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { to: peerId, offer });
    } catch (err) {
      console.error("createOffer error", err);
    }
  }

  async function handleOffer(from, offer) {
    try {
      const pc = await createPeerConnection(from, false);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("answer", { to: from, answer });
    } catch (err) {
      console.error("handleOffer error", err);
    }
  }

  async function handleAnswer(from, answer) {
    try {
      const pc = pcsRef.current[from];
      if (!pc) return;
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (err) {
      console.error("handleAnswer error", err);
    }
  }

  function removePeer(peerId) {
    const pc = pcsRef.current[peerId];
    if (pc) {
      try {
        pc.close();
      } catch {}
      delete pcsRef.current[peerId];
    }
    setRemoteStreams((prev) => prev.filter((p) => p.id !== peerId));
  }

  function stopAll() {
    // stop local tracks
    try {
      localStreamRef.current?.getTracks()?.forEach((t) => t.stop());
    } catch {}
    // close PCs
    Object.values(pcsRef.current || {}).forEach((pc) => {
      try {
        pc.close();
      } catch {}
    });
    pcsRef.current = {};
    setRemoteStreams([]);
  }

  // toggle mic
  const toggleMic = () => {
    if (!localStreamRef.current) return;
    const audioTracks = localStreamRef.current.getAudioTracks();
    audioTracks.forEach((t) => (t.enabled = !t.enabled));
    setMic(!mic);
  };

  // toggle camera
  const toggleCam = () => {
    if (!localStreamRef.current) return;
    const tracks = localStreamRef.current.getVideoTracks();
    tracks.forEach((t) => (t.enabled = !t.enabled));
    setCam(!cam);
  };

  // screen share
  const startScreenShare = async () => {
    if (sharing) {
      // stop screen share - replace with camera
      await stopScreenShare();
      return;
    }

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      // replace video tracks in all peer connections
      const screenTrack = screenStream.getVideoTracks()[0];

      // listen for end of screen share
      screenTrack.onended = async () => {
        await stopScreenShare();
      };

      // replace tracks
      for (const peerId of Object.keys(pcsRef.current)) {
        const pc = pcsRef.current[peerId];
        const senders = pc.getSenders();
        const videoSender = senders.find(
          (s) => s.track && s.track.kind === "video"
        );
        if (videoSender) {
          await videoSender.replaceTrack(screenTrack);
        }
      }

      // set local video preview to screen
      localVideoRef.current.srcObject = screenStream;

      // when screen ends, restore camera
      setSharing(true);
    } catch (err) {
      console.error("screen share failed", err);
    }
  };

  const stopScreenShare = async () => {
    // restore camera track
    try {
      const camTrack = localStreamRef.current.getVideoTracks()[0];
      for (const peerId of Object.keys(pcsRef.current)) {
        const pc = pcsRef.current[peerId];
        const senders = pc.getSenders();
        const videoSender = senders.find(
          (s) => s.track && s.track.kind === "video"
        );
        if (videoSender && camTrack) await videoSender.replaceTrack(camTrack);
      }
      // set preview back to local stream
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    } catch (e) {
      console.warn("restore camera failed", e);
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Local video */}
        <div className="col-span-1 md:col-span-1 bg-black rounded-lg overflow-hidden shadow-md">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-56 object-cover bg-black"
          />
          <div className="p-2 flex items-center justify-between bg-[#0b1220]">
            <div className="text-sm text-gray-300">
              {role === "teacher" ? "You (Teacher)" : "You (Student)"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleMic}
                className="px-2 py-1 bg-gray-800 rounded"
              >
                {mic ? "Mute" : "Unmute"}
              </button>
              <button
                onClick={toggleCam}
                className="px-2 py-1 bg-gray-800 rounded"
              >
                {cam ? "Camera Off" : "Camera On"}
              </button>
              <button
                onClick={startScreenShare}
                className="px-2 py-1 bg-purple-600 rounded"
              >
                {sharing ? "Stop Share" : "Share Screen"}
              </button>
            </div>
          </div>
        </div>

        {/* Remote streams */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {remoteStreams.map((r) => (
            <RemoteVideo key={r.id} stream={r.stream} id={r.id} />
          ))}
          {remoteStreams.length === 0 && (
            <div className="col-span-1 md:col-span-2 flex items-center justify-center text-gray-400">
              No participants yet
            </div>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-400">
        Tip: This demo uses a mesh approach
      </div>
    </div>
  );
}

function RemoteVideo({ stream, id }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);
  return (
    <div className="bg-black rounded overflow-hidden shadow">
      <video
        ref={ref}
        autoPlay
        playsInline
        className="w-full h-36 object-cover bg-black"
      />
      <div className="p-2 text-sm bg-[#0b1220] text-gray-200">{id}</div>
    </div>
  );
}
