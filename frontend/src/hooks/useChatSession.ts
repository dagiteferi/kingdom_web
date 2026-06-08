import { useState, useRef, useCallback, useEffect } from 'react';

export type Language = 'en' | 'am';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface FlowState {
  flow: 'idle' | 'testimony' | 'prayer' | 'partnership' | 'qa';
  step: string;
  collected_fields: Record<string, string>;
  missing_fields: string[];
}

interface UseChatSessionOptions {
  language: Language;
}

const SESSION_KEY = 'chatbot_session_id';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
// Convert https://host/api/v1 → wss://host/api/v1
const WS_BASE = API_BASE.replace(/^https?/, (m) => (m === 'https' ? 'wss' : 'ws'));

function uid() {
  return crypto.randomUUID();
}

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = uid();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useChatSession({ language }: UseChatSessionOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [flowState, setFlowState] = useState<FlowState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const sessionId = useRef(getOrCreateSessionId());
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add welcome message on first load
  useEffect(() => {
    const welcome: ChatMessage = {
      id: uid(),
      role: 'assistant',
      content: language === 'am'
        ? 'ሰላም! ወደ ሰማይ ላይ ምድር መንግሥት ቤተሰብ አገልግሎቶች እንኳን ደህና መጡ 🕊️\n\nለምን ልረዳዎ እችላለሁ? እባክዎ ከዚህ ስር ይምረጡ:'
        : 'Hello! Welcome to Heaven on Earth Kingdom Family Ministries 🕊️\n\nHow can I help you today? Please choose below:',
      timestamp: new Date(),
    };
    setMessages([welcome]);
  }, []);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_BASE}/chat/ws/${sessionId.current}`);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => {
      setIsConnected(false);
      // Reconnect after 3s
      reconnectTimer.current = setTimeout(connectWebSocket, 3000);
    };
    ws.onerror = () => ws.close();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.is_final === false) {
        // Streaming token
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.isStreaming) {
            return [
              ...prev.slice(0, -1),
              { ...last, content: last.content + data.message },
            ];
          }
          return [
            ...prev,
            {
              id: uid(),
              role: 'assistant',
              content: data.message,
              timestamp: new Date(),
              isStreaming: true,
            },
          ];
        });
      } else {
        // Final frame
        setIsLoading(false);
        if (data.flow_state) setFlowState(data.flow_state);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.isStreaming) {
            return [
              ...prev.slice(0, -1),
              { ...last, content: data.message || last.content, isStreaming: false },
            ];
          }
          if (data.message) {
            return [
              ...prev,
              {
                id: uid(),
                role: 'assistant',
                content: data.message,
                timestamp: new Date(),
              },
            ];
          }
          return prev;
        });
      }
    };
  }, []);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connectWebSocket]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: uid(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ message: text.trim(), language })
        );
      } else {
        // HTTP fallback
        try {
          const res = await fetch(`${API_BASE}/chat/message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: sessionId.current,
              message: text.trim(),
              language,
            }),
          });
          const data = await res.json();
          if (data.flow_state) setFlowState(data.flow_state);
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: 'assistant',
              content: data.message || '...',
              timestamp: new Date(),
            },
          ]);
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              id: uid(),
              role: 'assistant',
              content: language === 'am'
                ? 'ይቅርታ፣ ችግር ተፈጥሯል። እንደገና ይሞክሩ።'
                : 'Sorry, something went wrong. Please try again.',
              timestamp: new Date(),
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [isLoading, language]
  );

  const clearSession = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionId.current = uid();
    sessionStorage.setItem(SESSION_KEY, sessionId.current);
    setMessages([]);
    setFlowState(null);
    wsRef.current?.close();
  }, []);

  return { messages, isLoading, flowState, isConnected, sendMessage, clearSession };
}
