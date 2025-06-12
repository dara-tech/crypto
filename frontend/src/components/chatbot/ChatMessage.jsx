import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiEdit, FiTrash2, FiCheck, FiX, FiMoreVertical } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { enUS, km } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const getStatusIcon = (status, isUser) => {
  switch (status) {
    case 'sending':
      return <span className="loading loading-spinner loading-xs" />;
    case 'error':
      return <FiX className="text-error" />;
    case 'sent':
      return isUser ? <FiCheck className="text-success" /> : null;
    default:
      return null;
  }
};

const ChatMessage = ({ 
  message, 
  onEdit, 
  onDelete, 
  onCopy,
  onSuggestionClick,
  isLastMessage 
}) => {
  const { t, i18n } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);
  
  const isUser = message.sender === 'user';
  const locale = i18n.language === 'km' ? km : enUS;
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    onCopy?.(message.id);
  };
  
  const handleEdit = () => {
    if (isEditing) {
      onEdit?.(message.id, editedText);
    } else {
      setEditedText(message.text);
    }
    setIsEditing(!isEditing);
  };
  
  const handleDelete = () => {
    if (window.confirm(t('chat.confirmDelete'))) {
      onDelete?.(message.id);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    onSuggestionClick?.(suggestion, message.id);
  };

  return (
    <div 
      className={`chat ${isUser ? 'chat-end' : 'chat-start'} group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="chat-header opacity-70 text-xs mb-1">
        {isUser ? t('chat.you') : 'AI Assistant'}
        <time className="text-xs opacity-50 ml-2">
          {formatDistanceToNow(new Date(message.timestamp || new Date()), { 
            addSuffix: true,
            locale 
          })}
        </time>
        {isUser && (
          <div className="dropdown dropdown-end dropdown-hover">
            <button 
              className="btn btn-ghost btn-xs btn-circle"
              onClick={() => setShowActions(!showActions)}
            >
              <FiMoreVertical size={14} />
            </button>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40">
              <li>
                <button onClick={handleCopy}>
                  <FiCopy size={14} /> {t('chat.copy')}
                </button>
              </li>
              <li>
                <button onClick={handleEdit}>
                  <FiEdit size={14} /> {isEditing ? t('chat.save') : t('chat.edit')}
                </button>
              </li>
              <li>
                <button onClick={handleDelete} className="text-error">
                  <FiTrash2 size={14} /> {t('chat.delete')}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      
      <div 
        className={`chat-bubble text-sm prose max-w-full prose-p:my-2 prose-headings:my-3 ${
          message.status === 'error' ? 'bg-error/20' : ''
        }`}
      >
        {isEditing ? (
          <textarea
            className="textarea textarea-bordered w-full min-h-[100px]"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            autoFocus
          />
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                      }}
                      className="absolute right-2 top-2 btn btn-xs btn-ghost"
                      title="Copy code"
                    >
                      <FiCopy size={12} />
                    </button>
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.text || t('chat.thinking')}
          </ReactMarkdown>
        )}
        
        {/* Message status */}
        <div className="flex items-center justify-end mt-1 space-x-1 opacity-70">
          {message.isEdited && (
            <span className="text-xs opacity-50">({t('chat.edited')})</span>
          )}
          {getStatusIcon(message.status, isUser)}
        </div>
      </div>
      
      {/* Suggested replies */}
      {message.suggestions && isLastMessage && !isUser && (
        <div className="flex flex-wrap gap-2 mt-2 ml-4">
          {message.suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => handleSuggestionClick(suggestion)}
              className="btn btn-xs btn-ghost"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
