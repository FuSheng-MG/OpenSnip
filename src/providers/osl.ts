/**
 * OpenSnip Design Language (OSL) Tokens
 * Single source of truth for all visual properties.
 *
 * Usage:
 *   import { colors, space, radius, shadow, font, z } from "@/providers/osl";
 */

// ─── Color Palette ───────────────────────────────
export const colors = {
  // Dark theme base
  dark: {
    bg: "#0b0d11",
    surface: "rgba(255,255,255,0.04)",
    surfaceHover: "rgba(255,255,255,0.06)",
    surfaceActive: "rgba(255,255,255,0.08)",
    border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(255,255,255,0.10)",
    text: "rgba(255,255,255,0.90)",
    textMuted: "rgba(255,255,255,0.45)",
    textFaint: "rgba(255,255,255,0.25)",
  },
  // Light theme base
  light: {
    bg: "#f7f7f8",
    surface: "rgba(0,0,0,0.02)",
    surfaceHover: "rgba(0,0,0,0.04)",
    surfaceActive: "rgba(0,0,0,0.06)",
    border: "rgba(0,0,0,0.06)",
    borderHover: "rgba(0,0,0,0.10)",
    text: "rgba(0,0,0,0.88)",
    textMuted: "rgba(0,0,0,0.45)",
    textFaint: "rgba(0,0,0,0.22)",
  },
  // Semantic
  blue:  { 400: "#60a5fa", 500: "#3b82f6", 600: "#2563eb" },
  green: { 400: "#4ade80", 500: "#22c55e", 600: "#16a34a" },
  red:   { 400: "#f87171", 500: "#ef4444", 600: "#dc2626" },
  amber: { 400: "#fbbf24", 500: "#f59e0b" },
} as const;

// ─── Spacing ─────────────────────────────────────
export const space = {
  0:   "0px",
  1:   "4px",
  2:   "8px",
  3:  "12px",
  4:  "16px",
  5:  "20px",
  6:  "24px",
  8:  "32px",
 10:  "40px",
 12:  "48px",
 16:  "64px",
} as const;

// ─── Border Radius ───────────────────────────────
export const radius = {
  sm:   "8px",
  md:  "12px",
  lg:  "16px",
  xl:  "20px",
  "2xl":"24px",
  full:"9999px",
} as const;

// ─── Shadows ─────────────────────────────────────
export const shadow = {
  soft:    "0 2px 8px rgba(0,0,0,0.08)",
  medium:  "0 4px 16px rgba(0,0,0,0.12)",
  floating:"0 8px 30px rgba(0,0,0,0.18)",
  overlay: "0 12px 48px rgba(0,0,0,0.25)",
  glow:    "0 0 12px rgba(59,130,246,0.3)",
} as const;

// ─── Typography ──────────────────────────────────
export const font = {
  size: {
    xs:   "11px",
    sm:   "13px",
    base: "15px",
    lg:   "18px",
    xl:   "22px",
    "2xl":"28px",
  },
  weight: {
    normal: "400",
    medium: "500",
    semibold:"600",
    bold:   "700",
  },
  leading: {
    tight:  "1.25",
    normal: "1.5",
    relaxed:"1.75",
  },
  tracking: {
    tight:  "-0.01em",
    normal: "0",
    wide:   "0.02em",
  },
  family: {
    sans: `"Inter", "Segoe UI", system-ui, -apple-system, sans-serif`,
    mono: `"JetBrains Mono", "Cascadia Code", "Fira Code", monospace`,
  },
} as const;

// ─── Z-Index Layers ──────────────────────────────
export const z = {
  base:     0,
  dropdown: 10,
  sticky:   20,
  panel:    30,
  overlay:  50,
  modal:    70,
  toast:    90,
  palette:  100,
} as const;

// ─── Motion ──────────────────────────────────────
export const motion = {
  fast:   "120ms",
  normal: "160ms",
  slow:   "240ms",
  ease:   "cubic-bezier(0.2, 0.8, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut:"cubic-bezier(0, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

/** CSS transition helper */
export function tr(prop = "all", dur: keyof typeof motion = "normal"): string {
  return `${prop} ${motion[dur]} ${motion.ease}`;
}
