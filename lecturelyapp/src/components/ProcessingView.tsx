import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

interface ProcessingViewProps {
  progress: number;
  stage: string;
}

const steps = [
  { label: "Transcribing audio", threshold: 10 },
  { label: "Understanding context", threshold: 30 },
  { label: "Refining transcript", threshold: 50 },
  { label: "Translating subtitles", threshold: 70 },
  { label: "Generating notes", threshold: 90 },
];

export const ProcessingView: React.FC<ProcessingViewProps> = ({
  progress,
  stage,
}) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex flex-col items-center justify-center p-6 transition-colors duration-500">
      <div className="w-full max-w-lg">
        {/* Progress Section */}
        <div className="relative flex flex-col items-center mb-12">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />

            <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
              {/* Background Track */}
              <circle
                cx="96"
                cy="96"
                r={radius}
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-200 dark:text-slate-800"
              />
              {/* Progress Bar */}
              <motion.circle
                cx="96"
                cy="96"
                r={radius}
                stroke="url(#gradient)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: "easeInOut" }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={progress}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white"
              >
                {progress}%
              </motion.span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-slate-400 dark:text-slate-500">
                Complete
              </span>
            </div>
          </div>

          <motion.h2
            key={stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-2xl font-bold text-slate-800 dark:text-slate-100 text-center"
          >
            {stage}
          </motion.h2>
        </div>

        {/* Steps Timeline */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none backdrop-blur-sm">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isCompleted = progress >= step.threshold;
              const isActive =
                progress < step.threshold &&
                (index === 0 || progress >= steps[index - 1].threshold);

              return (
                <div key={index} className="relative flex items-start gap-4">
                  {/* Vertical Line Connector */}
                  {index !== steps.length - 1 && (
                    <div className="absolute left-[11px] top-7 w-0.5 h-10 bg-slate-100 dark:bg-slate-800">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: isCompleted ? "100%" : "0%" }}
                        className="w-full bg-indigo-500"
                      />
                    </div>
                  )}

                  <div className="relative z-10 flex items-center justify-center">
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-50 dark:fill-emerald-500/10" />
                      </motion.div>
                    ) : isActive ? (
                      <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-700 fill-slate-50 dark:fill-slate-800" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium transition-colors duration-300 ${
                        isCompleted
                          ? "text-slate-900 dark:text-slate-100"
                          : isActive
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-slate-400 dark:text-slate-600"
                      }`}
                    >
                      {step.label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="active-pill"
                        className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wider"
                      >
                        In Progress...
                      </motion.span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-slate-400 dark:text-slate-500 mt-8 text-sm leading-relaxed max-w-xs mx-auto">
          Our AI is analyzing every detail.
          <span className="block mt-1 font-medium text-slate-500">
            Larger files may take a moment.
          </span>
        </p>
      </div>
    </div>
  );
};

// import React from "react";

// interface ProcessingViewProps {
//   progress: number;
//   stage: string;
// }

// const steps = [
//   { label: "Transcribing audio", threshold: 10 },
//   { label: "Understanding context", threshold: 30 },
//   { label: "Refining transcript", threshold: 50 },
//   { label: "Translating subtitles", threshold: 70 },
//   { label: "Generating notes", threshold: 90 },
// ];

// export const ProcessingView: React.FC<ProcessingViewProps> = ({
//   progress,
//   stage,
// }) => {
//   return (
//     <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6">
//       <div className="w-full max-w-md text-center">
//         {/* 🔵 Progress Circle */}
//         <div className="relative w-32 h-32 mx-auto mb-8">
//           <svg className="w-full h-full transform -rotate-90">
//             <circle
//               cx="64"
//               cy="64"
//               r="58"
//               stroke="currentColor"
//               strokeWidth="8"
//               fill="transparent"
//               className="text-slate-200"
//             />
//             <circle
//               cx="64"
//               cy="64"
//               r="58"
//               stroke="currentColor"
//               strokeWidth="8"
//               fill="transparent"
//               strokeDasharray={365}
//               strokeDashoffset={365 - (365 * progress) / 100}
//               className="text-indigo-600 transition-all duration-500 ease-out"
//             />
//           </svg>

//           <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-indigo-900">
//             {progress}%
//           </div>
//         </div>

//         {/* 🔥 Current Stage */}
//         <h2 className="text-xl font-semibold text-slate-800 mb-4">{stage}</h2>

//         {/* 🧠 Step Indicators */}
//         <div className="text-left space-y-2 mt-4">
//           {steps.map((step, index) => {
//             const isCompleted = progress >= step.threshold;
//             const isActive =
//               progress < step.threshold &&
//               (index === 0 || progress >= steps[index - 1].threshold);

//             return (
//               <div
//                 key={index}
//                 className={`flex items-center gap-2 text-sm ${
//                   isCompleted
//                     ? "text-green-600"
//                     : isActive
//                       ? "text-indigo-600"
//                       : "text-slate-400"
//                 }`}
//               >
//                 <span>{isCompleted ? "✔" : isActive ? "⏳" : "•"}</span>
//                 {step.label}
//               </div>
//             );
//           })}
//         </div>

//         {/* 📝 Subtitle */}
//         <p className="text-slate-500 mt-6 text-sm">
//           AI is processing your lecture. This may take a moment depending on
//           video length.
//         </p>
//       </div>
//     </div>
//   );
// };
