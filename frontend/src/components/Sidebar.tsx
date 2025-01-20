import React from 'react';
import { Clock, MessageSquare, Trash2, Plus, Sun, Moon } from 'lucide-react';
import { Button, IconButton } from '@mui/material';
import type { Conversation } from '../types.ts';

interface SidebarProps {
  conversations: Conversation[];
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onNewChat: () => void;
  selectedId?: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  onSelectConversation,
  onDeleteConversation,
  onNewChat,
  selectedId,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <div className={`w-64 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} h-screen p-4 flex flex-col`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className={`w-6 h-6 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`} />
          <h1 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Assistant Vocal</h1>
        </div>
        <IconButton onClick={onToggleTheme} size="small">
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </IconButton>
      </div>

      <Button
        variant="contained"
        color="primary"
        startIcon={<Plus className="w-4 h-4" />}
        onClick={onNewChat}
        className="mb-4"
        fullWidth
      >
        Nouvelle Conversation
      </Button>
      
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`p-3 rounded-lg mb-2 cursor-pointer flex items-center justify-between ${
              selectedId === conv.id 
                ? isDarkMode ? 'bg-blue-600' : 'bg-blue-100'
                : isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
            }`}
            onClick={() => onSelectConversation(conv)}
          >
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                {conv.messages[0]?.content.slice(0, 30)}...
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};