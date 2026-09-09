import React from "react";

/**
 * Skeleton Loader for Hero ResumeCard
 */
export const ResumeCardSkeleton: React.FC = () => {
  return (
    <div
      id="resume-card-skeleton"
      className="w-full bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-xs animate-pulse"
    >
      {/* Header section */}
      <div className="flex items-center justify-between pb-6 border-b border-zinc-100">
        <div className="space-y-2">
          <div className="h-3.5 w-32 bg-zinc-200 rounded-md" />
          <div className="h-6 w-48 bg-zinc-300 rounded-lg" />
        </div>
        <div className="h-9 w-28 bg-zinc-200 rounded-xl" />
      </div>

      {/* Main 3 questions content */}
      <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-zinc-200 rounded-md" />
          <div className="h-16 w-full bg-zinc-100 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-28 bg-zinc-200 rounded-md" />
          <div className="h-16 w-full bg-zinc-100 rounded-xl" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-20 bg-zinc-200 rounded-md" />
          <div className="h-16 w-full bg-zinc-100 rounded-xl" />
        </div>
      </div>

      {/* Footer / CTA buttons */}
      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
        <div className="h-4 w-36 bg-zinc-200 rounded-md" />
        <div className="flex gap-2">
          <div className="h-9 w-24 bg-zinc-200 rounded-xl" />
          <div className="h-9 w-32 bg-zinc-300 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Activity Card Grid
 */
export const ActivityCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 space-y-4 shadow-xs animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-200" />
          <div className="space-y-1.5">
            <div className="h-4 w-32 bg-zinc-300 rounded-md" />
            <div className="h-3 w-20 bg-zinc-200 rounded-md" />
          </div>
        </div>
        <div className="h-6 w-16 bg-zinc-100 rounded-full" />
      </div>

      <div className="space-y-2">
        <div className="h-3 w-full bg-zinc-100 rounded-md" />
        <div className="h-3 w-4/5 bg-zinc-100 rounded-md" />
      </div>

      <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
        <div className="h-3 w-24 bg-zinc-200 rounded-md" />
        <div className="h-8 w-20 bg-zinc-200 rounded-lg" />
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Checkpoint Timeline in ActivityDetailView
 */
export const TimelineSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse py-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-zinc-200" />
            <div className="w-0.5 flex-1 bg-zinc-200 my-2" />
          </div>
          <div className="flex-1 bg-white rounded-xl border border-zinc-200 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-zinc-300 rounded-md" />
              <div className="h-3 w-16 bg-zinc-200 rounded-md" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full bg-zinc-100 rounded-md" />
              <div className="h-3.5 w-5/6 bg-zinc-100 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Full Dashboard Skeleton (used during initial data fetch)
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 sm:space-y-10 animate-pulse">
      {/* Greeting Skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 bg-zinc-300 rounded-lg" />
        <div className="h-4 w-72 bg-zinc-200 rounded-md" />
      </div>

      {/* Resume Card Skeleton */}
      <ResumeCardSkeleton />

      {/* Activities Grid Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
          <div className="h-5 w-36 bg-zinc-300 rounded-md" />
          <div className="h-4 w-28 bg-zinc-200 rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActivityCardSkeleton />
          <ActivityCardSkeleton />
          <ActivityCardSkeleton />
        </div>
      </div>
    </div>
  );
};