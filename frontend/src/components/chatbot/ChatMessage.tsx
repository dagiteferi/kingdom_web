import { motion } from 'framer-motion';
import { type ChatMessage as ChatMessageType } from '@/hooks/useChatSession';

interface Props {
  message: ChatMessageType;
}

/** Render a subset of markdown: **bold**, bullet lines, newlines */
function renderMarkdown(text: string) {
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    // Render inline **bold**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });

    // Bullet points: lines starting with • or -
    const isBullet = line.trimStart().startsWith('•') || line.trimStart().startsWith('- ');

    return (
      <span key={lineIdx} className={isBullet ? 'flex gap-1' : 'block'}>
        {rendered}
        {lineIdx < lines.length - 1 && !isBullet && <br />}
      </span>
    );
  });
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 text-xs">
          🕊️
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed break-words ${
          isUser
            ? 'bg-secondary text-secondary-foreground rounded-2xl rounded-br-sm'
            : 'bg-muted text-foreground rounded-2xl rounded-bl-sm'
        } ${message.isStreaming ? 'after:content-["▋"] after:animate-pulse after:ml-0.5 after:text-muted-foreground' : ''}`}
      >
        {renderMarkdown(message.content)}
      </div>
    </motion.div>
  );
}
