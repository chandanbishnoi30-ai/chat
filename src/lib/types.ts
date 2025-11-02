export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  onlineStatus: 'online' | 'offline' | 'away';
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'video' | 'doc' | 'location' | 'voice';
  mediaUrl?: string;
};

export type Chat = {
  id: string;
  type: 'private' | 'group';
  name: string;
  avatarUrl: string;
  members: User[];
  messages: Message[];
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
};

export type Status = {
  id: string;
  userId: string;
  type: 'text' | 'image';
  content: string;
  timestamp: string;
  viewers: string[];
};

export type Contact = User;
