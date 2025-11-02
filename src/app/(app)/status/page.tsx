import { Plus, CircleDot } from 'lucide-react';
import { statuses, users } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function StatusPage() {
    const myUser = users.find(u => u.id === 'user-me');
    const contactStatuses = statuses.reduce((acc, status) => {
        if (!acc[status.userId]) {
            acc[status.userId] = [];
        }
        acc[status.userId].push(status);
        return acc;
    }, {} as Record<string, typeof statuses>);


  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="flex w-full flex-col border-r bg-card md:max-w-sm">
        <header className="flex flex-shrink-0 items-center justify-between border-b p-4">
          <h1 className="text-2xl font-bold font-headline">Status</h1>
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
        </header>
        <div className="flex-1 overflow-y-auto">
            <div className="p-4">
                <div className="flex cursor-pointer items-center gap-4 p-2 transition-colors hover:bg-muted rounded-lg">
                    <div className="relative">
                        <Avatar className="h-14 w-14">
                            <AvatarImage src={myUser?.avatarUrl} alt="My status" />
                            <AvatarFallback>ME</AvatarFallback>
                        </Avatar>
                        <Button size="icon" className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div>
                        <h2 className="font-semibold">My Status</h2>
                        <p className="text-sm text-muted-foreground">Add to my status</p>
                    </div>
                </div>
            </div>

            <div className="px-4 py-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Recent updates</h3>
            </div>
            
            <ul className="divide-y">
                {Object.entries(contactStatuses).map(([userId, userStatuses]) => {
                    const user = users.find(u => u.id === userId);
                    if (!user) return null;
                    const lastStatus = userStatuses[userStatuses.length - 1];
                    return (
                        <li key={userId}>
                            <div className="flex cursor-pointer items-center gap-4 p-4 transition-colors hover:bg-muted">
                                <Avatar className="h-14 w-14 border-2 border-primary p-0.5">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h2 className="font-semibold">{user.name}</h2>
                                    <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(lastStatus.timestamp), { addSuffix: true })}</p>
                                </div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
      </div>
      <div className="hidden flex-1 items-center justify-center bg-background md:flex">
        <div className="text-center text-muted-foreground">
            <CircleDot className="mx-auto h-24 w-24 opacity-50" />
            <h2 className="mt-4 text-xl font-semibold">Click on a contact to view their status</h2>
        </div>
      </div>
    </div>
  );
}
