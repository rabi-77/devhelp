export const theme = {
  colors: {
    primary: {
      main: "#382344",
      light: "#4A3555",
      dark: "#2a1a33",
    },
    background: {
      main: "#ffffff",
      secondary: "#f9fafb",
      tertiary: "#f3f4f6",
    },
    text: {
      primary: "#1f2937",
      secondary: "#6b7280",
      tertiary: "#9ca3af",
    },
    border: {
      light: "#e5e7eb",
      main: "#d1d5db",
      dark: "#9ca3af",
    },
    status: {
      error: "#dc2626",
      errorLight: "#fee2e2",
      errorBorder: "#fecaca",
      success: "#16a34a",
      successLight: "#dcfce7",
      warning: "#f59e0b",
      info: "#3b82f6",
    },
  },
  gradients: {
    primary: "linear-gradient(135deg, #382344 0%, #4A3555 100%)",
    primaryReverse: "linear-gradient(135deg, #4A3555 0%, #382344 100%)",
    subtle: "linear-gradient(to bottom right, #f9fafb, #ffffff)",
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(56, 35, 68, 0.05)",
    md: "0 4px 6px -1px rgba(56, 35, 68, 0.1), 0 2px 4px -1px rgba(56, 35, 68, 0.06)",
    lg: "0 10px 15px -3px rgba(56, 35, 68, 0.1), 0 4px 6px -2px rgba(56, 35, 68, 0.05)",
    xl: "0 20px 25px -5px rgba(56, 35, 68, 0.1), 0 10px 10px -5px rgba(56, 35, 68, 0.04)",
  },
} as const;
export type Theme = typeof theme;
