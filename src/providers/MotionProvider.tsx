/**
 * OSL Motion Tokens
 * Animations maintained at:
 * - fast (120ms) — micro-interactions, hover
 * - normal (160ms) — transitions, toggles
 * - slow (240ms) — panels, modals, reveals
 */

export const motion = {
  fast: "120ms",
  normal: "160ms",
  slow: "240ms",
  ease: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

/** Utility to generate CSS transition string */
export function t(property: string, duration: keyof typeof motion = "normal"): string {
  return `${property} ${motion[duration]} ${motion.ease}`;
}
