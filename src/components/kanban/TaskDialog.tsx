"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { useAppSettings } from "@/context/AppSettingsContext";
import { columnMessageKey } from "@/i18n/columnKeys";
import { COLUMNS, type Task, type TaskColumn } from "@/types/task";

type Mode = "create" | "edit";

type Props = {
  open: boolean;
  mode: Mode;
  initial?: Task | null;
  defaultColumn?: TaskColumn;
  onClose: () => void;
  onSubmit: (values: Omit<Task, "id"> & { id?: number }) => Promise<void>;
};

export function TaskDialog({
  open,
  mode,
  initial,
  defaultColumn = "backlog",
  onClose,
  onSubmit,
}: Props) {
  const { t } = useAppSettings();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<TaskColumn>(defaultColumn);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      setTitle(initial.title);
      setDescription(initial.description);
      setColumn(initial.column);
    } else {
      setTitle("");
      setDescription("");
      setColumn(defaultColumn);
    }
  }, [open, mode, initial, defaultColumn]);

  async function handleSave() {
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        id: initial?.id,
        title: title.trim(),
        description: description.trim(),
        column,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          elevation: 12,
          sx: { borderRadius: 3, overflow: "hidden" },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          py: 2.5,
          px: 3,
          background: "linear-gradient(135deg, #3d5afe08 0%, #7c4dff0d 100%)",
        }}
      >
        <AssignmentOutlinedIcon color="primary" />
        <Box>
          <Typography variant="h6" component="span" fontWeight={800}>
            {mode === "create"
              ? t("dialog.task.newTitle")
              : t("dialog.task.editTitle")}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {mode === "create"
              ? t("dialog.task.newSubtitle")
              : t("dialog.task.editSubtitle")}
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
        <Stack spacing={2.5}>
          <TextField
            label={t("dialog.task.titleLabel")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            autoFocus
            variant="outlined"
          />
          <TextField
            label={t("dialog.task.descLabel")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
            placeholder={t("dialog.task.descPlaceholder")}
          />
          <TextField
            select
            label={t("dialog.task.columnLabel")}
            value={column}
            onChange={(e) => setColumn(e.target.value as TaskColumn)}
            fullWidth
          >
            {COLUMNS.map((c) => (
              <MenuItem key={c} value={c}>
                {t(columnMessageKey[c])}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2.5, bgcolor: "grey.50", gap: 1 }}>
        <Button onClick={onClose} color="inherit">
          {t("dialog.task.cancel")}
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={!title.trim() || saving}
          sx={{ minWidth: 120, borderRadius: 2 }}
        >
          {saving
            ? t("dialog.task.saving")
            : mode === "create"
              ? t("dialog.task.create")
              : t("dialog.task.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
