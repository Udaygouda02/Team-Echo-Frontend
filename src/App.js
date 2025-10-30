import React, { useState } from "react";
import { User, Plus, Trash2, MessageSquare, Paperclip, Lock, Mail } from "lucide-react";

// Add styles to head
const style = document.createElement('style');
style.textContent = `
  .bg-login-pattern {
    background-color: #1a365d;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%234a5568' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    background-position: center;
    background-repeat: repeat;
  }
`;
document.head.appendChild(style);

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 w-fit">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  </div>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Function to format date
  const formatDate = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diff = now.getTime() - messageDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return messageDate.toLocaleDateString();
  };

  // Function to format time
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Initialize new chat
  const startNewChat = () => {
    const newChatId = Date.now();
    const initialMessage = {
      id: Date.now(),
      from: "bot",
      text: "Hello 👋 I'm Echo AI. How can I assist you today?",
      timestamp: formatTime()
    };
    
    setMessages([initialMessage]);
    setChatHistory(prev => [{
      id: newChatId,
      title: "New Conversation",
      date: new Date().toISOString(),
      lastMessage: initialMessage.text
    }, ...prev]);
    setCurrentChatId(newChatId);
  };

  const sendMessage = () => {
    if (!input.trim() && !selectedFile) return;

    // Create new chat if none exists
    if (!currentChatId) {
      startNewChat();
    }

    const newMessage = {
      id: Date.now(),
      from: "user",
      text: selectedFile ? `📎 Uploaded: ${selectedFile.name}` : input.trim(),
      timestamp: formatTime()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Update chat history
    setChatHistory(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { 
            ...chat, 
            lastMessage: newMessage.text,
            title: chat.title === "New Conversation" ? `Chat about ${newMessage.text.slice(0, 30)}...` : chat.title
          }
        : chat
    ));

    // Show typing indicator
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now(),
        from: "bot",
        text: "I understand your message. How can I help you further?",
        timestamp: formatTime()
      };
      setIsTyping(false);
      setMessages(prev => [...prev, botResponse]);
      setChatHistory(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, lastMessage: botResponse.text }
          : chat
      ));
    }, 2000);

    if (selectedFile) {
      setSelectedFile(null);
    } else {
      setInput("");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Add your login logic here
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex items-center justify-center relative overflow-hidden bg-login-pattern">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-indigo-900/95"></div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-500/10 backdrop-blur-3xl transform -skew-y-6"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/3 bg-indigo-500/10 backdrop-blur-3xl transform skew-y-6"></div>
        </div>

        <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 relative z-10">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-white to-blue-100 rounded-2xl flex items-center justify-center shadow-xl transform rotate-45 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-50/50 backdrop-blur-sm"></div>
                <MessageSquare className="w-10 h-10 text-blue-600 transform -rotate-45" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Team Echo</h1>
            <div className="w-16 h-1 bg-blue-400/50 mx-auto rounded-full mb-3"></div>
            <p className="text-blue-100 text-sm">Intelligent Chat Assistant</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-blue-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-lg"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-blue-300 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-lg"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-blue-50 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-lg font-semibold text-gray-900">Echo AI Assistant</h1>
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <User className="w-4 h-4 mr-2" />
              <span>{email}</span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <button 
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>

            <div className="text-sm text-gray-500 uppercase tracking-wide">
              {chatHistory.length > 0 ? "History" : "No chat history"}
            </div>

            <nav className="space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setCurrentChatId(chat.id)}
                  className={`flex flex-col px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    chat.id === currentChatId ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">{chat.title}</span>
                  </div>
                  <div className="flex flex-col ml-6">
                    <span className="text-xs text-gray-500">{formatDate(chat.date)}</span>
                    <span className="text-xs text-gray-400 truncate">{chat.lastMessage}</span>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => {
              setChatHistory([]);
              setMessages([]);
              setCurrentChatId(null);
            }}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" /> Clear conversations
          </button>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold">Chat with AI</h2>
          <User className="w-6 h-6 text-gray-500" />
        </header>

        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              } w-full`}
            >
              <div className={`flex flex-col gap-1 max-w-[70%] ${
                msg.from === "user" ? "items-end" : "items-start"
              }`}>
                <div
                  className={`px-4 py-2 rounded-2xl w-fit ${
                    msg.from === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-500 px-2">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start w-full">
              <div className="flex flex-col gap-1 max-w-[70%] items-start">
                <TypingIndicator />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4 flex items-center">
          {/* Upload File Button */}
          <div className="relative">
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Paperclip className="w-5 h-5 text-gray-500" />
            </label>
          </div>

          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 mx-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            className="ml-1 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
