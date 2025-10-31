// ChatStream.jsx
import React, { useState, useEffect, useRef } from 'react';

const ChatStream = () => {
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [sources, setSources] = useState([]);
  
  const messagesEndRef = useRef(null);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamedText]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentInput.trim()) return;
    
    // Add user message to chat
    const userMessage = currentInput;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setCurrentInput('');
    setIsStreaming(true);
    setStreamedText('');
    setFollowUps([]);
    setSources([]);
    
    // Create URL with query params
    const url = new URL('/api/chat', window.location.origin);
    url.searchParams.append('query', userMessage);
    if (sessionId) {
      url.searchParams.append('session_id', sessionId);
    }
    
    // Create EventSource for streaming
    const eventSource = new EventSource(url);
    
    // Handle character streaming
    eventSource.addEventListener('message', (event) => {
      setStreamedText(prev => prev + event.data);
    });
    
    // Handle follow-up suggestions
    eventSource.addEventListener('follow_ups', (event) => {
      const followUpData = JSON.parse(event.data);
      setFollowUps(followUpData);
    });
    
    // Handle sources
    eventSource.addEventListener('sources', (event) => {
      const sourcesData = JSON.parse(event.data);
      setSources(sourcesData);
    });
    
    // Handle session info
    eventSource.addEventListener('session_info', (event) => {
      const sessionData = JSON.parse(event.data);
      if (sessionData.session_id) {
        setSessionId(sessionData.session_id);
      }
    });
    
    // Handle completion
    eventSource.addEventListener('error', () => {
      eventSource.close();
      setIsStreaming(false);
      // Add the complete message to the messages array
      setMessages(prev => [...prev, { 
        text: streamedText, 
        sender: 'assistant',
        followUps,
        sources
      }]);
    });
  };
  
  const selectFollowUp = (question) => {
    setCurrentInput(question);
    // Auto-submit the follow-up
    handleSubmit({ preventDefault: () => {} });
  };
  
  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            <div className="message-text">{msg.text}</div>
            
            {msg.sender === 'assistant' && msg.followUps && msg.followUps.length > 0 && (
              <div className="follow-ups">
                <h4>Follow-up Questions:</h4>
                <div className="follow-up-buttons">
                  {msg.followUps.map((q, i) => (
                    <button 
                      key={i} 
                      className="follow-up-button"
                      onClick={() => selectFollowUp(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {msg.sender === 'assistant' && msg.sources && msg.sources.length > 0 && (
              <div className="sources">
                <h4>Sources:</h4>
                <ul>
                  {msg.sources.map((source, i) => (
                    <li key={i}>{source.title || source.document}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
        
        {isStreaming && (
          <div className="message assistant streaming">
            <div className="message-text">{streamedText}<span className="cursor">▋</span></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isStreaming}
        />
        <button type="submit" disabled={isStreaming || !currentInput.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatStream;
