import React, { useEffect, useState } from "react";
import { subjectMap } from "../../../utils/courseOptions";
import { useNavigate, useParams, useLocation } from "react-router-dom";

export default function SubjectTabs({ onChange }) {
  const navigate = useNavigate();
  const { subject: urlSubject } = useParams();
  const location = useLocation();

  const [subjects, setSubjects] = useState([]);
  const [active, setActive] = useState(
    urlSubject || localStorage.getItem("activeSubject") || ""
  );

  const group = localStorage.getItem("activeGroup")?.toUpperCase();
  const standard = localStorage.getItem("activeStandard");
  const groupCode = localStorage.getItem("activeGroupCode"); // BIO MATHS / COMPUTER / COMMERCE

  const basePath = location.pathname.split("/")[2];
  // videos | notes | books | tests | quiz

  /* =====================================
      GET SUBJECT LIST BASED ON GROUP
  ===================================== */
  function getSubjects() {
    if (!group) return [];

    const code = (groupCode || "").toLowerCase();

    // ✅ ROOT / STEM
    if (group === "ROOT" || group === "STEM") {
      return ["Tamil", "English", "Maths", "Science", "Social Science"];
    }

    // ✅ LEAF (9th–12th)
    if (group === "LEAF") {
      // 9th & 10th
      if (standard === "9th" || standard === "10th") {
        return ["Tamil", "English", "Maths", "Science", "Social Science"];
      }

      // 11th & 12th
      if (standard === "11th" || standard === "12th") {
        // ✅ BIO-MATHS
        if (code.includes("bio")) {
          return [
            "Tamil",
            "English",
            "Maths",
            "Physics",
            "Chemistry",
            "Biology",
          ];
        }

        // ✅ COMPUTER SCIENCE
        if (code.includes("computer")) {
          return [
            "Tamil",
            "English",
            "Maths",
            "Computer Science",
            "Physics",
            "Chemistry",
          ];
        }

        // ✅ COMMERCE
        if (code.includes("commerce")) {
          return [
            "Tamil",
            "English",
            "Accountancy",
            "Economics",
            "Business Studies",
            "Statistics",
          ];
        }

        // ✅ ARTS
        if (code.includes("arts")) {
          return [
            "Tamil",
            "English",
            "History",
            "Political Science",
            "Economics",
          ];
        }
      }
    }

    // ✅ FLOWER / FRUIT / SEED
    if (["FLOWER", "FRUIT", "SEED"].includes(group)) {
      return subjectMap[group] || [];
    }

    return [];
  }

  /* =====================================
      LOAD SUBJECTS
  ===================================== */
  useEffect(() => {
    const list = getSubjects();
    setSubjects(list);

    if (list.length === 0) {
      setActive("");
      localStorage.removeItem("activeSubject");
      onChange?.(null);
      return;
    }

    if (urlSubject && list.includes(urlSubject)) {
      setActive(urlSubject);
      localStorage.setItem("activeSubject", urlSubject);
      onChange?.(urlSubject);
    } else {
      const saved =
        localStorage.getItem("activeSubject") &&
        list.includes(localStorage.getItem("activeSubject"))
          ? localStorage.getItem("activeSubject")
          : list[0];

      setActive(saved);
      localStorage.setItem("activeSubject", saved);
      onChange?.(saved);

      navigate(`/student/${basePath}/${saved}`, { replace: true });
    }
  }, [group, standard, groupCode, urlSubject]);

  /* =====================================
      CLICK HANDLER
  ===================================== */
  function selectSubject(s) {
    setActive(s);
    localStorage.setItem("activeSubject", s);
    onChange?.(s);
    navigate(`/student/${basePath}/${s}`);
  }

  /* =====================================
      IF NO SUBJECTS → HIDE
  ===================================== */
  if (!subjects || subjects.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mb-10">
      {subjects.map((s) => (
        <button
          key={s}
          onClick={() => selectSubject(s)}
          className={`
            px-6 py-2 rounded-full font-semibold text-sm
            transition-all duration-300
            ${
              active === s
                ? "bg-purple-600 text-white shadow-md scale-105"
                : "bg-[#151827] text-gray-300 hover:bg-purple-900 hover:text-white"
            }
          `}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
