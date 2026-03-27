"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import {
  type Locale,
  type MessageKey,
  translate,
} from "@/i18n/dictionaries";

const COLOR_STORAGE_KEY = "kanban-color-mode";
const LOCALE_STORAGE_KEY = "kanban-locale";

type PaletteMode = "light" | "dark";

type AppSettingsValue = {
  mode: PaletteMode;
  toggleColorMode: () => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isRtl: boolean;
  t: (key: MessageKey, vars?: Record<string, string | number>) => string;
};

const AppSettingsContext = createContext<AppSettingsValue | null>(null);

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error("useAppSettings requires AppSettingsProvider");
  }
  return ctx;
}

export function useColorMode() {
  const { mode, toggleColorMode } = useAppSettings();
  return { mode, toggleColorMode };
}

function buildTheme(mode: PaletteMode, locale: Locale) {
  const direction = locale === "ar" ? "rtl" : "ltr";
  const fontStack =
    locale === "ar"
      ? 'var(--font-noto-arabic), var(--font-geist-sans), "Segoe UI", Tahoma, sans-serif'
      : 'var(--font-geist-sans), system-ui, sans-serif';

  return createTheme({
    cssVariables: true,
    direction,
    palette: {
      mode,
      primary: { main: "#3d5afe", light: "#8187ff", dark: "#0031ca" },
      secondary: { main: "#00897b" },
      ...(mode === "light"
        ? {
            background: { default: "#e8eaf0", paper: "#ffffff" },
            divider: "rgba(0, 0, 0, 0.08)",
          }
        : {
            background: { default: "#0d1117", paper: "#161b22" },
            divider: "rgba(255, 255, 255, 0.08)",
          }),
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: fontStack,
      h6: { fontWeight: 700, letterSpacing: locale === "ar" ? undefined : "-0.02em" },
      subtitle2: { fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body:
            mode === "light"
              ? {
                  backgroundImage:
                    "radial-gradient(ellipse 120% 80% at 50% -20%, #c5cae9 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 100% 100%, #b2dfdb33 0%, transparent 45%), linear-gradient(180deg, #e8eaf0 0%, #eceff4 100%)",
                  backgroundAttachment: "fixed",
                  minHeight: "100vh",
                }
              : {
                  backgroundImage:
                    "radial-gradient(ellipse 100% 60% at 50% -10%, #1a237e33 0%, transparent 50%), linear-gradient(180deg, #0d1117 0%, #12171f 100%)",
                  backgroundAttachment: "fixed",
                  minHeight: "100vh",
                },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600, borderRadius: 10 },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
          },
        },
      },
    },
  });
}

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("light");
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const c = window.localStorage.getItem(COLOR_STORAGE_KEY) as PaletteMode | null;
      if (c === "dark" || c === "light") setMode(c);
      const l = window.localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      if (l === "ar" || l === "en") setLocaleState(l);
    } catch {
      //
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(COLOR_STORAGE_KEY, mode);
    } catch {
      //
    }
  }, [mode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      //
    }
  }, [locale]);

  useEffect(() => {
    const isRtl = locale === "ar";
    document.documentElement.lang = locale;
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
  }, [locale]);

  const toggleColorMode = useCallback(() => {
    setMode((m) => (m === "light" ? "dark" : "light"));
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale],
  );

  const theme = useMemo(() => buildTheme(mode, locale), [mode, locale]);

  const isRtl = locale === "ar";

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode,
      locale,
      setLocale,
      isRtl,
      t,
    }),
    [mode, toggleColorMode, locale, setLocale, isRtl, t],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </AppSettingsContext.Provider>
  );
}
