"use client";

import { Button } from "@/components/ui/button";
import {
  Clock,
  ExternalLink,
  FileText,
  Plus,
  Settings,
  Zap,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";

type Lecture = {
  lectureId?: string;
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
  minutesProcessed: number;
  languagesUsed: number;
  creditsRemaining: number;
  totalCredits: number;
};

const page = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const { data: session, status } = useSession();

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isNewStats = (stats: any): stats is NewStats => {
    return (
      typeof stats?.subtitlesGenerated === "number" &&
      typeof stats?.translationsDone === "number" &&
      typeof stats?.minutesProcessed === "number" &&
      typeof stats?.languagesUsed === "number"
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
          Authorization: `Bearer ${session?.accessToken}`,
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
      minutesProcessed: number;
      languagesUsed: number;
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
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
    stats: normalizedStats,
    recentLectures: profileData?.recentLectures || [],
  };

  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
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
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 w-36 text-black">
            <a
              href="/"
              className="flex bg-white text-3xl rounded-full w-8 border border-[#081A51] cursor-pointer"
            >
              <BsArrowLeftShort />
            </a>
            <p>Back</p>
          </div>
          <Button
            onClick={() => signOut({ callbackUrl: "/login" })}
            variant="destructive"
          >
            Sign Out
          </Button>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100 flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-indigo-50 object-cover"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-indigo-600 p-1.5 rounded-full text-white hover:bg-indigo-700 transition"
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
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500 font-medium">{user.role}</p>
              <p className="text-sm text-gray-400 mt-1">{user.email}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => router.push("/")}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <Plus size={18} /> New Lecture
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Stats & Plan */}
            <div className="lg:col-span-1 space-y-6">
              {/* Credits Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Zap size={18} className="text-amber-500" /> AI Credits
                  </h3>
                  <span className="text-sm font-semibold text-indigo-600">
                    Pro Plan
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                  <div
                    className="bg-indigo-600 h-3 rounded-full"
                    style={{
                      width: `${
                        user.stats.totalCredits
                          ? (user.stats.creditsRemaining /
                              user.stats.totalCredits) *
                            100
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">
                  {user.stats.creditsRemaining} credits left of{" "}
                  {user.stats.totalCredits}
                </p>
                <button className="w-full mt-4 py-2 border-2 border-indigo-50 text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition">
                  Top up Credits
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

                  <div>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Content & Integrations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Clock size={18} className="text-gray-400" /> Recent
                    Lectures
                  </h3>
                  <button className="text-sm text-indigo-600 font-medium">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {user.recentLectures.map((lecture, index) => (
                    <div
                      key={lecture.lectureId || index}
                      // key={index}
                      className="p-4 hover:bg-gray-50 transition cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {lecture.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(lecture.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <ExternalLink size={16} className="text-gray-300" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Integrations */}
              {/* <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4">
                  Connected Services
                </h3>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center text-[10px] text-white font-bold">
                      C
                    </div>
                    <span className="text-sm font-medium">Canvas LMS</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 opacity-60">
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-[10px] text-white font-bold">
                      Z
                    </div>
                    <span className="text-sm font-medium">Zoom</span>
                    <span className="text-[10px] text-gray-500">Connect</span>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  //   return (
  //     <>
  //

  //       <div className="p-4">
  //         Profile Page

  //       </div>
  //     </>
  //   );
};

export default page;
