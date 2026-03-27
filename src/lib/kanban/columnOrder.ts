import { COLUMNS, type TaskColumn } from "@/types/task";

const STORAGE_KEY = "kanban-column-order";

export function normalizeColumnOrder(order: unknown): TaskColumn[] {
  if (!Array.isArray(order) || order.length !== COLUMNS.length) {
    return [...COLUMNS];
  }
  const set = new Set(order);
  if (set.size !== COLUMNS.length) return [...COLUMNS];
  for (const c of COLUMNS) {
    if (!set.has(c)) return [...COLUMNS];
  }
  return order as TaskColumn[];
}

export function readStoredColumnOrder(): TaskColumn[] {
  if (typeof window === "undefined") return [...COLUMNS];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeColumnOrder(JSON.parse(raw) as unknown);
  } catch {
    //
  }
  return [...COLUMNS];
}

export function persistColumnOrder(order: TaskColumn[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  } catch {
    //
  }
}
