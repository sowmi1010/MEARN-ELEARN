import React from "react";

const groups = [
  { name: "ROOT GROUP", students: 200, image: "/Root.png" },
  { name: "STEM GROUP", students: 200, image: "/Stem.png" },
  { name: "LEAF GROUP", students: 1200, image: "/Leaf.png" },
  { name: "FLOWER GROUP", students: 200, image: "/Flower.png" },
  { name: "FRUIT GROUP", students: 200, image: "/Fruits.png" },
  { name: "SEED GROUP", students: 200, image: "/Seed.png" },
];

export default function GroupOverview() {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4">Group Overview</h2>
      <div className="grid grid-cols-2 gap-4">
        {groups.map((g, i) => (
          <div
            key={i}
            className="bg-gray-700 rounded-lg p-3 text-center hover:bg-gray-600 transition"
          >
            <img src={g.image} alt={g.name} className="mx-auto w-20 h-20 object-contain" />
            <p className="font-semibold mt-2">{g.name}</p>
            <p className="text-sm text-gray-400">Total Students: {g.students}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
