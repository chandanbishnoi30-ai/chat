import { Search, UserPlus } from 'lucide-react';
import { contacts } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ContactsPage() {
    const sortedContacts = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    const groupedContacts = sortedContacts.reduce((acc, contact) => {
        const firstLetter = contact.name[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(contact);
        return acc;
    }, {} as Record<string, typeof contacts>);

  return (
    <div className="flex h-screen flex-col bg-card">
      <header className="flex flex-shrink-0 items-center justify-between border-b p-4">
        <h1 className="text-2xl font-bold font-headline">Contacts</h1>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
                <UserPlus className="h-5 w-5" />
            </Button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <ul className="">
          {Object.entries(groupedContacts).map(([letter, contacts]) => (
            <li key={letter}>
              <h2 className="bg-muted px-4 py-1 text-sm font-semibold text-primary">{letter}</h2>
              <ul>
                {contacts.map(contact => (
                    <li key={contact.id}>
                         <Link href={`/chats/${contact.id.replace('user-', 'chat-')}`} className="block transition-colors hover:bg-muted/50">
                            <div className="flex items-center gap-4 p-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                                    <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{contact.name}</p>
                                </div>
                            </div>
                        </Link>
                    </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
