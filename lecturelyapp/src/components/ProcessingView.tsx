import React from 'react';

interface ProcessingViewProps {
  progress: number;
  stage: string;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ progress, stage }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64" cy="64" r="58"
              stroke="currentColor" strokeWidth="8"
              fill="transparent" className="text-slate-100"
            />
            <circle
              cx="64" cy="64" r="58"
              stroke="currentColor" strokeWidth="8"
              fill="transparent"
              strokeDasharray={365}
              strokeDashoffset={365 - (365 * progress) / 100}
              className="text-indigo-600 transition-all duration-300 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-indigo-900">
            {progress}%
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 animate-pulse">{stage}</h2>
        <p className="text-slate-500 mt-2">Using AI to analyze speech patterns and context...</p>
      </div>
    </div>
  );
};