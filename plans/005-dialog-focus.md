# 005 — Keyboard focus escapes the booking drawer and mobile menu

**Blocking status:** none.

## Problem
Judgement (accessibility). `#drawer` is `role="dialog" aria-modal="true"`, and `#mmenu` covers the whole screen, but neither keeps Tab focus inside: Tab from the last control moves into the page behind the overlay. `#mmenu` also does not close on Escape and does not return focus to the burger.

## Target
A shared trap helper in the script, used by both panels:
```js
function trap(panel,e){if(e.key!=='Tab')return;const f=[...panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea,[tabindex="0"]')].filter(x=>x.offsetParent!==null);if(!f.length)return;const a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}
drawer.addEventListener('keydown',e=>trap(drawer,e));
mmenu.addEventListener('keydown',e=>{trap(mmenu,e);if(e.key==='Escape')document.getElementById('mmClose').click();});
```
Mobile menu open/close: after opening, focus `#mmClose`; after closing, focus `.burger`.

## Steps
1. Add the `trap` function and the two listeners after the `mmenu` setup in the «dropdowns & mobile menu» script section.
2. In the burger `onclick` add `setTimeout(()=>document.getElementById('mmClose').focus(),300);`.
3. In the `#mmClose` `onclick` add `document.querySelector('.burger').focus();`.

## Scope bounds
Do not change drawer step logic, styles or the dropdown behaviour.

## Verification
Keyboard only: open «Записатися на примірку», Tab through every control — focus cycles inside the drawer; Shift+Tab from the first control goes to the last. At 375px open the menu: Tab cycles inside, Esc closes it and focus lands on the burger.
