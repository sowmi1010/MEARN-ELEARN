import { Link } from "react-router-dom";

const groups = [
  {
    name: "Root",
    desc: "1st to 4th Standard",
    price: "₹3000",
    offer: "₹500",
    tagline: "Strong Root, Strong Future!",
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
    tagline: "Soaking Wisdom!",
    img: "/Leaf.png",
  },
  {
    name: "Flower",
    desc: "Entrance Exams",
    price: "₹3000",
    offer: "₹750",
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
    <div className="min-h-screen pt-28 pb-20 px-6 bg-white dark:bg-[#050b18] transition-all relative overflow-hidden">

      {/* ✅ Floating Background Particles */}
      {[...Array(15)].map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 90}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></span>
      ))}

      {/* ✅ Animated Page Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-14 text-cyan-600 dark:text-cyan-300 tracking-wide animate-fade-down drop-shadow-lg">
        OUR COURSE GROUPS
      </h1>

      {/* ✅ Card Grid */}
      <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto animate-fade-up">
        {groups.map((g, i) => (
          <Link
            key={i}
            to={`/courses/${g.name.toLowerCase()}`}
            className="group relative rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden transition-all duration-500 bg-white/60 dark:bg-[#0d172b]/60 backdrop-blur-xl border border-gray-200 dark:border-gray-700 hover:-translate-y-2 hover:scale-[1.03]"
          >
            {/* ✅ Neon border animation on hover */}
            <span className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 group-hover:animate-glow rounded-2xl"></span>

            {/* ✅ Image */}
            <div className="w-full bg-gradient-to-br from-gray-100 to-white dark:from-[#162131] dark:to-[#0b1423]">
              <img src={g.img} alt={g.name} className="w-full h-48 object-cover" />
            </div>

            {/* ✅ Content */}
            <div className="p-6 text-center relative z-10">
              <h2 className="text-2xl font-extrabold text-gray-800 dark:text-white tracking-wider">
                {g.name} GROUP
              </h2>

              <p className="text-gray-500 dark:text-gray-300 mt-1">{g.desc}</p>

              {/* ✅ Price */}
              <div className="flex justify-center items-center gap-3 mt-3">
                <span className="line-through text-gray-400">{g.price}</span>
                <span className="text-green-500 font-bold text-xl">{g.offer}</span>
              </div>

              <p className="text-sm italic opacity-75 dark:text-gray-300">{g.tagline}</p>

              {/* ✅ Button */}
              <button className="mt-5 w-full py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 hover:scale-105 shadow-lg">
                View Courses →
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
