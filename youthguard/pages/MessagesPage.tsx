import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Message } from '../types';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // In a real app, you would fetch actual conversations
  // For now, we'll simulate with dummy data
  useEffect(() => {
    // Simulate fetching conversations
    const dummyConversations = [
      {
        id: '1',
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40',
        lastMessage: 'Hey, how are you doing?',
        unread: 2,
        timestamp: '2023-05-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Jane Smith',
        avatar: 'https://via.placeholder.com/40',
        lastMessage: 'Thanks for the feedback!',
        unread: 0,
        timestamp: '2023-05-14T14:20:00Z'
      },
      {
        id: '3',
        name: 'Career Mentor',
        avatar: 'https://via.placeholder.com/40',
        lastMessage: 'Your next session is scheduled for tomorrow',
        unread: 1,
        timestamp: '2023-05-13T09:15:00Z'
      }
    ];
    
    setConversations(dummyConversations);
    setLoading(false);
  }, []);

  const handleSelectConversation = async (conversation: any) => {
    setSelectedConversation(conversation);
    // In a real app, you would fetch messages for this conversation
    // For now, we'll simulate with dummy data
    const dummyMessages: Message[] = [
      {
        _id: '1',
        content: 'Hello there! How can I help you today?',
        senderId: conversation.id === '1' ? '1' : user?._id || '',
        receiverId: conversation.id === '1' ? user?._id || '' : '1',
        read: true,
        createdAt: '2023-05-15T10:25:00Z',
        updatedAt: '2023-05-15T10:25:00Z'
      },
      {
        _id: '2',
        content: 'Hey, how are you doing?',
        senderId: user?._id || '',
        receiverId: conversation.id === '1' ? '1' : user?._id || '',
        read: true,
        createdAt: '2023-05-15T10:30:00Z',
        updatedAt: '2023-05-15T10:30:00Z'
      }
    ];
    setMessages(dummyMessages);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    
    try {
      setSending(true);
      
      // In a real app, you would send the message to the backend
      // For now, we'll just simulate
      const messageData = {
        content: newMessage,
        senderId: user?._id,
        receiverId: selectedConversation.id
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add message to the list
      const newMessageObj: Message = {
        _id: Date.now().toString(),
        content: newMessage,
        senderId: user?._id || '',
        receiverId: selectedConversation.id,
        read: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setMessages([...messages, newMessageObj]);
      setNewMessage('');
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full fade-in">
      <div className="slide-up">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-text-primary">
          Messages
        </h1>
        <p className="mt-1 sm:mt-2 text-text-secondary text-base sm:text-lg">
          Connect with mentors, peers, and employers.
        </p>
      </div>

      <div className="flex flex-col md:flex-row flex-1 mt-4 sm:mt-6 bg-white rounded-xl shadow-card overflow-hidden card">
        {/* Conversations sidebar - hidden on mobile when conversation is selected */}
        <div className={`md:w-1/3 border-r border-gray-200 ${selectedConversation && 'hidden md:block'}`}>
          <div className="p-3 sm:p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-text-primary">Conversations</h2>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {conversations.map(conversation => (
              <div 
                key={conversation.id}
                className={`flex items-center p-3 sm:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-all duration-200 hover-lift ${
                  selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <img 
                  src={conversation.avatar} 
                  alt={conversation.name} 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-transform duration-300 hover:scale-110"
                />
                <div className="ml-2 sm:ml-3 flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="text-sm sm:text-base font-medium text-text-primary truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-text-secondary">
                      {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-xs sm:text-sm text-text-secondary truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unread > 0 && (
                      <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-xs font-medium text-white bg-primary rounded-full notification-badge">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-3 sm:p-4 border-b border-gray-200 flex items-center">
                <button 
                  onClick={() => setSelectedConversation(null)} 
                  className="md:hidden mr-2 sm:mr-4 text-text-secondary hover:text-primary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <img 
                  src={selectedConversation.avatar} 
                  alt={selectedConversation.name} 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-transform duration-300 hover:scale-110"
                />
                <div className="ml-2 sm:ml-3">
                  <h3 className="text-base sm:text-lg font-medium text-text-primary">
                    {selectedConversation.name}
                  </h3>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 sm:p-4" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {messages.map((message, index) => (
                  <div 
                    key={message._id}
                    className={`flex mb-3 sm:mb-4 bounce-in animation-delay-${index * 50} ${
                      message.senderId === user?._id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div 
                      className={`max-w-xs sm:max-w-sm md:max-w-md px-3 py-2 sm:px-4 sm:py-3 rounded-2xl ${
                        message.senderId === user?._id 
                          ? 'bg-primary text-white rounded-br-none' 
                          : 'bg-gray-100 text-text-primary rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm sm:text-base">{message.content}</p>
                      <p 
                        className={`text-xs mt-1 ${
                          message.senderId === user?._id ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-3 sm:p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-3 py-2 sm:px-4 sm:py-3 bg-primary text-white rounded-r-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 text-sm sm:text-base"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="text-center slide-in-right">
                <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-medium text-text-primary">No conversation selected</h3>
                <p className="mt-1 text-text-secondary text-sm sm:text-base">
                  Select a conversation from the sidebar to start messaging.
                </p>
                <p className="mt-2 text-text-secondary text-xs sm:text-sm md:hidden">
                  Tip: Conversations are listed on the left side.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;