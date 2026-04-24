export const SERVICE_CATEGORIES = [
  { value: "fotoin", label: "Fotoin", emoji: "📷" },
  { value: "videoin", label: "Videoin", emoji: "🎬" },
  { value: "sutradarain", label: "Sutradarain", emoji: "🎥" },
  { value: "editin", label: "Editin", emoji: "✂️" },
  { value: "desain_in", label: "Desain-in", emoji: "🎨" },
  { value: "tigadi_in", label: "3Din", emoji: "🧊" },
  { value: "musik_in", label: "Musik-in", emoji: "🎵" },
  { value: "voice_in", label: "Voice-in", emoji: "🎙️" },
  { value: "lainnya", label: "Lainnya", emoji: "✨" },
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number]["value"];

export const categoryLabel = (v: string) =>
  SERVICE_CATEGORIES.find((c) => c.value === v)?.label ?? v;

export const JOB_STATUS_LABELS: Record<string, string> = {
  posted: "Posted",
  accepted: "Accepted",
  in_progress: "In Progress",
  completed: "Completed",
  paid: "Paid",
  cancelled: "Cancelled",
};
