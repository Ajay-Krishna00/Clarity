"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import RecentChat from "@/components/recentChat";

export default function PeerSupportPage() {
  const router = useRouter();
  const [interests, setInterests] = useState([]);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [matches, setMatches] = useState([]);
  const [authToken, setAuthToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function syncSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!mounted) {
        return;
      }
      setAuthToken(session?.access_token ?? null);
      setAuthReady(true);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) {
        return;
      }
      setAuthToken(session?.access_token ?? null);
      setAuthReady(true);
    });

    syncSession();
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!authToken) {
      setInterests([]);
      setMessage("Please sign in to manage interests.");
      return;
    }

    async function fetchInterests() {
      setLoading(true);
      try {
        const res = await fetch("/api/interests", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setInterests(data);
          setMessage("");
        } else {
          setMessage("Error: " + data.error);
        }
      } catch (err) {
        setMessage("Failed to load interests");
      }
    }

    async function fetchUserInterests() {
      try {
        const res = await fetch("/api/fetch-user-interests", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setSelected(data.interest_ids);
        } else {
          setMessage("Error: " + data.error);
        }
      } catch (err) {
        setMessage("Failed to load your interests");
      } finally {
        handleFindMatches();
        setLoading(false);
      }
    }
    fetchInterests();
    fetchUserInterests();
  }, [authReady, authToken]);

  const handleToggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (!authToken) {
      setMessage("Please sign in to save interests.");
      return;
    }

    try {
      const res = await fetch("/api/save-user-interests", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ interestIds: selected }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Interests saved!");
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err) {
      setMessage("Failed to save interests");
    } finally {
      handleFindMatches();
    }
  };

  const handleFindMatches = async () => {
    if (!authToken) {
      setMessage("Please sign in to find matches.");
      return;
    }
    try {
      setLoadingMatches(true);
      const res = await fetch("/api/match", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMatches(data);
        if (data.length === 0) {
          setMessage("No matches found yet.");
        } else {
          setMessage("");
        }
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (err) {
      setMessage("Failed to find matches");
    } finally {
      setLoadingMatches(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="border-b p-4 border-gray-300 bg-white">
        <div className="flex items-center">
          <Link
            href="/"
            className=" hover:bg-gray-300 rounded-full p-3 transition-colors"
          >
            <ArrowLeft className="text-indigo-600 hover:text-indigo-700" />
          </Link>
          <h1 className="text-xl md:text-3xl md:ml-10 font-bold text-indigo-600 mb-2 text-center">
            Peer-to-Peer Support
          </h1>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 p-5 sm:px-20 sm:py-6">
        <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-8">
          {message && (
            <div className="mb-4 p-3 rounded bg-indigo-100 text-indigo-800 text-sm ">
              {message}
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4 text-gray-500">
            Select interests to find matches
          </h2>
          {loading && (
            <p className="text-indigo-800 text-xl text-center">
              Loading interests...
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {interests.map((interest) => (
              <label
                key={interest.id}
                className={`flex items-center text-gray-500 space-x-2 p-2 sm:p-3 border rounded-lg cursor-pointer ${
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
                <span>{interest.name}</span>
              </label>
            ))}
          </div>

          <div className="flex space-x-4 mb-2">
            <button
              onClick={handleSave}
              className="bg-green-600 w-full text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Save Interests
            </button>
          </div>

          {loadingMatches && (
            <p className="text-indigo-800 text-xl md:text-3xl text-center">
              Finding matches...
            </p>
          )}

          {matches.length > 0 && (
            <div>
              <div className="w-full h-0.5 border-b border-gray-500 mt-4 mb-4"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-600 mb-4">
                Matched Students
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matches.map((m, idx) => {
                  const interestNames = Array.isArray(m.interests)
                    ? m.interests.map((i) => i).join(", ")
                    : (m.interests ?? "");
                  return (
                    <div
                      className="flex p-4 bg-gray-100 rounded-lg border border-gray-200 justify-between items-center"
                      key={idx}
                    >
                      <li key={idx}>
                        <p className="font-medium text-black">
                          Anonymous {m.user_id.slice(1, 3)}
                          {m.user_id.slice(-4)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Interests: {interestNames || "None listed"}
                        </p>
                      </li>
                      <div className="">
                        <button
                          onClick={() =>
                            router.push(`/peer-chat?peer=${m.user_id}`)
                          }
                          className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          Chat
                        </button>
                      </div>
                    </div>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <RecentChat authToken={authToken} />
      </div>
    </div>
  );
}
