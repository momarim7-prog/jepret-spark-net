import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ClientLayout from "@/components/client/ClientLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { categoryLabel, JOB_STATUS_LABELS } from "@/lib/categories";
import { format } from "date-fns";
import {
  MoreVertical, MapPin, Calendar as CalendarIcon, Pause, Play, Trash2,
  Pencil, Plus, FileDown, Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Job = {
  id: string;
  title: string;
  category: string;
  type: "onsite" | "remote";
  status: string;
  scheduled_at: string | null;
  location_address: string | null;
  budget_idr: number | null;
  paused: boolean;
  created_at: string;
};

const statusVariant = (s: string) => {
  if (["completed", "paid"].includes(s)) return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  if (s === "accepted" || s === "in_progress") return "bg-amber/15 text-amber border-amber/30";
  if (s === "cancelled") return "bg-destructive/15 text-destructive border-destructive/30";
  return "bg-muted/40 text-muted-foreground border-border/50";
};

const ClientBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [appCounts, setAppCounts] = useState<Record<string, number>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false });
    setJobs((jobsData ?? []) as Job[]);

    if (jobsData?.length) {
      const ids = jobsData.map((j) => j.id);
      const { data: apps } = await supabase
        .from("job_applications")
        .select("job_id")
        .in("job_id", ids);
      const counts: Record<string, number> = {};
      (apps ?? []).forEach((a) => {
        counts[a.job_id] = (counts[a.job_id] ?? 0) + 1;
      });
      setAppCounts(counts);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const togglePause = async (job: Job) => {
    const { error } = await supabase.from("jobs").update({ paused: !job.paused }).eq("id", job.id);
    if (error) return toast.error(error.message);
    toast.success(job.paused ? "Posting diaktifkan" : "Posting dijeda");
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Posting dihapus");
    setDeleteId(null);
    load();
  };

  const active = jobs.filter((j) => !["completed", "paid", "cancelled"].includes(j.status));
  const finished = jobs.filter((j) => ["completed", "paid"].includes(j.status));

  const renderJob = (job: Job) => (
    <div
      key={job.id}
      className="rounded-2xl border border-border/50 bg-card/50 p-4 hover:border-amber/40 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => navigate(`/client/bookings/${job.id}`)}
          className="text-left flex-1 min-w-0"
        >
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", statusVariant(job.status))}>
              {JOB_STATUS_LABELS[job.status] ?? job.status}
            </Badge>
            {job.paused && (
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-muted/40 text-muted-foreground border-border/50">
                Paused
              </Badge>
            )}
            <span className="text-[10px] tracking-wider uppercase text-muted-foreground">
              {categoryLabel(job.category)}
            </span>
          </div>
          <p className="font-display text-lg leading-tight truncate">{job.title}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {job.scheduled_at && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                {format(new Date(job.scheduled_at), "d MMM, HH:mm")}
              </span>
            )}
            {job.location_address && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{job.location_address}</span>
              </span>
            )}
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/client/bookings/${job.id}`)}>
              <Pencil className="w-4 h-4 mr-2" /> Detail
            </DropdownMenuItem>
            {job.status === "posted" && (
              <DropdownMenuItem onClick={() => togglePause(job)}>
                {job.paused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                {job.paused ? "Aktifkan" : "Jeda"}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(job.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {(appCounts[job.id] ?? 0) > 0 && job.status === "posted" && (
        <button
          onClick={() => navigate(`/client/bookings/${job.id}`)}
          className="mt-3 w-full text-left text-xs px-3 py-2 rounded-lg bg-amber/10 text-amber border border-amber/20 hover:bg-amber/15"
        >
          {appCounts[job.id]} Freelancer Applied →
        </button>
      )}

      {["completed", "paid"].includes(job.status) && (
        <Button variant="outline" size="sm" className="w-full mt-3 text-xs" disabled>
          <FileDown className="w-3.5 h-3.5 mr-2" /> Download Invoice (segera)
        </Button>
      )}
    </div>
  );

  const empty = (msg: string) => (
    <div className="rounded-2xl border border-dashed border-border/50 p-10 text-center">
      <Inbox className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground">{msg}</p>
    </div>
  );

  return (
    <ClientLayout>
      <div className="px-5 lg:px-10 pt-8 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Bookings</p>
            <h1 className="font-display text-3xl">Pekerjaan saya</h1>
          </div>
          <Button onClick={() => navigate("/client/post")} size="sm" className="bg-gradient-golden text-primary-foreground shadow-amber">
            <Plus className="w-4 h-4 mr-1" /> Post
          </Button>
        </div>

        <Tabs defaultValue="active">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="active">Aktif ({active.length})</TabsTrigger>
            <TabsTrigger value="done">Selesai ({finished.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-3 mt-4">
            {loading ? <p className="text-xs text-muted-foreground">Memuat…</p> :
              active.length === 0 ? empty("Belum ada pekerjaan aktif.") : active.map(renderJob)}
          </TabsContent>
          <TabsContent value="done" className="space-y-3 mt-4">
            {loading ? <p className="text-xs text-muted-foreground">Memuat…</p> :
              finished.length === 0 ? empty("Belum ada pekerjaan selesai.") : finished.map(renderJob)}
          </TabsContent>
        </Tabs>

        <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus posting?</AlertDialogTitle>
              <AlertDialogDescription>
                Tindakan ini permanen. Semua lamaran terkait akan ikut terhapus.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && remove(deleteId)} className="bg-destructive">
                Hapus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ClientLayout>
  );
};

export default ClientBookings;
