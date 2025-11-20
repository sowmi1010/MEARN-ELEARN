import React, { useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import HeroSection from "../../components/sections/HeroSection";
import LearningSection from "../../components/sections/LearningSection";
import CourseGroupsPage from "../../pages/courses/CourseGroupsPage";
import CourseGroups from "../../components/sections/CourseGroups";
import StudentFeedbacks from "../../components/sections/StudentFeedbacks";
import Teachers from "../../components/sections/Teachers";
import AboutSection from "../../components/sections/AboutSection";
import FounderSection from "../../components/sections/FounderSection";
import FooterSection from "../../components/sections/FooterSection";

/* 
  LandingPage:
  - Loads Exo font for headings (Google Fonts)
  - Sets body-level CSS variables for color accents (optional)
  - Expects Tailwind with class-based dark mode (i.e., in tailwind config: darkMode: 'class')
*/
export default function LandingPage() {
  useEffect(() => {
    // Load Exo font (head injection). You can move this to index.html if you prefer.
    const id = "font-exo";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Exo:wght@400;600;700;800&display=swap";
      document.head.appendChild(link);
    }
    // Add a root CSS class for heading fonts
    document.documentElement.style.setProperty("--heading-font", "'Exo', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial");
    // tailwind should already apply things - this just provides a CSS var fallback
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-gray-200 transition-colors duration-300" style={{ fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
      <Navbar />

      {/* Hero */}
      <main className="pt-16">
        <HeroSection />

        {/* Learning / About */}
        <LearningSection />

        {/* Course Groups Overview (page preview) */}
        <CourseGroupsPage />

        {/* Courses carousel / grid */}
        <CourseGroups />

        {/* Student feedbacks */}
        <StudentFeedbacks />

        {/* Teachers (slider version) */}
        <Teachers />

        {/* About Us */}
        <AboutSection />

        {/* Founder / CEO */}
        <FounderSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
