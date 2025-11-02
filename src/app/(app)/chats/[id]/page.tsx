import { notFound } from 'next/navigation';
import { getChatById, getUserById } from '@/lib/data';
import ChatView from '@/components/chat-view';

export default function ChatPage({ params }: { params: { id: string } }) {
  const chat = getChatById(params.id);

  if (!chat) {
    notFound();
  }

  const chatWithMemberDetails = {
      ...chat,
      members: chat.members.map(member => getUserById(member.id)!)
  }
  
  const currentUser = getUserById('user-me');
  if (!currentUser) {
      notFound();
  }
  
  return <ChatView chat={chatWithMemberDetails} currentUser={currentUser} />;
}
