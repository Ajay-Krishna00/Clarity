"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, AlertCircle, FileText } from "lucide-react";

export default function AdminUploadPage() {
  const [idCard, setIdCard] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    checkUserAndRedirect();
  }, []);

  const checkUserAndRedirect = async () => {
    try {
      // Check if user is authenticated
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/signin");
        return;
      }

      // Check if user has pending admin application
      const { data: adminApp, error: dbError } = await supabase
        .from("admin_applications")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .single();

      if (dbError || !adminApp) {
        // No pending admin application, redirect to signin
        router.push("/signin");
        return;
      }

      setUserInfo(adminApp);
      setLoading(false);
    } catch (error) {
      console.error("Error checking user status:", error);
      router.push("/signin");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (images and PDFs only)
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setMessage("Please upload only JPG, PNG, or PDF files.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage("File size must be less than 5MB.");
        return;
      }

      setIdCard(file);
      setMessage("");
    }
  };

  const uploadFile = async (file, userId) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("admin-documents")
        .upload(`id-cards/${fileName}`, file);

      if (error) throw error;
      return data.path;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!idCard) {
      setMessage("Please select a file to upload.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Upload the file
      const filePath = await uploadFile(idCard, user.id);

      // Update the admin application with file path and change status to pending
      const { error: updateError } = await supabase
        .from("admin_applications")
        .update({
          id_card_path: filePath,
        })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      setMessage(
        "ID card uploaded successfully! Your admin application has been submitted for review. Our team will verify your credentials and get back to you within 24 hours.",
      );

      // Clear localStorage flag
      localStorage.removeItem("pendingAdminUpload");

      setTimeout(() => {
        router.push("/chat");
      }, 3000);
    } catch (error) {
      console.error("Error uploading document:", error);
      setMessage(
        "There was an error uploading your document. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-8">
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <FileText className="mx-auto h-16 w-16 text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload ID Card
          </h1>
          <p className="text-gray-600">Complete your admin application</p>
        </div>

        {userInfo && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              Application Details:
            </h3>
            <p className="text-sm text-blue-800">
              <strong>Institution:</strong> {userInfo.institution_name}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Department:</strong> {userInfo.department}
            </p>
            <p className="text-sm text-blue-800">
              <strong>Employee ID:</strong> {userInfo.employee_id}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-white hover:border-blue-400 transition-colors">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div>
                <label htmlFor="id-card" className="cursor-pointer">
                  <span className="block text-lg font-medium text-gray-900 mb-2">
                    Upload ID Card / Teaching Certificate
                  </span>
                  <span className="block text-sm text-gray-600 mb-4">
                    PNG, JPG, or PDF up to 5MB
                  </span>
                  <span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block">
                    Choose File
                  </span>
                </label>
                <input
                  id="id-card"
                  name="id-card"
                  type="file"
                  className="sr-only"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileUpload}
                />
              </div>
              {idCard && (
                <div className="mt-4 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-sm text-green-600 font-medium">
                    {idCard.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                  Required Documents:
                </h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Employee ID card with photo</li>
                  <li>• Teaching certificate or qualification proof</li>
                  <li>• Institution employment verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={!idCard || isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Uploading..." : "Submit Application"}
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Verification Process:</strong> Our team will manually
              verify your credentials and get back to you within 24 hours.
              You'll receive an email notification once your admin access is
              approved.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mt-6 p-3 rounded-lg text-sm ${
              message.includes("successfully") || message.includes("submitted")
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
