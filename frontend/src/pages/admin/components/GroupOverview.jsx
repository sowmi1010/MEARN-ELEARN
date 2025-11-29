import React, { useMemo } from "react";

export default function GroupOverview({ students }) {

  // always safe array
  const safeStudents = Array.isArray(students) ? students : [];

  const groupStats = useMemo(() => {
    const counts = {
      ROOT: 0,
      STEM: 0,
      LEAF: 0,
      FLOWER: 0,
      FRUIT: 0,
      SEED: 0,
    };

    safeStudents.forEach((s) => {
      const g = (s?.group || "").toUpperCase();
      if (counts[g] !== undefined) counts[g]++;
    });

    return [
      {
        key: "ROOT",
        name: "ROOT GROUP",
        students: counts.ROOT,
        image: "/Root.png",
        color: "from-emerald-500 to-green-600",
      },
      {
        key: "STEM",
        name: "STEM GROUP",
        students: counts.STEM,
        image: "/Stem.png",
        color: "from-yellow-400 to-orange-500",
      },
      {
        key: "LEAF",
        name: "LEAF GROUP",
        students: counts.LEAF,
        image: "/Leaf.png",
        color: "from-green-400 to-lime-600",
      },
      {
        key: "FLOWER",
        name: "FLOWER GROUP",
        students: counts.FLOWER,
        image: "/Flower.png",
        color: "from-pink-500 to-rose-600",
      },
      {
        key: "FRUIT",
        name: "FRUIT GROUP",
        students: counts.FRUIT,
        image: "/Fruits.png",
        color: "from-orange-500 to-red-600",
      },
      {
        key: "SEED",
        name: "SEED GROUP",
        students: counts.SEED,
        image: "/Seed.png",
        color: "from-violet-500 to-purple-600",
      },
    ];
  }, [safeStudents]);

  return (
    <div className="bg-[#0e162b] p-6 rounded-2xl border border-blue-900/40 shadow-xl">
      <h2 className="text-lg font-bold text-blue-400 mb-5">Group Overview</h2>

      <div className="grid grid-cols-2 gap-5">
        {groupStats.map((g) => (
          <div
            key={g.key}
            className="
              relative overflow-hidden rounded-xl p-4 text-center
              bg-[#050810] border border-blue-900/30
              hover:scale-105 transition-all shadow-md
            "
          >
            <div
              className={`absolute inset-0 opacity-20 bg-gradient-to-r ${g.color} blur-2xl`}
            />

            <div className="relative z-10">
              <img
                src={g.image}
                alt={g.name}
                className="mx-auto w-20 h-20 object-contain mb-2"
              />
              <p className="font-bold text-white tracking-wide">{g.name}</p>
              <p className="text-sm text-gray-400 mt-1">Total Students</p>
              <p className="text-lg font-extrabold text-blue-300 mt-1">
                {g.students}
              </p>
            </div>

            <div
              className={`absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r ${g.color}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
