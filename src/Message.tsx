import { useState, useEffect, useRef, useContext } from 'react';
import { Send,Search } from 'lucide-react';
import axios from 'axios';
import Sidebar from './component/Sidebar';
import { AuthContext } from './AuthContext';
interface MessagePayload {
  senderId: string;
  receiverId: string;
  message: string;
}
class ChatService {
  private ws: WebSocket | null = null;
  private messageHandlers: ((msg: MessagePayload) => void)[] = [];
  private typingHandlers: ((data: any) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];

  connect(userId: string, wsUrl = 'ws://localhost:3000') {
    this.ws = new WebSocket(wsUrl);
    this.ws.onopen = () => {
      this.send({ type: 'auth', userId });
      this.connectionHandlers.forEach(handler => handler(true));
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'new_message':
            this.messageHandlers.forEach(handler => handler(data.data));
            break;
          case 'typing':
            this.typingHandlers.forEach(handler => handler(data));
            break;
          case 'auth_success':
            // console.log('Authentication successful');
            break;
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    this.ws.onclose = () => {
      // console.log('Disconnected from WebSocket');
      this.connectionHandlers.forEach(handler => handler(false));
      setTimeout(() => this.connect(userId, wsUrl), 3000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  sendTyping(receiverId: string, isTyping: boolean) {
    this.send({ type: 'typing', receiverId, isTyping });
  }

  onMessage(handler: (msg: MessagePayload) => void) {
    this.messageHandlers.push(handler);
  }

  onTyping(handler: (data: any) => void) {
    this.typingHandlers.push(handler);
  }

  onConnection(handler: (connected: boolean) => void) {
    this.connectionHandlers.push(handler);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

const ChatApp = () => {
  const apiKey = import.meta.env.VITE_API_KEY
  const [conversations, setConversations] = useState<any[]>([]);//user list
  const [activeConversation, setActiveConversation] = useState<any>(null);// current conversation 
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  // const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');// search user
  const [isExpanded, setIsExpanded] = useState(false); // sidebar
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const chatService = useRef(new ChatService());
  const typingTimer = useRef<any>(null);
  const { userId } = useContext(AuthContext) // receive mine userId

  useEffect(() => {
    const initializeChat = async () => {
      try {
        // fetch active users
        const response = await axios.get(`${apiKey}/conversation`, { withCredentials: true });
        const data = response.data;
        console.log(response)
        setConversations(data.data);
        if (!activeConversation) {
          setActiveConversation(data.data[0]);
        }
        // connect you with ws by sending message
        chatService.current.connect(userId); // connect
        chatService.current.onMessage((message) => {
          setMessages(prev => [...prev, message]);
        });

        // chatService.current.onTyping((data) => {
        //   if (activeConversation && data.senderId === activeConversation.user._id) {
        //     setOtherUserTyping(data.isTyping);
        //   }
        // });

        chatService.current.onConnection((connected) => {
          setIsConnected(connected);
        });

        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setLoading(false);
      }
    };

    initializeChat();

    return () => {
      chatService.current.disconnect();
    };
  }, []);


  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation._id);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async (userId: string) => {
    try {
      const res = await axios.get(`${apiKey}/message/${userId}`, {
        withCredentials: true
      });
      const data = res.data;
      // console.log(res)
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    try {
      const res = await axios.post(`${apiKey}/chat`, {
        receiverId: activeConversation._id,
        message: newMessage,
      }, { withCredentials: true });

      const data = res.data;
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setNewMessage('');
        stopTyping();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e: any) => {
    setNewMessage(e.target.value);
    if (!isTyping && activeConversation) {
      setIsTyping(true);
      chatService.current.sendTyping(activeConversation._id, true);
    }
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(stopTyping, 1000);
  };

  const stopTyping = () => {
    if (isTyping && activeConversation) {
      setIsTyping(false);
      chatService.current.sendTyping(activeConversation._id, false);
    }
    if (typingTimer.current) clearTimeout(typingTimer.current);
  };



  const filteredConversations = conversations.filter(conv =>
    conv.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">Loading...</div>;
  }

  return (
    <div className='h-screen overflow-hidden flex flex-col'>
      <Sidebar expanded={isExpanded} setExpanded={setIsExpanded} />

      <header className='fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Logo and Title Section */}
            <div className='flex items-center gap-4'>
              <div className='relative group'>
                <div className='absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300'></div>
                <img
                  src="/logo.png"
                  alt="Second Brain Logo"
                  className='relative w-12 h-12 rounded-2xl object-cover shadow-lg ring-1 ring-white/20'
                />
              </div>
              <div className='flex flex-col'>
                <h1 className='font-bold text-xl bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'>
                  Second Brain
                </h1>
                <p className='text-xs text-slate-500 font-medium hidden sm:block'>Your personal knowledge hub</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={`flex-1 transition-all duration-300 ${isExpanded ? 'lg:ml-64' : 'lg:ml-16'} pt-16 pb-16 overflow-hidden`}>
        <div className="h-full flex ">
          {/* Sidebar */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col h-full mt-4 ">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
              <div className="flex items-center space-x-2 mt-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations List - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onClick={() => setActiveConversation(conversation)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${activeConversation?._id === conversation._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {
                        conversation.avatar.length == 0 ? (
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {conversation.username.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <img src={conversation.avatar} className='w-10 h-10  rounded-full flex items-center justify-center' />
                        )
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{conversation.firstName}</h3>
                        <span className="text-xs text-gray-500">
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage.message}</p>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col h-full mt-4">
            {activeConversation ? (
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {activeConversation.avatar?.length === 0 ? (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {activeConversation.username.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <img
                          src={activeConversation.avatar}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{activeConversation.firstName}</h2>
                    </div>
                  </div>
                </div>

                {/* Chat messages area - Scrollable */}
                <div className="flex-1 bg-gray-50 p-4 space-y-3 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-center text-sm text-gray-500">No messages yet</p>
                  ) : (
                    messages.map((message) => {
                      // Handle different possible data structures
                      const senderId = message.senderId._id;
                      const currentUserId = userId;
                      const isMyMessage = String(senderId) === String(currentUserId);
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl ${isMyMessage
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                              }`}
                          >
                            <p className="text-sm break-words">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-500'
                                }`}
                            >
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="bg-white p-4 border-t border-gray-200 flex-shrink-0 ">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type a message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className='fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm'>
        <div className=' text-right text-slate-500 py-2 px-4 text-sm'>
          Made by <span className="font-semibold text-purple-600">Dhruv</span> with ❤️
        </div>
      </footer>
    </div>
  );
};

export default ChatApp;