import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Send, Loader2, Clock, MessageCircle } from 'lucide-react';

const ContactForm = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate brief loading before showing coming soon
    await new Promise(resolve => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-xl p-8 shadow-card border border-border text-center"
      >
        {/* Coming Soon Icon */}
        <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-secondary" />
        </div>

        <h3 className="font-heading text-2xl font-bold text-primary mb-2">
          Coming Soon
        </h3>
        <p className="text-muted-foreground mb-6">
          Direct messaging is not available yet. In the meantime, reach us instantly on Telegram — we'd love to hear from you!
        </p>

        <a
          href="https://t.me/kingdomfamilyyy"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 btn-gold px-6 py-3 rounded-lg font-medium transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          Message us on Telegram
        </a>

        <p className="text-xs text-muted-foreground mt-4">
          @kingdomfamilyyy
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="bg-card rounded-xl p-6 shadow-card border border-border"
    >
      <h3 className="font-heading text-xl font-bold text-primary mb-6">
        {t('contactPage.formTitle')}
      </h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="form-label">
              {t('common.name')}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('common.namePlaceholder')}
              className="form-input"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="form-label">
              {t('common.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('common.emailPlaceholder')}
              className="form-input"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className="form-label">
            {t('contactPage.subjectPlaceholder')}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder={t('contactPage.subjectPlaceholder')}
            className="form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="form-label">
            {t('contactPage.messagePlaceholder')}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={t('contactPage.messagePlaceholder')}
            rows={5}
            className="form-input resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-gold flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>{t('common.loading')}</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>{t('common.submit')}</span>
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default ContactForm;
