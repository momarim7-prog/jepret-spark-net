import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/client/ClientLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { categoryLabel, JOB_STATUS_LABELS } from "@/lib/categories";
import { format } from "date-fns";
import {
  ArrowLeft, MapPin, Calendar as CalendarIcon, Wallet, Loader2,
  Check, X, Star, ShieldCheck, FileDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Job = any;
type Application = {
  id: string;
  freelancer_id: string;
  message: string | null;
  status: string;
  created_at: string;
  profile?: { full_name: string | null; avatar_url: string | null; skills: string[] | null; city: string | null };
};

const statusVariant = (s: string) => {
  if (["completed", "paid"].includes(s)) return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  if (s === "accepted" || s === "in_progress") return "bg-amber/15 text-amber border-amber/30";
  if (s === "cancelled") return "bg-destructive/15 text-destructive border-destructive/30";
  return "bg-muted/40 text-muted-foreground border-border/50";
};

const ClientBookingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showApplicants, setShowApplicants] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hasReview, setHasReview] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    const { data: j } = await supabase.from("jobs").select("*").eq("id", id).maybeSingle();
    setJob(j);

    const { data: a } = await supabase
      .from("job_applications")
      .select("*")
      .eq("job_id", id)
      .order("created_at", { ascending: false });
    const list = (a ?? []) as Application[];

    if (list.length) {
      const fids = list.map((x) => x.freelancer_id);
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url, skills, city")
        .in("id", fids);
      const map = new Map((profs ?? []).map((p) => [p.id, p]));
      list.forEach((x) => (x.profile = map.get(x.freelancer_id) as any));
    }
    setApps(list);

    if (j && user) {
      const { data: r } = await supabase
        .from("reviews")
        .select("id")
        .eq("job_id", id)
        .eq("client_id", user.id)
        .maybeSingle();
      setHasReview(!!r);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id, user]);

  const respond = async (appId: string, status: "accepted" | "declined") => {
    const app = apps.find((x) => x.id === appId);
    if (!app || !job) return;

    const { error } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", appId);
    if (error) return toast.error(error.message);

    if (status === "accepted") {
      // also decline others & move job to accepted
      await supabase
        .from("job_applications")
        .update({ status: "declined" })
        .eq("job_id", job.id)
        .neq("id", appId)
        .eq("status", "pending");
      await supabase
        .from("jobs")
        .update({ status: "accepted", accepted_freelancer_id: app.freelancer_id })
        .eq("id", job.id);
      toast.success("Freelancer diterima — lanjut ke pembayaran escrow (segera).");
    } else {
      toast.success("Lamaran ditolak");
    }
    load();
  };

  const markCompleted = async () => {
    if (!job) return;
    const { error } = await supabase.from("jobs").update({ status: "completed" }).eq("id", job.id);
    if (error) return toast.error(error.message);
    toast.success("Pekerjaan ditandai selesai. Beri ulasan ya!");
    load();
    setReviewing(true);
  };

  const submitReview = async () => {
    if (!job || !user || !job.accepted_freelancer_id) return;
    const { error } = await supabase.from("reviews").insert({
      job_id: job.id,
      client_id: user.id,
      freelancer_id: job.accepted_freelancer_id,
      rating,
      comment: comment.trim() || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Terima kasih atas ulasannya!");
    setReviewing(false);
    setHasReview(true);
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-amber" />
        </div>
      </ClientLayout>
    );
  }

  if (!job) {
    return (
      <ClientLayout>
        <div className="px-5 pt-10 text-center">
          <p className="text-muted-foreground text-sm">Pekerjaan tidak ditemukan.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/client/bookings")}>
            Kembali
          </Button>
        </div>
      </ClientLayout>
    );
  }

  const pendingApps = apps.filter((a) => a.status === "pending");

  return (
    <ClientLayout>
      <div className="px-5 lg:px-10 pt-6 max-w-3xl mx-auto">
        <button onClick={() => navigate("/client/bookings")} className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", statusVariant(job.status))}>
            {JOB_STATUS_LABELS[job.status]}
          </Badge>
          <span className="text-[10px] tracking-wider uppercase text-muted-foreground">{categoryLabel(job.category)}</span>
          <span className="text-[10px] tracking-wider uppercase text-muted-foreground">· {job.type}</span>
        </div>

        <h1 className="font-display text-3xl mt-2">{job.title}</h1>

        <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
          {job.scheduled_at && (
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5" />
              {format(new Date(job.scheduled_at), "EEE, d MMM yyyy · HH:mm")}
            </span>
          )}
          {job.location_address && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {job.location_address}
            </span>
          )}
          {job.budget_idr && (
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              IDR {job.budget_idr.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-border/50 bg-card/50 p-5 mt-6">
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">Brief</p>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </div>

        {/* Applicants */}
        {job.status === "posted" && (
          <Button
            onClick={() => setShowApplicants(true)}
            className="w-full mt-5 bg-gradient-golden text-primary-foreground shadow-amber"
            disabled={pendingApps.length === 0}
          >
            {apps.length === 0 ? "Belum ada lamaran" : `${pendingApps.length} Freelancer Applied`}
          </Button>
        )}

        {/* Escrow placeholder */}
        {job.status === "accepted" && (
          <div className="mt-6 rounded-2xl border border-amber/30 bg-amber/5 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber mt-0.5" />
              <div className="flex-1">
                <p className="font-display text-lg">Escrow Payment</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pembayaran aman akan ditahan hingga pekerjaan selesai. Fitur escrow segera hadir.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={async () => {
                    await supabase.from("jobs").update({ status: "in_progress" }).eq("id", job.id);
                    toast.success("Status dipindah ke In Progress (mock)");
                    load();
                  }}
                >
                  Lanjut (mock) → In Progress
                </Button>
              </div>
            </div>
          </div>
        )}

        {job.status === "in_progress" && (
          <Button onClick={markCompleted} className="w-full mt-5 bg-gradient-golden text-primary-foreground shadow-amber">
            Tandai Selesai
          </Button>
        )}

        {["completed", "paid"].includes(job.status) && (
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-border/50 bg-card/50 p-5 text-center">
              <FileDown className="w-6 h-6 mx-auto text-amber mb-2" />
              <p className="font-display">Invoice otomatis</p>
              <p className="text-xs text-muted-foreground">Tersedia setelah Phase 4.</p>
              <Button variant="outline" size="sm" className="mt-3" disabled>
                Download Invoice
              </Button>
            </div>
            {!hasReview && job.accepted_freelancer_id && (
              <Button onClick={() => setReviewing(true)} className="w-full bg-gradient-golden text-primary-foreground shadow-amber">
                <Star className="w-4 h-4 mr-2" /> Beri Ulasan
              </Button>
            )}
            {hasReview && <p className="text-center text-xs text-emerald-400">✓ Ulasan terkirim</p>}
          </div>
        )}
      </div>

      {/* Applicants modal */}
      <Dialog open={showApplicants} onOpenChange={setShowApplicants}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Freelancer yang melamar</DialogTitle>
            <DialogDescription>Pilih kandidat terbaik untuk pekerjaan ini.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {apps.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Belum ada lamaran.</p>}
            {apps.map((a) => (
              <div key={a.id} className="rounded-xl border border-border/50 p-3">
                <button
                  onClick={() => navigate(`/talent/${a.freelancer_id}`)}
                  className="flex items-center gap-3 w-full text-left"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={a.profile?.avatar_url ?? undefined} />
                    <AvatarFallback>{(a.profile?.full_name ?? "F").slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{a.profile?.full_name ?? "Freelancer"}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {a.profile?.skills?.slice(0, 2).join(" · ") ?? "—"}
                      {a.profile?.city && ` · ${a.profile.city}`}
                    </p>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px]", statusVariant(a.status))}>
                    {a.status}
                  </Badge>
                </button>
                {a.message && <p className="text-xs text-muted-foreground mt-2 italic">"{a.message}"</p>}
                {a.status === "pending" && (
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => respond(a.id, "declined")}>
                      <X className="w-3.5 h-3.5 mr-1" /> Tolak
                    </Button>
                    <Button size="sm" className="bg-gradient-golden text-primary-foreground shadow-amber" onClick={() => respond(a.id, "accepted")}>
                      <Check className="w-3.5 h-3.5 mr-1" /> Terima
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Review modal */}
      <Dialog open={reviewing} onOpenChange={setReviewing}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Beri ulasan</DialogTitle>
            <DialogDescription>Bagaimana pengalaman kerja sama dengan freelancer ini?</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} className="p-1">
                <Star className={cn("w-7 h-7", n <= rating ? "fill-amber text-amber" : "text-muted-foreground")} />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ceritakan pengalamanmu (opsional)…"
            maxLength={500}
          />
          <Button onClick={submitReview} className="w-full bg-gradient-golden text-primary-foreground shadow-amber">
            Kirim ulasan
          </Button>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
};

export default ClientBookingDetail;
