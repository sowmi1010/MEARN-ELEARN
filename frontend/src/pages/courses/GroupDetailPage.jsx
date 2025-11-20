import { useParams, useNavigate } from "react-router-dom";
import rootBanner from "/Root.png";
import stemBanner from "/Stem.png";
import leafBanner from "/Leaf.png";
import flowerBanner from "/Flower.png";
import fruitBanner from "/Fruits.png";
import seedBanner from "/Seed.png";

export default function GroupDetailPage() {
  const { groupName } = useParams();
  const navigate = useNavigate();

  const banners = {
    root: rootBanner,
    stem: stemBanner,
    leaf: leafBanner,
    flower: flowerBanner,
    fruit: fruitBanner,
    seed: seedBanner,
  };

  const boardOptions = ["CBSE", "ICSE", "NIOS", "Tamil Nadu", "Kerala", "Gujarat"];
  const languageOptions = ["English", "Tamil", "Hindi", "Malayalam", "Telugu", "Kannada"];

  const standards = {
    root: ["1st", "2nd", "3rd", "4th"],
    stem: ["5th", "6th", "7th", "8th"],
    leaf: ["9th", "10th", "11th", "12th"],
  };

  const leafGroupCodes = [
    "Group 1 – Tamil, English, Physics, Chemistry, Biology, Maths, Zoology",
    "Group 2 – Tamil, English, Physics, Chemistry, Maths, Computer Science",
    "Group 3 – Tamil, English, Biology, Chemistry, Computer Science",
    "Group 5 – Tamil, English, Commerce, Accountancy, Economics, Computer Science",
  ];

  const planPrices = {
    root: { monthly: 300, yearly: 3300 },
    stem: { monthly: 400, yearly: 4400 },
    leaf: { monthly: 500, yearly: 5500 },
  };

  const flowerCourses = [
    { title: "NEET", img: "/Neet.png", old: "₹2000", new: "₹1000" },
    { title: "JEE Main", img: "/Jee.png", old: "₹2000", new: "₹1000" },
    { title: "JEE Advanced", img: "/Jee Advance.png", old: "₹2000", new: "₹1000" },
    { title: "AIIMS Nursing", img: "/Aiims.png", old: "₹2000", new: "₹1000" },
    { title: "BITSAT", img: "/BitSat.png", old: "₹2000", new: "₹1000" },
    { title: "NDA", img: "/Nda.png", old: "₹2000", new: "₹1000" },
  ];

  const fruitCourses = [
    { title: "UPSC", img: "/upsc.png", old: "₹3000", new: "₹1500" },
    { title: "TNPSC", img: "/tnpsc.png", old: "₹3000", new: "₹1500" },
    { title: "SSB", img: "/ssb.png", old: "₹3000", new: "₹1500" },
    { title: "CDS", img: "/cds.png", old: "₹3000", new: "₹1500" },
    { title: "TET", img: "/tet.png", old: "₹3000", new: "₹1500" },
  ];

  const seedCourses = [
    { title: "Aari Works", img: "/aari.png", old: "₹12000", new: "₹6000" },
    { title: "AWS", img: "/aws.png", old: "₹3000", new: "₹1500" },
    { title: "Python", img: "/python.png", old: "₹3000", new: "₹1500" },
    { title: "React", img: "/react.png", old: "₹3000", new: "₹1500" },
    { title: "C++", img: "/cplus.png", old: "₹3000", new: "₹1500" },
    { title: "SE", img: "/se.png", old: "₹3000", new: "₹1500" },
  ];

  const professionalCourses =
    groupName === "flower"
      ? flowerCourses
      : groupName === "fruit"
      ? fruitCourses
      : seedCourses;

  const isPrimary = ["root", "stem", "leaf"].includes(groupName);

  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#050b18] min-h-screen py-10 px-4 sm:px-6 md:px-10 lg:px-20">

      {/* FLOATING PARTICLES */}
      {[...Array(15)].map((_, i) => (
        <span
          key={i}
          className="particle absolute w-3 h-3 bg-cyan-400/20 dark:bg-blue-500/20 rounded-full blur-xl animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 80 + 10}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        ></span>
      ))}

      {/* BANNER */}
      <div className="flex justify-center animate-fade-down mt-4">
        <img src={banners[groupName]} className="w-[280px] sm:w-[350px] md:w-[480px] lg:w-[520px]" />
      </div>

      {/* ROOT/STEM/LEAF SECTION */}
      {isPrimary && (
        <>
          {/* Selection Box */}
          <div className="mx-auto max-w-5xl bg-white/30 dark:bg-[#0d172b] backdrop-blur-xl border dark:border-gray-700 mt-8 p-6 sm:p-8 rounded-3xl shadow-xl animate-fade-up">

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 text-black dark:text-white">

              {/* Standard */}
              <select className="p-3 rounded-xl bg-white dark:bg-[#1c2436] border border-gray-300 dark:border-gray-600">
                <option>Select Standard</option>
                {standards[groupName].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              {/* Board */}
              <select className="p-3 rounded-xl bg-white dark:bg-[#1c2436] border border-gray-300 dark:border-gray-600">
                <option>Select Board</option>
                {boardOptions.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>

              {/* Language */}
              <select className="p-3 rounded-xl bg-white dark:bg-[#1c2436] border border-gray-300 dark:border-gray-600">
                <option>Select Language</option>
                {languageOptions.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>

            {/* Group Code for Leaf */}
            {groupName === "leaf" && (
              <select className="mt-4 w-full p-3 rounded-xl bg-white dark:bg-[#1c2436] border border-gray-300 dark:border-gray-600 text-black dark:text-white">
                <option>Select Group Code</option>
                {leafGroupCodes.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="flex flex-col md:flex-row justify-center gap-10 mt-12 animate-fade-up">

            {/* Monthly */}
            <div className="w-full sm:w-80 bg-gradient-to-br from-blue-100 to-white dark:from-[#162131] dark:to-[#0b1423] p-6 rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer">
              <h2 className="text-xl font-bold">COMFORT</h2>
              <p className="text-gray-600 dark:text-gray-400">Monthly</p>

              <h3 className="text-3xl font-extrabold text-cyan-600 mt-3">
                {planPrices[groupName].monthly} INR / month
              </h3>

              <button
                onClick={() =>
                  navigate(`/payment/${groupName}-monthly`, {
                    state: {
                      title: `${groupName.toUpperCase()} MONTHLY`,
                      price: planPrices[groupName].monthly,
                      img: banners[groupName],
                    },
                  })
                }
                className="mt-5 w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition"
              >
                Enroll Now ✅
              </button>
            </div>

            {/* Yearly */}
            <div className="w-full sm:w-80 bg-gradient-to-br from-yellow-100 to-white dark:from-[#312600] dark:to-[#1c1600] p-6 rounded-2xl shadow-xl border-2 border-yellow-400 hover:scale-105 transition cursor-pointer">
              <h2 className="text-xl font-bold">PREMIUM</h2>
              <p className="text-gray-600 dark:text-gray-400">Yearly (Most Popular)</p>

              <h3 className="text-3xl font-extrabold text-yellow-600 mt-3">
                {planPrices[groupName].yearly} INR / year
              </h3>

              <button
                onClick={() =>
                  navigate(`/payment/${groupName}-yearly`, {
                    state: {
                      title: `${groupName.toUpperCase()} YEARLY`,
                      price: planPrices[groupName].yearly,
                      img: banners[groupName],
                    },
                  })
                }
                className="mt-5 w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition"
              >
                Enroll Now ✅
              </button>
            </div>
          </div>
        </>
      )}

      {/* PROFESSIONAL COURSES */}
      {!isPrimary && (
        <div className="max-w-6xl mx-auto animate-fade-up mt-10 pb-16">

          {/* Search */}
          <div className="flex items-center border p-3 rounded-xl bg-white dark:bg-[#121b2e] text-black dark:text-white max-w-lg mx-auto shadow-md">
            <input
              className="flex-1 bg-transparent outline-none"
              placeholder="Search Courses..."
            />
            <button className="text-xl">🔍</button>
          </div>

          {/* Course Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 mt-12">

            {professionalCourses.map((c, index) => (
              <div
                key={index}
                className="relative bg-[#012b5d] hover:bg-[#003a82] text-white p-6 rounded-2xl shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
              >
                <img className="w-28 h-28 mx-auto object-contain" src={c.img} />

                <h3 className="text-xl font-bold text-center mt-3">{c.title}</h3>

                <div className="flex justify-center gap-3 mt-2 text-lg">
                  <span className="line-through text-gray-400">{c.old}</span>
                  <span className="text-green-400 font-bold">{c.new}</span>
                </div>

                <p className="text-center text-yellow-300 mt-1">⭐ 5.0</p>

                <button
                  onClick={() =>
                    navigate(`/payment/${groupName}-${index + 1}`, {
                      state: {
                        title: c.title,
                        price: c.new.replace("₹", ""),
                        img: c.img,
                      },
                    })
                  }
                  className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
                >
                  Enroll Now ✅
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
