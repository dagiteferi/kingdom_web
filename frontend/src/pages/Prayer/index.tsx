import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, Phone, MessageCircle, Mail, Clock, Heart, ShieldCheck } from 'lucide-react';
import { hero, bibleVerses } from './data';
import { toast } from 'sonner';

const Prayer = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: '',
    isAnonymous: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success(t('prayer.successMessage', 'Your prayer request has been submitted. Our team will be praying for you.'));
      setFormData({ name: '', email: '', request: '', isAnonymous: false });
      setIsSubmitting(false);
    }, 1000);
  };

  // Safe fetch for array translations
  const scheduleItems = t('prayer.scheduleItems', { returnObjects: true }) as Array<{ day: string; time: string; type: string }>;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">{hero.title}</h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              {hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bible Verses Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto mb-12 text-center"
          >
            <h2 className="text-3xl font-heading font-bold mb-4 text-primary">{bibleVerses.title}</h2>
            <p className="text-muted-foreground text-lg">{bibleVerses.subtitle}</p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {bibleVerses.verses.map((item, index) => {
              const verseMatch = item.verse.match(/^['\u2018\u2019\u201c\u201d]?([\s\S]+?)['\u2018\u2019\u201c\u201d]?\s*[-\u2013\u2014]\s*(.+)$/);
              const verseText = verseMatch ? verseMatch[1].trim() : item.verse;
              const verseRef  = verseMatch ? verseMatch[2].trim() : '';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bible-verse hover:shadow-md transition-shadow duration-300">
                    <span>{verseText}</span>
                    {verseRef && (
                      <span className="bible-verse-ref">— {verseRef}</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area (Form + Info) */}
      <section className="py-20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary/5 -skew-x-12 translate-x-20 -z-10" />
        
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12 lg:gap-16">
            
            {/* Left Column: Prayer Request Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/90 px-8 py-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold font-heading text-white m-0">
                    {t('prayer.formTitle', 'Submit Your Prayer Request')}
                  </h2>
                </div>

                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground">
                          {t('prayer.namePlaceholder', 'Your Name (Optional)')}
                        </label>
                        <input
                          type="text"
                          id="name"
                          disabled={formData.isAnonymous}
                          value={formData.isAnonymous ? t('prayer.anonymous', 'Anonymous') : formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="form-input disabled:bg-muted disabled:text-muted-foreground"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-foreground">
                          {t('prayer.emailPlaceholder', 'Your Email (Optional)')}
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="form-input"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="anonymous"
                        className="w-4 h-4 text-secondary rounded border-border focus:ring-secondary"
                        checked={formData.isAnonymous}
                        onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked, name: '' })}
                      />
                      <label htmlFor="anonymous" className="text-sm text-muted-foreground cursor-pointer select-none">
                        Keep my request {t('prayer.anonymous', 'Anonymous')}
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="request" className="text-sm font-medium text-foreground">
                        {t('prayer.requestLabel', 'Prayer Request')} *
                      </label>
                      <textarea
                        id="request"
                        rows={6}
                        value={formData.request}
                        onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                        className="form-input resize-y"
                        placeholder={t('prayer.requestPlaceholder', 'Enter your prayer request here...')}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/90 hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                      {isSubmitting ? 'Submitting...' : t('prayer.submit', 'Submit Request')}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Info & Commitment */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Other ways to submit */}
              <div className="bg-card rounded-2xl shadow-card border border-border p-6 hover:border-secondary/30 transition-colors">
                <h3 className="font-heading font-bold text-xl text-primary mb-6">
                  {t('prayer.otherWays', 'Other Ways to Submit')}
                </h3>
                <div className="space-y-4">
                  <a href="tel:+251905543858" className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary transition-colors">
                      <Phone className="w-5 h-5 text-secondary group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('prayer.call', 'Call us at')}</p>
                      <p className="font-semibold text-foreground">+251 90 554 3858</p>
                    </div>
                  </a>
                  
                  <a href="https://t.me/kingdomfamilyyy" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-[#0088cc]/10 flex items-center justify-center group-hover:bg-[#0088cc] transition-colors">
                      <MessageCircle className="w-5 h-5 text-[#0088cc] group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('prayer.telegram', 'Message us on Telegram')}</p>
                      <p className="font-semibold text-foreground">@kingdomfamilyyy</p>
                    </div>
                  </a>

                  <a href="mailto:heavenonearthkingdomfamily@gmail.com" className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                      <Mail className="w-5 h-5 text-primary group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{t('prayer.emailContact', 'Email')}</p>
                      <p className="font-semibold text-foreground text-sm break-all">heavenonearthkingdomfamily@gmail.com</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Join Prayer Meetings */}
              <div className="bg-gradient-to-br from-navy to-primary rounded-2xl shadow-xl p-8 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                <h3 className="font-heading font-bold text-xl text-white mb-6 relative z-10 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" />
                  {t('prayer.schedule', 'Join Our Prayer Meetings')}
                </h3>
                
                <div className="space-y-4 relative z-10">
                  {Array.isArray(scheduleItems) && scheduleItems.map((item, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded text-sm">
                          {item.day}
                        </span>
                        <span className="text-secondary font-medium text-sm">{item.time}</span>
                      </div>
                      <p className="text-white/90 font-medium">{item.type}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Our Commitment */}
              <div className="bg-card rounded-2xl shadow-card border border-border p-6 border-t-4 border-t-secondary">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-secondary" />
                  <h3 className="font-heading font-bold text-xl text-primary">
                    {t('prayer.commitment.title', 'Our Prayer Commitment')}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {t('prayer.commitment.body', 'Every prayer request submitted is prayed over by our dedicated prayer team. We believe in the power of intercessory prayer and are committed to standing with you in faith. Your requests are kept confidential and handled with love and care.')}
                </p>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Prayer;
