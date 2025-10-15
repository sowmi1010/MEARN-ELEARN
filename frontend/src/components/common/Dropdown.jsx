import React from "react";

export default function Dropdown({ label, name, value, options, onChange, required }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-gray-300 font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="p-2 rounded bg-gray-700 border border-gray-600 text-white"
      >
        <option value="">Select {label}</option>

        {options.map((opt, index) => {
          // ✅ Support both ["Maths", "Science"] and [{label, value}] formats
          const key = typeof opt === "object" ? opt.value : opt;
          const labelText = typeof opt === "object" ? opt.label : opt;

          return (
            <option key={key || index} value={key}>
              {labelText}
            </option>
          );
        })}
      </select>
    </div>
  );
}
