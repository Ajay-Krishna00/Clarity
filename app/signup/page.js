"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  User,
  School,
  FileText,
  Phone,
  MapPin,
} from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin-specific fields
  const [institutionName, setInstitutionName] = useState("");
  const [institutionAddress, setInstitutionAddress] = useState("");
  const [institutionCode, setInstitutionCode] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");

  const router = useRouter();

  const checkAdminExists = async (institutionName) => {
    try {
      const { data, error } = await supabase
        .from("admin_applications")
        .select("id")
        .eq("institution_name", institutionName.trim().toLowerCase())
        .in("status", ["approved", "pending"]);

      if (error) throw error;
      return data && data.length > 0;
    } catch (error) {
      console.error("Error checking admin:", error);
      return false;
    }
  };

  const handleSignup = async () => {
    setIsSubmitting(true);
    setMessage("");

    try {
      // Admin-specific validation
      if (isAdmin) {
        if (
          !institutionName.trim() ||
          !institutionAddress.trim() ||
          !employeeId.trim() ||
          !department.trim() ||
          !phoneNumber.trim() ||
          !qualification.trim() ||
          !fullName.trim()
        ) {
          setMessage(
            "Please fill in all required fields for admin registration.",
          );
          return;
        }

        // Check if admin already exists for this institution
        const adminExists = await checkAdminExists(institutionName);
        if (adminExists) {
          setMessage(
            "An admin already exists or has a pending application for this institution. Only one admin per institution is allowed.",
          );
          return;
        }
      }

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp(
        {
          email,
          password,
        },
        {
          emailRedirectTo: `${window.location.origin}/signin`,
        },
      );

      if (authError) {
        setMessage(authError.message);
        return;
      }

      // If admin registration, store application data temporarily
      if (isAdmin && authData.user) {
        try {
          const { error: dbError } = await supabase
            .from("admin_applications")
            .insert({
              user_id: authData.user.id,
              email: email,
              full_name: fullName,
              institution_name: institutionName.trim(),
              institution_address: institutionAddress.trim(),
              institution_code: institutionCode.trim(),
              employee_id: employeeId.trim(),
              department: department.trim(),
              phone_number: phoneNumber.trim(),
              qualification: qualification.trim(),
              experience: experience.trim(),
              status: "pending", // Status before ID upload
              created_at: new Date().toISOString(),
            });

          if (dbError) throw dbError;

          setMessage(
            "Signup successful! Please check your email to verify your account. After verification, you'll be redirected to upload your ID card.",
          );
        } catch (error) {
          console.error("Error saving admin application:", error);
          setMessage(
            "There was an error processing your admin application. Please try again.",
          );
          return;
        }
      } else {
        setMessage(
          "Signup successful! Please check your email to verify your account.",
        );
      }

      // Store admin flag in localStorage for redirect after email verification
      if (isAdmin) {
        localStorage.setItem("pendingAdminUpload", "true");
      }

      setTimeout(() => {
        router.push("/verify-email");
      }, 3000);
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-8">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Sign Up
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Join our mental health support platform
        </p>

        <div className="space-y-4">
          {/* Basic Information */}

          <div className="flex items-center border rounded-lg px-3">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 bg-transparent focus:outline-none text-gray-700"
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
              className="w-full p-2 bg-transparent focus:outline-none text-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Admin Toggle */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <span className="text-gray-700 font-medium">
                I am registering as an admin/teacher for my institution
              </span>
            </label>
            <p className="text-sm text-gray-600 mt-2">
              Note: Only one admin is allowed per institution. You&apos;ll need
              to upload your ID card after email verification.
            </p>
          </div>

          {/* Admin-specific fields */}
          {isAdmin && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Institution & Professional Details
              </h3>

              <div className="flex items-center border rounded-lg px-3">
                <User className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-2 bg-white focus:outline-none text-gray-700"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border rounded-lg px-3 bg-white">
                  <School className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Institution Name"
                    className="w-full p-2 bg-transparent focus:outline-none text-gray-700"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                    required={isAdmin}
                  />
                </div>

                <div className="flex items-center border rounded-lg px-3 bg-white">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Institution Code (if any)"
                    className="w-full p-2 bg-transparent focus:outline-none text-gray-700"
                    value={institutionCode}
                    onChange={(e) => setInstitutionCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center border rounded-lg px-3 bg-white">
                <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Institution Address"
                  className="w-full p-2 bg-transparent focus:outline-none text-gray-700"
                  value={institutionAddress}
                  onChange={(e) => setInstitutionAddress(e.target.value)}
                  required={isAdmin}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border rounded-lg px-3 bg-white">
                  <FileText className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Employee ID"
                    className="w-full p-2 bg-transparent focus:outline-none text-gray-700"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required={isAdmin}
                  />
                </div>

                <div className="flex items-center border rounded-lg px-3 bg-white">
                  <School className="w-5 h-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Department"
                    className="w-full p-2 bg-transparent focus:outline-none text-gray-700"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required={isAdmin}
                  />
                </div>
              </div>

              <div className="flex items-center border rounded-lg px-3 bg-white">
                <Phone className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-2 bg-transparent focus:outline-none text-gray-700"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required={isAdmin}
                />
              </div>

              <div className="flex items-center border rounded-lg px-3 bg-white">
                <FileText className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Highest Qualification"
                  className="w-full p-2 bg-transparent focus:outline-none text-gray-700"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  required={isAdmin}
                />
              </div>

              <div className="flex items-center border rounded-lg px-3 bg-white">
                <FileText className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Years of Experience"
                  className="w-full p-2 bg-transparent focus:outline-none text-gray-700"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Next Step:</strong> After email verification,
                  you&apos;ll be redirected to upload your ID card/teaching
                  certificate for manual verification.
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? "Processing..." : "Sign Up"}
          </button>
        </div>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              message.includes("successful") || message.includes("submitted")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <p className="text-gray-600 text-center mt-6">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
