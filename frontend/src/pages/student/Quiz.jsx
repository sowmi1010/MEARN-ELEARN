import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function QuizWheel() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Load all quiz questions
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await api.get("/quizzes", { headers });

        setQuizzes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to load quizzes", err);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔍 Global search listener
  useEffect(() => {
    const handle = (e) => {
      const text = (e?.detail || "").toString().trim();
      setFilter(text);
    };

    window.addEventListener("global-search", handle);
    return () => window.removeEventListener("global-search", handle);
  }, []);

  // 🔥 Step 1 — Client-side filter
  const filteredList = useMemo(() => {
    if (!filter) return quizzes;
    const q = filter.toLowerCase();

    return quizzes.filter((z) =>
      (z.subject || "").toLowerCase().includes(q) ||
      (z.lesson || "").toLowerCase().includes(q) ||
      (z.question || "").toLowerCase().includes(q)
    );
  }, [filter, quizzes]);

  // 🔥 Step 2 — Group by (subject + lesson)
  const grouped = useMemo(() => {
    const g = {};

    filteredList.forEach((item) => {
      const key = `${item.subject}__${item.lesson || ""}`;

      if (!g[key]) {
        g[key] = {
          subject: item.subject,
          lesson: item.lesson,
          title: `${item.subject} ${item.lesson ? "• " + item.lesson : ""}`,
          questions: []
        };
      }

      g[key].questions.push(item);
    });

    return Object.values(g); // convert object → array
  }, [filteredList]);

  // 🔥 Step 3 — Apply wheel positions (circle layout)
  const positions = useMemo(() => {
    const n = grouped.length || 1;
    const radius = 220;
    const arr = [];

    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2;
      const deg = (angle * 180) / Math.PI;

      arr.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        deg
      });
    }
    return arr;
  }, [grouped.length]);

  // Start quiz → pass group instead of one question
  function handleStart(group) {
    navigate(`/student/quiz/play/${group.questions[0]._id}?count=${group.questions.length}`);
  }

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-[#070712] to-[#090a11] text-gray-100">

      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-purple-400 tracking-tight">Challenge Arena</h1>
          <p className="text-gray-400 mt-1">
            Spin the wheel — pick a quiz and conquer it.  
            Use global search to filter quizzes.
          </p>
        </div>

        <div className="text-sm text-gray-300">
          <div className="inline-flex items-center gap-3 bg-[#0f1629] px-3 py-2 rounded-full border border-purple-800/30">
            <span className="text-xs text-gray-400">Showing</span>
            <div className="font-bold text-purple-300">{grouped.length}</div>
            <span className="text-xs text-gray-400">topics</span>
          </div>
        </div>
      </header>

      {loading && (
        <div className="text-center text-gray-400 py-20">Loading quizzes…</div>
      )}

      {/* MOBILE layout */}
      <section className="lg:hidden space-y-4">
        {grouped.map((g, i) => (
          <article
            key={i}
            className="bg-gradient-to-r from-[#0e1220] to-[#0b0f19] border border-purple-800/30 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg bg-purple-700 flex items-center justify-center text-white text-xl font-bold">
                {g.questions.length}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-300">{g.title}</h3>
                <p className="text-sm text-gray-400">Total Questions: {g.questions.length}</p>
              </div>

              <button
                onClick={() => handleStart(g)}
                className="bg-purple-600 px-4 py-2 rounded-lg"
              >
                Start
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* DESKTOP Wheel */}
      <section className="hidden lg:block relative h-[640px]">

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[520px] h-[520px] flex items-center justify-center">

            {/* Center card */}
            <div className="z-20 w-60 h-40 rounded-2xl bg-[#0b1020] border border-purple-800/40 shadow-lg flex flex-col items-center justify-center text-center p-4">
              <div className="text-sm text-gray-400">Pick a Quiz</div>
              <div className="text-xl font-extrabold text-purple-300 mt-2">Spin & Learn</div>
              <div className="mt-3 text-xs text-gray-500">Use global search to filter</div>
            </div>

            {/* Wheel Ring */}
            <div className="absolute inset-0 rounded-full border border-purple-900/20"></div>

            {/* Items */}
            {grouped.map((g, i) => {
              const pos = positions[i];
              const transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.deg}deg)`;
              const inner = `rotate(${-pos.deg}deg)`;

              return (
                <button
                  key={i}
                  onClick={() => handleStart(g)}
                  className="absolute transform transition-all duration-500 hover:scale-110 focus:outline-none"
                  style={{
                    transform,
                    top: "50%",
                    left: "50%",
                    transformOrigin: "center"
                  }}
                >
                  <div
                    className="w-48 h-28 rounded-xl bg-[#0f172a] border border-purple-800/40 shadow-lg flex items-center p-3"
                    style={{ transform: inner }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-purple-700 text-white font-bold flex items-center justify-center mr-3">
                      {g.questions.length}
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-purple-300">{g.title}</div>
                      <div className="text-xs text-gray-400">
                        {g.subject} • {g.lesson}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}

          </div>
        </div>
      </section>

      <footer className="mt-10 text-center text-gray-500 text-sm">
        {grouped.length === 0
          ? "No quizzes match your search."
          : "Tip: Hover a card — click to start."}
      </footer>

    </main>
  );
}
