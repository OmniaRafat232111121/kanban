export const COLUMNS = [
  "backlog",
  "in_progress",
  "review",
  "done",
] as const;

export type TaskColumn = (typeof COLUMNS)[number];

export interface Task {
  id: number;
  title: string;
  description: string;
  column: TaskColumn;
}
