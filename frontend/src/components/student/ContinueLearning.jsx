import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MdPlayCircle } from "react-icons/md";
import { RiBookOpenLine } from "react-icons/ri";

export default function ContinueLearning({ selectedCourse }) {
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  // ✅ Build clean display title
  function getCourseName(c) {
    if (!c) return "";

    // School groups
    if (c.standard) {
      let name = `${c.standard}`;

      if (c.groupCode) name += ` - ${c.groupCode}`;
      if (c.board) name += ` | ${c.board}`;
      if (c.language) name += ` | ${c.language}`;

      return name;
    }

    // Skills / Competitive
    if (c.title) {
      return c.title;
    }

    return c.group?.toUpperCase() || "Course";
  }

  useEffect(() => {
    async function loadLastWatched() {
      if (!selectedCourse?._id) {
        setItem(null);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // ✅ Try to get last watched video
        const res = await api.get(`/progress/last-watched`, {
          headers,
          params: { courseId: selectedCourse._id },
        });

        if (res.data?.video) {
          setItem({
            title: res.data.video.title,
            duration: res.data.video.duration || "—",
            lessonsCount: res.data.courseLessonsCount || 0,
            videoId: res.data.video._id,
          });
          return;
        }
      } catch {}

      // ✅ Fallback – first video of course
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const vRes = await api.get("/videos", {
          headers,
          params: { course: selectedCourse._id, limit: 1 },
        });

        const videos = Array.isArray(vRes.data)
          ? vRes.data
          : vRes.data.videos || [];

        if (videos.length) {
          setItem({
            title: videos[0].title,
            duration: videos[0].duration || "—",
            lessonsCount: videos.length,
            videoId: videos[0]._id,
          });
        } else {
          setItem(null);
        }
      } catch {
        setItem(null);
      }
    }

    loadLastWatched();
  }, [selectedCourse]);

  /* =====================================================
        NO COURSE SELECTED
  ===================================================== */
  if (!selectedCourse) {
    return (
      <div className="bg-gradient-to-br from-[#0c0c18] to-[#0a0a14] p-6 rounded-2xl shadow-xl border border-purple-800/20 text-gray-300 backdrop-blur-lg">
        <h3 className="font-semibold text-xl text-purple-300 mb-2">
          Continue Learning
        </h3>
        <p className="text-sm text-gray-400">
          No course selected. Choose a course from dropdown.
        </p>
      </div>
    );
  }

  const displayName = getCourseName(selectedCourse);

  /* =====================================================
        MAIN UI
  ===================================================== */
  return (
    <div
      className="
      bg-gradient-to-br from-[#0d0d1a] to-[#090912]
      p-6 rounded-2xl shadow-xl border border-purple-800/20
      backdrop-blur-xl text-gray-200 transition-all hover:shadow-purple-700/20
    "
    >
      {/* Heading */}
      <h3 className="font-semibold text-xl text-purple-300 mb-5">
        Continue Learning —{" "}
        <span className="text-white">{displayName}</span>
      </h3>

      {/* If found video */}
      {item ? (
        <div className="flex items-center gap-6 group">
          {/* Thumbnail */}
          <div
            className="
            w-28 h-20 
            bg-gradient-to-br from-purple-600 to-indigo-700 
            rounded-xl shadow-lg 
            flex items-center justify-center
            group-hover:scale-105 transition
            "
          >
            <MdPlayCircle className="text-4xl text-white drop-shadow-lg" />
          </div>

          {/* Video details */}
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-100 group-hover:text-purple-300 transition">
              {item.title}
            </div>

            <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
              <RiBookOpenLine className="text-purple-300" />
              {item.duration} • {item.lessonsCount} lessons
            </div>
          </div>

          {/* Resume */}
          <button
            onClick={() =>
              navigate(
                `/student/videos?course=${selectedCourse._id}&video=${item.videoId}`
              )
            }
            className="
              bg-purple-600 hover:bg-purple-700
              px-5 py-2 rounded-xl text-white
              font-semibold shadow shadow-purple-900/40
              transition-all hover:scale-105
            "
          >
            Resume
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          No videos found for this course yet.
        </p>
      )}
    </div>
  );
}
