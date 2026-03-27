"use client";

import { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import type { Locale } from "@/i18n/dictionaries";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useSearchStore } from "@/store/searchStore";

type Props = {
  onAddTask: () => void;
  taskCount?: number;
  onExportJson?: () => void;
};

export function KanbanNavbar({
  onAddTask,
  taskCount,
  onExportJson,
}: Props) {
  const search = useSearchStore((s) => s.search);
  const setSearch = useSearchStore((s) => s.setSearch);
  const { mode, toggleColorMode, locale, setLocale, t } = useAppSettings();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchModKey, setSearchModKey] = useState("Ctrl");

  useEffect(() => {
    setSearchModKey(
      typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
        ? "⌘"
        : "Ctrl",
    );
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== "k") return;
      const el = e.target as HTMLElement;
      if (el.closest("input, textarea, [contenteditable=true]")) return;
      e.preventDefault();
      const input = searchInputRef.current;
      if (!input) return;
      input.focus();
      input.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const iconActionSx = {
    border: 1,
    borderColor: "divider",
    borderRadius: 1.5,
    transition: "background-color 0.15s ease, border-color 0.15s ease, transform 0.12s ease",
    "&:hover": {
      bgcolor: (theme: Theme) =>
        alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.12 : 0.08),
      borderColor: "primary.light",
    },
  };

  const rightControls = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={{ xs: 0.75, sm: 1 }}
      sx={{ flexShrink: 0, flexWrap: "nowrap" }}
    >
      {typeof taskCount === "number" ? (
        <Chip
          size="small"
          variant="outlined"
          label={t("nav.tasksChip", { count: taskCount })}
          sx={{
            display: { xs: "none", sm: "flex" },
            fontWeight: 700,
            maxWidth: 128,
            borderColor: "divider",
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.08 : 0.04),
            "& .MuiChip-label": { px: 1 },
          }}
        />
      ) : null}

      <Box
        sx={(theme) => ({
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          flexWrap: "nowrap",
          px: 0.5,
          py: 0.25,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor:
            theme.palette.mode === "dark"
              ? alpha(theme.palette.common.white, 0.04)
              : alpha(theme.palette.primary.main, 0.04),
        })}
      >
        <ToggleButtonGroup
          exclusive
          size="small"
          value={locale}
          onChange={(_, value: Locale | null) => {
            if (value) setLocale(value);
          }}
          aria-label={t("nav.langAria")}
          sx={{
            "& .MuiToggleButtonGroup-grouped": {
              border: 0,
              borderRadius: "8px !important",
              mx: 0.125,
            },
            "& .MuiToggleButton-root": {
              px: 1.1,
              py: 0.4,
              fontWeight: 800,
              fontSize: "0.7rem",
              textTransform: "none",
              border: "none",
              color: "text.secondary",
              "&.Mui-selected": {
                bgcolor: (th) =>
                  alpha(th.palette.primary.main, th.palette.mode === "dark" ? 0.35 : 0.14),
                color: "primary.main",
                fontWeight: 800,
                "&:hover": {
                  bgcolor: (th) =>
                    alpha(th.palette.primary.main, th.palette.mode === "dark" ? 0.42 : 0.2),
                },
              },
            },
          }}
        >
          <ToggleButton value="en" aria-label={t("nav.langEn")} disableRipple>
            EN
          </ToggleButton>
          <ToggleButton value="ar" aria-label={t("nav.langAr")} disableRipple>
            عربي
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ my: 0.5, borderColor: "divider", opacity: 0.9 }}
        />

        <Tooltip title={mode === "dark" ? t("nav.themeLight") : t("nav.themeDark")}>
          <IconButton
            onClick={toggleColorMode}
            aria-label={t("nav.themeAria")}
            color="inherit"
            size="small"
            sx={iconActionSx}
          >
            {mode === "dark" ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        {onExportJson ? (
          <Tooltip title={t("nav.export")}>
            <IconButton
              onClick={onExportJson}
              aria-label={t("nav.exportAria")}
              color="inherit"
              size="small"
              sx={iconActionSx}
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>

      <Divider
        orientation="vertical"
        flexItem
        sx={{ display: { xs: "none", sm: "block" }, my: 0.75, opacity: 0.6 }}
      />

      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Tooltip title={t("nav.newTaskHint")}>
          <span>
            <Button
              variant="contained"
              size="medium"
              startIcon={<AddIcon />}
              onClick={onAddTask}
              sx={{
                px: 2.75,
                py: 1.1,
                borderRadius: 2.5,
                fontWeight: 800,
                letterSpacing: locale === "en" ? "0.01em" : undefined,
                boxShadow: (theme) =>
                  `0 6px 20px ${alpha(theme.palette.primary.main, 0.38)}`,
                whiteSpace: "nowrap",
                transition: "box-shadow 0.2s ease, transform 0.12s ease",
                "&:hover": {
                  boxShadow: (theme) =>
                    `0 10px 26px ${alpha(theme.palette.primary.main, 0.48)}`,
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "translateY(0)" },
              }}
            >
              {t("nav.newTask")}
            </Button>
          </span>
        </Tooltip>
      </Box>

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Tooltip title={t("nav.newTaskHint")}>
          <IconButton
            onClick={onAddTask}
            aria-label={t("nav.addAria")}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              boxShadow: (theme) => `0 4px 14px ${alpha(theme.palette.primary.main, 0.45)}`,
              "&:hover": {
                bgcolor: "primary.dark",
                boxShadow: (theme) => `0 6px 18px ${alpha(theme.palette.primary.main, 0.5)}`,
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Stack>
  );

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={(theme) => ({
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(22, 27, 34, 0.92)"
            : "rgba(255, 255, 255, 0.9)",
        color: theme.palette.text.primary,
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow:
          theme.palette.mode === "dark"
            ? `0 1px 0 ${alpha(theme.palette.common.white, 0.06)} inset`
            : `0 1px 0 ${alpha(theme.palette.common.white, 0.65)} inset, 0 8px 32px -12px ${alpha(theme.palette.common.black, 0.08)}`,
        "& .MuiToolbar-root": {
          color: theme.palette.text.primary,
        },
      })}
    >
      <Container
        maxWidth={false}
        sx={{
          maxWidth: 1800,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: "auto", md: 76 },
            py: { xs: 2, md: 1.75 },
            display: { xs: "flex", md: "grid" },
            flexDirection: { xs: "column" },
            alignItems: { xs: "stretch", md: "center" },
            gridTemplateColumns: { md: "2fr 6fr 2fr" },
            columnGap: { md: 2 },
            rowGap: { xs: 2, md: 0 },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              width: "100%",
              minWidth: 0,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: { xs: 40, sm: 44 },
                height: { xs: 40, sm: 44 },
                borderRadius: 2.5,
                background:
                  "linear-gradient(145deg, #3d5afe 0%, #536dfe 45%, #7c4dff 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow:
                  "0 6px 20px rgba(61, 90, 254, 0.38), 0 1px 0 rgba(255,255,255,0.25) inset",
                flexShrink: 0,
                border: "1px solid",
                borderColor: alpha("#7c4dff", 0.35),
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "scale(1.04)",
                  boxShadow:
                    "0 8px 24px rgba(61, 90, 254, 0.45), 0 1px 0 rgba(255,255,255,0.25) inset",
                },
              }}
            >
              <ViewKanbanIcon sx={{ color: "#fff", fontSize: 24 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 800,
                  letterSpacing: locale === "en" ? "-0.03em" : undefined,
                  lineHeight: 1.15,
                  fontSize: { xs: "1.05rem", sm: "1.2rem" },
                  color: "text.primary",
                }}
              >
                {t("nav.title")}
              </Typography>
              {typeof taskCount === "number" ? (
                <Typography variant="caption" color="text.secondary" display="block">
                  {t("nav.tasksOnBoard", { count: taskCount })}
                </Typography>
              ) : null}
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" }, ml: "auto" }}>
              {rightControls}
            </Box>
          </Stack>

          <Box
            sx={{
              width: "100%",
              minWidth: 0,
              justifySelf: "stretch",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField
              size="small"
              placeholder={t("nav.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label={t("nav.searchAria")}
              inputRef={searchInputRef}
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", md: 400 },
                minWidth: 0,
                "& .MuiOutlinedInput-root": {
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.background.paper, 0.8)
                      : alpha(theme.palette.background.paper, 0.92),
                  borderRadius: 1.75,
                  minHeight: 30,
                  transition: "box-shadow 0.15s ease, border-color 0.15s ease",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: (theme) =>
                      `0 1px 6px ${alpha(theme.palette.primary.main, 0.1)}`,
                  },
                  "&.Mui-focused": {
                    boxShadow: (theme) =>
                      `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                  "& fieldset": {
                    borderWidth: 1,
                    borderColor: (theme) =>
                      alpha(theme.palette.divider, theme.palette.mode === "dark" ? 0.85 : 1),
                  },
                },
                "& .MuiOutlinedInput-input": {
                  py: 0.35,
                  px: 0.2,
                  fontSize: "0.75rem",
                },
                "& .MuiInputAdornment-root": {
                  "&:first-of-type": { ml: 0.6, mr: -0.35 },
                  "&:last-of-type": { ml: -0.35, mr: 0.2 },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 16, opacity: 0.65 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" sx={{ gap: 0.35, mr: 0 }}>
                      {search ? (
                        <IconButton
                          size="small"
                          aria-label={t("nav.clearSearch")}
                          edge="end"
                          onClick={() => setSearch("")}
                          sx={{ p: 0.25 }}
                        >
                          <ClearIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      ) : (
                        <Tooltip title={t("nav.searchShortcutTip", { mod: searchModKey })}>
                          <Box
                            component="span"
                            aria-hidden
                            sx={(theme) => ({
                              display: { xs: "none", sm: "inline-flex" },
                              alignItems: "center",
                              px: 0.5,
                              py: 0.05,
                              borderRadius: 0.75,
                              fontSize: "0.6rem",
                              fontWeight: 700,
                              fontFamily: "inherit",
                              letterSpacing: "0.02em",
                              color: "text.secondary",
                              bgcolor:
                                theme.palette.mode === "dark"
                                  ? alpha(theme.palette.common.white, 0.06)
                                  : alpha(theme.palette.common.black, 0.05),
                              border: "1px solid",
                              borderColor: alpha(theme.palette.divider, 0.9),
                              userSelect: "none",
                            })}
                          >
                            {searchModKey}+K
                          </Box>
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
              alignItems: "center",
              minWidth: 0,
              width: "100%",
            }}
          >
            {rightControls}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
