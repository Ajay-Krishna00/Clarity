"use client";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  BookOpen,
  Video,
  Headphones,
  FileText,
  Heart,
  Star,
  Clock,
  Eye,
  ChevronRight,
  Tag,
} from "lucide-react";
import Link from "next/link";

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: "all", name: "All Resources", count: 16 },
    { id: "anxiety", name: "Anxiety & Stress", count: 6 },
    { id: "depression", name: "Depression", count: 1 },
    { id: "academic", name: "Academic Pressure", count: 4 },
    { id: "relationships", name: "Relationships", count: 1 },
    { id: "sleep", name: "Sleep & Wellness", count: 2 },
    { id: "nutrition", name: "Nutrition & Mental Health", count: 1 },
    { id: "wellbeing", name: "Wellbeing & Lifestyle", count: 1 },
  ];

  const formats = [
    { id: "all", name: "All Formats" },
    { id: "article", name: "Articles" },
    { id: "video", name: "Videos" },
    { id: "audio", name: "Audio" },
    { id: "pdf", name: "PDFs" },
  ];

  // Mock data - replace with actual API call
  const mockResources = [
    {
      id: 1,
      title: "Managing Exam Stress: A Student's Guide",
      description:
        "Comprehensive strategies for handling academic pressure and exam anxiety. Includes breathing techniques, study schedules, and mindfulness exercises.",
      category: "academic",
      format: "pdf",
      duration: "15 min read",
      downloads: 1234,
      rating: 4.8,
      tags: ["stress", "exams", "study-tips"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "Dr. Priya Sharma, Clinical Psychologist",
      link: "https://www.place2be.org.uk/media/j4kjdblk/navigating-exam-season-guide-for-students.pdf",
    },
    {
      id: 2,
      title: "Mindfulness Meditation for Beginners",
      description:
        "A guided introduction to mindfulness practices specifically designed for students. Learn to calm your mind and improve focus.",
      category: "anxiety",
      format: "video",
      duration: "20 min",
      downloads: 892,
      rating: 4.9,
      tags: ["mindfulness", "meditation", "relaxation"],
      featured: true,
      thumbnail: "/api/placeholder/300/200",
      author: "Meditation Center, Kashmir University",
      link: "https://www.youtube.com/watch?v=inpok4MKVLM",
    },
    {
      id: 3,
      title: "Sleep Hygiene for Students",
      description:
        "Essential tips for better sleep quality during academic stress. Understand sleep cycles and create healthy bedtime routines.",
      category: "sleep",
      format: "article",
      duration: "10 min read",
      downloads: 756,
      rating: 4.7,
      tags: ["sleep", "health", "routine"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "J&K Health Department",
      link: "https://www.sleepfoundation.org/sleep-hygiene",
    },
    {
      id: 4,
      title: "Understanding Depression: Signs and Solutions",
      description:
        "Recognize early signs of depression and learn about available support resources. Know when and how to seek professional help.",
      category: "depression",
      format: "pdf",
      duration: "25 min read",
      downloads: 645,
      rating: 4.6,
      tags: ["depression", "mental-health", "support"],
      featured: true,
      thumbnail: "/api/placeholder/300/200",
      author: "New York State Office of Mental Health",
      link: "https://omh.ny.gov/omhweb/booklets/depression.pdf",
    },
    {
      id: 5,
      title: "Building Healthy Relationships in College",
      description:
        "Navigate friendships, romantic relationships, and family dynamics while managing academic life. Communication and boundary-setting tips.",
      category: "relationships",
      format: "pdf",
      duration: "18 min",
      downloads: 523,
      rating: 4.5,
      tags: ["relationships", "communication", "social"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "Student Counseling Services",
      link: "https://ung.edu/student-counseling/_uploads/files/healthy-relationships.pdf",
    },
    {
      id: 6,
      title: "Breathing Exercises for Instant Calm",
      description:
        "Quick and effective breathing techniques you can use anywhere to reduce anxiety and stress in the moment.",
      category: "anxiety",
      format: "audio",
      duration: "12 min",
      downloads: 1001,
      rating: 4.8,
      tags: ["breathing", "anxiety", "quick-relief"],
      featured: true,
      thumbnail: "/api/placeholder/300/200",
      author: "Mindfulness Institute, Jammu",
      link: "https://www.youtube.com/watch?v=aNXKjGFUlMs",
    },

    // 10 new items (all featured: false) - verified
    {
      id: 7,
      title: "Time Management for Students (Quick Guide)",
      description:
        "Practical steps to plan your week, beat overload, and protect study focus.",
      category: "academic",
      format: "pdf",
      duration: "10 min read",
      downloads: 912,
      rating: 4.7,
      tags: ["time-management", "planning", "study-habits"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "University of Northern Colorado - Academic Success",
      link: "https://www.unco.edu/student-academic-success/academic-success/academic-success-resources/pdf/SAS_time_management.pdf",
    },
    {
      id: 8,
      title: "Test Anxiety: Quick Tips for Students",
      description:
        "Evidence-based strategies to calm nerves before and during exams.",
      category: "anxiety",
      format: "pdf",
      duration: "8 min read",
      downloads: 788,
      rating: 4.7,
      tags: ["anxiety", "exams", "coping"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "UHCL Counseling & Mental Health Center",
      link: "https://www.uhcl.edu/cmhc/resources/documents/handouts/test-anxiety.pdf",
    },
    {
      id: 9,
      title: "Doing What Matters in Times of Stress (Workbook)",
      description:
        "WHO’s illustrated, step-by-step stress management guide with downloadable exercises and audio.",
      category: "anxiety",
      format: "pdf",
      duration: "45 min read",
      downloads: 1322,
      rating: 4.8,
      tags: ["stress", "coping", "workbook"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "World Health Organization",
      link: "https://www.who.int/publications-detail-redirect/9789240003927",
    },
    {
      id: 10,
      title: "Perfectionism in Perspective — Module 1",
      description:
        "Understand perfectionism traps and learn balanced goal-setting.",
      category: "academic",
      format: "pdf",
      duration: "20 min read",
      downloads: 674,
      rating: 4.6,
      tags: ["perfectionism", "mindset", "productivity"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "Centre for Clinical Interventions (WA)",
      link: "https://www.cci.health.wa.gov.au/-/media/CCI/Consumer-Modules/Perfectionism-in-Perspective/Perfectionism-in-Perspective---01---What-is-Perfectionism.pdf",
    },
    {
      id: 11,
      title: "Procrastination: Why We Delay & How to Start",
      description:
        "Concise handout with cognitive and behavioral tools to overcome procrastination.",
      category: "academic",
      format: "pdf",
      duration: "10 min read",
      downloads: 845,
      rating: 4.7,
      tags: ["procrastination", "activation", "study-habits"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "UNH Psychological & Counseling Services",
      link: "https://www.unh.edu/pacs/sites/default/files/media/2020-07/procrastination-handout.pdf",
    },
    {
      id: 12,
      title: "Mindful Check-In (Guided Audio)",
      description:
        "A short guided practice to pause, notice, and reset—great between study blocks.",
      category: "anxiety",
      format: "audio",
      duration: "6 min",
      downloads: 1102,
      rating: 4.8,
      tags: ["mindfulness", "reset", "focus"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "Mindfulness Studies (GROW Meditations)",
      link: "https://www.mindfulnessstudies.com/wp-content/uploads/2019/09/Mindful-Check-In-1.mp3",
    },
    {
      id: 13,
      title: "Your Guide to Healthy Sleep",
      description:
        "NHLBI booklet on sleep basics, common issues, and actionable tips.",
      category: "sleep",
      format: "pdf",
      duration: "30 min read",
      downloads: 973,
      rating: 4.7,
      tags: ["sleep", "health", "routine"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "NHLBI, National Institutes of Health",
      link: "https://www.nhlbi.nih.gov/files/docs/public/sleep/healthy_sleep.pdf",
    },
    {
      id: 14,
      title: "Food and Mood: How Diet Affects Mental Health",
      description:
        "Student-friendly guide on stabilizing energy and mood with everyday food choices.",
      category: "nutrition",
      format: "article",
      duration: "12 min read",
      downloads: 651,
      rating: 4.6,
      tags: ["nutrition", "mood", "wellbeing"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "Mind (UK)",
      link: "https://www.mind.org.uk/information-support/tips-for-everyday-living/food-and-mental-health/",
    },
    {
      id: 15,
      title: "Physical Activity & Mental Health (What You Need to Know)",
      description:
        "Clear, evidence-based overview of how moving your body supports mood and focus.",
      category: "wellbeing",
      format: "article",
      duration: "8 min read",
      downloads: 702,
      rating: 4.6,
      tags: ["exercise", "mental-health", "energy"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "Centers for Disease Control and Prevention (CDC)",
      link: "https://www.cdc.gov/physical-activity-basics/benefits/index.html",
    },
    {
      id: 16,
      title: "5–4–3–2–1 Grounding Technique",
      description:
        "Fast, practical grounding method for anxious moments you can use anywhere.",
      category: "anxiety",
      format: "pdf",
      duration: "5 min read",
      downloads: 989,
      rating: 4.7,
      tags: ["grounding", "anxiety", "quick-relief"],
      featured: false,
      thumbnail: "/api/placeholder/300/200",
      author: "Boys & Girls Clubs / practical handout",
      link: "https://www.bgcmd.org/wp-content/uploads/2020/03/Grounding-Exercise.pdf",
    },
  ];

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setResources(mockResources);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;
    const matchesFormat =
      selectedFormat === "all" || resource.format === selectedFormat;

    return matchesSearch && matchesCategory && matchesFormat;
  });

  const featuredResources = filteredResources.filter(
    (resource) => resource.featured,
  );

  const getFormatIcon = (format) => {
    switch (format) {
      case "video":
        return <Video className="w-4 h-4" />;
      case "audio":
        return <Headphones className="w-4 h-4" />;
      case "pdf":
        return <FileText className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getFormatColor = (format) => {
    switch (format) {
      case "video":
        return "bg-red-100 text-red-700 border-red-200";
      case "audio":
        return "bg-green-100 text-green-700 border-green-200";
      case "pdf":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft
                  size={20}
                  className="text-gray-600 hover:text-gray-800"
                />
              </Link>

              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Mental Health Resources
                </h1>
                <p className="text-sm text-gray-600">
                  Government of J&K • Higher Education Department
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center bg-green-50 px-3 py-1 rounded-full">
              <Heart className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-sm text-green-700 font-medium">
                Free Resources
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-700"
              >
                {formats.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              Featured Resources
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                      <div className="text-4xl">📚</div>
                    </div>
                    <div
                      className={`absolute top-3 left-3 flex items-center px-2 py-1 rounded-full text-xs border ${getFormatColor(resource.format)}`}
                    >
                      {getFormatIcon(resource.format)}
                      <span className="ml-1 capitalize">{resource.format}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium border border-yellow-200">
                      Featured
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {resource.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {resource.duration}
                      </div>
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {resource.downloads}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {resource.rating}
                      </div>
                    </div>

                    {/* Author */}
                    <p className="text-xs text-gray-500 mb-4">
                      By {resource.author}
                    </p>

                    {/* Action Button */}
                    <button
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center font-medium"
                      onClick={() => window.open(resource.link, "_blank")}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Access Resource
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Resources */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            All Resources ({filteredResources.length})
          </h2>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-gray-100"
                >
                  <div className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group"
                >
                  <div className="relative">
                    <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <div className="text-3xl">
                        {resource.category === "anxiety" && "🧘"}
                        {resource.category === "depression" && "💙"}
                        {resource.category === "academic" && "📖"}
                        {resource.category === "relationships" && "🤝"}
                        {resource.category === "sleep" && "😴"}
                        {![
                          "anxiety",
                          "depression",
                          "academic",
                          "relationships",
                          "sleep",
                        ].includes(resource.category) && "📚"}
                      </div>
                    </div>
                    <div
                      className={`absolute top-3 left-3 flex items-center px-2 py-1 rounded-full text-xs border ${getFormatColor(resource.format)}`}
                    >
                      {getFormatIcon(resource.format)}
                      <span className="ml-1 capitalize">{resource.format}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {resource.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {resource.duration}
                      </div>
                      <div className="flex items-center">
                        <Download className="w-3 h-3 mr-1" />
                        {resource.downloads}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 mr-1 text-yellow-400" />
                        {resource.rating}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      className="w-full bg-white border border-indigo-200 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center text-sm font-medium"
                      onClick={() => window.open(resource.link, "_blank")}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Resource
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No resources found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedFormat("all");
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-100">
          <div className="text-center">
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Immediate Support?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you&apos;re experiencing a mental health crisis or need
              immediate assistance, please don&apos;t hesitate to reach out for
              professional help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/support-chat"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              >
                Start Chat Support
              </a>
              <a
                href="/booking"
                className="bg-white border border-indigo-200 text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                Book Counseling Session
              </a>
              <a
                href="tel:988"
                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors"
              >
                Crisis Hotline: 14416
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
