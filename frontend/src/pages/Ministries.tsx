import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, BookOpen, Calendar, HandHeart, Music, Baby, Globe, LucideIcon, Church, ArrowRight, Sparkles, ChevronDown, Quote } from 'lucide-react';
import { getMinistries, Ministry } from '@/services/api';
import { toast } from 'sonner';
import { getCache, setCache } from '@/lib/cache';

const CACHE_KEY = 'all_ministries';
const CACHE_TTL_MINUTES = 15; 

const Ministries = () => {
  const { t, i18n } = useTranslation();
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const iconMap: { [key: string]: LucideIcon } = {
    Heart,
    HandHeart,
    BookOpen,
    Users,
    Calendar,
    Music,
    Baby,
    Globe,
    Church,
    Default: Heart,
  };

  const renderDescription = (text: string) => {
    if (!text) return null;
    const parts = text.split(/("[^"]*")/);
    return parts.map((part, index) => {
      if (part.startsWith('"') && part.endsWith('"')) {
        return (
          <div key={index} className="bible-verse">
            <Quote className="w-6 h-6 text-secondary/40 mb-3" />
            {part}
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  useEffect(() => {
    const fetchMinistries = async () => {
      const cachedMinistries = getCache<Ministry[]>(CACHE_KEY);
      if (cachedMinistries) {
        setMinistries(cachedMinistries);
      }

      try {
        const allMinistries = await getMinistries({ page_size: 100 });
        setMinistries(allMinistries);
        setCache(CACHE_KEY, allMinistries, CACHE_TTL_MINUTES);
      } catch (error) {
        console.error("Failed to fetch ministries:", error);
        if (!cachedMinistries) {
          toast.error(t('errors.fetchMinistries'));
        }
      }
    };

    fetchMinistries();
  }, [t]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Premium Hero Section */}
      <section className="relative py-24 md:py-32 lg:py-40 overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-secondary/10 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary border border-secondary/30 mb-8"
            >
              <Sparkles size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">{t('welcome.ourCalling')}</span>
            </motion.div>
            
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              {t('ministries.title')}
            </h1>
            <p className="text-primary-foreground/70 text-xl md:text-2xl font-light italic max-w-2xl mx-auto mb-10">
              "{t('ministries.subtitle')}"
            </p>
            
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Ministries Interactive Grid */}
      <section className="section-container -mt-16 relative z-20 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {ministries.map((ministry, index) => {
            const MinistryIcon = iconMap[ministry.icon_name] || iconMap.Default;
            const isExpanded = expandedId === ministry.id;
            const title = i18n.language === 'am' && ministry.title_am ? ministry.title_am : ministry.title;
            const description = i18n.language === 'am' && ministry.description_am ? ministry.description_am : ministry.description;
            
            // Handle both List and Object types for activities safely
            const activities = Array.isArray(ministry.activities) 
              ? ministry.activities 
              : (ministry.activities && typeof ministry.activities === 'object' && 'teams' in ministry.activities)
                ? (ministry.activities as any).teams 
                : [];

            return (
              <motion.div
                key={ministry.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`group relative bg-card rounded-3xl shadow-xl border border-border overflow-hidden flex flex-col transition-all duration-500 ${isExpanded ? 'ring-2 ring-secondary shadow-2xl scale-[1.02] z-10' : 'hover:-translate-y-2'}`}
              >
                <div className="p-8 flex-grow">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${isExpanded ? 'bg-secondary rotate-[360deg]' : 'bg-secondary/10 group-hover:bg-secondary group-hover:rotate-12'}`}>
                    <MinistryIcon className={`w-8 h-8 transition-colors duration-500 ${isExpanded ? 'text-navy' : 'text-secondary group-hover:text-navy'}`} />
                  </div>
                  
                  <h3 className="font-heading text-2xl font-bold text-navy mb-4 group-hover:text-secondary transition-colors">
                    {title}
                  </h3>
                  
                  <div className={`text-muted-foreground text-lg leading-relaxed mb-6 transition-all duration-500 ${isExpanded ? '' : 'line-clamp-3'}`}>
                    {isExpanded ? renderDescription(description) : description}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 border-t border-border mt-6">
                          {ministry.leader_name && (
                            <div className="mb-6 p-4 bg-secondary/5 rounded-2xl border border-secondary/20">
                              <h4 className="text-navy font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Users size={16} className="text-secondary" />
                                Ministry Leader
                              </h4>
                              <p className="text-navy text-lg font-medium">{ministry.leader_name}</p>
                              {(ministry.leader_email || ministry.leader_phone) && (
                                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                  {ministry.leader_email && <span>{ministry.leader_email}</span>}
                                  {ministry.leader_phone && <span>{ministry.leader_phone}</span>}
                                </div>
                              )}
                            </div>
                          )}

                          {activities.length > 0 && (
                            <>
                              <h4 className="text-navy font-bold mb-4 flex items-center gap-2">
                                <Sparkles size={14} className="text-secondary" />
                                {t('testimonial.categories.general')}
                              </h4>
                              <ul className="space-y-4">
                                {activities.map((activity: string, i: number) => (
                                  <motion.li 
                                    key={i}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 text-base text-muted-foreground"
                                  >
                                    <div className="w-2 h-2 bg-secondary rounded-full flex-shrink-0 mt-2.5" />
                                    <span>{activity}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    onClick={() => toggleExpand(ministry.id)}
                    className={`mt-8 flex items-center justify-between w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 ${isExpanded ? 'bg-secondary text-navy shadow-gold-glow' : 'bg-secondary/10 text-secondary hover:bg-secondary/20'}`}
                  >
                    <span>{isExpanded ? t('common.readLess') : t('common.readMore')}</span>
                    <ChevronDown className={`transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Better Get Involved CTA */}
      <section className="bg-navy py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -ml-32 -mt-32" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-48 -mb-48" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-md rounded-[3rem] p-10 md:p-20 border border-white/10 shadow-2xl"
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              {t('ministriesPage.getInvolved.title')}
            </h2>
            <p className="text-primary-foreground/70 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('ministriesPage.getInvolved.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a href="/partnership" className="btn-gold py-5 px-12 rounded-full text-lg shadow-gold-glow">
                {t('ministriesPage.getInvolved.volunteerCta')}
              </a>
              <a href="/contact" className="btn-navy bg-white/10 border border-white/20 hover:bg-white/20 text-white py-5 px-12 rounded-full text-lg">
                {t('ministriesPage.getInvolved.contactCta')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Ministries;

