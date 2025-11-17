import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="w-full h-full bg-[var(--secondary)] rounded-lg">
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-[var(--muted-foreground)] animate-pulse">
            <span className="material-icons-round text-5xl mb-3 text-[var(--border)]">image</span>
            <p className="mt-2 text-sm font-semibold">AI is painting...</p>
            <p className="text-xs">This can take a moment</p>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;