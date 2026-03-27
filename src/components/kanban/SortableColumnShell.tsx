"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import type { Task, TaskColumn } from "@/types/task";
import { TaskColumn as Column } from "./TaskColumn";

type Props = {
  column: TaskColumn;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDuplicate?: (task: Task) => void;
};

export function SortableColumnShell({
  column,
  onEdit,
  onDelete,
  onDuplicate,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column,
    data: { type: "column-reorder", column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        flex: 1,
        display: "flex",
        minWidth: 0,
        maxWidth: { xs: "100%", lg: 380 },
        opacity: isDragging ? 0.88 : 1,
        zIndex: isDragging ? 2 : "auto",
      }}
    >
      <Column
        column={column}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        columnDragHandleProps={{ ...attributes, ...listeners }}
      />
    </Box>
  );
}
