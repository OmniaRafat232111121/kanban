import type { Task, TaskColumn } from "@/types/task";

export type TaskStats = {
  total: number;
  byColumn: Record<TaskColumn, number>;
};

function tasksBase(): string {
  const ext = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  return ext ? `${ext}/tasks` : "/api/tasks";
}

export const PAGE_SIZE = 5;

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function fetchTaskStats(): Promise<TaskStats> {
  const res = await fetch("/api/tasks/stats");
  return parseJson<TaskStats>(res);
}

export async function fetchTasksForExport(): Promise<Task[]> {
  const res = await fetch("/api/tasks/export");
  return parseJson<Task[]>(res);
}

export async function fetchTasksPage(params: {
  column: TaskColumn;
  page: number;
  limit: number;
  q: string;
}): Promise<Task[]> {
  const search = new URLSearchParams({
    column: params.column,
    _page: String(params.page),
    _limit: String(params.limit),
  });
  if (params.q.trim()) search.set("q", params.q.trim());
  const res = await fetch(`${tasksBase()}?${search.toString()}`);
  return parseJson<Task[]>(res);
}

export async function createTask(body: Omit<Task, "id">): Promise<Task> {
  const res = await fetch(tasksBase(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson<Task>(res);
}

export async function updateTask(
  id: number,
  patch: Partial<Pick<Task, "title" | "description" | "column">>,
): Promise<Task> {
  const res = await fetch(`${tasksBase()}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return parseJson<Task>(res);
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${tasksBase()}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
}
