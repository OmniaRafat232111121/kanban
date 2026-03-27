import type { MessageKey } from "@/i18n/dictionaries";
import type { TaskColumn } from "@/types/task";

export const columnMessageKey: Record<TaskColumn, MessageKey> = {
  backlog: "column.backlog",
  in_progress: "column.in_progress",
  review: "column.review",
  done: "column.done",
};
