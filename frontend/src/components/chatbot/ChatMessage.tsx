import { motion } from 'framer-motion';
import { type ChatMessage as ChatMessageType } from '@/hooks/useChatSession';

interface Props {
  message: ChatMessageType;
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
        className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
          isUser
            ? 'bg-secondary text-secondary-foreground rounded-2xl rounded-br-sm'
            : 'bg-muted text-foreground rounded-2xl rounded-bl-sm'
        } ${message.isStreaming ? 'after:content-["▋"] after:animate-pulse after:ml-0.5 after:text-muted-foreground' : ''}`}
      >
        {message.content}
      </div>
    </motion.div>
  );
}
