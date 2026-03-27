import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import type { Task, TaskColumn } from "@/types/task";
import { COLUMNS } from "@/types/task";

const COLUMN_SET = new Set<string>(COLUMNS);

function isTaskColumn(v: string): v is TaskColumn {
  return COLUMN_SET.has(v);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const column = searchParams.get("column");
  const page = Math.max(1, parseInt(searchParams.get("_page") || "1", 10));
  const limit = Math.max(1, parseInt(searchParams.get("_limit") || "10", 10));
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";

  const db = await readDb();
  let tasks = [...db.tasks];

  if (column && isTaskColumn(column)) {
    tasks = tasks.filter((t) => t.column === column);
  }

  if (q) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }

  tasks.sort((a, b) => a.id - b.id);

  const start = (page - 1) * limit;
  const slice = tasks.slice(start, start + limit);

  return NextResponse.json(slice);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<Task>;
  if (!body.title?.trim() || !body.column || !isTaskColumn(body.column)) {
    return NextResponse.json(
      { message: "Invalid body: need title and valid column" },
      { status: 400 },
    );
  }

  const db = await readDb();
  const nextId = Math.max(0, ...db.tasks.map((t) => t.id), 0) + 1;
  const task: Task = {
    id: nextId,
    title: body.title.trim(),
    description: (body.description ?? "").trim(),
    column: body.column,
  };
  db.tasks.push(task);
  await writeDb(db);

  return NextResponse.json(task, { status: 201 });
}
