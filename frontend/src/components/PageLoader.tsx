import { useEffect, useState } from 'react';

// Thin top progress bar shown on route-level lazy load
export const RouteProgressBar = () => (
  <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-secondary/20 overflow-hidden">
    <div
      className="h-full bg-secondary animate-[progress_1.2s_ease-in-out_infinite]"
      style={{ width: '40%' }}
    />
    <style>{`
      @keyframes progress {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(350%); }
      }
    `}</style>
  </div>
);

// Skeleton shimmer block
const Shimmer = ({ className }: { className: string }) => (
  <div
    className={`bg-gradient-to-r from-white/5 via-white/20 to-white/5 bg-[length:400%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded ${className}`}
  />
);

const ShimmerLight = ({ className }: { className: string }) => (
  <div
    className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:400%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded ${className}`}
  />
);

// Full-screen branded splash with skeleton layout
const PageLoader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9998] flex flex-col transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-label="Loading"
      aria-live="polite"
    >
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>

      {/* ── Skeleton Header ── */}
      <div className="bg-white border-b border-gray-100 shadow-sm px-6 h-16 md:h-20 flex items-center justify-between flex-shrink-0">
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <ShimmerLight className="w-12 h-12 rounded-full" />
          <div className="hidden sm:flex flex-col gap-1.5">
            <ShimmerLight className="w-40 h-3.5" />
            <ShimmerLight className="w-28 h-2.5" />
          </div>
        </div>
        {/* Nav links */}
        <div className="hidden lg:flex items-center gap-2">
          {[64, 52, 72, 56, 60, 52, 48, 64, 56].map((w, i) => (
            <ShimmerLight key={i} className="h-3" style={{ width: w }} />
          ))}
        </div>
        {/* Lang + menu */}
        <div className="flex items-center gap-3">
          <ShimmerLight className="w-14 h-8 rounded-md" />
          <ShimmerLight className="w-8 h-8 rounded-md lg:hidden" />
        </div>
      </div>

      {/* ── Skeleton Hero ── */}
      <div
        className="relative flex-shrink-0 flex flex-col items-center justify-center text-center px-4"
        style={{
          height: 'clamp(280px, 45vh, 480px)',
          background: 'hsl(214 57% 23%)',
        }}
      >
        {/* Logo circle */}
        <div
          className="w-20 h-20 md:w-28 md:h-28 rounded-full mb-5 flex-shrink-0"
          style={{
            background: 'hsl(43 60% 52% / 0.25)',
            animation: 'pulse-soft 2s ease-in-out infinite',
          }}
        />
        {/* Title lines */}
        <Shimmer className="w-72 md:w-[480px] h-6 md:h-8 mb-3" />
        <Shimmer className="w-56 md:w-72 h-4 md:h-5 mb-2" />
        <Shimmer className="w-32 md:w-44 h-3 md:h-4 mb-8" />
        {/* Buttons */}
        <div className="flex gap-3">
          <Shimmer className="w-32 h-11 rounded-lg" />
          <Shimmer className="w-28 h-11 rounded-lg" />
        </div>
      </div>

      {/* ── Skeleton Content Section ── */}
      <div className="flex-1 bg-gray-50 px-4 py-10 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <ShimmerLight className="w-48 h-5" />
            <ShimmerLight className="w-72 h-4" />
          </div>
          {/* Card grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 shadow-sm flex flex-col gap-3"
                style={{
                  opacity: 1 - i * 0.07,
                  animation: `fadeDown 0.4s ease-out ${i * 60}ms both`,
                }}
              >
                <ShimmerLight className="w-10 h-10 rounded-lg" />
                <ShimmerLight className="w-3/4 h-3.5" />
                <ShimmerLight className="w-full h-2.5" />
                <ShimmerLight className="w-5/6 h-2.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Branded center overlay (fades out before skeletons) ── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ animation: 'fadeDown 0.5s ease-out 1.8s both, shimmer 0s 2.2s both' }}
      >
        {/* Subtle gold pulse ring around logo area */}
        <div
          className="absolute rounded-full border-2 border-secondary/40"
          style={{
            width: 'clamp(100px, 20vw, 160px)',
            height: 'clamp(100px, 20vw, 160px)',
            top: 'clamp(110px, 22vh, 200px)',
            animation: 'pulse-soft 1.8s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
};

export default PageLoader;
