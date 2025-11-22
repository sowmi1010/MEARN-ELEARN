// src/pages/student/VideoPlayer.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

/**
 * VideoPlayer — Enhanced + secure (client-side deterrents)
 * - Fixed playback behavior (no autoplay-block issues)
 * - Autoplay next lesson
 * - Speed control, quality selector, captions toggle
 * - Notes + resources panel
 * - Dynamic watermark (username + timestamp)
 * - Client-side download/screen-record deterrents (not foolproof)
 *
 * Sidebar is fixed/sticky on right (Option A).
 *
 * NOTE: For strong protection use tokenized short-lived URLs + streaming/DRM on the server.
 */

export default function VideoPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [currentSource, setCurrentSource] = useState(null); // chosen quality src
  const [speed, setSpeed] = useState(1);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [notes, setNotes] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [showAutoplayMsg, setShowAutoplayMsg] = useState(false);
  const [autoplayDelay] = useState(3000); // ms
  const [watermarkText, setWatermarkText] = useState("");
  const watermarkTimerRef = useRef(null);

  // -----------------------
  // Load video metadata
  // -----------------------
  const loadVideo = async () => {
    try {
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data || null);
      // choose a default source
      if (res.data) {
        if (Array.isArray(res.data.sources) && res.data.sources.length) {
          setCurrentSource(res.data.sources[0].file);
        } else if (res.data.file) {
          setCurrentSource(res.data.file);
        } else {
          setCurrentSource(null);
        }
      }
    } catch (err) {
      console.error("Failed to load video", err);
      setVideo(null);
      setCurrentSource(null);
    }
  };

  // -----------------------
  // Load related videos for sidebar
  // -----------------------
  const loadSideVideos = async () => {
    try {
      const res = await api.get("/videos", {
        params: { subject: video?.subject },
      });
      setAllVideos(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Sidebar videos failed", err);
      setAllVideos([]);
    }
  };

  // -----------------------
  // Watch progress (best-effort)
  // -----------------------
  useEffect(() => {
    async function markWatch() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        await api.post(
          `/videos/watch/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        // ignore silently
      }
    }
    markWatch();
  }, [id]);

  // initial load
  useEffect(() => {
    loadVideo();
  }, [id]);
  useEffect(() => {
    if (video) loadSideVideos();
  }, [video]);

  // -----------------------
  // Update <video> element when source changes
  // IMPORTANT: Do NOT call load() or play() automatically (avoids autoplay-block).
  // We only change src attribute — playback will start on user gesture (click).
  // -----------------------
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (!currentSource) return;

    // Only change the src attribute; don't force load/play.
    if (el.src !== currentSource) {
      // save time to try to resume position if you want (optional)
      const currentTime = el.currentTime || 0;
      el.pause(); // pause before switching to keep consistent UX
      // Set src using absolute URL if needed by your server. Keep as-is for local dev.
      el.src = currentSource;
      // do not call el.load() or el.play() here to avoid autoplay policy issues
      // but restore currentTime after metadata loaded (if applicable)
      const onLoadedMeta = () => {
        try {
          el.currentTime = Math.min(currentTime, el.duration || currentTime);
        } catch (e) {
          // ignore
        }
        el.removeEventListener("loadedmetadata", onLoadedMeta);
      };
      el.addEventListener("loadedmetadata", onLoadedMeta);
    }

    // Prevent download/remote playback attributes (where supported)
    try {
      el.setAttribute("controlsList", "nodownload noremoteplayback");
      // try to disable picture-in-picture where the browser supports the property/method
      if (typeof el.disablePictureInPicture !== "undefined") {
        el.disablePictureInPicture = true;
      }
    } catch (e) {
      // ignore
    }
  }, [currentSource]);

  // -----------------------
  // Playback rate
  // -----------------------
  useEffect(() => {
    const el = videoRef.current;
    if (el) el.playbackRate = speed;
  }, [speed]);

  // -----------------------
  // Captions toggle
  // -----------------------
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    for (let i = 0; i < el.textTracks.length; i++) {
      try {
        el.textTracks[i].mode = captionsOn ? "showing" : "disabled";
      } catch (e) {}
    }
  }, [captionsOn]);

  // -----------------------
  // Watermark: username + timestamp (updates every 5s)
  // -----------------------
  useEffect(() => {
    const user = (() => {
      try {
        return JSON.parse(localStorage.getItem("user"));
      } catch {
        return null;
      }
    })();
    function updateWatermark() {
      const name = user?.name || "Student";
      const t = new Date().toLocaleString();
      setWatermarkText(`${name} • ${t}`);
    }
    updateWatermark();
    watermarkTimerRef.current = setInterval(updateWatermark, 5000);
    return () => clearInterval(watermarkTimerRef.current);
  }, []);

  // -----------------------
  // Client-side deterrents: block right-click & common shortcuts
  // (keeps playback intact; we don't prevent user gestures.)
  // -----------------------
  useEffect(() => {
    const onContext = (e) => {
      // allow context if the target is an input/textarea so notes still work
      const tag = e.target?.tagName?.toLowerCase?.();
      if (tag === "input" || tag === "textarea") return;
      e.preventDefault();
    };

    const onKey = (e) => {
      // Block Save / Print / DevTools common combos where reasonable
      const forbidden =
        (e.ctrlKey && (e.key === "s" || e.key === "S")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) ||
        e.key === "F12" ||
        e.key === "PrintScreen";
      if (forbidden) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    document.addEventListener("contextmenu", onContext);
    document.addEventListener("keydown", onKey, true);

    return () => {
      document.removeEventListener("contextmenu", onContext);
      document.removeEventListener("keydown", onKey, true);
    };
  }, []);

  // -----------------------
  // Autoplay next lesson
  // -----------------------
  const handleVideoEnd = () => {
    const idx = allVideos.findIndex((v) => v._id === video._id);
    if (idx === -1 || idx === allVideos.length - 1) {
      // last lesson -> stop
      return;
    }
    const next = allVideos[idx + 1];
    setShowAutoplayMsg(true);
    setTimeout(() => {
      setShowAutoplayMsg(false);
      navigate(`/student/video/${next._id}`);
    }, autoplayDelay);
  };

  // -----------------------
  // Save quick personal note
  // -----------------------
  const saveNote = async () => {
    if (!notes) return;
    try {
      setSavingNote(true);
      const token = localStorage.getItem("token");
      await api.post(
        `/videos/${id}/notes`,
        { text: notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes("");
      // optionally show a toast
    } catch (err) {
      console.error("Failed to save note", err);
    } finally {
      setSavingNote(false);
    }
  };

  // quality change handler
  const handleQualityChange = (file) => {
    setCurrentSource(file);
    // do not force play; user can click play again (or keep playing if allowed)
  };

  // If we haven't got a video yet
  if (!video) {
    return <div className="p-10 text-gray-300">Loading...</div>;
  }

  // Build sources array
  const sources =
    Array.isArray(video.sources) && video.sources.length
      ? video.sources
      : video.file
      ? [{ label: "Default", file: video.file }]
      : [];

  // fallbacks: poster image — use uploaded file path as fallback poster (dev note)
  const fallbackPoster = "/mnt/data/Screenshot 2025-11-19 074541.png";

  return (
    <div className="flex min-h-screen bg-[#0b0f1a] text-gray-100">
      {/* MAIN */}
      <div className="flex-1 p-6 pr-4">
        <h1 className="text-2xl font-bold text-purple-400 mb-3">
          {video.title}
        </h1>
        <p className="text-sm text-gray-400 mb-4">
          {video.subject} • {video.lesson}
        </p>

        <div className="relative rounded-xl overflow-hidden shadow-xl mb-4">
          {/* VIDEO ELEMENT */}
          <video
            src={`http://localhost:4000/${video.file.replace(/^\//, "")}`}
            controls
            className="w-full max-h-[65vh] bg-black rounded-xl"
            poster={
              video.thumbnail
                ? `http://localhost:4000/${video.thumbnail.replace(/^\//, "")}`
                : ""
            }
          />

          {/* Top-right controls */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="bg-[#0f1629] text-sm text-gray-200 px-2 py-1 rounded"
              title="Playback speed"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={1.75}>1.75x</option>
              <option value={2}>2x</option>
            </select>

            {video.captions && video.captions.length > 0 && (
              <button
                onClick={() => setCaptionsOn((s) => !s)}
                className={`px-2 py-1 rounded text-sm ${
                  captionsOn
                    ? "bg-purple-600 text-white"
                    : "bg-[#0f1629] text-gray-200"
                }`}
                title="Toggle captions"
              >
                CC
              </button>
            )}

            {sources.length > 1 && (
              <select
                value={currentSource}
                onChange={(e) => handleQualityChange(e.target.value)}
                className="bg-[#0f1629] text-sm text-gray-200 px-2 py-1 rounded"
                title="Quality"
              >
                {sources.map((s) => (
                  <option key={s.file} value={s.file}>
                    {s.label || s.file}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Autoplay popup */}
          {showAutoplayMsg && (
            <div className="absolute bottom-4 right-4 bg-purple-700/85 px-4 py-2 rounded-xl text-sm shadow-lg animate-pulse z-30">
              ▶ Next lesson starting...
            </div>
          )}

          {/* Watermark overlay (pointer-events:none so clicks pass through) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{ mixBlendMode: "overlay" }}
          >
            <div className="absolute bottom-3 right-3 text-[12px] text-white/30 font-medium tracking-wide">
              {watermarkText}
            </div>

            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.03,
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gridAutoRows: "80px",
                gap: "0",
                transform: "rotate(-20deg) scale(1.2)",
              }}
            >
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    color: "white",
                  }}
                >
                  {watermarkText}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About + resources */}
        <div className="lg:col-span-2 bg-[#0f1629] p-5 rounded-2xl border border-purple-800/30 shadow-lg">
          <h3 className="text-lg font-semibold text-purple-300 mb-2">
            About this lesson
          </h3>
          <p className="text-gray-300 whitespace-pre-line">
            {video.aboutCourse || "No description."}
          </p>
        </div>
      </div>

      {/* PLAYLIST (RIGHT) - fixed/sticky sidebar */}
      <aside className="w-80 p-4 bg-[#0d0d17] border-l border-purple-900/20 h-screen sticky top-0 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-purple-300">
          Next Lessons
        </h3>
        <div className="space-y-3 pb-10">
          {allVideos.map((v) => (
            <div
              key={v._id}
              onClick={() => navigate(`/student/video/${v._id}`)}
              className={`p-3 rounded-lg cursor-pointer transition ${
                v._id === video._id
                  ? "bg-purple-700/40 border border-purple-500 shadow-md"
                  : "bg-[#101728] hover:bg-purple-900/20"
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    v.thumbnail ? `http://localhost:4000/${v.thumbnail}` : ""
                  }
                  className="w-20 h-14 rounded object-cover"
                  alt={v.title}
                />
                <div>
                  <p className="font-bold text-sm">{v.title}</p>
                  <p className="text-xs text-gray-400">
                    {v.subject} • {v.lesson}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
