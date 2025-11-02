import { ChevronRight, User, Lock, Bell, MessageCircle, HelpCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { users } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

const settingsItems = [
    { icon: User, text: "Account", subtext: "Privacy, security, change number" },
    { icon: Lock, text: "Privacy", subtext: "Block contacts, disappearing messages" },
    { icon: MessageCircle, text: "Chats", subtext: "Theme, wallpapers, chat history" },
    { icon: Bell, text: "Notifications", subtext: "Message, group & call tones" },
    { icon: HelpCircle, text: "Help", subtext: "Help center, contact us, privacy policy" },
]

export default function SettingsPage() {
    const myUser = users.find(u => u.id === 'user-me');

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex flex-shrink-0 border-b bg-card p-4">
        <h1 className="text-2xl font-bold font-headline">Settings</h1>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
            <div className="flex items-center gap-4 p-4 bg-card rounded-lg shadow-sm">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={myUser?.avatarUrl} alt={myUser?.name} />
                    <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-xl font-semibold">{myUser?.name}</h2>
                    <p className="text-muted-foreground">Online</p>
                </div>
            </div>
        </div>

        <div className="bg-card">
            <ul>
                {settingsItems.map((item, index) => (
                    <li key={item.text}>
                        <div className="flex cursor-pointer items-center gap-4 px-6 py-4 transition-colors hover:bg-muted">
                            <item.icon className="h-6 w-6 text-muted-foreground"/>
                            <div className="flex-1">
                                <p>{item.text}</p>
                                <p className="text-sm text-muted-foreground">{item.subtext}</p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                        </div>
                        {index < settingsItems.length - 1 && <Separator className="ml-16"/>}
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
}
