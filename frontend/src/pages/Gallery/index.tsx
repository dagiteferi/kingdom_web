import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, ZoomIn, Calendar, Expand } from 'lucide-react';
import { getGallery, Gallery as GalleryItemType } from '@/services/api';
import { staleWhileRevalidate } from '@/lib/cache';
import { toast } from 'sonner';

const CACHE_KEY = 'all_gallery_items';
const CACHE_TTL_MINUTES = 30; // bumped from 15 — gallery doesn't change often

const galleryCategories = [
  { id: 'all',      label: 'All' },
  { id: 'worship',  label: 'Worship' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'youth',    label: 'Youth' },
  { id: 'events',   label: 'Events' },
  { id: 'general',  label: 'General' },
];

// ── Preload the first N images so they appear instantly ───────────────────────
function preloadImages(urls: string[], count = 6) {
  urls.slice(0, count).forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// ── Progressive image with IntersectionObserver + shimmer ─────────────────────
const LazyImage = ({
  src,
  alt,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) => {
  const [loaded, setLoaded]       = useState(false);
  const [inView, setInView]       = useState(priority); // priority images load immediately
  const containerRef              = useRef<HTMLDivElement>(null);
  const imgRef                    = useRef<HTMLImageElement>(null);

  // IntersectionObserver — only start loading when near viewport
  useEffect(() => {
    if (priority || inView) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '200px' }, // start loading 200px before visible
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [priority, inView]);

  // Mark as loaded if already cached by browser
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, [inView]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-100 overflow-hidden">
      {/* Shimmer skeleton */}
      {!loaded && (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
            backgroundSize: '400% 100%',
            animation: 'shimmerImg 1.6s ease-in-out infinite',
          }}
        />
      )}

      {inView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          // fetchpriority is not yet in React types but is valid HTML
          {...(priority ? { fetchpriority: 'high' } : { fetchpriority: 'low' })}
          onLoad={() => setLoaded(true)}
          className={`${className ?? ''} transition-opacity duration-400 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ willChange: loaded ? 'auto' : 'opacity' }}
        />
      )}

      <style>{`
        @keyframes shimmerImg {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
};

// ── Gallery Card ──────────────────────────────────────────────────────────────
const GalleryCard = ({
  item,
  index,
  onClick,
}: {
  item: GalleryItemType;
  index: number;
  onClick: () => void;
}) => {
  const { i18n } = useTranslation();
  const title = i18n.language === 'am' && item.title_am ? item.title_am : item.title;
  const isPriority = index < 6; // first 6 cards load eagerly

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.05 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-500"
      onClick={onClick}
      style={{ aspectRatio: index % 5 === 0 ? '4/5' : index % 3 === 0 ? '16/10' : '1/1' }}
    >
      {item.media_type === 'video' ? (
        <div className="w-full h-full bg-gradient-to-br from-navy to-primary flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      ) : (
        <LazyImage
          src={item.src_url}
          alt={item.alt_text || title}
          priority={isPriority}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Expand icon */}
      <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 border border-white/30">
        {item.media_type === 'video' ? <Play className="w-4 h-4 text-white" /> : <Expand className="w-4 h-4 text-white" />}
      </div>

      {/* Bottom caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">{title}</h3>
        {item.event_date && (
          <div className="flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3 text-secondary" />
            <p className="text-xs text-white/70">
              {new Date(item.event_date).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        )}
      </div>

      {/* Category badge */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-secondary text-white">
          {item.category}
        </span>
      </div>
    </motion.div>
  );
};

// ── Lightbox ──────────────────────────────────────────────────────────────────
const Lightbox = ({
  items,
  currentIndex,
  onClose,
  onNavigate,
}: {
  items: GalleryItemType[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) => {
  const { i18n } = useTranslation();
  const item  = items[currentIndex];
  const title = i18n.language === 'am' && item.title_am ? item.title_am : item.title;

  const prev = useCallback(() => onNavigate(currentIndex > 0 ? currentIndex - 1 : items.length - 1), [currentIndex, items.length, onNavigate]);
  const next = useCallback(() => onNavigate(currentIndex < items.length - 1 ? currentIndex + 1 : 0), [currentIndex, items.length, onNavigate]);

  // Preload adjacent images
  useEffect(() => {
    const adjacent = [
      items[currentIndex + 1],
      items[currentIndex - 1],
    ].filter(Boolean).filter(i => i.media_type === 'image');
    adjacent.forEach(i => { const img = new Image(); img.src = i.src_url; });
  }, [currentIndex, items]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

        <button onClick={onClose} className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors border border-white/20">
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-white/10 border border-white/20">
          <span className="text-white/80 text-sm font-medium">{currentIndex + 1} / {items.length}</span>
        </div>

        <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all border border-white/20 hover:scale-110">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all border border-white/20 hover:scale-110">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative z-10 max-w-5xl w-full mx-16 flex flex-col items-center gap-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {item.media_type === 'video' ? (
              <div className="aspect-video">
                <iframe src={item.src_url} title={title} className="w-full h-full" allowFullScreen />
              </div>
            ) : (
              <img
                src={item.src_url}
                alt={item.alt_text || title}
                className="w-full max-h-[75vh] object-contain bg-black"
                loading="eager"
              />
            )}
          </div>

          <div className="text-center px-4">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            {item.event_date && (
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                <p className="text-sm text-white/60">
                  {new Date(item.event_date).toLocaleDateString(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 overflow-x-auto pb-1 max-w-full px-2">
            {items.map((thumb, i) => (
              <button
                key={thumb.id}
                onClick={() => onNavigate(i)}
                className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  i === currentIndex ? 'border-secondary scale-110 shadow-lg' : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                }`}
              >
                {thumb.media_type === 'video' ? (
                  <div className="w-full h-full bg-navy flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <img src={thumb.src_url} alt={thumb.title} className="w-full h-full object-cover" loading="lazy" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Skeleton grid shown while loading ─────────────────────────────────────────
const GallerySkeleton = () => (
  <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="break-inside-avoid mb-4 rounded-2xl overflow-hidden"
        style={{
          aspectRatio: i % 5 === 0 ? '4/5' : i % 3 === 0 ? '16/10' : '1/1',
          background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
          backgroundSize: '400% 100%',
          animation: `shimmerImg 1.6s ease-in-out ${i * 0.08}s infinite`,
        }}
      />
    ))}
  </div>
);

// ── Main Gallery Page ─────────────────────────────────────────────────────────
const Gallery = () => {
  const { t } = useTranslation();
  const [galleryItems, setGalleryItems]   = useState<GalleryItemType[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      // staleWhileRevalidate: paint cached data instantly, refresh in background
      const cached = await staleWhileRevalidate<GalleryItemType[]>(
        CACHE_KEY,
        CACHE_TTL_MINUTES,
        async () => {
          // Backend max page_size is 100 — fetch both pages in parallel
          const [page1, page2] = await Promise.all([
            getGallery({ page_size: 100, page: 1 }),
            getGallery({ page_size: 100, page: 2 }),
          ]);
          return [...page1, ...page2];
        },
        (fresh) => {
          if (!cancelled) {
            setGalleryItems(fresh);
            preloadImages(fresh.filter(i => i.media_type === 'image').map(i => i.src_url));
          }
        },
      );

      if (!cancelled) {
        if (cached) {
          setGalleryItems(cached);
          preloadImages(cached.filter(i => i.media_type === 'image').map(i => i.src_url));
          setIsLoading(false);
        } else {
          try {
            const [page1, page2] = await Promise.all([
              getGallery({ page_size: 100, page: 1 }),
              getGallery({ page_size: 100, page: 2 }),
            ]);
            const fresh = [...page1, ...page2];
            if (!cancelled) {
              setGalleryItems(fresh);
              preloadImages(fresh.filter(i => i.media_type === 'image').map(i => i.src_url));
            }
          } catch {
            if (!cancelled) toast.error('Failed to load gallery');
          } finally {
            if (!cancelled) setIsLoading(false);
          }
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  // Turn off loading once we have data
  useEffect(() => {
    if (galleryItems.length > 0) setIsLoading(false);
  }, [galleryItems]);

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">{t('gallery.title')}</h1>
            <p className="text-lg text-primary-foreground/80">{t('gallery.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {galleryCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                    : 'bg-card border border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                }`}
              >
                {t(`gallery.categories.${cat.id}`, cat.label)}
              </button>
            ))}
          </div>

          {/* Loading skeleton */}
          {isLoading && <GallerySkeleton />}

          {/* Gallery grid */}
          {!isLoading && filteredItems.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
              >
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="break-inside-avoid mb-4">
                    <GalleryCard item={item} index={index} onClick={() => setLightboxIndex(index)} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Empty state */}
          {!isLoading && filteredItems.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 text-muted-foreground">
              <ZoomIn className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No items in this category yet.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filteredItems}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
};

export default Gallery;
