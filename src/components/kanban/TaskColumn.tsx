"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useColumnTasks } from "@/hooks/useColumnTasks";
import { columnMessageKey } from "@/i18n/columnKeys";
import { columnTheme } from "@/lib/kanban/columnTheme";
import type { Task, TaskColumn } from "@/types/task";
import { TaskCard } from "./TaskCard";

const COLUMN_ICONS: Record<TaskColumn, typeof InboxOutlinedIcon> = {
  backlog: InboxOutlinedIcon,
  in_progress: PlayCircleOutlineIcon,
  review: RateReviewOutlinedIcon,
  done: TaskAltOutlinedIcon,
};

type Props = {
  column: Task["column"];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDuplicate?: (task: Task) => void;
  columnDragHandleProps?: Record<string, unknown>;
};

export function TaskColumn({
  column,
  onEdit,
  onDelete,
  onDuplicate,
  columnDragHandleProps,
}: Props) {
  const { t } = useAppSettings();
  const theme = columnTheme[column];
  const ColumnIcon = COLUMN_ICONS[column];
  const columnTitle = t(columnMessageKey[column]);

  const { setNodeRef, isOver } = useDroppable({
    id: `drop-${column}`,
    data: { type: "column" as const, column },
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useColumnTasks(column);

  const tasks = data?.pages.flat() ?? [];
  const Icon = ColumnIcon;

  return (
    <Paper
      ref={setNodeRef}
      elevation={isOver ? 8 : 0}
      sx={{
        flex: 1,
        minWidth: { xs: "100%", sm: 280 },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
        border: "1px solid",
        borderColor: isOver ? theme.accent : "divider",
        bgcolor: isOver ? theme.accentSoft : "background.paper",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease",
        boxShadow: isOver
          ? "0 12px 40px rgba(0,0,0,0.12)"
          : "0 2px 12px rgba(0,0,0,0.06)",
        outline: isOver ? `2px solid ${theme.accent}` : "none",
        outlineOffset: isOver ? 2 : 0,
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.75,
          background: theme.header,
          color: "common.white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          flex={1}
          minWidth={0}
          {...(columnDragHandleProps
            ? {
                ...columnDragHandleProps,
              }
            : {})}
          sx={{
            ...(columnDragHandleProps
              ? {
                  cursor: "grab",
                  touchAction: "none",
                  userSelect: "none",
                  borderRadius: 1,
                  py: 0.25,
                  pr: 0.5,
                  mr: -0.5,
                  "&:active": { cursor: "grabbing" },
                }
              : {}),
          }}
          aria-label={
            columnDragHandleProps
              ? t("column.headerDrag", { name: columnTitle })
              : undefined
          }
        >
          {columnDragHandleProps ? (
            <DragIndicatorIcon
              sx={{ fontSize: 22, opacity: 0.95, flexShrink: 0 }}
            />
          ) : null}
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              bgcolor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 22 }} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={800} letterSpacing="-0.02em">
              {columnTitle}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.92 }}>
              {status === "pending"
                ? t("column.loading")
                : t("column.shown", {
                    n: tasks.length,
                    more: hasNextPage ? "+" : "",
                  })}
            </Typography>
          </Box>
        </Stack>
        <Chip
          size="small"
          label={tasks.length}
          sx={{
            bgcolor: "rgba(255,255,255,0.25)",
            color: "common.white",
            fontWeight: 700,
            "& .MuiChip-label": { px: 1 },
          }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 320,
          p: 1.75,
          display: "flex",
          flexDirection: "column",
          gap: 1.25,
          overflow: "auto",
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 4,
            bgcolor: "action.disabledBackground",
          },
        }}
      >
        {status === "pending" && (
          <Stack spacing={1.25} sx={{ py: 1 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={88}
                sx={{ borderRadius: 2, bgcolor: "action.hover" }}
              />
            ))}
          </Stack>
        )}
        {status === "error" && (
          <Box
            sx={{
              py: 3,
              px: 2,
              borderRadius: 2,
              bgcolor: "error.light",
              color: "error.dark",
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              {error instanceof Error ? error.message : t("column.errorLoad")}
            </Typography>
          </Box>
        )}
        {status === "success" && tasks.length === 0 && (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ py: 5, px: 2, textAlign: "center" }}
          >
            <InboxOutlinedIcon
              sx={{ fontSize: 48, color: "action.disabled", opacity: 0.6 }}
            />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {t("column.emptyTitle")}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("column.emptySubtitle")}
            </Typography>
          </Stack>
        )}
        <Stack spacing={1.25}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </Stack>
        {hasNextPage && (
          <Button
            fullWidth
            variant="outlined"
            size="medium"
            sx={{
              mt: 0.5,
              borderColor: theme.accent,
              color: theme.accent,
              "&:hover": {
                borderColor: theme.accent,
                bgcolor: theme.accentSoft,
              },
            }}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? (
              <CircularProgress size={20} sx={{ color: theme.accent }} />
            ) : (
              t("column.loadMore")
            )}
          </Button>
        )}
      </Box>
    </Paper>
  );
}
