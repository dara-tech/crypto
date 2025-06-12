import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import Draggable from 'react-draggable';
import ChatMessage from './ChatMessage';
import useChat from '../../hooks/useChat';

const Chatbot = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const draggableRef = useRef(null);
  
  const {
    messages,
    isLoading,
    sendMessage,
    clearMessages
  } = useChat();
  
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      clearMessages();
    }
  };
  
  const handleDrag = (e, ui) => {
    setPosition({
      x: ui.x,
      y: ui.y
    });
  };
  
  const handleStart = () => {
    setIsDragging(true);
  };
  
  const handleStop = () => {
    setIsDragging(false);
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const chatWindowClass = `w-80 ${isExpanded ? 'h-[80vh]' : 'h-[500px]'} bg-white rounded-lg shadow-xl flex flex-col border border-gray-200 transition-all duration-200`;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Chat Window */}
      {isOpen ? (
        <Draggable
          handle=".chat-header"
          defaultPosition={{ x: 0, y: 0 }}
          position={position}
          onStart={handleStart}
          onStop={handleStop}
          onDrag={handleDrag}
          bounds="parent"
          nodeRef={draggableRef}
        >
          <div 
            ref={draggableRef}
            className={chatWindowClass}
            style={{
              position: 'absolute',
              right: '20px',
              bottom: '20px',
              pointerEvents: 'auto',
              cursor: isDragging ? 'grabbing' : 'default'
            }}
          >
            {/* Header */}
            <div className="chat-header p-3 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
              <h3 className="font-medium">Chat Assistant</h3>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleExpand}
                  className="text-white hover:bg-blue-700 rounded p-1"
                  title={isExpanded ? 'Minimize' : 'Maximize'}
                >
                  {isExpanded ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                </button>
                <button 
                  onClick={handleClearChat}
                  className="text-white hover:bg-blue-700 rounded p-1 text-sm"
                  title="Clear chat"
                  disabled={messages.length === 0}
                >
                  Clear
                </button>
                <button 
                  onClick={toggleChat}
                  className="text-white hover:bg-blue-700 rounded-full p-1"
                  title="Close chat"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-4">
                  <div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 mx-auto">
                      <FiMessageSquare size={24} className="text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-800 mb-1">How can I help you today?</h3>
                    <p className="text-sm text-gray-500 mb-4">Ask me anything about our services</p>
                    <div className="grid gap-2">
                      {['How do I get started?', 'What are your plans?', 'Contact support'].map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => setInput(suggestion)}
                          className="text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div 
                      key={msg.id || index} 
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === 'user' 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-white border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        <div className="break-words">
                          {msg.text || (isLoading && '...')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none">
                        <span className="loading loading-dots loading-sm"></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="input input-bordered w-full pr-12"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </div>
          </div>
        </Draggable>
      ) : (
        <div 
          className="fixed bottom-5 right-5"
          style={{ pointerEvents: 'auto' }}
        >
          <button 
            onClick={toggleChat}
            className="btn btn-circle bg-blue-600 text-white shadow-lg hover:bg-blue-700 border-0"
            aria-label="Open chat"
          >
            <FiMessageSquare size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;