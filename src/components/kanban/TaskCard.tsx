"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { columnTheme } from "@/lib/kanban/columnTheme";
import type { Task } from "@/types/task";

type Props = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDuplicate?: (task: Task) => void;
};

export function TaskCard({ task, onEdit, onDelete, onDuplicate }: Props) {
  const accent = columnTheme[task.column].accent;

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: String(task.id),
      data: { type: "task" as const, column: task.column },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.35 : 1,
  };

  return (
    <Box ref={setNodeRef} sx={{ ...style, touchAction: "none" }}>
      <Card
        variant="outlined"
        sx={{
          bgcolor: "background.paper",
          borderLeftWidth: 4,
          borderLeftColor: accent,
          borderRadius: 2,
          "&:hover": {
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            transform: "translateY(-1px)",
          },
        }}
      >
        <CardContent sx={{ py: 1.75, px: 1.5, "&:last-child": { pb: 1.75 } }}>
          <Stack direction="row" alignItems="flex-start" spacing={0.75}>
            <IconButton
              size="small"
              aria-label="Drag task"
              sx={{
                cursor: "grab",
                mt: -0.25,
                color: "text.secondary",
                opacity: 0.85,
                "&:hover": { color: accent, bgcolor: `${accent}14` },
              }}
              {...listeners}
              {...attributes}
            >
              <DragIndicatorIcon fontSize="small" />
            </IconButton>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                sx={{ mb: 0.5 }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  noWrap
                  sx={{ letterSpacing: "-0.01em" }}
                >
                  {task.title}
                </Typography>
                <Chip
                  label={`#${task.id}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 22,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    borderColor: "divider",
                    flexShrink: 0,
                  }}
                />
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.45,
                }}
              >
                {task.description || "—"}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0} sx={{ ml: -0.5 }}>
              {onDuplicate ? (
                <IconButton
                  size="small"
                  aria-label="Duplicate task"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(task);
                  }}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "secondary.main", bgcolor: "action.hover" },
                  }}
                >
                  <ContentCopyOutlinedIcon fontSize="small" />
                </IconButton>
              ) : null}
              <IconButton
                size="small"
                aria-label="Edit"
                onClick={() => onEdit(task)}
                sx={{
                  color: "text.secondary",
                  "&:hover": { color: "primary.main", bgcolor: "action.hover" },
                }}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Delete"
                onClick={() => onDelete(task)}
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    color: "error.main",
                    bgcolor: "error.light",
                    opacity: 0.9,
                  },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
