import BottomNav from "@/components/BottomNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const chats = [
  {
    id: 1,
    name: "Andra Wijaya",
    role: "Fotoin · Level 3",
    avatar: "https://i.pravatar.cc/150?img=12",
    last: "On my way! ETA 10 minutes 📸",
    time: "now",
    unread: 2,
    online: true,
    delivered: false,
  },
  {
    id: 2,
    name: "Maya Lestari",
    role: "Videoin · Level 2",
    avatar: "https://i.pravatar.cc/150?img=47",
    last: "Sent the moodboard for Saturday's shoot.",
    time: "5m",
    unread: 1,
    online: true,
    delivered: true,
  },
  {
    id: 3,
    name: "Rendy Pratama",
    role: "Editin · Level 3",
    avatar: "https://i.pravatar.cc/150?img=33",
    last: "You: Looks great, please proceed 🙌",
    time: "1h",
    unread: 0,
    online: false,
    delivered: true,
  },
  {
    id: 4,
    name: "Sinta Halim",
    role: "Desain-in · Level 2",
    avatar: "https://i.pravatar.cc/150?img=45",
    last: "Final logo files are uploaded to the gig.",
    time: "Yesterday",
    unread: 0,
    online: false,
    delivered: true,
  },
  {
    id: 5,
    name: "Bella Anindya",
    role: "MakeUp-in · Level 1",
    avatar: "https://i.pravatar.cc/150?img=49",
    last: "Thank you! See you next time ✨",
    time: "Mon",
    unread: 0,
    online: false,
    delivered: true,
  },
  {
    id: 6,
    name: "Davin Santoso",
    role: "Sutradarain · Level 3",
    avatar: "https://i.pravatar.cc/150?img=15",
    last: "Storyboard v2 attached — let me know.",
    time: "Sun",
    unread: 0,
    online: false,
    delivered: true,
  },
];

const Chat = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <main className="relative z-10 pb-32 max-w-3xl mx-auto px-5 lg:px-10 pt-10">
        <header className="mb-6">
          <div className="text-[10px] tracking-[0.3em] uppercase text-amber mb-2">Messages</div>
          <h1 className="font-display text-4xl text-foreground">Chat</h1>
        </header>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search conversations" className="pl-9 bg-secondary/50 border-border/60" />
        </div>

        <ul className="space-y-1">
          {chats.map((c) => (
            <li key={c.id}>
              <button className="w-full text-left flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/60 transition-colors">
                <div className="relative shrink-0">
                  <Avatar className="w-12 h-12 ring-1 ring-border/60">
                    <AvatarImage src={c.avatar} alt={c.name} />
                    <AvatarFallback>{c.name[0]}</AvatarFallback>
                  </Avatar>
                  {c.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-amber ring-2 ring-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-foreground truncate">{c.name}</span>
                    <span className={cn("text-[10px] shrink-0", c.unread > 0 ? "text-amber" : "text-muted-foreground")}>
                      {c.time}
                    </span>
                  </div>
                  <div className="text-[10px] text-muted-foreground/80 mb-0.5">{c.role}</div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-xs truncate flex items-center gap-1",
                        c.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                      )}
                    >
                      {c.delivered && c.unread === 0 && <CheckCheck className="w-3 h-3 text-amber/80 shrink-0" />}
                      {c.last}
                    </span>
                    {c.unread > 0 && (
                      <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-gradient-golden text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-amber">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </main>
      <BottomNav />
    </div>
  );
};

export default Chat;
