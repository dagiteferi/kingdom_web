'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import TestimonialForm from './TestimonialForm';
import { useTranslation } from 'react-i18next';
import { getTestimonials, Testimonial } from '@/services/api';
import { getCache, setCache } from '@/lib/cache';
import { Loader2 } from 'lucide-react';

const CACHE_KEY = 'published_testimonials';
const CACHE_TTL_MINUTES = 5;

const categoryEmojis: Record<string, string> = {
  healing: '🙌',
  salvation: '✝️',
  provision: '💝',
  deliverance: '🕊️',
  general: '✨',
  Prayer: '🙏', // Added from backend schema
  General: '✨', // Added from backend schema
};

const categoryColors: Record<string, string> = {
  healing: 'bg-blue-100 text-blue-800',
  salvation: 'bg-green-100 text-green-800',
  provision: 'bg-purple-100 text-purple-800',
  deliverance: 'bg-red-100 text-red-800',
  general: 'bg-gray-100 text-gray-800',
  Prayer: 'bg-yellow-100 text-yellow-800',
  General: 'bg-gray-100 text-gray-800',
};

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const fetchPublishedTestimonials = async () => {
      const cached = getCache<Testimonial[]>(CACHE_KEY);
      if (cached) {
        setTestimonials(cached);
        setIsLoading(false);
      }

      try {
        const fresh = await getTestimonials({ published_only: true }); // Explicitly request published testimonials
        console.log("Fetched testimonials for home page:", fresh); // Add this line for debugging
        setTestimonials(fresh);
        setCache(CACHE_KEY, fresh, CACHE_TTL_MINUTES);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        if (!cached) {
          toast.error(t('errors.fetchTestimonials'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishedTestimonials();
  }, [t]);

  if (isLoading) {
    return (
      <section className="py-20 md:py-28 bg-muted/30" id="testimonials">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#fdf8ee] p-10 rounded-2xl shadow-md h-64 border border-[#d4a947]/20 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="h-4 bg-[#c9973a]/20 rounded w-full"></div>
                    <div className="h-4 bg-[#c9973a]/20 rounded w-5/6"></div>
                    <div className="h-4 bg-[#c9973a]/20 rounded w-2/3"></div>
                  </div>
                  <div className="h-4 bg-[#c9973a]/30 rounded w-1/3 ml-auto mt-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-muted/30" id="testimonials">
      <div className="container mx-auto px-4 text-center">
        {/* Translation keys for these can be found in i18n/en.json and i18n/am.json */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-10 bg-secondary" />
          <span className="text-secondary font-bold tracking-widest uppercase text-xs">Testimonies</span>
          <div className="h-px w-10 bg-secondary" />
        </div>
        <h2 className="section-title text-navy">{t('testimonial.sectionTitle')}</h2>
        <p className="section-subtitle mb-16">
          {t('testimonial.sectionSubtitle')}
        </p>

        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-left bg-[#fdf8ee] rounded-2xl p-10 shadow-md hover:shadow-2xl transition-all duration-400 border border-[#d4a947]/20 flex flex-col h-full overflow-hidden"
                style={{ borderLeft: '4px solid #c9973a' }}
              >
                {/* Top-left opening quote mark */}
                <span
                  className="absolute top-4 left-5 text-[5rem] leading-none font-serif text-[#c9973a]/25 select-none pointer-events-none"
                  style={{ fontFamily: "'EB Garamond', serif", lineHeight: 1 }}
                >
                  &quot;
                </span>

                {/* Testimonial text */}
                <p
                  className="relative z-10 text-xl leading-loose italic text-[#1e3a5f] mt-6 flex-grow"
                  style={{ fontFamily: "'EB Garamond', serif" }}
                >
                  &quot;{i18n.language === 'am' && testimonial.content ? testimonial.content : testimonial.content}&quot;
                </p>

                {/* Reference + Emoji row */}
                <div className="flex items-end justify-between mt-8 relative z-10">
                  <div className="flex flex-col">
                    <p
                      className="text-sm font-bold uppercase tracking-widest text-[#c9973a]"
                      style={{ fontFamily: "'EB Garamond', serif", letterSpacing: '0.12em' }}
                    >
                      — {testimonial.name}
                    </p>
                    {testimonial.location && (
                      <p className="text-xs font-serif text-[#1e3a5f]/60 mt-2">{testimonial.location}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-3xl mb-1 opacity-80">{categoryEmojis[testimonial.category] || '✨'}</span>
                  </div>
                </div>

                {/* Bottom-right closing quote mark */}
                <span
                  className="absolute bottom-4 right-5 text-[4rem] leading-none font-serif text-[#c9973a]/25 select-none pointer-events-none -mb-4"
                  style={{ fontFamily: "'EB Garamond', serif", lineHeight: 1 }}
                >
                  &quot;
                </span>

                {/* Subtle bottom gold accent bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#c9973a]/60 via-[#d4a947]/30 to-transparent rounded-b-2xl" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-12">
            <p className="text-muted-foreground">{t('testimonial.noTestimonials')}</p>
          </div>
        )}

        <div className="mt-12">
          {/* The text for 'testimonial.ctaText' can be modified in your i18n/en.json and i18n/am.json files */}
          <p className="text-xl font-semibold text-primary mb-4">
            {t('testimonial.ctaText')}
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button  className="mt-6">
                {t('testimonial.shareYourStory')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t('testimonial.shareYourStory')}</DialogTitle>
              </DialogHeader>
              <TestimonialForm onSuccess={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
