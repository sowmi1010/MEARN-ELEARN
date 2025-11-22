import { useState, useEffect } from "react";

export default function useGlobalSearch(eventName = "admin-global-search") {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = (e) => {
      const value = (e.detail || "").toString();
      setSearch(value);
    };

    window.addEventListener(eventName, handler);

    return () => {
      window.removeEventListener(eventName, handler);
    };
  }, [eventName]);

  return search;
}
