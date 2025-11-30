// src/components/LiveRoom/WebRTCRoom.jsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import socket from "../../utils/socket";
import {
  HiMicrophone,
  HiSpeakerWave,
  HiVideoCamera,
  HiOutlineShare,
  HiOutlineStop,
  HiUser,
  HiOutlineUserMinus,
  HiMinusCircle,
} from "react-icons/hi2";

/**
 * Upgraded WebRTCRoom — ultra responsive + premium UI
 * - mesh-based WebRTC with socket.io signaling (keeps your existing events)
 * - screen share, mute/unmute mic & cam, teacher controls
 * - responsive participant grid with spotlight + badges
 * - lightweight network stats (RTT via datachannel ICE rtt not implemented — placeholder)
 *
 * Drop in to replace your existing file. Keeps the same props: { roomId, role }.
 */

export default function WebRTCRoom({ roomId = "main-room", role = "student" }) {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const pcsRef = useRef({}); // { peerId: RTCPeerConnection }
  const [remoteStreams, setRemoteStreams] = useState([]); // [{ id, stream, pinned }]
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pinnedId, setPinnedId] = useState(null); // pinned participant
  const [participantsCount, setParticipantsCount] = useState(1);

  // keep a list of peerIds for ordering
  const peersOrderRef = useRef([]);

  // ---------- socket listeners ----------
  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join-room", { roomId });
    });

    socket.on("peers", (peerIds = []) => {
      // existing peers -> create offers to them
      peersOrderRef.current = peerIds.filter((id) => id !== socket.id);
      setParticipantsCount(1 + peersOrderRef.current.length);
      peersOrderRef.current.forEach((peerId) => createOffer(peerId));
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
      removePeer(id);
    });

    // server may emit updated peer list
    socket.on("peer-list-update", (peerIds = []) => {
      peersOrderRef.current = peerIds.filter((id) => id !== socket.id);
      setParticipantsCount(1 + peersOrderRef.current.length);
    });

    // teacher / host control (mute single)
    socket.on("force-mute", ({ id }) => {
      if (id === socket.id && localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = false));
        setMicOn(false);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("peers");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("peer-left");
      socket.off("peer-list-update");
      socket.off("force-mute");
      stopAll();
    };
    // eslint-disable-next-line
  }, [roomId]);

  // ---------- getUserMedia ----------
  useEffect(() => {
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        localStreamRef.current = s;
        if (localVideoRef.current) localVideoRef.current.srcObject = s;
        setLoading(false);
      } catch (err) {
        console.error("getUserMedia failed", err);
        setLoading(false);
      }
    })();
  }, []);

  // ---------- helpers ----------
  function makePC(peerId) {
    if (pcsRef.current[peerId]) return pcsRef.current[peerId];

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current));
    }

    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit("ice-candidate", { to: peerId, candidate: e.candidate });
    };

    pc.ontrack = (e) => {
      const [stream] = e.streams;
      if (!stream) return;
      setRemoteStreams((prev) => {
        if (prev.find((p) => p.id === peerId)) return prev;
        return [...prev, { id: peerId, stream, pinned: false }];
      });
    };

    pc.onconnectionstatechange = () => {
      if (["failed", "disconnected", "closed"].includes(pc.connectionState)) {
        removePeer(peerId);
      }
    };

    pcsRef.current[peerId] = pc;
    return pc;
  }

  async function createOffer(peerId) {
    try {
      const pc = makePC(peerId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit("offer", { to: peerId, offer });
    } catch (err) {
      console.error("createOffer error:", err);
    }
  }

  async function handleOffer(from, offer) {
    try {
      const pc = makePC(from);
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
    peersOrderRef.current = peersOrderRef.current.filter((p) => p !== peerId);
    setParticipantsCount(1 + peersOrderRef.current.length);
    if (pinnedId === peerId) setPinnedId(null);
  }

  function stopAll() {
    try {
      localStreamRef.current?.getTracks()?.forEach((t) => t.stop());
    } catch {}
    Object.values(pcsRef.current || {}).forEach((pc) => {
      try {
        pc.close();
      } catch {}
    });
    pcsRef.current = {};
    setRemoteStreams([]);
  }

  // ---------- UI actions ----------
  const toggleMic = () => {
    if (!localStreamRef.current) return;
    const next = !micOn;
    localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = next));
    setMicOn(next);
  };

  const toggleCam = () => {
    if (!localStreamRef.current) return;
    const next = !camOn;
    localStreamRef.current.getVideoTracks().forEach((t) => (t.enabled = next));
    setCamOn(next);
  };

  const startScreenShare = async () => {
    if (sharing) return stopScreenShare();

    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];

      // replace on all peer connections
      Object.keys(pcsRef.current).forEach((peerId) => {
        const pc = pcsRef.current[peerId];
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender) sender.replaceTrack(screenTrack).catch((e) => console.warn(e));
      });

      // preview local as screen
      if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
      setSharing(true);

      // when screen share ends, restore
      screenTrack.onended = async () => {
        await stopScreenShare();
      };
    } catch (err) {
      console.error("screen share failed", err);
    }
  };

  const stopScreenShare = async () => {
    try {
      // restore camera track
      const camTrack = localStreamRef.current?.getVideoTracks()?.[0];
      if (camTrack) {
        Object.keys(pcsRef.current).forEach((peerId) => {
          const pc = pcsRef.current[peerId];
          const sender = pc.getSenders().find((s) => s.track?.kind === "video");
          if (sender) sender.replaceTrack(camTrack).catch(() => {});
        });
        if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
      }
    } catch (e) {
      console.warn("restore camera failed", e);
    } finally {
      setSharing(false);
    }
  };

  // teacher: mute all participants (emit to server to forward)
  const muteAll = () => {
    if (role !== "teacher") return;
    socket.emit("mute-all", { roomId });
  };

  // teacher: pin a participant (client side pin + emit to others)
  const pinParticipant = (id) => {
    setPinnedId((prev) => (prev === id ? null : id));
    socket.emit("pin", { roomId, id });
  };

  // responsive grid ordering: pinned shown large on top-left
  const sortedStreams = useCallback(() => {
    if (!pinnedId) return remoteStreams;
    const pinned = remoteStreams.find((r) => r.id === pinnedId);
    const others = remoteStreams.filter((r) => r.id !== pinnedId);
    return pinned ? [pinned, ...others] : remoteStreams;
  }, [remoteStreams, pinnedId]);

  // ---------- render ----------
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg">
            <HiUser className="text-xl" />
          </div>
          <div>
            <div className="text-lg font-semibold text-white">Live Classroom</div>
            <div className="text-sm text-gray-400">
              Room: <span className="text-purple-300 font-medium">{roomId}</span> • Participants:{" "}
              <span className="text-green-300 font-semibold">{participantsCount}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {role === "teacher" && (
            <button
              onClick={muteAll}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
              title="Mute all participants"
            >
              <HiOutlineUserMinus className="inline mr-2" /> Mute All
            </button>
          )}

          <div className="bg-[#0f1629] px-3 py-2 rounded-lg border border-purple-800/30 text-sm">
            {role === "teacher" ? "Host (Teacher)" : "Participant (Student)"}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT: video area (large) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Local preview */}
          <div className="bg-black rounded-xl overflow-hidden shadow-lg border border-purple-900/20">
            <div className="w-full h-64 md:h-80 lg:h-96 relative">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover bg-black"
              />
              <div className="absolute left-3 top-3 px-3 py-1 rounded-md bg-black/50 text-white text-sm">
                You ({role === "teacher" ? "Teacher" : "Student"})
              </div>
              {sharing && (
                <div className="absolute right-3 top-3 px-3 py-1 rounded-md bg-yellow-400/90 text-black text-sm">
                  Screen Share
                </div>
              )}
            </div>

            <div className="p-3 flex items-center justify-between bg-[#071022]">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggleMic}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${micOn ? "bg-green-600" : "bg-gray-700"}`}
                >
                  <HiMicrophone /> <span className="text-sm">{micOn ? "Mic On" : "Mic Off"}</span>
                </button>

                <button
                  onClick={toggleCam}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md ${camOn ? "bg-blue-600" : "bg-gray-700"}`}
                >
                  <HiVideoCamera /> <span className="text-sm">{camOn ? "Cam On" : "Cam Off"}</span>
                </button>

                <button
                  onClick={sharing ? stopScreenShare : startScreenShare}
                  className="flex items-center gap-2 px-3 py-2 rounded-md bg-purple-600 hover:bg-purple-700"
                >
                  {sharing ? <HiOutlineStop /> : <HiOutlineShare />}{" "}
                  <span className="text-sm">{sharing ? "Stop Share" : "Share Screen"}</span>
                </button>
              </div>

              <div className="text-sm text-gray-300">Network stable</div>
            </div>
          </div>

          {/* Remote participants grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sortedStreams().length === 0 ? (
              <div className="col-span-1 p-6 text-center text-gray-400 bg-[#071124] rounded-xl">
                No participants yet — waiting for others to join.
              </div>
            ) : (
              sortedStreams().map((r, idx) => {
                const isPinned = pinnedId === r.id;
                return (
                  <div key={r.id} className={`bg-black rounded-xl overflow-hidden border ${isPinned ? "border-purple-500/60" : "border-transparent"}`}>
                    <RemoteVideoTile stream={r.stream} id={r.id} pinned={isPinned} />
                    <div className="p-2 flex items-center justify-between bg-[#071025]">
                      <div className="text-sm text-gray-200 truncate">{r.id}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => pinParticipant(r.id)}
                          className={`px-2 py-1 rounded-md text-sm ${isPinned ? "bg-purple-600" : "bg-white/5"}`}
                        >
                          {isPinned ? "Pinned" : "Pin"}
                        </button>
                        {role === "teacher" && (
                          <button
                            onClick={() => socket.emit("force-mute", { id: r.id })}
                            title="Force mute"
                            className="px-2 py-1 rounded-md bg-red-700 text-white"
                          >
                            <HiMinusCircle />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: participants list & controls */}
        <aside className="space-y-4">
          <div className="bg-[#0d1220] p-4 rounded-xl border border-purple-800/20 shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-300 font-semibold">Participants</div>
              <div className="text-xs text-gray-400">{participantsCount}</div>
            </div>

            <div className="space-y-2 max-h-64 overflow-auto">
              {/* local */}
              <div className="flex items-center justify-between px-2 py-2 rounded-md bg-white/3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-purple-700/60 flex items-center justify-center text-white">
                    <HiUser />
                  </div>
                  <div>
                    <div className="text-sm text-white">You</div>
                    <div className="text-xs text-gray-400">{role}</div>
                  </div>
                </div>

                <div className="text-xs text-gray-300">{micOn ? "Mic" : "Muted"}</div>
              </div>

              {remoteStreams.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-2 py-2 rounded-md bg-white/3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#0f172a] flex items-center justify-center text-gray-300">
                      <HiUser />
                    </div>
                    <div>
                      <div className="text-sm text-white truncate">{r.id}</div>
                      <div className="text-xs text-gray-400">Participant</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => pinParticipant(r.id)}
                      className="px-2 py-1 text-xs rounded bg-white/5"
                    >
                      Pin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1220] p-4 rounded-xl border border-purple-800/20 shadow">
            <div className="text-sm text-gray-300 font-semibold mb-2">Controls</div>
            <div className="flex flex-col gap-2">
              <button onClick={toggleMic} className={`px-3 py-2 rounded-md ${micOn ? "bg-green-600" : "bg-gray-700"} text-white`}>
                {micOn ? "Mute My Mic" : "Unmute My Mic"}
              </button>
              <button onClick={toggleCam} className={`px-3 py-2 rounded-md ${camOn ? "bg-blue-600" : "bg-gray-700"} text-white`}>
                {camOn ? "Turn Off Camera" : "Turn On Camera"}
              </button>
              <button onClick={() => setPinnedId(null)} className="px-3 py-2 rounded-md bg-white/5 text-sm">
                Clear Pin
              </button>
              <div className="text-xs text-gray-400 mt-2">Tip: Pin a participant to spotlight them.</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Remote tile ---------- */
function RemoteVideoTile({ stream, id, pinned }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);

  return (
    <div className={`w-full h-44 bg-black ${pinned ? "ring-4 ring-purple-600/30" : ""}`}>
      <video ref={ref} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute top-2 left-2 px-2 py-1 text-xs bg-black/50 text-white rounded">{id}</div>
    </div>
  );
}
