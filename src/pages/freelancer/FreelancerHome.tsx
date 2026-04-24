import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FreelancerHome = () => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background px-5 lg:px-10 py-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Dashboard freelancer</p>
        <Button variant="ghost" size="icon" onClick={async () => { await signOut(); navigate("/auth"); }}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      <div className="glass rounded-3xl p-7 space-y-5">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20 ring-2 ring-amber/40">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback>{profile?.full_name?.[0] ?? "F"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-3xl">{profile?.full_name}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1 normal-case tracking-normal">
              <MapPin className="w-3 h-3" /> {profile?.city} · radius {profile?.service_radius_km}km
            </p>
          </div>
        </div>

        {profile?.bio && (
          <p className="text-sm text-muted-foreground normal-case tracking-normal leading-relaxed">{profile.bio}</p>
        )}

        {profile?.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <Badge key={s} variant="secondary" className="text-[10px] tracking-[0.2em] uppercase">{s}</Badge>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 glass rounded-3xl p-7 text-center">
        <Briefcase className="w-10 h-10 mx-auto text-amber mb-3" />
        <h2 className="font-display text-2xl mb-2">Belum ada pekerjaan</h2>
        <p className="text-sm text-muted-foreground normal-case tracking-normal">
          Pekerjaan dari klien di area Anda akan muncul di sini
        </p>
      </div>

      <footer className="mt-10 text-center">
        <div className="flex justify-center gap-4 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          <a href="/terms" className="hover:text-foreground">Terms</a>
          <span>·</span>
          <a href="/privacy" className="hover:text-foreground">Privacy</a>
        </div>
      </footer>
    </div>
  );
};

export default FreelancerHome;
