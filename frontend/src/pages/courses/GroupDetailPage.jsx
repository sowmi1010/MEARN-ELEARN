import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";

// Icons (you already use react-icons in the project)
import { FiBookOpen, FiGlobe, FiMessageCircle, FiAward, FiClock } from "react-icons/fi";
import { BsStars } from "react-icons/bs";

import rootBanner from "/Root.png";
import stemBanner from "/Stem.png";
import leafBanner from "/Leaf.png";
import flowerBanner from "/Flower.png";
import fruitBanner from "/Fruits.png";
import seedBanner from "/Seed.png";

export default function GroupDetailPage() {
  const { groupName } = useParams();
  const navigate = useNavigate();

  const [standard, setStandard] = useState("");
  const [board, setBoard] = useState("");
  const [language, setLanguage] = useState("");
  const [groupCode, setGroupCode] = useState("");

  const banners = {
    root: rootBanner,
    stem: stemBanner,
    leaf: leafBanner,
    flower: flowerBanner,
    fruit: fruitBanner,
    seed: seedBanner,
  };

  const boardOptions = ["CBSE", "ICSE", "NIOS", "Tamil Nadu", "Kerala"];
  const languageOptions = ["English", "Tamil", "Hindi", "Malayalam", "Telugu"];

  const standards = {
    root: ["1st", "2nd", "3rd", "4th"],
    stem: ["5th", "6th", "7th", "8th"],
    leaf: ["9th", "10th", "11th", "12th"],
  };

  const leafGroupCodes = [
    "Group 1 – Bio-Maths",
    "Group 2 – Maths-CS",
    "Group 3 – Bio-CS",
    "Group 4 – Commerce-CS",
  ];

  const planPrices = {
    root: { monthly: 300, yearly: 3300 },
    stem: { monthly: 400, yearly: 4400 },
    leaf: { monthly: 500, yearly: 5500 },
  };

  const flowerCourses = [
    { title: "NEET", img: "/Neet.png", price: 1000 },
    { title: "JEE Main", img: "/Jee.png", price: 1000 },
    { title: "AIIMS", img: "/Aiims.png", price: 1000 },
  ];

  const fruitCourses = [
    { title: "TNPSC", img: "/tnpsc.png", price: 1500 },
    { title: "UPSC", img: "/upsc.png", price: 1500 },
  ];

  const seedCourses = [
    { title: "Python", img: "/python.png", price: 1500 },
    { title: "React", img: "/react.png", price: 1500 },
    { title: "SE", img: "/se.png", price: 1500 },
  ];

  const professionalCourses =
    groupName === "flower"
      ? flowerCourses
      : groupName === "fruit"
      ? fruitCourses
      : seedCourses;

  const isPrimary = ["root", "stem", "leaf"].includes(groupName);

  // ---------- Progress bar (form completion) ----------
  const progress = useMemo(() => {
    let total = 3; // standard, board, language
    let done = 0;

    if (standard) done++;
    if (board) done++;
    if (language) done++;

    if (groupName === "leaf") {
      total += 1;
      if (groupCode) done++;
    }

    return Math.round((done / total) * 100);
  }, [standard, board, language, groupCode, groupName]);

  function handlePrimaryEnroll(type) {
    if (!standard || !board || !language) {
      return alert("Please select Standard, Board and Language");
    }

    if (groupName === "leaf" && !groupCode) {
      return alert("Please select Group Code");
    }

    navigate(`/payment/${groupName}-${type}`, {
      state: {
        title: `${groupName.toUpperCase()} ${type.toUpperCase()}`,
        price: planPrices[groupName][type],
        img: banners[groupName],
        group: groupName,
        standard,
        board,
        language,
        groupCode,
      },
    });
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050b18] px-4 sm:px-6 lg:px-10 py-10 transition-colors duration-300">

      {/* ===== BANNER / TITLE ===== */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <img
          src={banners[groupName]}
          className="w-[220px] md:w-[340px] lg:w-[420px] object-contain  animate-[fadeIn_0.7s_ease-out]"
        />
        <p className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-300 tracking-wide uppercase">
          <FiBookOpen />
          Personalised learning plan for{" "}
          <span className="font-semibold">{groupName?.toUpperCase()} Group</span>
        </p>
      </div>

      {/* ==================== ROOT / STEM / LEAF ==================== */}
      {isPrimary && (
        <>
          {/* ===== SELECT BOX CARD ===== */}
          <div className="max-w-6xl mx-auto bg-white/80 dark:bg-[#0d172b]/90 backdrop-blur-xl p-6 md:p-8 lg:p-10 rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.25)] border border-white/60 dark:border-white/10 relative overflow-hidden">

            {/* subtle gradient glow */}
            <div className="pointer-events-none absolute -right-16 -top-16 w-56 h-56 bg-gradient-to-br from-indigo-400/20 via-purple-500/10 to-cyan-400/0 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
                <h2 className="flex items-center gap-2 text-lg md:text-2xl font-extrabold text-[#5b5af7] dark:text-indigo-400">
                  <BsStars className="text-xl md:text-2xl" />
                  Select Your Details
                </h2>

                <span className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                  <FiClock />
                  Takes less than <b>30 seconds</b>
                </span>
              </div>

              {/* SELECT FIELDS */}
              <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                {/* Standard */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <FiBookOpen />
                    Standard
                  </label>
                  <select
                    value={standard}
                    onChange={(e) => setStandard(e.target.value)}
                    className="w-full p-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121b2e] text-sm sm:text-base text-black dark:text-white outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
                  >
                    <option value="">Select Standard</option>
                    {standards[groupName].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Board */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <FiGlobe />
                    Board
                  </label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full p-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121b2e] text-sm sm:text-base text-black dark:text-white outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
                  >
                    <option value="">Select Board</option>
                    {boardOptions.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Language */}
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <FiMessageCircle />
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121b2e] text-sm sm:text-base text-black dark:text-white outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
                  >
                    <option value="">Select Language</option>
                    {languageOptions.map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Leaf group code */}
              {groupName === "leaf" && (
                <div className="mt-5 space-y-1">
                  <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    <FiAward />
                    Group Code
                  </label>
                  <select
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                    className="w-full p-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#121b2e] text-sm sm:text-base text-black dark:text-white outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
                  >
                    <option value="">Select Group Code</option>
                    {leafGroupCodes.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* PROGRESS BAR */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Profile completion</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ===== PRICING CARDS ===== */}
          <div className="flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-10 mt-12">

            {/* Monthly */}
            <div className="relative w-full max-w-sm mx-auto bg-gradient-to-br from-blue-500/8 via-cyan-400/10 to-blue-500/5 dark:from-[#162131] dark:via-[#0b1423] dark:to-[#050818] backdrop-blur-xl p-7 sm:p-8 rounded-3xl shadow-[0_18px_50px_rgba(15,23,42,0.5)] border border-white/80 dark:border-white/10 transform hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(15,23,42,0.85)] transition-all duration-300">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-500 font-semibold mb-2">
                Comfort Plan
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                Monthly Plan
              </h3>

              <p className="mt-4 text-4xl sm:text-5xl font-extrabold text-cyan-500">
                ₹ {planPrices[groupName].monthly}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Billed every month • Pause anytime
              </p>

              <ul className="mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
                <li>• Ideal for trying the platform</li>
                <li>• Access to all lessons for this group</li>
                <li>• Live doubt sessions & recordings</li>
              </ul>

              <button
                onClick={() => handlePrimaryEnroll("monthly")}
                className="mt-6 w-full py-3 rounded-xl font-semibold text-sm sm:text-base bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Enroll Monthly
              </button>
            </div>

            {/* Yearly - Recommended */}
            <div className="relative w-full max-w-sm mx-auto bg-gradient-to-br from-amber-300/25 via-yellow-400/30 to-orange-400/20 dark:from-[#3a2b00] dark:via-[#2b2100] dark:to-[#1b1400] backdrop-blur-xl p-8 rounded-3xl shadow-[0_22px_70px_rgba(180,83,9,0.65)] border-2 border-yellow-400/80 transform md:scale-105 hover:scale-110 hover:-translate-y-3 transition-all duration-300">

              {/* Recommended badge */}
              <div className="absolute -top-3 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] sm:text-xs font-semibold shadow-lg">
                <BsStars className="text-xs" />
                Recommended
              </div>

              <p className="text-xs uppercase tracking-[0.25em] text-yellow-700 dark:text-yellow-300 font-semibold mb-2">
                Value Plan
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                Yearly Plan
              </h3>

              <p className="mt-4 text-4xl sm:text-5xl font-extrabold text-yellow-500">
                ₹ {planPrices[groupName].yearly}
              </p>
              <p className="mt-1 text-xs text-gray-700 dark:text-yellow-100">
                Save more than 2 months of fees
              </p>

              <ul className="mt-4 text-xs sm:text-sm text-gray-700 dark:text-yellow-50 space-y-1.5">
                <li>• Unlimited access for 12 months</li>
                <li>• Priority doubt support & mentor calls</li>
                <li>• Exclusive revision bootcamps</li>
              </ul>

              <button
                onClick={() => handlePrimaryEnroll("yearly")}
                className="mt-6 w-full py-3 rounded-xl font-semibold text-sm sm:text-base bg-yellow-500 hover:bg-yellow-600 text-black flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-2xl"
              >
                <FiAward />
                Enroll Yearly
              </button>
            </div>
          </div>
        </>
      )}

      {/* ==================== FLOWER / FRUIT / SEED ==================== */}
      {!isPrimary && (
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">
          {professionalCourses.map((c, index) => (
            <div
              key={index}
              className="group bg-gradient-to-br from-[#091933] via-[#050b1d] to-[#020818] p-6 rounded-3xl shadow-[0_18px_55px_rgba(15,23,42,0.75)] text-white hover:-translate-y-2 hover:shadow-[0_24px_80px_rgba(15,23,42,0.9)] transition-all duration-300 border border-slate-800/60"
            >
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition duration-300" />
                  <img
                    src={c.img}
                    className="relative w-24 h-24 mx-auto object-contain drop-shadow-lg"
                  />
                </div>

                <h2 className="text-xl text-center font-bold mt-4 tracking-wide">
                  {c.title}
                </h2>

                <p className="text-center text-green-400 text-lg font-semibold mt-2">
                  ₹ {c.price}
                </p>

                <button
                  onClick={() =>
                    navigate(`/payment/${groupName}-${index}`, {
                      state: {
                        title: c.title,
                        price: c.price,
                        img: c.img,
                        group: groupName,
                      },
                    })
                  }
                  className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-lg group-hover:shadow-2xl"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
