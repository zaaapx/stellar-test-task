# 007 — «Відгуки наречених» shows photos of other dresses

**Blocking status:** REQUIRES-APPROVAL — content decision for the owner.

## Decision needed before Step 1
The reviews strip (`index.html:536–541`, `.ugc`) shows four photos under a bride-review heading. Two are catalogue shots of J-1165 (Dorotea_(5), Dorotea_(2)), two are other models (Ethereal, Eveil). Presented as brides' photos, this reads as fabricated social proof.
- **Route A — real UGC:** owner supplies 4 photos of real brides in J-1165 (with consent). Swap the four `src` values; keep layout.
- **Route B — honest catalogue:** retitle the strip «Як сукня виглядає в русі» / keep only J-1165 photos (Dorotea_(5), Dorotea_(2), Dorotea_(6), video poster), and move the rating + text reviews into their own row without photos.
Tradeoff: A is stronger social proof but needs assets; B ships now without misleading users.

## Steps (after the owner picks)
- Route A: replace each `<img … src>` inside `.ugc` with the supplied URLs, alt «Наречена в сукні J-1165».
- Route B: replace the Ethereal and Eveil `src` with `Dorotea/Dorotea_(6).jpg?width=600` and the video poster URL (see `photos[5]` in the script); change no other markup.

## Scope bounds
Do not alter review texts or rating numbers in this plan.

## Verification
Every image in `.ugc` shows the J-1165 dress (Route B) or a real bride supplied by the owner (Route A).
