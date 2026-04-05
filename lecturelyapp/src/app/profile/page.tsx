"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import {
  Clock,
  ExternalLink,
  FileText,
  Moon,
  Plus,
  Settings,
  Sun,
  Zap,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";

type Lecture = {
  lectureId: string;
  title: string;
  createdAt: string;
};

type ProfileData = {
  userName: string;
  image: string;
  stats: {
    lecturesSummarized: number;
    hoursSaved: number;
    creditsRemaining: number;
    totalCredits: number;
  };
  recentLectures: Lecture[];
};

type NewStats = {
  subtitlesGenerated: number;
  translationsDone: number;
  // minutesProcessed: number;
  // languagesUsed: number;
  creditsRemaining: number;
  totalCredits: number;
};

type Currency = "INR" | "USD" | "EUR";
type BillingType = "monthly" | "yearly";

type Plan = {
  name: string;
  credits: number;
  price:
    | string
    | {
        monthly: Record<Currency, number>;
        yearly: Record<Currency, number>;
      };
  sub?: string;
  features: string[];
  badge?: string;
  save?: string;
  button: string;
};

const page = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const { data: session, status } = useSession();

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isNewStats = (stats: any): stats is NewStats => {
    return (
      typeof stats?.subtitlesGenerated === "number" &&
      typeof stats?.translationsDone === "number"
      // typeof stats?.minutesProcessed === "number" &&
      // typeof stats?.languagesUsed === "number"
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("email", session?.user?.email || "");

    try {
      const res = await fetch("http://localhost:5000/api/users/upload-avatar", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session?.user.email}`,
        },
        body: formData,
      });

      const data = await res.json();

      setProfileData((prev) => (prev ? { ...prev, image: data.image } : prev));
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const normalizedStats: NewStats = (() => {
    const stats = profileData?.stats;

    if (!stats) {
      return {
        subtitlesGenerated: 0,
        translationsDone: 0,
        minutesProcessed: 0,
        languagesUsed: 0,
        creditsRemaining: 0,
        totalCredits: 0,
      };
    }

    // ✅ Proper type-safe check
    if (isNewStats(stats)) {
      return stats;
    }

    // 🔄 Convert old → new
    return {
      subtitlesGenerated: stats.lecturesSummarized || 0,
      translationsDone: 0,
      minutesProcessed: (stats.hoursSaved || 0) * 60,
      languagesUsed: 1,
      creditsRemaining: stats.creditsRemaining || 0,
      totalCredits: stats.totalCredits || 0,
    };
  })();

  const user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
    stats: {
      subtitlesGenerated: number;
      translationsDone: number;
      // minutesProcessed: number;
      // languagesUsed: number;
      creditsRemaining: number;
      totalCredits: number;
    };
    recentLectures: Lecture[];
  } = {
    name: session?.user?.name || "No Name",
    email: session?.user?.email || "No Email",
    role: "Student",
    avatar:
      profileData?.image ||
      session?.user?.image ||
      "https://www.svgrepo.com/show/452030/avatar-default.svg",
    stats: normalizedStats,
    recentLectures: profileData?.recentLectures || [],
  };

  // Lectures
  const limitedLectures = [...user.recentLectures]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Top-Up Plans
  const [showPlans, setShowPlans] = useState(false);
  const [billingType, setBillingType] = useState<BillingType>("monthly");
  const [currency, setCurrency] = useState<Currency>("INR");
  const [currentPlan, setCurrentPlan] = useState("Free Plan");

  const [credits, setCredits] = useState({
    remaining: 0,
    total: 0,
  });

  const currencySymbol: Record<Currency, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
  };

  const rates = {
    USD: 94,
    EUR: 109,
  };
  const convertFromINR = (inr: number) => ({
    INR: inr,
    USD: +(inr / rates.USD).toFixed(2),
    EUR: +(inr / rates.EUR).toFixed(2),
  });

  const getYearlyTotal = (price: number) => price * 12;

  const handleCurrencyChange = (value: Currency) => {
    setCurrency(value);
  };

  const handlePlanSelect = (plan: Plan) => {
    setCredits({
      remaining: plan.credits,
      total: plan.credits,
    });

    setCurrentPlan(plan.name);
    setShowPlans(false);
  };

  const plans: Plan[] = [
    {
      name: "Free Plan",
      credits: 50,
      price: {
        monthly: { USD: 0, INR: 0, EUR: 0 },
        yearly: { USD: 0, INR: 0, EUR: 0 },
      },
      sub: "Basic access",
      features: [
        "50 credits / month",
        // "Subtitle generation",
        // "Basic translation",
        // "Standard processing speed",
      ],
      badge: "50 Credits",
      button: "Get Started",
    },
    {
      name: "Pro Plan",
      credits: 500,
      price: {
        monthly: convertFromINR(199),
        yearly: convertFromINR(99),
      },
      sub: "For regular users",
      features: [
        "500 credits / month",
        // "Subtitle + Translation",
        // "Faster processing",
        // "Priority queue",
      ],
      badge: "500 Credits",
      button: "Upgrade to Pro",
    },
    {
      name: "Premium Plan",
      credits: 2000,
      price: {
        monthly: convertFromINR(499),
        yearly: convertFromINR(399),
      },
      sub: "For heavy usage",
      features: [
        "2000 credits / month",
        // "All Pro features",
        // "Fastest processing",
        // "Priority support",
      ],
      badge: "2000 Credits",
      button: "Go Premium",
    },
  ];

  useEffect(() => {
    if (credits.total === 0) {
      setCredits({
        remaining: user.stats.creditsRemaining,
        total: user.stats.totalCredits,
      });
    }
  }, [user.stats.creditsRemaining, user.stats.totalCredits]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${session.user.email}`,
          },
        });

        if (!res.ok) {
          console.error("Failed to fetch profile");
          return;
        }

        const data = await res.json();
        setProfileData(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchUserData();
  }, [status, session]);

  console.log("Session:", session);
  console.log("Status:", status);

  if (status === "loading") {
    return <div>Loading..</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please login</div>;
  }

  //   Dummy User
  //   const user = {
  //     name: "Alex Thompson",
  //     email: "alex.t@university.edu",
  //     role: "Computer Science Student",
  //     avatar:
  //       "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
  //     stats: {
  //       lecturesSummarized: 42,
  //       hoursSaved: 124,
  //       creditsRemaining: 15,
  //       totalCredits: 50,
  //     },
  //     recentLectures: [
  //       { id: 1, title: "Advanced Algorithms - Week 4", date: "Oct 24, 2023" },
  //       { id: 2, title: "Machine Learning Ethics", date: "Oct 22, 2023" },
  //       { id: 3, title: "Database Management Systems", date: "Oct 20, 2023" },
  //     ],
  //   };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-6 font-sans">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 w-36 text-black">
            <a
              href="/"
              className="flex bg-white text-3xl rounded-full w-8 border border-[#081A51] cursor-pointer"
            >
              <BsArrowLeftShort />
            </a>
            <p className="dark:text-white">Back</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="flex items-center cursor-pointer"
            >
              {isDarkMode ? <Moon /> : <Sun />}
            </button>

            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              variant="destructive"
              className="bg-red-500 cursor-pointer"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-10">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-indigo-50 object-cover"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-full text-white hover:bg-indigo-700 transition cursor-pointer"
              >
                <Settings size={16} />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFileChange(e)}
                />
              </button>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h1>
              <p className="text-gray-500 font-medium">{user.role}</p>
              <p className="text-sm text-gray-400 mt-1">{user.email}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/")}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2 cursor-pointer"
              >
                <Plus size={18} /> New Lecture
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Stats & Plan */}
            <div className="lg:col-span-1 space-y-6">
              {/* Credits Card */}
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" />
                    AI Credits
                  </h3>

                  <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-white px-2 py-1 rounded-full">
                    {currentPlan}
                  </span>

                  {/* <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-white px-2 py-1 rounded-full">
                    {credits.remaining} left
                  </span> */}
                </div>

                {/* Main Numbers */}
                <div className="mb-3">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {credits.remaining} / {credits.total}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    1 credit = 1 video
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${
                        credits.total
                          ? (credits.remaining / credits.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                {/* CTA */}
                <button
                  onClick={() => setShowPlans(true)}
                  className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition cursor-pointer"
                >
                  Top Up Credits
                </button>
              </div>

              {/* Platform Stats */}
              <div className="bg-linear-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-semibold opacity-90 mb-4">
                  Lecturely Impact
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-3xl font-bold">
                      {user.stats.subtitlesGenerated || 0}
                    </p>
                    <p className="text-xs opacity-80 uppercase tracking-wider mt-1">
                      Subtitles Generated
                    </p>
                  </div>

                  <div>
                    <p className="text-3xl font-bold">
                      {user.stats.translationsDone || 0}
                    </p>
                    <p className="text-xs opacity-80 uppercase tracking-wider mt-1">
                      Translations
                    </p>
                  </div>

                  {/* <div>
                    <p className="text-3xl font-bold">
                      {(user.stats.minutesProcessed || 0).toFixed(2)}m
                    </p>
                    <p className="text-xs opacity-80 uppercase tracking-wider mt-1">
                      Content Processed
                    </p>
                  </div>

                  <div>
                    <p className="text-3xl font-bold">
                      {user.stats.languagesUsed || 0}
                    </p>
                    <p className="text-xs opacity-80 uppercase tracking-wider mt-1">
                      Languages Used
                    </p>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Right Column: Content & Integrations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Clock size={18} className="text-gray-400" /> Recent
                    Lectures
                  </h3>
                  <button
                    onClick={() => router.push("/history")}
                    className="text-sm text-indigo-600 font-medium cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="divide-y divide-gray-50">
                  {limitedLectures.length === 0 ? (
                    <p className="p-4 text-gray-400 text-sm">No lectures yet</p>
                  ) : (
                    limitedLectures.map((lecture, index) => (
                      <div
                        key={lecture.lectureId || index}
                        onClick={() => {
                          console.log("Navigating to:", lecture.lectureId);
                          router.push(`/editor/${lecture.lectureId}`);
                        }}
                        // key={index}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                            <FileText size={20} />
                          </div>

                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {lecture.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(lecture.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <ExternalLink size={16} className="text-gray-300" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPlans && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#0B1220] text-white rounded-2xl p-8 w-[75%] max-w-7xl relative">
            {/* Close */}
            <button
              onClick={() => setShowPlans(false)}
              className="absolute top-5 right-6 text-gray-400 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-8">Top Up Credits</h2>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              {/* Billing Toggle */}
              <div className="flex bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setBillingType("monthly")}
                  className={`px-4 py-1.5 rounded-lg text-sm cursor-pointer ${
                    billingType === "monthly"
                      ? "bg-white text-black"
                      : "text-gray-300"
                  }`}
                >
                  Monthly
                </button>

                <button
                  onClick={() => setBillingType("yearly")}
                  className={`px-4 py-1.5 rounded-lg text-sm cursor-pointer ${
                    billingType === "yearly"
                      ? "bg-white text-black"
                      : "text-gray-300"
                  }`}
                >
                  Yearly
                </button>
              </div>

              {/* Currency Selector */}
              <select
                value={currency}
                onChange={(e) =>
                  handleCurrencyChange(e.target.value as Currency)
                }
                className="bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg cursor-pointer"
              >
                <option value="INR" className="cursor-pointer">
                  INR (₹)
                </option>
                <option value="USD" className="cursor-pointer">
                  USD ($)
                </option>
                <option value="EUR" className="cursor-pointer">
                  EUR (€)
                </option>
              </select>
            </div>

            {/* GRID (important change) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className="bg-[#111827] rounded-2xl border border-gray-700 flex flex-col h-[420px]"
                >
                  {/* TOP SECTION */}
                  <div className="p-5 border-b border-gray-700">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{plan.name}</h3>
                    </div>

                    {typeof plan.price === "string" ? (
                      <p className="text-3xl font-bold mt-2">{plan.price}</p>
                    ) : billingType === "monthly" ? (
                      <p className="text-3xl font-bold mt-2">
                        {currencySymbol[currency]}
                        {plan.price.monthly[currency]} / mo
                      </p>
                    ) : (
                      <>
                        <p className="text-3xl font-bold mt-2">
                          {currencySymbol[currency]}
                          {plan.price.yearly[currency]} / mo
                        </p>

                        <p className="text-xs text-gray-400">
                          Billed yearly: {currencySymbol[currency]}
                          {getYearlyTotal(plan.price.yearly[currency])}
                        </p>
                      </>
                    )}
                    {plan.badge && (
                      <p className="text-indigo-400 font-semibold mt-1 text-sm">
                        {plan.badge}
                      </p>
                    )}
                    <p className="text-sm text-gray-400">{plan.sub}</p>
                  </div>

                  {/* MIDDLE (grow area) */}
                  <div className="p-3 flex-1">
                    <p className="text-sm text-gray-400 mb-4">
                      Included features:
                    </p>

                    <ul className="space-y-2 text-sm">
                      {plan.features.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-gray-300"
                        >
                          <span className="text-green-400 mt-1">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* BOTTOM (fixed position) */}
                  <div className="p-2">
                    <p className="text-xs text-gray-400 pb-2">
                      1 credit = 1 video
                    </p>
                    <button
                      onClick={() => handlePlanSelect(plan)}
                      className="w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition cursor-pointer"
                    >
                      {plan.button}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default page;
