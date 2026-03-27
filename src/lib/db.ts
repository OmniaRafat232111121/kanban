import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Task } from "@/types/task";

export type TaskDb = { tasks: Task[] };

const DB_PATH = path.join(process.cwd(), "db.json");

export async function readDb(): Promise<TaskDb> {
  const raw = await readFile(DB_PATH, "utf-8");
  return JSON.parse(raw) as TaskDb;
}

export async function writeDb(db: TaskDb): Promise<void> {
  await writeFile(DB_PATH, `${JSON.stringify(db, null, 2)}\n`, "utf-8");
}
