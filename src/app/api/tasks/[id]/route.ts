import { NextRequest, NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import type { TaskColumn } from "@/types/task";
import { COLUMNS } from "@/types/task";

const COLUMN_SET = new Set<string>(COLUMNS);

function isTaskColumn(v: unknown): v is TaskColumn {
  return typeof v === "string" && COLUMN_SET.has(v);
}

type RouteCtx = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, ctx: RouteCtx) {
  const { id: idStr } = await ctx.params;
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const patch = (await request.json()) as Record<string, unknown>;
  const db = await readDb();
  const idx = db.tasks.findIndex((t) => t.id === id);
  if (idx === -1) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  const current = db.tasks[idx];
  const next = { ...current };

  if (typeof patch.title === "string") next.title = patch.title;
  if (typeof patch.description === "string") next.description = patch.description;
  if (patch.column !== undefined) {
    if (!isTaskColumn(patch.column)) {
      return NextResponse.json({ message: "Invalid column" }, { status: 400 });
    }
    next.column = patch.column;
  }

  db.tasks[idx] = next;
  await writeDb(db);

  return NextResponse.json(next);
}

export async function DELETE(_request: NextRequest, ctx: RouteCtx) {
  const { id: idStr } = await ctx.params;
  const id = parseInt(idStr, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ message: "Invalid id" }, { status: 400 });
  }

  const db = await readDb();
  const before = db.tasks.length;
  db.tasks = db.tasks.filter((t) => t.id !== id);
  if (db.tasks.length === before) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  await writeDb(db);

  return new NextResponse(null, { status: 204 });
}
