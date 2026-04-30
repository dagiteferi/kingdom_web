import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon, Sparkles, Quote, ChevronDown, ChevronUp } from 'lucide-react';

interface MinistryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  delay?: number;
}

const MinistryCard = ({ title, description, icon: Icon, delay = 0 }: MinistryCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to detect and style bible verses
  const renderDescription = (text: string) => {
    const parts = text.split(/("[^"]*")/);
    return parts.map((part, index) => {
      if (part.startsWith('"') && part.endsWith('"')) {
        return (
          <div key={index} className="bible-verse text-base my-4 p-4">
            <Quote className="w-5 h-5 text-secondary/30 mb-1" />
            {part}
          </div>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`group relative bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-border ${isExpanded ? 'ring-2 ring-secondary/50 border-secondary/50' : 'hover:border-secondary/30'} flex flex-col items-start overflow-hidden h-fit`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-secondary/5 rounded-full group-hover:scale-[3] transition-transform duration-700 pointer-events-none" />
      
      {/* Icon & Title Row */}
      <div className="flex items-center gap-5 mb-6 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-secondary rotate-[10deg] shadow-gold-glow' : 'bg-secondary/10 group-hover:bg-secondary group-hover:rotate-12'}`}>
          <Icon className={`w-7 h-7 transition-colors duration-500 ${isExpanded ? 'text-navy' : 'text-secondary group-hover:text-navy'}`} />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-primary group-hover:text-secondary transition-colors duration-300">
            {title}
          </h3>
          <div className={`h-1 bg-secondary/30 rounded-full transition-all duration-500 ${isExpanded ? 'w-full bg-secondary' : 'w-10 group-hover:w-16'}`} />
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 w-full">
        <motion.div
          animate={{ height: isExpanded ? 'auto' : '4.5rem' }}
          className="overflow-hidden"
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="text-muted-foreground text-base leading-relaxed">
            {isExpanded ? renderDescription(description) : description}
          </div>
        </motion.div>
      </div>

      {/* Expand/Collapse Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`mt-6 flex items-center justify-between w-full py-3 px-5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 ${isExpanded ? 'bg-secondary text-navy' : 'bg-secondary/5 text-secondary hover:bg-secondary/20'}`}
      >
        <span>{isExpanded ? 'Read Less' : 'Read More'}</span>
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {/* Join Link (Only visible when expanded) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 w-full pt-6 border-t border-border"
          >
            <a 
              href="/partnership" 
              className="flex items-center justify-center gap-2 text-secondary font-bold hover:gap-4 transition-all"
            >
              <span>Join this Ministry</span>
              <Sparkles size={16} />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MinistryCard;



