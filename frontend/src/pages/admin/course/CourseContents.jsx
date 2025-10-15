import React, { Suspense } from "react";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const ManageVideos = React.lazy(() => import("./manage/ManageVideos"));
const ManageNotes = React.lazy(() => import("./manage/ManageNotes"));
const ManageTests = React.lazy(() => import("./manage/ManageTests"));

export default function CourseContents() {
  const { groupId, subject, category } = useParams();
  // ✅ Normalize to match "Unit Test" even if URL has "unit-test"
  const normalized = category.trim().toLowerCase().replace(/-/g, " ");

  const renderContent = () => {
    // 🎥 Video categories
    if (
      [
        "videos",
        "lesson",
        "practical",
        "important",
        "medium answer",
        "long answer",
      ].includes(normalized)
    ) {
      return <ManageVideos />;
    }

    // 📘 Notes categories
    if (
      [
        "lesson notes",
        "summary",
        "question bank",
        "notes",
        "one word",
        "short answer",
        "important notes",
      ].includes(normalized)
    ) {
      return <ManageNotes />;
    }

    // 🧪 Test categories
    if (
  [
    "exam paper",
    "unit test",
    "model paper",
    "revision test",
    "practice test",
    "test paper",
    "lesson test", // ✅ present and correct
    "weekly test",
    "monthly test",
    "quarterly exam",
    "half-yearly exam",
    "annual exam",
  ].includes(normalized)
) {
  return <ManageTests />;
}


    // 🟥 Default (unknown)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        ⚠️ Unknown category type — No matching content manager found.
      </div>
    );
  };

  return <Suspense fallback={<LoadingSpinner />}>{renderContent()}</Suspense>;
}
