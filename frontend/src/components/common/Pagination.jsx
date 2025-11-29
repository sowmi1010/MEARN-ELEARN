import React from "react";

export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
  if (totalPages <= 1) return null;

  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-8 select-none">

      {/* PREVIOUS BUTTON */}
      <button
        onClick={goPrev}
        disabled={currentPage === 1}
        className={`px-5 py-2 rounded-full font-medium transition-all shadow
          ${
            currentPage === 1
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-105"
          }`}
      >
        Previous
      </button>

      {/* PAGE NUMBERS */}
      <div className="flex gap-4">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          const active = currentPage === page;

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-full font-semibold transition-all shadow-md
                ${
                  active
                    ? "bg-blue-500 text-white scale-110 shadow-blue-500/50"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:scale-105"
                }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* NEXT BUTTON */}
      <button
        onClick={goNext}
        disabled={currentPage === totalPages}
        className={`px-5 py-2 rounded-full font-medium transition-all shadow 
          ${
            currentPage === totalPages
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-105"
          }`}
      >
        Next
      </button>
    </div>
  );
}
