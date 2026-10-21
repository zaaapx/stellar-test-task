# 003 — Main gallery image ships with an empty src

**Blocking status:** none.

## Problem
I-1a (red) `index.html:409`
```html
<img id="mainImg" alt="Весільна сукня J-1165, вид спереду" src="">
```
The hero image (the page's LCP element) has `src=""` until JavaScript runs. With JS slow or failing the first screen shows an empty box; browsers may also request the page URL for an empty src.

## Target
```html
<img id="mainImg" alt="Весільна сукня J-1165, вид спереду" src="https://luce.b-cdn.net/storage/shop/category/JardindeLumiere/Dorotea/Dorotea_(1).jpg?width=1400" width="600" height="900" fetchpriority="high">
```
The URL equals `photos[0].src` in the gallery script, so `show(0)` keeps working unchanged.

## Steps
1. Replace line 409 with the target markup above.

## Scope bounds
Do not touch the gallery script, thumbnails or CSS.

## Verification
- View source: `#mainImg` has a non-empty src.
- With JavaScript disabled the first photo is visible.
- Re-run the detector: no I-1a.
