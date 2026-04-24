import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/client/ClientLayout";
import { Button } from "@/components/ui/button";
import {
  Bell, UserPlus, MessageCircle, CreditCard, Star, CheckCheck, Inbox,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

const iconFor = (t: string) => {
  switch (t) {
    case "new_applicant": return UserPlus;
    case "new_message": return MessageCircle;
    case "payment_confirmed": return CreditCard;
    case "review_received": return Star;
    default: return Bell;
  }
};

const ClientNotifications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);
    setItems((data ?? []) as Notification[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("notifs-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const markRead = async (n: Notification) => {
    if (!n.read) {
      await supabase.from("notifications").update({ read: true }).eq("id", n.id);
    }
    if (n.link) navigate(n.link);
    else load();
  };

  const markAllRead = async () => {
    if (!user) return;
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
    if (error) return toast.error(error.message);
    toast.success("Semua ditandai dibaca");
    load();
  };

  const unread = items.filter((i) => !i.read).length;

  return (
    <ClientLayout>
      <div className="px-5 lg:px-10 pt-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Inbox</p>
            <h1 className="font-display text-3xl">Notifikasi</h1>
          </div>
          {unread > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}>
              <CheckCheck className="w-4 h-4 mr-1" /> Tandai dibaca
            </Button>
          )}
        </div>

        {loading ? (
          <p className="text-xs text-muted-foreground">Memuat…</p>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/50 p-10 text-center">
            <Inbox className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Belum ada notifikasi.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((n) => {
              const Icon = iconFor(n.type);
              return (
                <button
                  key={n.id}
                  onClick={() => markRead(n)}
                  className={cn(
                    "w-full text-left rounded-xl border p-4 flex gap-3 transition-colors",
                    n.read
                      ? "border-border/40 bg-card/30 hover:bg-card/50"
                      : "border-amber/30 bg-amber/5 hover:bg-amber/10",
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                    n.read ? "bg-muted text-muted-foreground" : "bg-amber/20 text-amber",
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-medium", !n.read && "text-foreground")}>{n.title}</p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-amber shrink-0 mt-1.5" />}
                    </div>
                    {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                    <p className="text-[10px] tracking-wider uppercase text-muted-foreground mt-1.5">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default ClientNotifications;
