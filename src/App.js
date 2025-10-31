import React, { useState, useRef, useEffect } from "react";
import { User, Plus, Trash2, MessageSquare } from "lucide-react";
import { sendChatMessage } from "./api";
import { v4 as uuid } from "uuid";
import ChatMessage from "./components/ChatMessage";
import TypingIndicator from "./components/TypingIndicator";

const App = () => {
  const [sessionId, setSessionId] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // ✅ Ref for auto-scroll
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    console.log(messages);
  }, [messages, isTyping]);

  const formatTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDate = (d) => new Date(d).toLocaleDateString();

  const startNewChat = () => {
    const sid = uuid();
    setSessionId(sid);
    setCurrentChatId(sid);

    const welcome = {
      id: Date.now(),
      from: "bot",
      text: "Hello 👋 I'm Echo AI. How can I assist you today?",
      timestamp: formatTime(),
    };

    setMessages([welcome]);
    setChatHistory((c) => [
      {
        id: sid,
        title: "New Conversation",
        date: new Date().toISOString(),
        lastMessage: welcome.text,
      },
      ...c,
    ]);
  };

  const sendMessageHandler = async () => {
    if (!input.trim()) return;

    if (!sessionId) {
      startNewChat();
    }

    const sid = sessionId ?? uuid();
    if (!sessionId) setSessionId(sid);

    const userMsg = {
      id: Date.now(),
      from: "user",
      text: input,
      timestamp: formatTime(),
    };

    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await sendChatMessage(input, sid);

      setIsTyping(false);

      const botMsg = {
        id: Date.now(),
        from: "bot",
        text: res.answer ?? res.response ?? "No reply",
        sources: res.sources ?? [],
        followUps: res.follow_up_suggestions ?? [],
        timestamp: formatTime(),
      };

      setMessages((m) => [...m, botMsg]);
      setChatHistory((h) =>
        h.map((c) =>
          c.id === sid ? { ...c, lastMessage: botMsg.text } : c
        )
      );
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  const loadChatHistoryUI = (sid) => {
    setCurrentChatId(sid);
    const chats = chatHistory.find((c) => c.id === sid);
    if (!chats) setMessages([]);
  };

  return (
    <div className="h-screen flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b">
            <h1 className="text-lg font-semibold">Team Echo's DevAI</h1>
            <div className="text-sm text-gray-600 mt-2 flex items-center">
              <User className="w-4 h-4 mr-2" /> Guest User
            </div>
          </div>

          <div className="p-4 space-y-4">
            <button
              onClick={startNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              <Plus className="w-4 h-4" /> New Chat
            </button>

            <div className="text-sm text-gray-500 uppercase">
              {chatHistory.length ? "History" : "No chat history"}
            </div>

            <nav className="space-y-2">
              {chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => loadChatHistoryUI(chat.id)}
                  className={`px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    chat.id === currentChatId ? "bg-gray-100" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">{chat.title}</span>
                  </div>
                  <div className="ml-6">
                    <span className="text-xs text-gray-500">
                      {formatDate(chat.date)}
                    </span>
                    <p className="text-xs text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={() => {
              setChatHistory([]);
              setMessages([]);
              setCurrentChatId(null);
              setSessionId(null);
            }}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" /> Clear conversations
          </button>
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b bg-white">
          <h2 className="text-lg font-semibold">Chat with AI</h2>
          <User className="w-6 h-6 text-gray-500" />
        </header>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <ChatMessage message={m} />
            </div>
          ))}

          {isTyping && <TypingIndicator />}

          {/* ✅ Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4 flex items-center">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessageHandler()}
            className="flex-grow border rounded-full px-4 py-2 mx-2"
          />

          <button
            onClick={sendMessageHandler}
            className="px-4 py-2 bg-blue-600 text-white rounded-full"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
