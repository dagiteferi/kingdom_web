import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, Clock, Users, Calendar } from 'lucide-react';
import { prayerTimes, prayerRequests, hero, bibleVerses } from './data';

const Prayer = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    request: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Prayer request submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', request: '' });
  };

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{hero.title}</h1>
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
                  className="relative py-8 px-8 md:px-12 rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-500"
                  style={{
                    background: 'linear-gradient(135deg, hsl(43 60% 52% / 0.08) 0%, hsl(43 60% 52% / 0.02) 100%)',
                    border: '1px solid hsl(43 60% 52% / 0.25)',
                    borderLeft: '6px solid hsl(43 60% 52% / 0.8)',
                  }}
                >
                  <span
                    className="absolute top-2 left-4 pointer-events-none select-none"
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      color: 'hsl(43 60% 52% / 0.22)',
                      fontSize: '6rem',
                      lineHeight: 1,
                    }}
                  >
                    &#8220;
                  </span>
                  
                  <p
                    className="relative italic text-xl md:text-2xl leading-relaxed pl-4"
                    style={{ fontFamily: "'EB Garamond', serif", color: 'hsl(214 57% 23%)' }}
                  >
                    {verseText}
                  </p>

                  {verseRef && (
                    <p
                      className="text-right mt-6 not-italic font-bold text-sm uppercase tracking-[0.2em]"
                      style={{
                        color: 'hsl(43 60% 42%)',
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      — {verseRef}
                    </p>
                  )}

                  <span
                    className="absolute bottom-[-10px] right-6 pointer-events-none select-none"
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      color: 'hsl(43 60% 52% / 0.22)',
                      fontSize: '6rem',
                      lineHeight: 1,
                    }}
                  >
                    &#8221;
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prayer Times */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Prayer Times</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {prayerTimes.map((time, index) => (
                <motion.div
                  key={time.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card p-6 rounded-lg shadow-sm border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <time.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{time.name}</h3>
                      <p className="text-muted-foreground">{time.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Prayer Request Form */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-xl shadow-sm border border-border"
            >
              <h2 className="text-3xl font-bold mb-6">Submit a Prayer Request</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="request" className="block text-sm font-medium mb-2">
                    Your Prayer Request
                  </label>
                  <textarea
                    id="request"
                    rows={4}
                    value={formData.request}
                    onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Submit Prayer Request
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Prayer;
