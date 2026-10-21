# 002 — Replace repeated inline lead-paragraph styles with a class

**Blocking status:** TOUCHES-DS (adds a type-scale class). Not REQUIRES-APPROVAL.

## Problem
Judgement (design-system integrity): the 18px lead paragraph is styled inline three times instead of through the type scale. Same value, three instances:
- `index.html:474` `<p class="sec" style="font-size:18px;margin-top:32px">J-1165 — сукня-русалка…`
- `index.html:501` `<p class="sec" style="font-size:18px;margin-top:16px">Примірка безкоштовна…`
- `index.html:605` `<p class="sec" style="font-size:18px;margin-top:16px">Jeorjett — виробник…`

## Target
New rule next to the other type helpers (after `.s{…}` on line ~27):
```css
.lead{font-size:18px;line-height:1.6;margin-top:16px}
```
Markup becomes `<p class="sec lead">…</p>`; the first one keeps its larger gap with `<p class="sec lead" style="margin-top:32px">` removed in favour of `class="sec lead lead-gap"` and `.lead-gap{margin-top:32px}`.
On mobile (`@media (max-width:1100px)`) add `.lead{font-size:16px}`.

## Steps
1. Add `.lead{font-size:18px;line-height:1.6;margin-top:16px}` and `.lead-gap{margin-top:32px}` after the `.s{…}` rule.
2. Line 474: replace `class="sec" style="font-size:18px;margin-top:32px"` with `class="sec lead lead-gap"`.
3. Lines 501 and 605: replace `class="sec" style="font-size:18px;margin-top:16px"` with `class="sec lead"`.
4. Inside `@media (max-width:1100px){…}` add `.lead{font-size:16px}`.

## Scope bounds
Do not change any copy, other inline styles, or `.final .txt p`.

## Verification
- `grep -c 'font-size:18px;margin' index.html` → 0.
- Visually compare «Про модель», «Як проходить примірка», «Оптова співпраця» at 1440px: identical to before. At 375px the three paragraphs are 16px.
