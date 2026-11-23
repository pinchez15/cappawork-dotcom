import type { CSSProperties } from "react"

/** Inline style for the CSS-only load animations (.cw-rise, .cw-line): sets the stagger index. */
export function stagger(i: number): CSSProperties {
  return { "--i": i } as CSSProperties
}
