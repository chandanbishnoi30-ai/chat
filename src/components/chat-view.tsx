'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video, MoreVertical, Paperclip, Mic, Send, Lock, Check, CheckCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Chat, type Message, type User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { generateSmartReplySuggestions } from '@/ai/flows/smart-reply-suggestions';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

interface ChatViewProps {
  chat: Chat;
  currentUser: User;
}

function SmartReplySuggestions({ lastMessage, onSuggestionClick }: { lastMessage: Message | undefined, onSuggestionClick: (suggestion: string) => void }) {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lastMessage && lastMessage.senderId !== 'user-me' && lastMessage.senderId !== 'user-bot') {
            setLoading(true);
            setSuggestions([]);
            generateSmartReplySuggestions({ message: lastMessage.text })
                .then(response => {
                    setSuggestions(response.suggestions);
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        } else {
            setSuggestions([]);
        }
    }, [lastMessage]);

    if (loading) {
        return (
            <div className="flex gap-2 px-4 pb-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>
        )
    }

    if (!suggestions.length) return null;

    return (
        <div className="flex gap-2 overflow-x-auto p-2">
            {suggestions.map((suggestion, index) => (
                <Button key={index} variant="outline" size="sm" className="rounded-full bg-background flex-shrink-0" onClick={() => onSuggestionClick(suggestion)}>
                    {suggestion}
                </Button>
            ))}
        </div>
    );
}


export default function ChatView({ chat, currentUser }: ChatViewProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(chat.messages);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const otherUser = chat.type === 'private' ? chat.members.find(m => m.id !== currentUser.id) : null;
  const isBotChat = otherUser?.id === 'user-bot';

  const handleBotReply = async (userMessage: string) => {
    let botMessageText: string;
    const lowerCaseMessage = userMessage.toLowerCase().trim();

    if (lowerCaseMessage === 'hello') {
      botMessageText = 'yes how can i help you';
      const botMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'user-bot',
        text: botMessageText,
        timestamp: new Date().toISOString(),
        status: 'read',
        type: 'text',
      };
      setMessages(prev => [...prev, botMessage]);
      return;
    }

    if (lowerCaseMessage === 'give me some idea') {
      botMessageText = 'chulu bhar pani me dub mero';
      const botMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'user-bot',
        text: botMessageText,
        timestamp: new Date().toISOString(),
        status: 'read',
        type: 'text',
      };
      setMessages(prev => [...prev, botMessage]);
      return;
    }

    try {
      const response = await generateSmartReplySuggestions({ message: userMessage, context: 'You are a helpful assistant named Abhay Jatan.' });
      botMessageText = response.suggestions[0] || "I'm not sure how to respond to that.";

      const botMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'user-bot',
        text: botMessageText,
        timestamp: new Date().toISOString(),
        status: 'read',
        type: 'text',
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Error generating bot reply:", error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: 'user-bot',
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        timestamp: new Date().toISOString(),
        status: 'read',
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }


  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: inputValue,
      timestamp: new Date().toISOString(),
      status: 'sent',
      type: 'text',
    };
    setMessages(prev => [...prev, newMessage]);
    if (isBotChat) {
      setTimeout(() => handleBotReply(inputValue), 1000);
    }
    setInputValue('');
  };
  
  const lastMessage = messages[messages.length - 1];

  const handleSuggestionClick = (suggestion: string) => {
    const newMessage: Message = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        text: suggestion,
        timestamp: new Date().toISOString(),
        status: 'sent',
        type: 'text',
      };
      setMessages(prev => [...prev, newMessage]);
      if (isBotChat) {
        setTimeout(() => handleBotReply(suggestion), 1000);
      }
  }

  const renderMessageStatus = (message: Message) => {
    if (message.senderId !== currentUser.id) return null;
    switch(message.status) {
        case 'sent': return <Check className="h-4 w-4 text-primary-foreground/70" />;
        case 'delivered': return <CheckCheck className="h-4 w-4 text-primary-foreground/70" />;
        case 'read': return <CheckCheck className="h-4 w-4 text-accent" />;
        default: return null;
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex flex-shrink-0 items-center gap-3 border-b bg-card p-3 md:p-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={chat.avatarUrl} alt={chat.name} />
          <AvatarFallback>{chat.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="font-bold font-headline">{chat.name}</h2>
          <p className="text-xs text-muted-foreground">
            {chat.type === 'private' ? otherUser?.onlineStatus : `${chat.members.length} members`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {chat.type === 'private' && !isBotChat && (
            <>
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
            </>
          )}
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex justify-center py-2">
            <Badge variant="secondary" className="gap-1.5 text-xs"><Lock size={12}/>End-to-end encrypted</Badge>
        </div>
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUser.id;
              const sender = chat.members.find(m => m.id === message.senderId);
              const showAvatar = chat.type === 'group' && !isCurrentUser && (index === 0 || messages[index-1].senderId !== message.senderId);

              return (
                <div key={message.id} className={cn('flex items-end gap-2', isCurrentUser ? 'justify-end' : 'justify-start')}>
                  {showAvatar && (
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={sender?.avatarUrl} />
                        <AvatarFallback>{sender?.name.substring(0,2)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={cn("max-w-sm rounded-lg p-3 md:max-w-md lg:max-w-lg shadow-sm", 
                                    isCurrentUser ? 'rounded-br-none bg-primary text-primary-foreground' : 'rounded-bl-none bg-card',
                                    chat.type === 'group' && !isCurrentUser && !showAvatar ? 'ml-10' : '')}>
                    {chat.type === 'group' && !isCurrentUser && <p className="text-xs font-bold text-accent mb-1">{sender?.name}</p>}
                    <p className="text-sm break-words">{message.text}</p>
                    <div className="mt-1 flex items-center justify-end gap-1.5">
                        <p className={cn("text-xs", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                            {format(new Date(message.timestamp), 'p')}
                        </p>
                        {renderMessageStatus(message)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        <div className="flex-shrink-0 border-t bg-card pt-1">
            <SmartReplySuggestions lastMessage={lastMessage} onSuggestionClick={handleSuggestionClick} />
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-2 md:p-4">
                <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
                />
                {inputValue ? (
                    <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 rounded-full">
                        <Send className="h-5 w-5" />
                    </Button>
                ) : (
                    <Button type="button" size="icon" className="bg-primary hover:bg-primary/90 rounded-full">
                        <Mic className="h-5 w-5" />
                    </Button>
                )}
            </form>
        </div>
      </div>
    </div>
  );
}
