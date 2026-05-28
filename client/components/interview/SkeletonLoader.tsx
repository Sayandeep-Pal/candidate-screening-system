import React from 'react';

export const InterviewSkeleton = () => {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Question Card Skeleton */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 space-y-4">
        <div className="w-32 h-4 bg-slate-800 rounded" />
        <div className="w-full h-8 bg-slate-800 rounded" />
        <div className="w-3/4 h-8 bg-slate-800 rounded" />
      </div>

      {/* Input Skeleton */}
      <div className="space-y-4">
        <div className="w-full h-64 bg-slate-900/20 border border-slate-800 rounded-xl" />
        <div className="flex justify-end">
          <div className="w-40 h-12 bg-slate-800 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
