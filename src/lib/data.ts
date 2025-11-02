import { Chat, User, Contact, Status } from '@/lib/types';
import { subMinutes, subHours, subDays } from 'date-fns';

const now = new Date();

export const users: User[] = [
  { id: 'user-me', name: 'You', avatarUrl: 'https://picsum.photos/seed/0/200/200', onlineStatus: 'online' },
  { id: 'user-1', name: 'Alice', avatarUrl: 'https://picsum.photos/seed/1/200/200', onlineStatus: 'online' },
  { id: 'user-2', name: 'Bob', avatarUrl: 'https://picsum.photos/seed/2/200/200', onlineStatus: 'offline' },
  { id: 'user-3', name: 'Charlie', avatarUrl: 'https://picsum.photos/seed/3/200/200', onlineStatus: 'away' },
  { id: 'user-4', name: 'Diana', avatarUrl: 'https://picsum.photos/seed/4/200/200', onlineStatus: 'online' },
  { id: 'user-5', name: 'Eve', avatarUrl: 'https://picsum.photos/seed/5/200/200', onlineStatus: 'offline' },
];

export const contacts: Contact[] = users.filter(u => u.id !== 'user-me');

export const chats: Chat[] = [
  {
    id: 'chat-1',
    type: 'private',
    name: 'Alice',
    avatarUrl: users.find(u => u.id === 'user-1')!.avatarUrl,
    members: [users.find(u => u.id === 'user-me')!, users.find(u => u.id === 'user-1')!],
    messages: [
      { id: 'msg-1-1', senderId: 'user-1', text: 'Hey, how are you?', timestamp: subMinutes(now, 5).toISOString(), status: 'read', type: 'text' },
      { id: 'msg-1-2', senderId: 'user-me', text: 'I\'m good, thanks! How about you?', timestamp: subMinutes(now, 4).toISOString(), status: 'read', type: 'text' },
      { id: 'msg-1-3', senderId: 'user-1', text: 'Doing great! Just working on the new project.', timestamp: subMinutes(now, 3).toISOString(), status: 'read', type: 'text' },
      { id: 'msg-1-4', senderId: 'user-1', text: 'Wanna grab coffee later?', timestamp: subMinutes(now, 1).toISOString(), status: 'delivered', type: 'text' },
    ],
    unreadCount: 2,
    isMuted: false,
    isPinned: true,
  },
  {
    id: 'chat-2',
    type: 'group',
    name: 'Project Team',
    avatarUrl: 'https://picsum.photos/seed/101/200/200',
    members: [users.find(u => u.id === 'user-me')!, users.find(u => u.id === 'user-2')!, users.find(u => u.id === 'user-3')!],
    messages: [
      { id: 'msg-2-1', senderId: 'user-2', text: 'Don\'t forget the meeting at 3 PM.', timestamp: subHours(now, 2).toISOString(), status: 'read', type: 'text' },
      { id: 'msg-2-2', senderId: 'user-3', text: 'I have the documents ready.', timestamp: subHours(now, 1).toISOString(), status: 'read', type: 'text' },
      { id: 'msg-2-3', senderId: 'user-me', text: 'Perfect, see you both there.', timestamp: subHours(now, 1).toISOString(), status: 'delivered', type: 'text' },
    ],
    unreadCount: 0,
    isMuted: false,
    isPinned: false,
  },
  {
    id: 'chat-3',
    type: 'private',
    name: 'Charlie',
    avatarUrl: users.find(u => u.id === 'user-3')!.avatarUrl,
    members: [users.find(u => u.id === 'user-me')!, users.find(u => u.id === 'user-3')!],
    messages: [
      { id: 'msg-3-1', senderId: 'user-me', text: 'Did you see the new designs?', timestamp: subHours(now, 6).toISOString(), status: 'read', type: 'text' },
      { id: 'msg-3-2', senderId: 'user-3', text: 'Yes, they look amazing!', timestamp: subHours(now, 5).toISOString(), status: 'read', type: 'text' },
    ],
    unreadCount: 0,
    isMuted: true,
    isPinned: false,
  },
    {
    id: 'chat-4',
    type: 'private',
    name: 'Diana',
    avatarUrl: users.find(u => u.id === 'user-4')!.avatarUrl,
    members: [users.find(u => u.id === 'user-me')!, users.find(u => u.id === 'user-4')!],
    messages: [
      { id: 'msg-4-1', senderId: 'user-4', text: 'Lunch tomorrow?', timestamp: subDays(now, 1).toISOString(), status: 'read', type: 'text' },
    ],
    unreadCount: 1,
    isMuted: false,
    isPinned: false,
  },
];

export const statuses: Status[] = [
    { id: 'status-1', userId: 'user-1', type: 'image', content: 'https://picsum.photos/seed/201/1080/1920', timestamp: subHours(now, 1).toISOString(), viewers: ['user-me'] },
    { id: 'status-2', userId: 'user-2', type: 'text', content: 'Feeling productive today! 🚀', timestamp: subHours(now, 3).toISOString(), viewers: [] },
    { id: 'status-3', userId: 'user-4', type: 'image', content: 'https://picsum.photos/seed/202/1080/1920', timestamp: subHours(now, 8).toISOString(), viewers: ['user-me']},
];

export const getChatById = (id: string) => chats.find(chat => chat.id === id);
export const getMessagesByChatId = (id: string) => getChatById(id)?.messages;
export const getUserById = (id: string) => users.find(user => user.id === id);
