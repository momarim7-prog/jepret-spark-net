import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, PlusSquare, ClipboardList, MessageCircle, Bell, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { id: "home", label: "Home", Icon: Home, path: "/client/home" },
  { id: "post", label: "Post", Icon: PlusSquare, path: "/client/post" },
  { id: "bookings", label: "Bookings", Icon: ClipboardList, path: "/client/bookings" },
  { id: "chat", label: "Chat", Icon: MessageCircle, path: "/chat" },
  { id: "notifications", label: "Inbox", Icon: Bell, path: "/client/notifications" },
];

const ClientLayout = ({ children }: { children: ReactNode }) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setUnread(count ?? 0);
    };
    fetchUnread();

    const channel = supabase
      .channel("notif-badge")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        () => fetchUnread(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const isActive = (path: string) =>
    path === "/client/home" ? pathname === path : pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 border-r border-border/40 bg-card/40 backdrop-blur-xl flex-col p-6 z-40">
        <Link to="/client/home" className="font-display text-2xl mb-10">
          Jepretin
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ id, label, Icon, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={id}
                to={path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors",
                  active
                    ? "bg-gradient-golden text-primary-foreground shadow-amber"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                )}
              >
                <span className="relative">
                  <Icon className="w-4 h-4" />
                  {id === "notifications" && unread > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </span>
                <span className="font-medium">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1">
          <Link
            to="/client/profile"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors",
              pathname.startsWith("/client/profile")
                ? "bg-muted/60 text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
            )}
          >
            <User className="w-4 h-4" />
            <span className="truncate">{profile?.full_name ?? "Profil"}</span>
          </Link>
          <button
            onClick={async () => { await signOut(); navigate("/auth"); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header className="lg:hidden sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/40">
        <div className="flex items-center justify-between px-5 py-3">
          <Link to="/client/home" className="font-display text-lg">Jepretin</Link>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/client/notifications")}
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/client/profile")}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="lg:ml-64 pb-28 lg:pb-10 min-h-screen">
        {children}
      </main>

      {/* Bottom nav (mobile only) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto max-w-md m-3">
          <div className="glass rounded-full px-2 py-2 flex items-center justify-between shadow-deep">
            {navItems.map(({ id, label, Icon, path }) => {
              const active = isActive(path);
              return (
                <button
                  key={id}
                  onClick={() => navigate(path)}
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300",
                    active
                      ? "bg-gradient-golden text-primary-foreground shadow-amber"
                      : "text-muted-foreground",
                  )}
                >
                  <span className="relative">
                    <Icon className={cn("w-4 h-4", active && "stroke-[2.5]")} />
                    {id === "notifications" && unread > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 px-1 rounded-full bg-destructive text-destructive-foreground text-[8px] font-bold flex items-center justify-center">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </span>
                  {active && <span className="text-[11px] font-semibold">{label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ClientLayout;
