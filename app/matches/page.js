"use client";

import { useEffect, useState } from "react";

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchMatches = async () => {
      const res = await fetch("/api/match");
      const data = await res.json();
      setMatches(data);
    };
    fetchMatches();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Matches</h1>
      {matches.length === 0 ? (
        <p className="text-gray-600">No matches found yet.</p>
      ) : (
        <ul className="space-y-4">
          {matches.map((user) => (
            <li key={user.id} className="border rounded-md p-4 shadow-sm">
              <p className="font-semibold">{user.email}</p>
              <p className="text-sm text-gray-600">
                Interests:{" "}
                {user.interests.map((i) => i.interests.name).join(", ")}
              </p>
              <button className="mt-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600">
                Send Request
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
