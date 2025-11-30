import React, { useEffect, useRef, useState } from "react";
import { subjectMap } from "../../../utils/courseOptions";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function SubjectTabs({ onChange }) {
  const navigate = useNavigate();
  const { subject: urlSubject } = useParams();
  const location = useLocation();

  const activeChipRef = useRef(null); 

  const [subjects, setSubjects] = useState([]);
  const [active, setActive] = useState(
    urlSubject || localStorage.getItem("activeSubject") || ""
  );

  const group = localStorage.getItem("activeGroup")?.toUpperCase();
  const standard = localStorage.getItem("activeStandard");
  const groupCode = localStorage.getItem("activeGroupCode");

  const basePath = location.pathname.split("/")[2];

  /* =============================================
        GET SUBJECT BASED ON GROUP & STANDARD
  ============================================= */
  const getSubjects = () => {
    if (!group) return [];

    const code = (groupCode || "").toLowerCase();

    if (group === "ROOT" || group === "STEM") {
      return ["Tamil", "English", "Maths", "Science", "Social Science"];
    }

    if (group === "LEAF") {
      if (standard === "9th" || standard === "10th")
        return ["Tamil", "English", "Maths", "Science", "Social Science"];

      if (standard === "11th" || standard === "12th") {
        if (code.includes("bio"))
          return ["Tamil", "English", "Maths", "Physics", "Chemistry", "Biology"];

        if (code.includes("computer"))
          return ["Tamil", "English", "Maths", "Computer Science", "Physics", "Chemistry"];

        if (code.includes("commerce"))
          return ["Tamil", "English", "Accountancy", "Economics", "Business Studies", "Statistics"];

        if (code.includes("arts"))
          return ["Tamil", "English", "History", "Political Science", "Economics"];
      }
    }

    if (["FLOWER", "FRUIT", "SEED"].includes(group)) {
      return subjectMap[group] || [];
    }

    return [];
  };

  /* =============================================
        LOAD SUBJECTS AND SET ACTIVE SUBJECT
  ============================================= */
  useEffect(() => {
    const list = getSubjects();
    setSubjects(list);

    if (!list.length) {
      setActive("");
      localStorage.removeItem("activeSubject");
      onChange?.(null);
      return;
    }

    if (urlSubject && list.includes(urlSubject)) {
      setActive(urlSubject);
      localStorage.setItem("activeSubject", urlSubject);
      onChange?.(urlSubject);
      return;
    }

    const saved = list.includes(localStorage.getItem("activeSubject"))
      ? localStorage.getItem("activeSubject")
      : list[0];

    setActive(saved);
    localStorage.setItem("activeSubject", saved);
    onChange?.(saved);

    navigate(`/student/${basePath}/${saved}`, { replace: true });
  }, [group, standard, groupCode, urlSubject]);

  /* =============================================
        AUTO SCROLL TO ACTIVE TAB
  ============================================= */
  useEffect(() => {
    if (activeChipRef.current) {
      activeChipRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [active]);

  /* =============================================
        HANDLE CLICK
  ============================================= */
  const selectSubject = (s) => {
    setActive(s);
    localStorage.setItem("activeSubject", s);
    onChange?.(s);

    navigate(`/student/${basePath}/${s}`);
  };

  if (!subjects.length) return null;

  /* =============================================
        UI (Ultra Responsive & Smooth)
  ============================================= */
  return (
    <div className="relative w-full overflow-x-auto scrollbar-hide mb-8 py-1">
      <div className="flex flex-nowrap gap-3 px-1">
        {subjects.map((s) => {
          const isActive = active === s;

          return (
            <button
              key={s}
              ref={isActive ? activeChipRef : null}
              onClick={() => selectSubject(s)}
              className={`
                px-6 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition-all duration-300
                border 
                ${
                  isActive
                    ? "bg-purple-600 border-purple-400 shadow-lg scale-105 text-white"
                    : "bg-[#151827] border-transparent text-gray-300 hover:bg-purple-900/60 hover:text-white"
                }
              `}
            >
              {s}
            </button>
          );
        })}
      </div>

      {/* Gradient Fade (left + right) */}
      <div className="pointer-events-none absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-[#0b0f1a] to-transparent"></div>
      <div className="pointer-events-none absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-[#0b0f1a] to-transparent"></div>
    </div>
  );
}
