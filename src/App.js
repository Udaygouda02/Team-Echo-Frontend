import logo from './logo.svg';
import React, { useState } from "react";
import { User, Plus, Trash2, MessageSquare, Paperclip } from "lucide-react";

const App = () => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello 👋 I’m Echo AI. How can I assist you today?" },
    { from: "user", text: "Can you help me with something" },
    { from: "bot", text: "Of course! Please tell me what you need." },
  ]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const sendMessage = () => {
    if (!input.trim() && !selectedFile) return;

    if (selectedFile) {
      setMessages([...messages, { from: "user", text: `📎 Uploaded: ${selectedFile.name}` }]);
      setSelectedFile(null);
    } else {
      setMessages([...messages, { from: "user", text: input }]);
      setInput("");
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className="h-screen flex bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between">
        <div>
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-lg font-semibold text-gray-900">Echo AI Assistant</h1>
          </div>

          <div className="p-4 space-y-4">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Plus className="w-4 h-4" /> New Chat
            </button>

            <div className="text-sm text-gray-500 uppercase tracking-wide">History</div>

            <nav className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    i === 2 ? "bg-gray-100" : ""
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <span>Chat with AI</span>
                </div>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600">
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
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                  msg.from === "user"
                    ? "bg-gray-200 text-gray-900"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
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
