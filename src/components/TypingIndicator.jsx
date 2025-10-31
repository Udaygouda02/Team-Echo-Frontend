import React from "react";

const TypingIndicator = () => (
  <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 w-fit">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>
  </div>
);

export default TypingIndicator;
