"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setMessage(error.message);
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error: profileError } = await supabase
      .from("admin_applications")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (data && data.id_card_path == null) {
      router.push("/upload-id");
    } else {
      router.push("/chat");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Sign In
        </h1>

        <form onSubmit={handleSignin} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3">
            <Mail className="w-5 h-5 text-gray-400 mr-2 " />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 bg-transparent focus:outline-none text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center border rounded-lg px-3">
            <Lock className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 bg-transparent focus:outline-none text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-transform"
          >
            Sign In
          </button>
        </form>

        {message && (
          <p className="text-red-500 text-sm mt-4 text-center">{message}</p>
        )}

        <p className="text-gray-600 text-center mt-6">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
