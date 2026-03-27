"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { InfiniteData } from "@tanstack/react-query";
import {
  Alert,
  Box,
  Container,
  Snackbar,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  kanbanCollisionDetection,
  persistColumnOrder,
  readStoredColumnOrder,
} from "@/lib/kanban";
import {
  createTask,
  deleteTask,
  fetchTasksForExport,
  updateTask,
} from "@/lib/api";
import { useTaskStats } from "@/hooks/useTaskStats";
import { COLUMNS, type Task, type TaskColumn } from "@/types/task";
import { useAppSettings } from "@/context/AppSettingsContext";
import { DeleteTaskDialog } from "./DeleteTaskDialog";
import { KanbanNavbar } from "./KanbanNavbar";
import { SortableColumnShell } from "./SortableColumnShell";
import { TaskCard } from "./TaskCard";
import { TaskDialog } from "./TaskDialog";

export function KanbanBoard() {
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isRowLayout = useMediaQuery(theme.breakpoints.up("lg"));
  const { data: stats } = useTaskStats();
  const { t } = useAppSettings();

  const [columnOrder, setColumnOrder] = useState<TaskColumn[]>(() => [
    ...COLUMNS,
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [editing, setEditing] = useState<Task | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  const showToast = useCallback(
    (message: string, severity: "success" | "error" = "success") => {
      setSnack({ open: true, message, severity });
    },
    [],
  );

  const closeSnack = useCallback(() => {
    setSnack((s) => ({ ...s, open: false }));
  }, []);

  useEffect(() => {
    setColumnOrder(readStoredColumnOrder());
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "n") return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, [contenteditable=true]")) return;
      e.preventDefault();
      setDialogMode("create");
      setEditing(null);
      setDialogOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const invalidateTasks = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["tasks"] });
    void queryClient.invalidateQueries({ queryKey: ["task-stats"] });
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: invalidateTasks,
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: number;
      patch: Partial<Pick<Task, "title" | "description" | "column">>;
    }) => updateTask(id, patch),
    onSuccess: invalidateTasks,
    onError: () => showToast(t("toast.updateFailed"), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      invalidateTasks();
      showToast(t("toast.taskDeleted"));
    },
    onError: () => showToast(t("toast.deleteFailed"), "error"),
  });

  function handleEdit(task: Task) {
    setDialogMode("edit");
    setEditing(task);
    setDialogOpen(true);
  }

  function handleDeleteRequest(task: Task) {
    setDeleteTarget(task);
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  function handleDuplicate(task: Task) {
    createMutation.mutate(
      {
        title: `${task.title} (copy)`,
        description: task.description,
        column: task.column,
      },
      {
        onSuccess: () => showToast(t("toast.duplicated")),
      },
    );
  }

  async function handleExportJson() {
    try {
      const tasks = await fetchTasksForExport();
      const blob = new Blob([JSON.stringify(tasks, null, 2)], {
        type: "application/json",
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `kanban-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      showToast(t("toast.exportStarted"));
    } catch {
      showToast(t("toast.exportFailed"), "error");
    }
  }

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "column-reorder") {
      setActiveTask(null);
      return;
    }
    const id = Number(event.active.id);
    if (!Number.isFinite(id)) {
      setActiveTask(null);
      return;
    }
    const queries = queryClient
      .getQueryCache()
      .findAll({ queryKey: ["tasks"] });
    for (const q of queries) {
      const data = q.state.data as InfiniteData<Task[]> | undefined;
      if (!data?.pages) continue;
      const found = data.pages.flat().find((t) => t.id === id);
      if (found) {
        setActiveTask(found);
        return;
      }
    }
    setActiveTask(null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data.current as
      | { type?: string; column?: TaskColumn }
      | undefined;

    if (activeData?.type === "column-reorder") {
      if (active.id !== over.id) {
        setColumnOrder((order) => {
          const oldIndex = order.indexOf(active.id as TaskColumn);
          const newIndex = order.indexOf(over.id as TaskColumn);
          if (oldIndex < 0 || newIndex < 0) return order;
          const next = arrayMove(order, oldIndex, newIndex);
          persistColumnOrder(next);
          return next;
        });
      }
      return;
    }

    if (activeData?.type !== "task") return;

    const taskId = Number(active.id);
    if (!Number.isFinite(taskId)) return;

    const overData = over.data.current as
      | { type?: string; column?: TaskColumn }
      | undefined;

    let targetColumn: TaskColumn | undefined;
    if (overData?.type === "column" && overData.column) {
      targetColumn = overData.column;
    } else if (overData?.type === "task" && overData.column) {
      targetColumn = overData.column;
    }

    if (!targetColumn || activeData.column === targetColumn) return;

    updateMutation.mutate({ id: taskId, patch: { column: targetColumn } });
  }

  async function handleDialogSubmit(
    values: Omit<Task, "id"> & { id?: number },
  ) {
    try {
      if (values.id != null) {
        await updateMutation.mutateAsync({
          id: values.id,
          patch: {
            title: values.title,
            description: values.description,
            column: values.column,
          },
        });
        showToast(t("toast.taskUpdated"));
      } else {
        await createMutation.mutateAsync({
          title: values.title,
          description: values.description,
          column: values.column,
        });
        showToast(t("toast.taskCreated"));
      }
    } catch {
      showToast(t("toast.saveFailed"), "error");
    }
  }

  function openCreateTask() {
    setDialogMode("create");
    setEditing(null);
    setDialogOpen(true);
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <KanbanNavbar
        onAddTask={openCreateTask}
        taskCount={stats?.total}
        onExportJson={handleExportJson}
      />

      <Container
        maxWidth={false}
        sx={{
          py: { xs: 2, sm: 3 },
          px: { xs: 1.5, sm: 3 },
          flex: 1,
          maxWidth: 1800,
          mx: "auto",
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={kanbanCollisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={columnOrder}
            strategy={
              isRowLayout
                ? horizontalListSortingStrategy
                : verticalListSortingStrategy
            }
          >
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2.5}
              alignItems="stretch"
              justifyContent="center"
            >
              {columnOrder.map((col) => (
                <SortableColumnShell
                  key={col}
                  column={col}
                  onEdit={handleEdit}
                  onDelete={handleDeleteRequest}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </Stack>
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <Box
                sx={{
                  width: { xs: "min(100vw - 32px, 320px)", sm: 320 },
                  opacity: 0.98,
                  boxShadow: 12,
                  borderRadius: 2,
                  rotate: "2deg",
                }}
              >
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Container>

      <TaskDialog
        open={dialogOpen}
        mode={dialogMode}
        initial={editing}
        defaultColumn="backlog"
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />

      <DeleteTaskDialog
        task={deleteTarget}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeSnack}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
