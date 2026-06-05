import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, ChevronLeft, ChevronRight, ZoomIn, Calendar, Expand } from 'lucide-react';
import { getGallery, Gallery as GalleryItemType } from '@/services/api';
import { getCache, setCache } from '@/lib/cache';
import { toast } from 'sonner';

const CACHE_KEY = 'all_gallery_items';
const CACHE_TTL_MINUTES = 15;

const galleryCategories = [
  { id: 'all', label: 'All' },
  { id: 'worship', label: 'Worship' },
  { id: 'outreach', label: 'Outreach' },
  { id: 'youth', label: 'Youth' },
  { id: 'events', label: 'Events' },
  { id: 'general', label: 'General' },
];

// ── Lazy Image with blur-up placeholder ──────────────────────────────────────
const LazyImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton shimmer */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: (index % 8) * 0.07 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-slate-100 shadow-md hover:shadow-2xl transition-shadow duration-500"
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
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

      {/* Zoom icon */}
      <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 border border-white/30">
        {item.media_type === 'video' ? (
          <Play className="w-4 h-4 text-white" />
        ) : (
          <Expand className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
        <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">{title}</h3>
        {item.event_date && (
          <div className="flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3 text-secondary" />
            <p className="text-xs text-white/70">
              {new Date(item.event_date).toLocaleDateString(i18n.language, {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
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
  const item = items[currentIndex];
  const title = i18n.language === 'am' && item.title_am ? item.title_am : item.title;

  const prev = useCallback(() => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : items.length - 1);
  }, [currentIndex, items.length, onNavigate]);

  const next = useCallback(() => {
    onNavigate(currentIndex < items.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, items.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, prev, next]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Blurred backdrop */}
        <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors border border-white/20 backdrop-blur-sm"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Counter */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="text-white/80 text-sm font-medium">{currentIndex + 1} / {items.length}</span>
        </div>

        {/* Prev button */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all border border-white/20 backdrop-blur-sm hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Next button */}
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center transition-all border border-white/20 backdrop-blur-sm hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Main content */}
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 max-w-5xl w-full mx-16 flex flex-col items-center gap-5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image / Video */}
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {item.media_type === 'video' ? (
              <div className="aspect-video">
                <iframe
                  src={item.src_url}
                  title={title}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={item.src_url}
                alt={item.alt_text || title}
                className="w-full max-h-[75vh] object-contain bg-black"
              />
            )}
          </div>

          {/* Caption */}
          <div className="text-center px-4">
            <h3 className="text-white font-semibold text-lg">{title}</h3>
            {item.event_date && (
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                <p className="text-sm text-white/60">
                  {new Date(item.event_date).toLocaleDateString(i18n.language, {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
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
                  <img
                    src={thumb.src_url}
                    alt={thumb.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Gallery Page ─────────────────────────────────────────────────────────
const Gallery = () => {
  const { t } = useTranslation();
  const [galleryItems, setGalleryItems] = useState<GalleryItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGalleryItems = async () => {
      const cached = getCache<GalleryItemType[]>(CACHE_KEY);
      if (cached) { setGalleryItems(cached); setIsLoading(false); }
      try {
        const fresh = await getGallery({ page_size: 100 });
        setGalleryItems(fresh);
        setCache(CACHE_KEY, fresh, CACHE_TTL_MINUTES);
      } catch (error) {
        console.error('Failed to fetch gallery items:', error);
        if (!cached) toast.error(t('errors.fetchGalleryItems', 'Failed to load gallery'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchGalleryItems();
  }, [t]);

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-20 md:py-28 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3 blur-2xl" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-2xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">{t('gallery.title')}</h1>
            <p className="text-lg text-primary-foreground/80">{t('gallery.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
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
          </motion.div>

          {/* Skeleton loading */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse"
                  style={{ aspectRatio: '1/1' }}
                />
              ))}
            </div>
          )}

          {/* Gallery Grid */}
          {!isLoading && filteredItems.length > 0 && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"
              >
                {filteredItems.map((item, index) => (
                  <div key={item.id} className="break-inside-avoid mb-4">
                    <GalleryCard
                      item={item}
                      index={index}
                      onClick={() => openLightbox(index)}
                    />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {/* Empty state */}
          {!isLoading && filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24 text-muted-foreground"
            >
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
          onClose={closeLightbox}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
};

export default Gallery;
