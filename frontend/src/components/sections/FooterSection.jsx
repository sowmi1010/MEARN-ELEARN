import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
} from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="relative bg-gradient-to-b from-white to-[#f3f9ff] dark:from-[#030614] dark:to-[#040a1a] text-gray-800 dark:text-gray-200 pt-24 pb-10 overflow-hidden">
      {/* === Decorative Left Shapes === */}
      {/* --- LEFT SIDE DECORATIVE BLOBS --- */}
      <div className="absolute left-0 bottom-0 w-52 h-52 bg-gradient-to-br from-purple-400 to-pink-500 opacity-30 dark:opacity-20 rounded-full blur-2xl"></div>

      <div className="absolute left-24 bottom-20 w-20 h-20 bg-gradient-to-br from-red-400 to-orange-500 opacity-40 dark:opacity-25 rounded-full blur-xl"></div>

      {/* --- RIGHT SIDE DECORATIVE BLOBS --- */}
      <div className="absolute right-0 bottom-0 w-60 h-60 bg-gradient-to-br from-yellow-400 to-orange-300 opacity-30 dark:opacity-20 rounded-full blur-2xl"></div>

      <div className="absolute right-12 bottom-32 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 opacity-40 dark:opacity-30 rounded-full blur-xl"></div>

      {/* === Blurred Glow Backgrounds === */}
      <div className="absolute -top-10 -left-20 w-64 h-64 bg-cyan-300/20 dark:bg-cyan-500/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 -right-10 w-64 h-64 bg-yellow-300/20 dark:bg-yellow-600/10 blur-3xl rounded-full"></div>

      {/* === Main Footer Grid === */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* BRAND COLUMN */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              className="w-12 h-12 rounded-full shadow-md bg-white"
              alt="Last Try Academy"
            />
            <h2 className="text-2xl font-extrabold tracking-wide dark:text-white">
              LAST TRY ACADEMY
            </h2>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">
            Empowering students with guidance, mentorship and career-oriented
            education to shape a brighter tomorrow.
          </p>
        </div>

        {/* GET HELP COLUMN */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white uppercase tracking-wide">
            Get Help
          </h3>

          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li className="hover:text-cyan-500 cursor-pointer">Contact Us</li>
            <li className="hover:text-cyan-500 cursor-pointer">
              Terms & Conditions
            </li>
            <li className="hover:text-cyan-500 cursor-pointer">FAQ</li>
          </ul>
        </div>

        {/* DEVELOPERS COLUMN */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white uppercase tracking-wide">
            Developers
          </h3>

          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Dhanush</li>
            <li>Sharmila</li>
            <li>Sowmiya</li>
            <li>xxxxxx</li>
            <li>xxxxxx</li>
          </ul>
        </div>

        {/* CONTACT COLUMN */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white uppercase tracking-wide">
            Contact Us
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <MapPin size={18} className="text-cyan-600" />
            Chennai, India
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Phone size={18} className="text-cyan-600" />
            +91-7603983212
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Mail size={18} className="text-cyan-600" />
            <a
              href="mailto:lasttryacademy@gmail.com"
              className="text-blue-600 hover:underline"
            >
              lasttryacademy@gmail.com
            </a>
          </p>

          {/* SOCIAL MEDIA ICONS */}
          <div className="flex gap-5 mt-4 text-gray-700 dark:text-gray-300">
            <Youtube
              size={22}
              className="hover:text-red-500 cursor-pointer transition"
            />
            <Instagram
              size={22}
              className="hover:text-pink-500 cursor-pointer transition"
            />
            <Facebook
              size={22}
              className="hover:text-blue-600 cursor-pointer transition"
            />
            <Twitter
              size={22}
              className="hover:text-black dark:hover:text-white cursor-pointer transition"
            />
          </div>
        </div>
      </div>

      {/* === COPYRIGHT BAR === */}
      <div className="relative z-20 mt-14 border-t border-gray-300 dark:border-gray-700 pt-5 text-center text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} | Powered by{" "}
        <span className="text-cyan-600 font-semibold dark:text-cyan-400">
          One Last Try EduTech Private Limited Company
        </span>
      </div>
    </footer>
  );
}
