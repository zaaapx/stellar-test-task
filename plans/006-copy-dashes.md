# 006 — Em dashes overused in UI copy

**Blocking status:** none (copy-only, meaning unchanged).

## Problem
H-1 (orange) `index.html:474` — the «Про модель» paragraph uses several em dashes; across the page there are 23. In Ukrainian UI copy most of them read as a generated cadence. Replace the ones that are not true appositions:

| Line | Before | After |
|---|---|---|
| 459 | `Власне виробництво в Чернівцях — без посередників` | `Власне виробництво в Чернівцях, без посередників` |
| 474 | `J-1165 — сукня-русалка з напівпрозорого мережива з бісером.` | `J-1165: сукня-русалка з напівпрозорого мережива з бісером.` |
| 474 | `кріпиться під баскою — на церемонію вона додає` | `кріпиться під баскою: на церемонію вона додає` |
| 506 | `Рукави, верхня спідниця, підгонка — обговорюємо на місці` | `Рукави, верхня спідниця, підгонка: обговорюємо на місці` |
| 565 | `Залиште питання — менеджер зателефонує` | `Залиште питання, і менеджер зателефонує` |
| 595 | `Розкажіть про дату весілля та побажання — стилістка підбере` | `Розкажіть про дату весілля та побажання, і стилістка підбере` |
| 605 | `Jeorjett — виробник весільних суконь з Чернівців.` | `Jeorjett: виробник весільних суконь з Чернівців.` |
| 608 | `Мінімальне замовлення — можна комбінувати моделі` | `Мінімальне замовлення, моделі можна комбінувати` |

Keep: the `<title>` separator, «Розмір відповідає — 92%», aria-labels «— немає в наявності», toast «— додано в обране», gallery alt prefix, and the en dash in ranges (3–7, 34–50).

## Steps
1. Apply each replacement in the table exactly (one occurrence each).

## Scope bounds
Do not rewrite other copy. Do not touch en dashes (–).

## Verification
`grep -o '—' index.html | wc -l` drops from 23 to 15. Read each changed sentence aloud: meaning unchanged.
