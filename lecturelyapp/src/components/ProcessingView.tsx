import React from "react";

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
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* 🔵 Progress Circle */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-200"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={365}
              strokeDashoffset={365 - (365 * progress) / 100}
              className="text-indigo-600 transition-all duration-500 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-indigo-900">
            {progress}%
          </div>
        </div>

        {/* 🔥 Current Stage */}
        <h2 className="text-xl font-semibold text-slate-800 mb-4">{stage}</h2>

        {/* 🧠 Step Indicators */}
        <div className="text-left space-y-2 mt-4">
          {steps.map((step, index) => {
            const isCompleted = progress >= step.threshold;
            const isActive =
              progress < step.threshold &&
              (index === 0 || progress >= steps[index - 1].threshold);

            return (
              <div
                key={index}
                className={`flex items-center gap-2 text-sm ${
                  isCompleted
                    ? "text-green-600"
                    : isActive
                      ? "text-indigo-600"
                      : "text-slate-400"
                }`}
              >
                <span>{isCompleted ? "✔" : isActive ? "⏳" : "•"}</span>
                {step.label}
              </div>
            );
          })}
        </div>

        {/* 📝 Subtitle */}
        <p className="text-slate-500 mt-6 text-sm">
          AI is processing your lecture. This may take a moment depending on
          video length.
        </p>
      </div>
    </div>
  );
};
