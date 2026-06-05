/**
 * Skeleton loading components.
 *
 * - PageLoader   : full-page skeleton (header + hero + content sections)
 *                  used as the Suspense fallback for the whole app
 * - RouteProgressBar : slim top bar for quick in-page transitions
 */

// ─── shimmer primitives ─────────────────────────────────────────────────────

const S = ({ className = '' }: { className?: string }) => (
  <div
    className={`animate-pulse rounded bg-gray-200 ${className}`}
  />
);

const SD = ({ className = '' }: { className?: string }) => (
  <div
    className={`animate-pulse rounded bg-white/10 ${className}`}
  />
);

// ─── Header skeleton ─────────────────────────────────────────────────────────

const HeaderSkeleton = () => (
  <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20">
      {/* logo */}
      <div className="flex items-center gap-3">
        <S className="w-12 h-12 rounded-full" />
        <div className="hidden sm:flex flex-col gap-2">
          <S className="w-36 h-3" />
          <S className="w-24 h-2.5" />
        </div>
      </div>
      {/* nav links */}
      <div className="hidden lg:flex items-center gap-3">
        {[56, 48, 72, 56, 52, 48, 56, 64, 52].map((w, i) => (
          <S key={i} className="h-3" style={{ width: w }} />
        ))}
      </div>
      {/* right side */}
      <div className="flex items-center gap-3">
        <S className="w-14 h-8 rounded-md" />
        <S className="w-8 h-8 rounded-md lg:hidden" />
      </div>
    </div>
  </div>
);

// ─── Hero skeleton (navy bg like the real hero) ───────────────────────────────

const HeroSkeleton = () => (
  <section
    className="flex flex-col items-center justify-center text-center px-4 py-20 md:py-28"
    style={{ minHeight: '60vh', background: 'hsl(214 57% 23%)' }}
  >
    {/* logo circle */}
    <SD className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-6" />
    {/* title */}
    <SD className="w-72 md:w-[520px] h-8 md:h-10 mb-4" />
    {/* scripture */}
    <SD className="w-56 md:w-80 h-4 mb-2" />
    <SD className="w-32 md:w-44 h-3 mb-10" />
    {/* buttons */}
    <div className="flex gap-3">
      <SD className="w-36 h-12 rounded-lg" />
      <SD className="w-28 h-12 rounded-lg" />
    </div>
  </section>
);

// ─── Welcome section skeleton ─────────────────────────────────────────────────

const WelcomeSkeleton = () => (
  <section className="py-12 md:py-20 px-4 bg-white">
    <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
      <S className="w-48 h-6 mb-2" />
      <S className="w-64 h-4" />
      <div className="w-full bg-gray-50 rounded-2xl p-8 mt-6 flex flex-col gap-3">
        <S className="w-3/4 h-5 mx-auto" />
        <S className="w-full h-4" />
        <S className="w-full h-4" />
        <S className="w-5/6 h-4" />
      </div>
      <S className="w-40 h-12 rounded-full mt-4" />
    </div>
  </section>
);

// ─── Mission / Vision skeleton (navy bg) ─────────────────────────────────────

const MissionSkeleton = () => (
  <section
    className="py-16 md:py-24 px-4"
    style={{ background: 'hsl(214 57% 23%)' }}
  >
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
      {[0, 1].map((i) => (
        <div key={i} className="rounded-3xl p-8 border border-white/10 flex flex-col gap-4">
          <SD className="w-16 h-16 rounded-2xl" />
          <SD className="w-40 h-6" />
          <SD className="w-full h-4" />
          <SD className="w-full h-4" />
          <SD className="w-4/5 h-4" />
        </div>
      ))}
    </div>
  </section>
);

// ─── Ministry cards skeleton ──────────────────────────────────────────────────

const MinistriesSkeleton = () => (
  <section className="py-12 md:py-20 px-4 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      {/* section header */}
      <div className="flex flex-col items-center gap-3 mb-12">
        <S className="w-32 h-4" />
        <S className="w-52 h-6" />
        <S className="w-64 h-4" />
      </div>
      {/* card grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm flex flex-col items-center gap-3">
            <S className="w-12 h-12 rounded-full" />
            <S className="w-3/4 h-4" />
            <S className="w-full h-3" />
            <S className="w-5/6 h-3" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Events skeleton (primary bg) ────────────────────────────────────────────

const EventsSkeleton = () => (
  <section
    className="py-12 md:py-20 px-4"
    style={{ background: 'hsl(214 57% 23%)' }}
  >
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col items-center gap-3 mb-10">
        <SD className="w-52 h-7" />
        <SD className="w-64 h-4" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/10 rounded-xl p-6 flex flex-col gap-3">
            <SD className="w-3/4 h-5" />
            <SD className="w-1/2 h-3" />
            <SD className="w-full h-3" />
            <SD className="w-full h-3" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Generic interior page skeleton (for non-home pages) ─────────────────────

export const GenericPageSkeleton = () => (
  <>
    {/* hero banner */}
    <section
      className="py-20 md:py-28 px-4 flex flex-col items-center gap-4"
      style={{ background: 'hsl(214 57% 23%)' }}
    >
      <SD className="w-64 md:w-96 h-9 md:h-11" />
      <SD className="w-48 md:w-72 h-5" />
    </section>

    {/* content */}
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border flex flex-col gap-3">
            <S className="w-12 h-12 rounded-lg" />
            <S className="w-2/3 h-5" />
            <S className="w-full h-3" />
            <S className="w-full h-3" />
            <S className="w-4/5 h-3" />
          </div>
        ))}
      </div>
    </section>
  </>
);

// ─── Footer skeleton ──────────────────────────────────────────────────────────

const FooterSkeleton = () => (
  <footer className="py-12 px-4" style={{ background: 'hsl(214 57% 23%)' }}>
    <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, col) => (
        <div key={col} className="flex flex-col gap-3">
          <SD className="w-24 h-4" />
          {Array.from({ length: 5 }).map((_, row) => (
            <SD key={row} className="h-3" style={{ width: `${60 + (row * 7) % 30}%` }} />
          ))}
        </div>
      ))}
    </div>
  </footer>
);

// ─── Full page loader (Suspense fallback) ─────────────────────────────────────

const PageLoader = () => (
  <div className="flex flex-col min-h-screen">
    <HeaderSkeleton />
    <main className="flex-1">
      <HeroSkeleton />
      <WelcomeSkeleton />
      <MissionSkeleton />
      <MinistriesSkeleton />
      <EventsSkeleton />
    </main>
    <FooterSkeleton />
  </div>
);

export default PageLoader;

// ─── Slim progress bar for route transitions ──────────────────────────────────

export const RouteProgressBar = () => (
  <>
    <style>{`
      @keyframes routeProgress {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(350%); }
      }
    `}</style>
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-secondary/20 overflow-hidden pointer-events-none">
      <div
        className="h-full bg-secondary"
        style={{ width: '40%', animation: 'routeProgress 1s ease-in-out infinite' }}
      />
    </div>
  </>
);
