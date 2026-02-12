"use client";

import React, { useEffect, useState } from "react";
import { Play, Download, Globe, Edit3, Moon, Sun, Menu, X } from "lucide-react";
import { Subtitle } from "../types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Contact from "./Contact";

interface EditorViewProps {
  subtitles: Subtitle[];
  targetLang: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onSubtitleChange: (id: number, newText: string) => void;
  onDownload: () => void;
  onNewProject: () => void;

  videoSrc?: string | null;
}

export const EditorView: React.FC<EditorViewProps> = ({
  subtitles,
  targetLang,
  isDarkMode,
  toggleTheme,
  onSubtitleChange,
  onDownload,
  onNewProject,
  videoSrc,
}) => {
  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 75);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: session } = useSession();

  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <div className={isDarkMode ? "dark" : ""}>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
          {/* Editor Navbar */}
          {/* <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-10 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            L
          </div>
          <span className="font-bold text-xl text-slate-800 dark:text-slate-100">
            Lecturely.ai
          </span>
          <span className="bg-green-100 dark:bg-indigo-500/10 text-green-700 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full font-medium ml-2 border dark:border-indigo-500/20">
            Editor Mode
          </span>
        </div>
        <div className="flex items-center gap-3">

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isDarkMode ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={onNewProject}
            className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
          >
            New Project
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
          <button
          onClick={onDownload}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            <Download className="w-4 h-4" /> Export SRT
          </button>
        </div>
      </header> */}
          {/* Navbar added */}
          <nav
            className={`flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto g-4 w-87 md:w-full border-b border-transparent md:border-none z-50 transition-all duration-300 ${
              isSticky
                ? "fixed top-5 left-3.5 md:left-5 md:right-5 rounded-4xl p-2 bg-white dark:bg-black shadow-lg"
                : "relative"
            }`}
          >
            <a href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                L
              </div>
              <span className="hidden md:flex font-bold text-2xl text-slate-800 dark:text-slate-100 tracking-tight">
                Lecturely.ai
              </span>
              <span className="bg-green-100 w-10 dark:bg-indigo-500/10 text-green-700 dark:text-indigo-400 text-[8px] px-2 py-0.5 rounded-full font-medium ml-2 border dark:border-indigo-500/20">
                Editor Mode
              </span>
            </a>

            <div className="hidden md:flex gap-8 text-slate-600 dark:text-slate-400 font-medium">
              <a
                href="#"
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Home
              </a>
            </div>

            <div className="flex gap-2 md:gap-10 items-center">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {isDarkMode ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={onNewProject}
                className="text-[10px] md:text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                New Project
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
              <button
                onClick={onDownload}
                className="flex items-center gap-2 bg-indigo-600 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                <Download className="w-4 h-4" />{" "}
                <p className="text-[14px] hidden md:inline">Export SRT</p>
              </button>
            </div>
          </nav>

          {/* End of navBar */}

          {/* Main Workspace */}
          <main className="flex flex-col md:flex-row w-full md:flex-1 md:overflow-hidden">
            {/* Left: Video Preview */}
            <div className="md:w-1/2 flex flex-col items-center justify-center relative">
              {/* Video Player */}
              <div className="w-full aspect-video overflow-hidden relative group">
                {videoSrc ? (
                  <video
                    src={videoSrc}
                    controls
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-slate-500 font-medium">
                      Video Preview Placeholder
                    </p>
                  </div>
                )}

                {/* video play */}
                {subtitles.length > 0 && (
                  <div className="absolute bottom-[8%] left-0 right-0 flex justify-center px-4 pointer-events-none">
                    <span className="bg-black/50 text-white px-4 py-2 rounded-lg text-[10px] md:text-base lg:text-lg leading-relaxed text-center max-w-[90%] backdrop-blur-sm">
                      {subtitles[0].translated}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Subtitle Editor */}
            <div className="md:w-1/2 bg-white dark:bg-slate-900 flex flex-col border-l border-slate-200 dark:border-slate-800 transition-colors">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">
                    Subtitle Tracks
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    English (Original) &rarr; {targetLang}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg">
                    <Globe className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {subtitles.map((sub) => (
                  <div
                    key={sub.id}
                    className="group border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-indigo-300 dark:hover:border-indigo-500 transition bg-white dark:bg-slate-800"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-mono px-2 py-1 rounded">
                        {sub.start} &rarr; {sub.end}
                      </span>
                      <Edit3 className="w-4 h-4 text-slate-300 dark:text-slate-500 group-hover:text-indigo-400" />
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
                        Original
                      </p>
                      <div className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded text-sm select-none border border-transparent dark:border-slate-700">
                        {sub.original}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1 font-medium flex items-center gap-2">
                        {targetLang}{" "}
                        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 px-1.5 rounded text-indigo-700 dark:text-indigo-300">
                          Editable
                        </span>
                      </p>
                      <textarea
                        className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                        rows={2}
                        value={sub.translated}
                        onChange={(e) =>
                          onSubtitleChange(sub.id, e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                {/* <div className="">
                  <Contact />
                </div> */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

// import React from 'react';
// import { Play, Download, Globe, Edit3 } from 'lucide-react';
// import { Subtitle } from '../types';

// interface EditorViewProps {
//   subtitles: Subtitle[];
//   targetLang: string;
//   onSubtitleChange: (id: number, newText: string) => void;
//   onDownload: () => void;
//   onNewProject: () => void;
// }

// export const EditorView: React.FC<EditorViewProps> = ({
//   subtitles,
//   targetLang,
//   onSubtitleChange,
//   onDownload,
//   onNewProject
// }) => {
//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
//       {/* Editor Navbar */}
//       <header className="bg-white border-b px-6 py-3 flex justify-between items-center z-10">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">L</div>
//           <span className="font-bold text-xl text-slate-800">Lecturely.ai</span>
//           <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium ml-2">Editor Mode</span>
//         </div>
//         <div className="flex items-center gap-3">
//           <button onClick={onNewProject} className="text-sm font-medium text-slate-500 hover:text-slate-800">New Project</button>
//           <div className="h-6 w-px bg-slate-200 mx-2"></div>
//           <button
//             onClick={onDownload}
//             className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
//           >
//             <Download className="w-4 h-4" /> Export SRT
//           </button>
//         </div>
//       </header>

//       {/* Main Workspace */}
//       <main className="flex flex-1 overflow-hidden">
//         {/* Left: Video Preview */}
//         <div className="w-1/2 bg-slate-900 flex flex-col items-center justify-center relative p-8">
//           <div className="w-full aspect-video bg-black rounded-xl shadow-2xl overflow-hidden relative group">
//             <div className="absolute inset-0 flex items-center justify-center">
//               <p className="text-slate-500 font-medium">Video Preview Placeholder</p>
//             </div>

//             <div className="absolute bottom-10 left-0 right-0 text-center px-10">
//               <span className="inline-block bg-black/70 text-white px-4 py-2 rounded text-lg leading-relaxed shadow-lg backdrop-blur-sm">
//                 {subtitles[0].translated}
//               </span>
//             </div>

//             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
//                <button className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white hover:bg-white/40 transition">
//                  <Play className="w-8 h-8 fill-current" />
//                </button>
//             </div>
//           </div>
//         </div>

//         {/* Right: Subtitle Editor */}
//         <div className="w-1/2 bg-white flex flex-col border-l border-slate-200">
//           <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
//             <div>
//               <h3 className="font-bold text-slate-800">Subtitle Tracks</h3>
//               <p className="text-xs text-slate-500">English (Original) &rarr; {targetLang} (AI Translated)</p>
//             </div>
//             <div className="flex gap-2">
//                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Globe className="w-4 h-4"/></button>
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {subtitles.map((sub) => (
//               <div key={sub.id} className="group border border-slate-200 rounded-xl p-4 hover:border-indigo-300 hover:shadow-md transition bg-white">
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="bg-slate-100 text-slate-500 text-xs font-mono px-2 py-1 rounded">
//                     {sub.start} &rarr; {sub.end}
//                   </span>
//                   <Edit3 className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
//                 </div>

//                 <div className="mb-3">
//                   <p className="text-sm text-slate-500 mb-1 font-medium">Original</p>
//                   <div className="text-slate-600 bg-slate-50 p-2 rounded text-sm select-none">
//                     {sub.original}
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-sm text-indigo-600 mb-1 font-medium flex items-center gap-2">
//                     {targetLang} <span className="text-[10px] bg-indigo-100 px-1.5 rounded text-indigo-700">Editable</span>
//                   </p>
//                   <textarea
//                     className="w-full p-2 border border-slate-200 rounded-lg text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
//                     rows={2}
//                     value={sub.translated}
//                     onChange={(e) => onSubtitleChange(sub.id, e.target.value)}
//                   />
//                 </div>
//               </div>
//             ))}
//             <div className="h-10"></div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };
