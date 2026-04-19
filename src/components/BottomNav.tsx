import { Home, Tag, ClipboardList, MessageCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { id: "home", label: "Home", Icon: Home, path: "/" },
  { id: "promos", label: "Promos", Icon: Tag, path: "/promos" },
  { id: "orders", label: "Orders", Icon: ClipboardList, path: "/orders" },
  { id: "chat", label: "Chat", Icon: MessageCircle, path: "/chat" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active =
    items.find((i) => (i.path === "/" ? pathname === "/" : pathname.startsWith(i.path)))?.id ?? "home";

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-md m-3">
        <div className="glass rounded-full px-2 py-2 flex items-center justify-between shadow-deep">
          {items.map(({ id, label, Icon, path }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => navigate(path)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-500",
                  isActive
                    ? "bg-gradient-golden text-primary-foreground shadow-amber"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive && "stroke-[2.5]")} />
                {isActive && (
                  <span className="text-xs font-semibold tracking-wide">{label}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
