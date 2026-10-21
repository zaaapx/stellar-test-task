# 004 — Respect prefers-reduced-motion

**Blocking status:** none.

## Problem
G-9 (orange) `index.html` — the page animates the booking drawer (`.drawer` transform .3s), mobile menu (`.mmenu`), dropdowns (`.dd-m`), sticky bar, toast, chevrons and uses `html{scroll-behavior:smooth}`, with no `prefers-reduced-motion` query anywhere.

## Target
Append at the end of the `<style>` block:
```css
@media (prefers-reduced-motion:reduce){
  html{scroll-behavior:auto}
  *,*::before,*::after{transition-duration:.01ms!important;animation-duration:.01ms!important}
}
```
And in the script, the two `scrollIntoView({behavior:'smooth',…})` calls (lead-form scroll) use `behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'`.

## Steps
1. Paste the CSS block immediately before `</style>`.
2. In the `[data-contact]` click handler replace `{behavior:'smooth',block:'center'}` with `{behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'}`.

## Scope bounds
Do not change durations or easings for users without the preference.

## Verification
DevTools → Rendering → emulate `prefers-reduced-motion: reduce`: drawer, menus and toast appear instantly; «Отримати консультацію» jumps without smooth scroll. Without emulation behaviour is unchanged. Detector: no G-9.
