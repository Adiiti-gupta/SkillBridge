import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Send, User as UserIcon, MessageSquare, ArrowLeft } from 'lucide-react';

const Messages = () => {
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('user');
  
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (initialUserId && !selectedUser) {
      startConversationWithUser(initialUserId);
    }
  }, [initialUserId, conversations]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser._id);
      const interval = setInterval(() => fetchMessages(selectedUser._id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startConversationWithUser = async (userId) => {
    try {
      console.log('Starting conversation with user ID:', userId);
      
      // Try to fetch user details
      const response = await api.get(`/profile/${userId}`);
      const user = response.data.data;
      console.log('User fetched:', user);
      selectUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      
      // If user not found in profile route, try to find in conversations
      const existingConv = conversations.find(c => c.user._id === userId);
      if (existingConv) {
        console.log('User found in conversations:', existingConv.user);
        selectUser(existingConv.user);
      } else {
        // Create a minimal user object to start chatting
        console.log('Creating minimal user object for chat');
        selectUser({
          _id: userId,
          name: 'User',
          avatarColor: '#3B82F6'
        });
        
        // Send a test message to establish the conversation
        // This will help fetch the real user data
        fetchMessages(userId);
      }
    }
  };

  const fetchConversations = async () => {
    try {
      const response = await api.get('/messages');
      setConversations(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await api.get(`/messages/${userId}`);
      setMessages(response.data.data);
      
      // Update selected user with full details from messages if available
      if (response.data.data.length > 0 && selectedUser?._id === userId) {
        const firstMessage = response.data.data[0];
        const otherUser = firstMessage.sender._id === currentUserId 
          ? firstMessage.receiver 
          : firstMessage.sender;
        
        if (otherUser && selectedUser.name === 'User') {
          setSelectedUser(otherUser);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const selectUser = (user) => {
    console.log('Selecting user:', user);
    setSelectedUser(user);
    setMessages([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      await api.post('/messages', {
        to: selectedUser._id,
        text: messageText
      });
      fetchMessages(selectedUser._id);
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
      setNewMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 250px)' }}>
        {/* Conversations List */}
        <div className={`lg:col-span-1 bg-white rounded-xl shadow-sm overflow-hidden ${selectedUser ? 'hidden lg:block' : ''}`}>
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-semibold text-gray-900">Conversations</h2>
          </div>
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">
                  No conversations yet. Start chatting with your matches from the marketplace!
                </p>
              </div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.user._id}
                  onClick={() => selectUser(conv.user)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition border-b ${
                    selectedUser?._id === conv.user._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                    style={{ backgroundColor: conv.user.avatarColor || '#3B82F6' }}
                  >
                    {conv.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {conv.user.name}
                      </h3>
                      {conv.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full ml-2">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conv.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.lastMessageAt).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages Panel */}
        <div className={`lg:col-span-2 bg-white rounded-xl shadow-sm flex flex-col ${!selectedUser ? 'hidden lg:flex' : ''}`}>
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex items-center gap-3 bg-gray-50">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="lg:hidden p-2 hover:bg-gray-200 rounded-full transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: selectedUser.avatarColor || '#3B82F6' }}
                >
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    {selectedUser.name}
                  </h2>
                  {selectedUser.location && (
                    <p className="text-xs text-gray-500">{selectedUser.location}</p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg) => {
                      const isSent = msg.sender._id === currentUserId;
                      return (
                        <div
                          key={msg._id}
                          className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                              isSent
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-900 rounded-bl-none shadow-sm'
                            }`}
                          >
                            <p className="text-sm break-words">{msg.text}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isSent ? 'text-blue-100' : 'text-gray-500'
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;