import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useChatSession, type Language } from '@/hooks/useChatSession';
import ChatMessage from './ChatMessage';
import QuickActions from './QuickActions';

const QUICK_ACTIONS_EN = [
  { label: '🙏 Share Testimony', value: 'I would like to share my testimony' },
  { label: '✝️ Prayer Request', value: 'I want to submit a prayer request' },
  { label: '🤝 Partnership', value: 'I am interested in partnering with the church' },
];

const QUICK_ACTIONS_AM = [
  { label: '🙏 ምስክርነት ማካፈል', value: 'ምስክርነቴን ማካፈል እፈልጋለሁ' },
  { label: '✝️ ጸሎት ጥያቄ', value: 'የጸሎት ጥያቄ ለማቅረብ እፈልጋለሁ' },
  { label: '🤝 አጋርነት', value: 'ከቤተ ክርስቲያን ጋር ለመተባበር ፍላጎት አለኝ' },
];

// Category options for testimony
const CATEGORY_OPTIONS_EN = [
  { label: '💊 Healing', value: 'healing' },
  { label: '✝️ Salvation', value: 'salvation' },
  { label: '🙌 Provision', value: 'provision' },
  { label: '⛓️ Deliverance', value: 'deliverance' },
  { label: '📖 General', value: 'general' },
];

const CATEGORY_OPTIONS_AM = [
  { label: '💊 ፈውስ', value: 'healing' },
  { label: '✝️ ድኅነት', value: 'salvation' },
  { label: '🙌 አቅርቦት', value: 'provision' },
  { label: '⛓️ ነፃነት', value: 'deliverance' },
  { label: '📖 አጠቃላይ', value: 'general' },
];

// Partnership type options
const PARTNERSHIP_TYPE_OPTIONS_EN = [
  { label: '💰 Financial', value: 'financial' },
  { label: '🙋 Volunteer', value: 'volunteer' },
  { label: '📦 Material', value: 'material' },
];

const PARTNERSHIP_TYPE_OPTIONS_AM = [
  { label: '💰 ፋይናንሻል', value: 'financial' },
  { label: '🙋 በጎ ፈቃደኛ', value: 'volunteer' },
  { label: '📦 ቁሳቁስ', value: 'material' },
];

