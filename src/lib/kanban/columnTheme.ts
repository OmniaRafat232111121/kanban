import type { TaskColumn } from "@/types/task";

export const columnTheme: Record<
  TaskColumn,
  { accent: string; accentSoft: string; header: string }
> = {
  backlog: {
    accent: "#5c6bc0",
    accentSoft: "rgba(92, 107, 192, 0.14)",
    header: "linear-gradient(135deg, #5c6bc0 0%, #7e57c2 100%)",
  },
  in_progress: {
    accent: "#ff8f00",
    accentSoft: "rgba(255, 143, 0, 0.14)",
    header: "linear-gradient(135deg, #ff8f00 0%, #ff6d00 100%)",
  },
  review: {
    accent: "#7b1fa2",
    accentSoft: "rgba(123, 31, 162, 0.12)",
    header: "linear-gradient(135deg, #8e24aa 0%, #6a1b9a 100%)",
  },
  done: {
    accent: "#00897b",
    accentSoft: "rgba(0, 137, 123, 0.14)",
    header: "linear-gradient(135deg, #00897b 0%, #00695c 100%)",
  },
};
