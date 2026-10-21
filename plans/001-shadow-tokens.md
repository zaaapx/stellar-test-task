# 001 — Shadow tokens; drop border+diffuse-shadow combo on dropdown

**Blocking status:** TOUCHES-DS (adds tokens to `:root` in `index.html`). Not REQUIRES-APPROVAL.

## Problem
- E-3 (orange) `index.html:249` — `.dd-m` has `border:1px solid var(--border)` **and** `box-shadow:0 12px 32px rgba(43,34,38,.08)`: hairline border plus wide diffuse shadow on one surface.
- E-8 (orange) `index.html:249` and `index.html:340` — two ad-hoc shadows outside any surface system:
  - `.dd-m { box-shadow:0 12px 32px rgba(43,34,38,.08) }`
  - `.sticky { box-shadow:0 -4px 20px rgba(43,34,38,.12) }`
Detector: unslop 1.0.3 `scripts/detect.mjs`. Canon: **unverified** (MCP canon server unreachable from the audit environment).

## Target
Add two tokens to `:root` (line 12–16) and use them; the dropdown keeps the hairline border and gets a tight shadow only.
```css
--shadow-pop:0 4px 12px rgba(43,34,38,.06);
--shadow-bar:0 -4px 20px rgba(43,34,38,.12);
```
- `.dd-m` → `box-shadow:var(--shadow-pop)` (border unchanged)
- `.sticky` → `box-shadow:var(--shadow-bar)`

## Repo conventions
Colour tokens already live in `:root` as `--name:value;` pairs separated by spaces, e.g. `--border:#EED9DF; --strong:#A3475F;` (line 15). Follow the same style.

## Steps
1. In `index.html`, inside the `:root{…}` block, after `--success:#3F7A55;` append `--shadow-pop:0 4px 12px rgba(43,34,38,.06); --shadow-bar:0 -4px 20px rgba(43,34,38,.12);`.
2. In the `.dd-m{…}` rule replace `box-shadow:0 12px 32px rgba(43,34,38,.08)` with `box-shadow:var(--shadow-pop)`.
3. In the `.sticky{…}` rule (inside `@media (max-width:1100px)`) replace `box-shadow:0 -4px 20px rgba(43,34,38,.12)` with `box-shadow:var(--shadow-bar)`.

## Scope bounds
Do not touch any other rule, colour, border or z-index. Do not add shadows elsewhere.

## Verification
- `grep -n "box-shadow" index.html` returns only the two `var(--shadow-…)` uses.
- Open the page at 1440px, hover «Весільні сукні»: menu shows border and a barely visible shadow. At 375px scroll past the main CTA: sticky bar shadow unchanged.
- Re-run `node scripts/detect.mjs <repo>`: no E-3 / E-8.
