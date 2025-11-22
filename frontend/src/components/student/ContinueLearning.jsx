import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MdPlayCircle } from "react-icons/md";
import { RiBookOpenLine } from "react-icons/ri";

export default function ContinueLearning({ selectedCourse }) {
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  function getCourseName(c) {
    if (!c) return "";

    if (c.standard) {
      let name = `${c.standard}`;

      if (c.groupCode) name += ` - ${c.groupCode}`;
      if (c.board) name += ` | ${c.board}`;
      if (c.language) name += ` | ${c.language}`;

      return name;
    }

    if (c.title) {
      return c.title;
    }

    return c.group?.toUpperCase() || "Course";
  }

  useEffect(() => {
    async function loadVideo() {
      if (!selectedCourse) {
        setItem(null);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await api.get("/videos", {
          headers,
          params: {
            standard: selectedCourse.standard,
            board: selectedCourse.board,
            language: selectedCourse.language,
            limit: 1,
          },
        });

        if (res.data && res.data.length > 0) {
          const v = res.data[0];

          setItem({
            title: v.title,
            duration: v.duration || "—",
            lessonsCount: res.data.length,
            videoId: v._id,
          });
        } else {
          setItem(null);
        }
      } catch (error) {
        console.error("Continue Learning Error:", error);
        setItem(null);
      }
    }

    loadVideo();
  }, [selectedCourse]);

  if (!selectedCourse) {
    return (
      <div className="bg-[#0d0d17] p-5 rounded-2xl border border-purple-900/20 shadow-lg text-gray-400">
        No course selected. Choose a course first.
      </div>
    );
  }

  const displayName = getCourseName(selectedCourse);

  return (
    <div
      className="
        bg-[#0d0d1a]
        p-6 rounded-2xl
        shadow-xl
        border border-purple-800/20
        text-gray-200
      "
    >
      <h3 className="font-semibold text-xl text-purple-300 mb-5">
        Continue Learning — <span className="text-white">{displayName}</span>
      </h3>

      {item ? (
        <div className="flex items-center gap-6 group">
          <div
            className="
              w-28 h-20
              bg-gradient-to-br from-purple-600 to-indigo-700
              rounded-xl
              flex items-center justify-center
            "
          >
            <MdPlayCircle className="text-4xl text-white" />
          </div>

          <div className="flex-1">
            <div className="text-lg font-bold text-gray-100">{item.title}</div>

            <div className="text-sm text-gray-400 mt-1 flex items-center gap-2">
              <RiBookOpenLine className="text-purple-300" />
              {item.duration}
            </div>
          </div>

          <button
            onClick={() => navigate(`/student/video/${item.videoId}`)}
            className="
              bg-purple-600 hover:bg-purple-700
              px-5 py-2 rounded-xl text-white
              font-semibold
            "
          >
            Resume
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-400 mt-3">
          No videos found for this course yet.
        </p>
      )}
    </div>
  );
}
