import React from "react";

const groups = [
  {
    name: "ROOT GROUP",
    students: 200,
    image: "/Root.png",
    color: "from-emerald-500 to-green-600",
  },
  {
    name: "STEM GROUP",
    students: 200,
    image: "/Stem.png",
    color: "from-yellow-400 to-orange-500",
  },
  {
    name: "LEAF GROUP",
    students: 1200,
    image: "/Leaf.png",
    color: "from-green-400 to-lime-600",
  },
  {
    name: "FLOWER GROUP",
    students: 200,
    image: "/Flower.png",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "FRUIT GROUP",
    students: 200,
    image: "/Fruits.png",
    color: "from-orange-500 to-red-600",
  },
  {
    name: "SEED GROUP",
    students: 200,
    image: "/Seed.png",
    color: "from-violet-500 to-purple-600",
  },
];

export default function GroupOverview() {
  return (
    <div
      className="
        bg-[#0e162b]
        p-6
        rounded-2xl
        border border-blue-900/40
        shadow-xl
      "
    >
      <h2 className="text-lg font-bold text-blue-400 mb-5">
        Group Overview
      </h2>

      <div className="grid grid-cols-2 gap-5">
        {groups.map((g, i) => (
          <div
            key={i}
            className="
              relative overflow-hidden
              rounded-xl p-4 text-center
              bg-[#050810]
              border border-blue-900/30
              hover:scale-105 transition-all
              shadow-md
              group
            "
          >
            {/* Glow background */}
            <div
              className={`absolute inset-0 opacity-20 bg-gradient-to-r ${g.color} blur-2xl`}
            />

            <div className="relative z-10">
              <img
                src={g.image}
                alt={g.name}
                className="mx-auto w-20 h-20 object-contain mb-2"
              />

              <p className="font-bold text-white tracking-wide">
                {g.name}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Total Students
              </p>

              <p className="text-lg font-extrabold text-blue-300 mt-1">
                {g.students}
              </p>
            </div>

            {/* Bottom line accent */}
            <div
              className={`absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r ${g.color}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
