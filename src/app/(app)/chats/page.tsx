import Link from 'next/link';
import { Search, Plus, MessageSquare } from 'lucide-react';
import { chats } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function ChatsPage() {
  const sortedChats = [...chats].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    const lastMsgA = new Date(a.messages[a.messages.length - 1]?.timestamp || 0);
    const lastMsgB = new Date(b.messages[b.messages.length - 1]?.timestamp || 0);
    return lastMsgB.getTime() - lastMsgA.getTime();
  });

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="flex w-full flex-col border-r bg-card md:max-w-sm">
        <header className="flex flex-shrink-0 items-center justify-between border-b p-4">
          <h1 className="text-2xl font-bold font-headline">ConnectNow</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y">
            {sortedChats.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              return (
                <li key={chat.id}>
                  <Link href={`/chats/${chat.id}`} className="block transition-colors hover:bg-muted">
                    <div className="flex items-center gap-4 p-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={chat.avatarUrl} alt={chat.name} />
                        <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 truncate">
                        <div className="flex items-center justify-between">
                          <h2 className="font-semibold">{chat.name}</h2>
                          {lastMessage && (
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm text-muted-foreground">
                                {lastMessage?.text || 'No messages yet'}
                            </p>
                          {chat.unreadCount > 0 && (
                            <Badge className="flex-shrink-0 bg-accent text-accent-foreground hover:bg-accent/90">{chat.unreadCount}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="hidden flex-1 items-center justify-center bg-background md:flex">
        <div className="text-center text-muted-foreground">
            <MessageSquare className="mx-auto h-24 w-24 opacity-50" />
            <h2 className="mt-4 text-xl font-semibold">Select a chat to start messaging</h2>
            <p>or start a new conversation</p>
        </div>
      </div>
    </div>
  );
}
