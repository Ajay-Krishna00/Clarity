"use client";
import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  BookOpen,
  Calendar,
  Shield,
  Users,
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  Menu,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsVisible(true);
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setLoggedIn(!!data);
      }
    }
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage("Error signing out: " + error.message);
    } else {
      setMessage("Successfully signed out.");
      setLoggedIn(false);
      setTimeout(() => {
        window.location.href = "/signin";
        setMessage("");
      }, 2000);
    }
  };

  const features = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "24/7 AI Chat Support",
      description:
        "Get immediate, confidential support whenever you need it. Our AI companion is trained to provide empathetic guidance.",
      href: "/support-chat",
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Self-Help Resources",
      description:
        "Access curated mental health resources, coping strategies, and wellness tools designed for students.",
      href: "/resources",
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Professional Counseling",
      description:
        "Book sessions with licensed mental health professionals who understand student life challenges.",
      href: "/booking",
    },
  ];

  const stats = [
    { number: "24/7", label: "Available Support" },
    { number: "100%", label: "Confidential" },
    { number: "1000+", label: "Students Helped" },
    { number: "4.8★", label: "User Rating" },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      role: "Psychology Major",
      text: "Clarity helped me through my toughest semester. Having support available anytime made all the difference.",
      rating: 5,
    },
    {
      name: "Alex K.",
      role: "Engineering Student",
      text: "The chat support is incredible. It's like having a friend who really understands what you're going through.",
      rating: 5,
    },
    {
      name: "Maya P.",
      role: "Pre-Med Student",
      text: "The resources section is a goldmine. I've learned so many healthy coping strategies for exam stress.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 backdrop-blur-sm z-10 px-6 py-4 bg-white/70 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Clarity</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#features"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Features
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              About
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-indigo-600 transition"
            >
              Reviews
            </a>
            {loggedIn == false ? (
              <a
                href="/signin"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Sign In
              </a>
            ) : (
              <button
                onClick={handleSignOut}
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Sign Out
              </button>
            )}
            <a
              href="/peers"
              className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Peer Support
            </a>
            <a
              href="/support-chat"
              className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Get Support
            </a>
            <a
              href="/adminboard"
              className="bg-indigo-600 text-white px-2 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Admin Dashboard
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-black" />
            ) : (
              <Menu className="w-6 h-6 text-black" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t">
            <div className="px-6 py-4 space-y-4">
              <a
                href="#features"
                className="block text-gray-700 hover:text-indigo-600 transition"
              >
                Features
              </a>
              <a
                href="#about"
                className="block text-gray-700 hover:text-indigo-600 transition"
              >
                About
              </a>
              <a
                href="#testimonials"
                className="block text-gray-700 hover:text-indigo-600 transition"
              >
                Reviews
              </a>
              {loggedIn == false ? (
                <a
                  href="/signin"
                  className="block text-gray-700 hover:text-indigo-600 transition"
                >
                  Sign In
                </a>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-indigo-600 transition"
                >
                  Sign Out
                </button>
              )}
              <a
                href="/peers"
                className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-center"
              >
                Peer Support
              </a>
              <a
                href="/support-chat"
                className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-center"
              >
                Get Support
              </a>
              <a
                href="/adminboard"
                className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition text-center"
              >
                Admin Dashboard
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        {message && (
          <div className="max-w-4xl mx-auto mb-2">
            <div
              className={`p-4 rounded-lg text-center ${
                message.startsWith("Error")
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          </div>
        )}
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-full px-4 py-2 mb-8">
            <Shield className="w-4 h-4 text-indigo-600 mr-2" />
            <span className="text-sm text-indigo-700 font-medium">
              Confidential • Safe • Always Available
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Mental Health
            </span>
            <br />
            <span className="text-gray-900">Matters</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A comprehensive digital support system designed specifically for
            students. Get confidential help, connect with peers, and access
            professional resources - all in one safe space.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href="/support-chat"
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center"
            >
              Start Chatting Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/resources"
              className="bg-white/80 backdrop-blur-sm text-gray-800 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Explore Resources
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="px-6 py-20 bg-white/40 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive mental health support designed with student life in
              mind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <div className="text-indigo-600">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <a
                  href={feature.href}
                  className="inline-flex items-center text-indigo-600 font-semibold group-hover:text-purple-600 transition-colors"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Built for Students, By Students
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            We understand the unique pressures of academic life. Clarity was
            created to provide accessible, judgment-free mental health support
            that fits into your busy schedule.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Completely Private
              </h3>
              <p className="text-gray-600">
                Your conversations and data are encrypted and never shared
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Peer Support
              </h3>
              <p className="text-gray-600">
                Connect with other students who understand your experiences
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Always Here
              </h3>
              <p className="text-gray-600">
                24/7 availability means support when you need it most
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="px-6 py-20 bg-gradient-to-r from-indigo-50 to-purple-50"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What Students Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from students who found support through Clarity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &quot;{testimonial.text}&quot;
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-500 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Take the First Step?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Your mental health journey starts with a single conversation.
            We&quot;re here to support you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/support-chat"
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Start Your Journey
            </a>
            <a
              href="/booking"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Book a Session
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">Clarity</span>
              </div>
              <p className="text-gray-400">
                Supporting student mental health, one conversation at a time.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="/support-chat"
                    className="hover:text-white transition"
                  >
                    Chat Support
                  </a>
                </li>
                <li>
                  <a href="/resources" className="hover:text-white transition">
                    Resources
                  </a>
                </li>
                <li>
                  <a href="/booking" className="hover:text-white transition">
                    Book Session
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Emergency</h4>
              <p className="text-gray-400 text-sm mb-2">
                If you&quot;re in crisis, please contact:
              </p>
              <p className="text-white font-semibold">
                14416 - Tele MANAS Mental Health Support
              </p>
              <p className="text-white font-semibold">
                112 - Emergency Services
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 Clarity - Government of Jammu & Kashmir | Higher
              Education Department. All rights reserved.
            </p>
            <p className="mt-2 text-sm">
              Remember, seeking help is a sign of strength. You are not alone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
