import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Briefcase, MapPin, Clock, FileText, ChevronsUpDown, Check } from "lucide-react";
import { z } from "zod";
import TalentMap from "@/components/TalentMap";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const OCCASION_GROUPS: { heading: string; options: string[] }[] = [
  {
    heading: "Social & Celebrations",
    options: [
      "Wedding (Indoor)",
      "Engagement / Sangjit",
      "Pre-Wedding / Engagement Session",
      "Birthday Party (Adult)",
      "Kids' Birthday / Baby Shower",
      "Graduation / Convocation",
      "Anniversary",
      "Prom / Formal Night",
      "Holiday / Family Gathering",
    ],
  },
  {
    heading: "Corporate & Professional",
    options: [
      "Conference / Seminar",
      "Product Launch",
      "Company Gathering / Outing",
      "Gala Dinner",
      "Workshop / Masterclass",
      "Corporate Headshots / Branding",
      "Office / Architectural Photography",
      "Exhibition / Trade Show",
    ],
  },
  {
    heading: "Lifestyle & Nightlife",
    options: [
      "Music Festival / Concert",
      "Club Night / DJ Performance",
      "Fashion Show",
      "Sporting Event / Tournament",
      "Street / Urban Photography",
      "Automotive / Car Meet",
    ],
  },
  {
    heading: "Personal & Studio",
    options: [
      "Maternity Session",
      "Newborn / Toddler Portrait",
      "Personal Branding / Portfolio",
      "Pet Photography",
      "Food & Beverage (Menu/Commercial)",
      "Interior / Real Estate",
      "Other",
    ],
  },
];

const ALL_OCCASIONS = OCCASION_GROUPS.flatMap((g) => g.options);

const SERVICE_LABELS: Record<string, string> = {
  fotoin: "Fotoin",
  videoin: "Videoin",
  makeupin: "Make-up-in",
  stylein: "Style-in",
  sutradarain: "Sutradarain",
  suarain: "Suarain",
  terangin: "Terangin",
  bantuin: "Bantuin",
};

const jobSchema = z.object({
  occasion: z.string().trim().min(2, "Occasion wajib diisi").max(120),
  where: z.string().trim().min(2, "Lokasi wajib diisi").max(200),
  duration: z.string().trim().min(1, "Durasi wajib diisi").max(40),
  notes: z.string().trim().max(1000).optional(),
});

const Field = ({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Briefcase;
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <label className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      <Icon className="w-3.5 h-3.5 text-amber" />
      {label}
    </label>
    {children}
  </div>
);

const BookNow = () => {
  const { type, slug } = useParams();
  const navigate = useNavigate();
  const label = (slug && SERVICE_LABELS[slug]) || "Layanan";

  const [form, setForm] = useState({
    occasion: "",
    where: "",
    duration: "",
    notes: "",
  });
  const [occasionOpen, setOccasionOpen] = useState(false);
  const [occasionSearch, setOccasionSearch] = useState("");

  const handleOccasionSelect = (value: string) => {
    setForm({ ...form, occasion: value });
    setOccasionSearch("");
    setOccasionOpen(false);
  };

  const trimmedSearch = occasionSearch.trim();
  const hasMatch = trimmedSearch
    ? ALL_OCCASIONS.some((o) => o.toLowerCase().includes(trimmedSearch.toLowerCase()))
    : true;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = jobSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    navigate(`/book/${type}/${slug}/posted`, { state: form });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-5 lg:px-10 pt-6 pb-24 relative z-10">
        <Link
          to={`/book/${type}/${slug}`}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <div className="mt-5">
          <span className="text-[10px] uppercase tracking-[0.3em] text-amber font-semibold">
            Book NOW · {label}
          </span>
          <h1 className="font-display text-2xl mt-2 leading-tight">
            Talent terdekat di sekitarmu
          </h1>
        </div>

        <div className="mt-4">
          <TalentMap />
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <h2 className="font-display text-xl">Detail pekerjaan</h2>

          <Field icon={Briefcase} label="What's the occasion?">
            <Popover open={occasionOpen} onOpenChange={setOccasionOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={occasionOpen}
                  className={cn(
                    "w-full justify-between font-normal h-10",
                    !form.occasion && "text-muted-foreground"
                  )}
                >
                  {form.occasion || "Pilih atau ketik occasion…"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command
                  filter={(value, search) => {
                    if (!search) return 1;
                    return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
                  }}
                >
                  <CommandInput
                    placeholder="Cari occasion…"
                    value={occasionSearch}
                    onValueChange={setOccasionSearch}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {trimmedSearch ? (
                        <button
                          type="button"
                          onClick={() => handleOccasionSelect(trimmedSearch)}
                          className="w-full text-left px-2 py-2 text-sm hover:bg-accent rounded-sm"
                        >
                          Use "<span className="font-semibold">{trimmedSearch}</span>" (Other)
                        </button>
                      ) : (
                        "Tidak ditemukan."
                      )}
                    </CommandEmpty>
                    {OCCASION_GROUPS.map((group) => (
                      <CommandGroup key={group.heading} heading={group.heading}>
                        {group.options.map((opt) => (
                          <CommandItem
                            key={opt}
                            value={opt}
                            onSelect={() => handleOccasionSelect(opt)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                form.occasion === opt ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {opt}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                    {trimmedSearch && !hasMatch && (
                      <CommandGroup heading="Custom">
                        <CommandItem
                          value={`__custom_${trimmedSearch}`}
                          onSelect={() => handleOccasionSelect(trimmedSearch)}
                        >
                          <Check className="mr-2 h-4 w-4 opacity-0" />
                          Use "{trimmedSearch}" (Other)
                        </CommandItem>
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </Field>

          <Field icon={MapPin} label="Where?">
            <Input
              value={form.where}
              onChange={(e) => setForm({ ...form, where: e.target.value })}
              placeholder="Alamat lengkap atau landmark"
              maxLength={200}
            />
          </Field>

          <Field icon={Clock} label="Job duration?">
            <Input
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              placeholder="Contoh: 3 jam"
              maxLength={40}
            />
          </Field>

          <Field icon={FileText} label="Notes">
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Detail tambahan, gear, dress code, dll."
              maxLength={1000}
              rows={4}
            />
          </Field>

          <button
            type="submit"
            className="w-full mt-2 rounded-2xl bg-gradient-golden text-obsidian font-display text-lg py-4 shadow-amber hover:opacity-95 transition-all"
          >
            Post Job Listing →
          </button>
        </form>
      </main>
    </div>
  );
};

export default BookNow;
