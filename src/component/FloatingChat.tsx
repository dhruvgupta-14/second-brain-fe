import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, ExternalLink } from "lucide-react";
import axios from "axios";
interface FloatingChatProps {
  setContent: React.Dispatch<React.SetStateAction<string[]>>;
}
const FloatingChat = (props: FloatingChatProps) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    //@ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  // Type definitions
  interface ParsedEntry {
    title: string;
    link: string | null;
    tags: string[];
  }

  interface Message {
    id: number;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
  }

  // Enhanced parsing function for AI responses
  const parseAIResponse = (aiResponse: string): ParsedEntry[] => {
    try {
      const entries: ParsedEntry[] = [];
      const regex = /\*\*(.*?)\*\*\n(.*?)\nTags:\s*(.*?)(?:\n\n|\n$|$)/g;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(aiResponse)) !== null) {
        const title = match[1].trim();
        const link = match[2].trim();
        const tags = match[3].trim();

        entries.push({
          title,
          link: link === '(no link)' ? null : link,
          tags: tags === '(none)' ? [] : tags.split(',').map(tag => tag.trim())
        });
      }

      return entries;
    } catch (error) {
      console.error('Parsing error:', error);
      return [];
    }
  };

  // Component to render parsed entries
  const ParsedEntries = ({ entries }: { entries: ParsedEntry[] }) => {
    if (!entries || entries.length === 0) return null;

    return (
      <div className="space-y-3 mt-2">
        {entries.map((entry, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
            <h4 className="font-semibold text-gray-800 text-sm mb-1">{entry.title}</h4>
            {entry.link && (
              <a
                href={entry.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 mb-1 break-all"
              >
                <ExternalLink size={12} />
                {entry.link.length > 40 ? `${entry.link.substring(0, 40)}...` : entry.link}
              </a>
            )}
            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {entry.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Component to render message content
  const MessageContent = ({ content, type }: { content: string; type: 'user' | 'bot' }) => {
    if (type === 'user') {
      return <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>;
    }

    // Try to parse AI response
    const parsedEntries = parseAIResponse(content);

    if (parsedEntries && parsedEntries.length > 0) {
      return (
        <div>
          <p className="text-sm text-gray-600 mb-2">Found {parsedEntries.length} relevant item(s):</p>
          <ParsedEntries entries={parsedEntries} />
        </div>
      );
    }

    // Fallback to regular text if parsing fails
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${apiKey}/ask/ai`, { question: query }, { withCredentials: true });
      // console.log(response.data.pineconeMatches)
      if (response) {
        const array = response.data.pineconeMatches.map((item: any) => item.fields)
        props.setContent(array)
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        type: "bot",
        content: response.data.aiAnswer || "I received your message! This is a demo response.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-7 right-7 z-50 p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${isOpen
            ? 'bg-gray-600 hover:bg-gray-700 rotate-0'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          } text-white`}
        aria-label={isOpen ? "Close Chat" : "Open Chat"}
        title={isOpen ? "Close Chat" : "Open Chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-7 w-[400px] h-[600px] bg-white shadow-2xl rounded-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <p className="text-xs text-blue-100">Online</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container - Fixed height with scrolling */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }`}>
                    {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`rounded-2xl px-4 py-3 ${message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border'
                    }`}>
                    <div className="overflow-y-auto max-h-96">
                      <MessageContent content={message.content} type={message.type} />
                    </div>
                    <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-200 text-gray-600">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md shadow-sm border px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <div className="p-4 border-t bg-white flex-shrink-0">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
              />
              <button
                onClick={handleSubmit}
                disabled={!query.trim() || isLoading}
                className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChat;