export interface Conversation {
  id: string;
  timestamp: number;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
}