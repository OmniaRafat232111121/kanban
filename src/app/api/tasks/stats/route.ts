import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { COLUMNS, type TaskColumn } from "@/types/task";

export async function GET() {
  const db = await readDb();
  const byColumn = {} as Record<TaskColumn, number>;
  for (const c of COLUMNS) {
    byColumn[c] = db.tasks.filter((t) => t.column === c).length;
  }
  return NextResponse.json({ total: db.tasks.length, byColumn });
}
