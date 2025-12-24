"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  ArrowLeft,
  Users,
  MessageCircle,
  BookOpen,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Shield,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Clock,
  Heart,
  Activity,
  Award,
  Building,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedInstitution, setSelectedInstitution] = useState("all");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setMessage("Login to access the admin dashboard.");
        return;
      }
      if (!error && data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("admin_applications")
          .select("*")
          .eq("user_id", data.user.id)
          .single();
        if (profileError) {
          setMessage("Error checking admin application.");
          return;
        }

        if (profileData) {
          setIsAdmin(true);
        } else {
          setMessage("Access Denied: You do not have admin privileges.");
        }
      }
    }
    fetchUser();
  }, []);

  // Mock data - replace with actual API calls
  const overviewStats = {
    totalUsers: 2847,
    activeUsers: 1234,
    chatSessions: 5678,
    resourceViews: 12450,
    bookings: 456,
    avgSessionDuration: "18.5 min",
    userGrowth: 12.5,
    engagementRate: 74.2,
  };

  const institutionData = [
    { name: "Kashmir University", users: 856, active: 312, sessions: 1245 },
    { name: "Jammu University", users: 742, active: 287, sessions: 1089 },
    { name: "NIT Srinagar", users: 521, active: 198, sessions: 876 },
    { name: "IIT Jammu", users: 398, active: 156, sessions: 654 },
    { name: "IUST", users: 330, active: 125, sessions: 432 },
  ];

  const usageData = [
    { month: "Jan", users: 1234, sessions: 2345, resources: 3456 },
    { month: "Feb", users: 1456, sessions: 2789, resources: 4123 },
    { month: "Mar", users: 1678, sessions: 3234, resources: 4567 },
    { month: "Apr", users: 1892, sessions: 3789, resources: 5234 },
    { month: "May", users: 2156, sessions: 4567, resources: 6789 },
    { month: "Jun", users: 2398, sessions: 5234, resources: 7456 },
    { month: "Jul", users: 2634, sessions: 5789, resources: 8234 },
    { month: "Aug", users: 2847, sessions: 6234, resources: 8967 },
  ];

  const categoryData = [
    { name: "Academic Stress", value: 32, count: 1847, color: "#8884d8" },
    { name: "Anxiety", value: 28, count: 1612, color: "#82ca9d" },
    { name: "Depression", value: 18, count: 1036, color: "#ffc658" },
    { name: "Relationships", value: 12, count: 691, color: "#ff7c7c" },
    { name: "Sleep Issues", value: 10, count: 576, color: "#8dd1e1" },
  ];

  const timeDistribution = [
    { hour: "6-9 AM", sessions: 145 },
    { hour: "9-12 PM", sessions: 267 },
    { hour: "12-3 PM", sessions: 432 },
    { hour: "3-6 PM", sessions: 589 },
    { hour: "6-9 PM", sessions: 734 },
    { hour: "9-12 AM", sessions: 456 },
    { hour: "12-6 AM", sessions: 123 },
  ];

  const wellnessMetrics = [
    {
      metric: "Crisis Interventions",
      value: 23,
      change: -15.2,
      status: "decreased",
    },
    {
      metric: "Support Requests",
      value: 1847,
      change: 8.7,
      status: "increased",
    },
    {
      metric: "Resource Downloads",
      value: 12450,
      change: 22.1,
      status: "increased",
    },
    {
      metric: "Counseling Sessions",
      value: 456,
      change: 18.5,
      status: "increased",
    },
  ];

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setLoading(false);
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
                <Activity className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Clarity Analytics
                </h1>
                <p className="text-sm text-gray-600"> Wellness Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* <div className="text-right hidden sm:block">
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm font-medium text-gray-700">
                  {lastUpdated.toLocaleTimeString()}
                </p>
              </div> */}

              <button
                onClick={refreshData}
                disabled={loading}
                className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 disabled:opacity-50 transition-colors"
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </button>

              <div className="flex items-center bg-green-50 px-3 py-2 rounded-full">
                <Shield className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-700 font-medium">
                  Anonymized Data
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {message && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Alert: </strong>
            <span className="block sm:inline">{message}</span>
          </div>
        </div>
      )}
      {isAdmin && (
        <>
          <div className="w-full flex justify-center items-center">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 mt-2 border-2 border-amber-300 rounded-xl bg-amber-100">
              <h2 className="text-md  text-gray-800">
                Data shown are just for demonstration purposes.
              </h2>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-800"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="3months">Last 3 months</option>
                  <option value="6months">Last 6 months</option>
                  <option value="1year">Last year</option>
                </select>

                <text className="text-gray-800 bg-white p-2 rounded-lg border-1 border-gray-300">
                  Model Engg College
                </text>
              </div>

              <div className="flex-1"></div>

              <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div
                    className={`flex items-center text-sm ${overviewStats.userGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {overviewStats.userGrowth >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {Math.abs(overviewStats.userGrowth)}%
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {overviewStats.totalUsers.toLocaleString()}
                </h3>
                <p className="text-gray-600 text-sm">Total Registered Users</p>
                <p className="text-xs text-gray-500 mt-1">
                  {overviewStats.activeUsers.toLocaleString()} active this month
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    24.3%
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {overviewStats.chatSessions.toLocaleString()}
                </h3>
                <p className="text-gray-600 text-sm">Chat Sessions</p>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: {overviewStats.avgSessionDuration}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    31.7%
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {overviewStats.resourceViews.toLocaleString()}
                </h3>
                <p className="text-gray-600 text-sm">Resource Views</p>
                <p className="text-xs text-gray-500 mt-1">
                  Across all categories
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-sm text-green-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    18.5%
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {overviewStats.bookings.toLocaleString()}
                </h3>
                <p className="text-gray-600 text-sm">Counseling Sessions</p>
                <p className="text-xs text-gray-500 mt-1">
                  Professional bookings
                </p>
              </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Usage Trends */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Platform Usage Trends
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Monthly Data
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="sessions"
                      stackId="1"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="resources"
                      stackId="1"
                      stroke="#ffc658"
                      fill="#ffc658"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Support Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Support Categories
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="w-4 h-4 mr-1" />
                    Most Common
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 flex flex-col justify-center space-y-3">
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {category.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {category.count} interactions
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {category.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Institution Comparison */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Institution Engagement
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building className="w-4 h-4 mr-1" />
                    Top 5 Institutions
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={institutionData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" stroke="#666" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#666"
                      width={120}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="users" fill="#8884d8" name="Total Users" />
                    <Bar dataKey="active" fill="#82ca9d" name="Active Users" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Time Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Usage by Time
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Peak Hours
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sessions"
                      stroke="#8884d8"
                      strokeWidth={3}
                      dot={{ fill: "#8884d8", strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Wellness Metrics */}
            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Wellness Impact Metrics
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Heart className="w-4 h-4 mr-1" />
                  Student Wellbeing Indicators
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {wellnessMetrics.map((metric, index) => (
                  <div key={index} className="text-center">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm mb-3 ${
                        metric.status === "increased"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {metric.status === "increased" ? (
                        <TrendingUp className="w-4 h-4 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 mr-1" />
                      )}
                      {metric.change >= 0 ? "+" : ""}
                      {metric.change}%
                    </div>
                    <h4 className="text-3xl font-bold text-gray-900 mb-2">
                      {metric.value.toLocaleString()}
                    </h4>
                    <p className="text-gray-600 text-sm">{metric.metric}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts and Insights */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* System Alerts */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">
                    System Insights
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Peak Usage Detected
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Evening hours (6-9 PM) show highest engagement. Consider
                        additional support during these times.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        Positive Trend
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Crisis interventions decreased by 15.2% this month,
                        indicating improved preventive care.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-yellow-900">
                        Resource Gap
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Sleep-related resources are highly requested but
                        limited. Consider expanding this category.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center mb-6">
                  <Award className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Performance Summary
                  </h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        User Engagement
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {overviewStats.engagementRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                        style={{ width: `${overviewStats.engagementRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Response Time
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        &lt; 2 mins
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "92%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        System Uptime
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        99.8%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "99.8%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        User Satisfaction
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        4.7/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: "94%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center text-gray-500">
              <p className="text-sm">
                All data is anonymized and aggregated to protect student
                privacy. Individual student information is never displayed or
                stored in identifiable form.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
