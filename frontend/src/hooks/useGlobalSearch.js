import { useState, useEffect } from "react";
import api from "../utils/api";

/*
  Global Search Hook
  - Listens to window event (admin-global-search)
  - Fetches from backend: /global-search
  - Returns: search, results, loading
*/

export default function useGlobalSearch(eventName = "admin-global-search") {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState({
    videos: [],
    books: [],
    notes: [],
    tests: [],
    quizzes: []
  });

  // 1. Listen to global event (from navbar)
  useEffect(() => {
    const handler = (e) => {
      const value = (e.detail || "").toString();
      setSearch(value);
    };

    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName]);

  // 2. Fetch data when search changes (debounced)
  useEffect(() => {
    if (!search || search.length < 2) {
      setResults({
        videos: [],
        books: [],
        notes: [],
        tests: [],
        quizzes: []
      });
      return;
    }

    const delay = setTimeout(() => {
      fetchResults(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // 3. API Call
  const fetchResults = async (query) => {
    try {
      setLoading(true);

      const res = await api.get("/global-search", {
        params: { q: query }
      });

      setResults({
        videos: res.data?.videos || [],
        books: res.data?.books || [],
        notes: res.data?.notes || [],
        tests: res.data?.tests || [],
        quizzes: res.data?.quizzes || []
      });
    } catch (err) {
      console.error("Global search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    search,
    results,
    loading
  };
}
