import React from 'react';
import type { Message } from '../types.ts';

interface ChatMessageProps {
  message: Message;
  isDarkMode: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isDarkMode }) => {
  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          message.isUser
            ? isDarkMode 
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : isDarkMode
              ? 'bg-gray-900 text-gray-100'
              : 'bg-gray-100 text-gray-900'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};