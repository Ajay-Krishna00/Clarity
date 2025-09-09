"use client";

import { useEffect, useState } from "react";

export default function InterestsPage() {
  const [interests, setInterests] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all available interests
  useEffect(() => {
    const fetchInterests = async () => {
      const res = await fetch("/api/interests");
      const data = await res.json();
      setInterests(data);
    };
    fetchInterests();
  }, []);

  // Save selected interests
  const saveInterests = async () => {
    const res = await fetch("/api/user-interests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interestIds: selected }),
    });

    if (res.ok) {
      setMessage("Interests saved successfully!");
    } else {
      setMessage("Error saving interests.");
    }
  };

  const toggleSelection = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Choose Your Interests</h1>
      <div className="grid gap-3">
        {interests.map((interest) => (
          <label
            key={interest.id}
            className="flex items-center space-x-2 border p-2 rounded-md"
          >
            <input
              type="checkbox"
              checked={selected.includes(interest.id)}
              onChange={() => toggleSelection(interest.id)}
            />
            <span>{interest.name}</span>
          </label>
        ))}
      </div>
      <button
        onClick={saveInterests}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Save Interests
      </button>
      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
