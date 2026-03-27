"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { useAppSettings } from "@/context/AppSettingsContext";
import type { Task } from "@/types/task";

type Props = {
  task: Task | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteTaskDialog({
  task,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  const { t } = useAppSettings();

  return (
    <Dialog
      open={Boolean(task)}
      onClose={() => {
        if (!isDeleting) onClose();
      }}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3 } },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <WarningAmberOutlinedIcon color="warning" />
        {t("dialog.delete.title")}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" component="span">
          {t("dialog.delete.bodyBefore")}{" "}
          <Box component="span" fontWeight={700} color="text.primary">
            {task?.title}
          </Box>{" "}
          {t("dialog.delete.bodyAfter")}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} disabled={isDeleting} color="inherit">
          {t("dialog.delete.cancel")}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? t("dialog.delete.deleting") : t("dialog.delete.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
