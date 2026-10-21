# unslop audit — plans

Audit of `index.html` with unslop 1.0.3 (detector `scripts/detect.mjs`, sections B–J, DS).
**Canon: unverified** — the `unslop` MCP canon server (oleg.design) was unreachable from the audit environment, so this is detector findings plus judgement, not a canon-based pass.

## Execution order (design system first)
| # | Plan | Severity | Flags | Status |
|---|---|---|---|---|
| 001 | shadow-tokens | orange (E-3, E-8) | TOUCHES-DS | done |
| 002 | lead-text-class | judgement | TOUCHES-DS | done |
| 003 | main-image-src | red (I-1a) | — | done |
| 004 | reduced-motion | orange (G-9) | — | done |
| 005 | dialog-focus | judgement (a11y) | — | done |
| 006 | copy-dashes | orange (H-1) | — | done |
| 007 | ugc-imagery | judgement | REQUIRES-APPROVAL | blocked on owner |

## Checked and discarded
- J-5 (text <14px): the 12px hits are uppercase tracked labels (`.caps`, calendar weekdays, language trigger) and the 11px favourites counter badge — labels and numerals, not body text.
- B-7 (inline style): swatch colours are product data rendered from the `COLORS` array; not a styling bypass.

## Checked and clean
Colour contrast: body/secondary/muted text ≥ 4.78:1 on white and pink; white on rose buttons 5.79:1. Disabled sizes/slots at 1.9:1 are disabled controls (WCAG exempt). One accent colour, no gradients, no icon-tile feature grids, buttons from one component with consistent radius (0).
