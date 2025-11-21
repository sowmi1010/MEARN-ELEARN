import { Link } from "react-router-dom";

const groups = [
  {
    name: "Root",
    desc: "1st to 4th Standard",
    price: "₹3000",
    offer: "₹500",
    tagline: "Strong Roots, Strong Future!",
    img: "/Root.png",
  },
  {
    name: "Stem",
    desc: "5th to 8th Standard",
    price: "₹3000",
    offer: "₹400",
    tagline: "Growing Steady, Reaching High!",
    img: "/Stem.png",
  },
  {
    name: "Leaf",
    desc: "9th to 12th Standard",
    price: "₹1000",
    offer: "₹500",
    tagline: "Spreading Knowledge, Soaking Wisdom!",
    img: "/Leaf.png",
  },
  {
    name: "Flower",
    desc: "Entrance Exams",
    price: "₹3000",
    offer: "₹1500",
    tagline: "Bloom With Brilliance!",
    img: "/Flower.png",
  },
  {
    name: "Fruit",
    desc: "Government Exams",
    price: "₹3000",
    offer: "₹1500",
    tagline: "Harvest Your Success!",
    img: "/Fruits.png",
  },
  {
    name: "Seed",
    desc: "Skill Development",
    price: "₹3000",
    offer: "₹1500",
    tagline: "Planting Skill, Growing Knowledge!",
    img: "/Seed.png",
  },
];

export default function CourseGroupsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-white dark:bg-[#050b18] transition-all relative overflow-hidden font-mulish">
      {/* FLOATING PARTICLES */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-5 h-5 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-20 rounded-full blur-xl animate-pulse"
          style={{
            left: `${Math.random() * 90}%`,
            top: `${Math.random() * 90}%`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}

      {/* PAGE TITLE */}
      <div className="flex flex-col items-center justify-center mb-10">
        <div
          className="
      px-6 py-2 border border-gray-400 
      rounded-full text-lg font-semibold 
      bg-white dark:bg-gray-900 
      shadow-sm tracking-wide text-black dark:text-white
      font-[Mulish]
    "
        >
          Our Course
        </div>
      </div>

      {/* CARD GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-12 max-w-7xl mx-auto animate-fade-up">
        {groups.map((g, i) => (
          <Link
            key={i}
            to={`/courses/${g.name.toLowerCase()}`}
            className="
              group relative rounded-2xl  
              bg-white dark:bg-[#0d172b] 
              border border-gray-200 dark:border-gray-700 
              shadow-xl hover:shadow-2xl
              transition-all duration-500 
              hover:-translate-y-2 hover:scale-[1.03]
              overflow-hidden backdrop-blur-xl
            "
          >
            {/* REMOVED BLUE GLOW COMPLETELY */}

            {/* IMAGE */}
            <div className="w-full bg-gradient-to-br from-gray-50 to-white dark:from-[#162131] dark:to-[#0b1423]">
              <img
                src={g.img}
                alt={g.name}
                className="w-full h-48 object-contain p-4"
              />
            </div>

            {/* CONTENT */}
            <div className="p-6 text-center relative z-10">
              <h2 className="font-luckiest text-3xl text-gray-800 dark:text-white tracking-wide">
                {g.name} GROUP
              </h2>

              <p className="text-gray-500 dark:text-gray-300 mt-1 font-semibold">
                {g.desc}
              </p>

              {/* PRICE SECTION */}
              <div className="flex justify-center items-center gap-3 mt-3">
                <span className="line-through text-gray-400">{g.price}</span>
                <span className="text-green-500 font-bold text-2xl">
                  {g.offer}
                </span>
              </div>

              <p className="text-sm italic opacity-75 dark:text-gray-300 mt-1">
                {g.tagline}
              </p>

              {/* BUTTON */}
              <button
                className="
                mt-5 w-full py-2 rounded-xl 
                text-white font-semibold 
                bg-gradient-to-r from-cyan-500 to-blue-600 
                hover:from-blue-600 hover:to-cyan-500 
                transition-all duration-300 hover:scale-105 shadow-lg
              "
              >
                View Courses →
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