/** Detect what kind of quick-reply buttons to show based on last bot message */
function detectQuickReplies(
  lastBotMessage: string,
  language: Language
): { label: string; value: string }[] | null {
  const lower = lastBotMessage.toLowerCase();

  // Yes/No confirmation prompt
  if (
    lower.includes('reply **yes** to submit') ||
    lower.includes('reply yes to submit') ||
    lower.includes('አዎ** ብለው ሊልኩ') ||
    lower.includes('please reply')
  ) {
    return language === 'am'
      ? [
          { label: '✅ አዎ — አስገባ', value: 'yes' },
          { label: '❌ አይ — ሰርዝ', value: 'no' },
        ]
      : [
          { label: '✅ Yes — Submit', value: 'yes' },
          { label: '❌ No — Cancel', value: 'no' },
        ];
  }

  // Category selection for testimony
  if (
    lower.includes('healing') &&
    lower.includes('salvation') &&
    lower.includes('category')
  ) {
    return language === 'am' ? CATEGORY_OPTIONS_AM : CATEGORY_OPTIONS_EN;
  }

  // Partnership type selection
  if (
    lower.includes('financial') &&
    lower.includes('volunteer') &&
    lower.includes('material') &&
    (lower.includes('partner') || lower.includes('አጋርነት'))
  ) {
    return language === 'am' ? PARTNERSHIP_TYPE_OPTIONS_AM : PARTNERSHIP_TYPE_OPTIONS_EN;
  }

  // Anonymous prayer question
  if (
    lower.includes('anonymous') ||
    lower.includes('ሳይታወቅ')
  ) {
    return language === 'am'
      ? [
          { label: '👤 አዎ — ሳይታወቅ', value: 'yes' },
          { label: '😊 አይ — ስሜን አካትት', value: 'no' },
        ]
      : [
          { label: '👤 Yes — Anonymously', value: 'yes' },
          { label: '😊 No — Include my name', value: 'no' },
        ];
  }

  return null;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const { i18n } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, isLoading, isConnected, sendMessage, clearSession } =
    useChatSession({ language });

  // Sync language with the app's i18n language
  useEffect(() => {
    setLanguage(i18n.language === 'am' ? 'am' : 'en');
  }, [i18n.language]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (value: string) => {
    sendMessage(value);
  };

  const quickActions = language === 'am' ? QUICK_ACTIONS_AM : QUICK_ACTIONS_EN;
  const showQuickActions = messages.length <= 1 && !isLoading;

  // Detect contextual quick-reply buttons from the last bot message
  const lastBotMessage = [...messages].reverse().find((m) => m.role === 'assistant' && !m.isStreaming);
  const contextualReplies =
    !isLoading && lastBotMessage
      ? detectQuickReplies(lastBotMessage.content, language)
      : null;

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-secondary shadow-2xl flex items-center justify-center text-secondary-foreground hover:bg-secondary/90 transition-colors"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={24} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread indicator */}
        {!isOpen && messages.length > 1 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 bg-white rounded-full" />
          </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-8rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-border bg-card"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm">
                  🕊️
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">
                    {language === 'am' ? 'የቤተ ክርስቲያን ረዳት' : 'Church Assistant'}
                  </p>
                  <div className="flex items-center gap-1">
                    {isConnected ? (
                      <>
                        <Wifi size={10} className="text-green-300" />
                        <span className="text-xs text-green-300">
                          {language === 'am' ? 'ተያይዟል' : 'Connected'}
                        </span>
                      </>
                    ) : (
                      <>
                        <WifiOff size={10} className="text-yellow-300" />
                        <span className="text-xs text-yellow-300">
                          {language === 'am' ? 'በማያያዝ ላይ...' : 'Reconnecting...'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Language toggle */}
                <button
                  onClick={() => setLanguage((l) => (l === 'en' ? 'am' : 'en'))}
                  className="text-xs bg-white/20 hover:bg-white/30 rounded-full px-2 py-1 transition-colors font-medium"
                  aria-label="Switch language"
                >
                  {language === 'en' ? 'አማ' : 'EN'}
                </button>

                {/* Clear chat */}
                <button
                  onClick={clearSession}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Clear chat"
                  title={language === 'am' ? 'ውይይቱን ጥፋ' : 'Clear chat'}
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scroll-smooth">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {/* Typing indicator */}
              {isLoading && !messages.some((m) => m.isStreaming) && (
                <div className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs">
                    🕊️
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center h-4">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60"
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Contextual quick-reply buttons (category / yes-no / anonymous) */}
            {contextualReplies && !showQuickActions && (
              <div className="px-3 pb-2 flex flex-col gap-1.5 shrink-0 border-t border-border pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {contextualReplies.map((reply, i) => (
                    <motion.button
                      key={reply.value}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleQuickReply(reply.value)}
                      className="text-sm px-3 py-1.5 rounded-xl border border-secondary/60 bg-secondary/10 hover:bg-secondary/25 text-foreground font-medium transition-all duration-150 whitespace-nowrap"
                    >
                      {reply.label}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Initial Quick Actions */}
            {showQuickActions && (
              <QuickActions
                actions={quickActions}
                onSelect={(value) => sendMessage(value)}
              />
            )}

            {/* Input */}
            <div className="px-3 py-3 border-t border-border bg-background shrink-0">
              <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    language === 'am'
                      ? 'መልዕክት ይጻፉ...'
                      : 'Type a message...'
                  }
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  disabled={isLoading}
                  maxLength={2000}
                  aria-label="Chat message input"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="w-8 h-8 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-secondary/90 transition-colors shrink-0"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
