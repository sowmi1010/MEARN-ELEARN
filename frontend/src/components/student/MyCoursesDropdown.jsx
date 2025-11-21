export default function MyCoursesDropdown({ courses, selected, onSelect }) {
  return (
    <select
      value={selected?.key || ""}
      onChange={(e) => {
        const course = courses.find(c => c.key === e.target.value);
        onSelect(course);
      }}
      className="bg-[#0d1633] border border-purple-700 text-white px-4 py-2 rounded-lg"
    >
      {courses.map((c) => {

        // Show REAL values like: 11th Bio-Maths | Tamil | CBSE
        let label = "";

        if (c.standard) {
          label = `${c.standard}`;

          if (c.groupCode) label += ` - ${c.groupCode}`;
          if (c.board) label += ` | ${c.board}`;
          if (c.language) label += ` | ${c.language}`;
        }

        // Professional / Skill courses
        if (c.title && !c.standard) {
          label = `${c.title} (${c.group?.toUpperCase()})`;
        }

        return (
          <option key={c.key} value={c.key}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
