"use client";
import React, { useEffect, useState } from "react";

export default function PeerSupportPage() {
  const [interests, setInterests] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState([]);

  // Load all interests
  useEffect(() => {
    async function fetchInterests() {
      try {
        const res = await fetch("/api/interests");
        const data = await res.json();
        if (res.ok) {
          setInterests(data);
        } else {
          setMessage("Error: " + data.error);
        }
      } catch (err) {
        setMessage("Failed to load interests");
      }
    }
    fetchInterests();
  }, []);

  // Toggle selection
  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Save interests
  const handleSave = async () => {
    try {
      const res = await fetch("/api/user-interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interestIds: selected }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Interests saved!");
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (err) {
      setMessage("❌ Failed to save interests");
    }
  };

  // Find matches
  const handleFindMatches = async () => {
    try {
      const res = await fetch("/api/match");
      const data = await res.json();
      if (res.ok) {
        setMatches(data);
        if (data.length === 0) {
          setMessage("No matches found yet.");
        } else {
          setMessage("");
        }
      } else {
        setMessage("❌ Error: " + data.error);
      }
    } catch (err) {
      setMessage("❌ Failed to find matches");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Peer-to-Peer Support
        </h1>

        {message && (
          <div className="mb-4 p-3 rounded bg-indigo-100 text-indigo-800 text-sm">
            {message}
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4 text-gray-500">Select Your Interests</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {interests.map((interest) => (
            <label
              key={interest.id}
              className={`flex items-center text-gray-500 space-x-2 p-3 border rounded-lg cursor-pointer ${
                selected.includes(interest.id)
                  ? "bg-indigo-50 border-indigo-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(interest.id)}
                onChange={() => handleToggle(interest.id)}
              />
              <span >{interest.name}</span>
            </label>
          ))}
        </div>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={handleSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Save Interests
          </button>
          <button
            onClick={handleFindMatches}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Find Matches
          </button>
        </div>

        {matches.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Matched Students</h2>
            <ul className="space-y-3">
              {matches.map((m, idx) => (
                <li
                  key={idx}
                  className="p-4 bg-gray-100 rounded-lg border border-gray-200"
                >
                  <p className="font-medium">User ID: {m.user_id}</p>
                  <p className="text-sm text-gray-600">
                    Interests: {m.interests?.map((i) => i.name).join(", ")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
