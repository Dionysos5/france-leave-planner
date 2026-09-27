# France Leave Planner

Plan your leave days visually — paint CP, RTT, unpaid and sick days onto a year calendar and watch your balances update as you go. Work-from-home days can be marked too; they never change a balance.

Built for one profile: a **cadre au forfait jours (218 days) under the Syntec agreement (IDCC 1486), France métropolitaine**.

## Features

- **Visual planning** — click or drag days to paint leave; weekends and public holidays are handled automatically
- **Syntec rules built in** — CP earned June 1 – May 31 (25 jours ouvrés) with N-1 days lost after May 31; RTT computed each year from the forfait (e.g. 9 in 2026, 11 in 2027), earned in twelfths each month and lost after December 31
- **Absences** — unpaid leave reduces CP and RTT accrual in proportion; sick leave still earns 80% of CP
- **Balance checkpoints** — copy CP N-1, CP N and RTT from a payslip at any date; the projection corrects itself from there and carries over across years
- **Any year** — public holidays (including the Easter-based ones) are generated for the year you're viewing
- **Bilingual** — French and English UI
- **Local-first** — your plan stays in your browser; older saved formats migrate automatically

## Keyboard shortcuts

| Key | Action |
| --- | ------ |
| 1 | CP tool |
| 2 | RTT tool |
| 3 | Unpaid tool |
| 4 | Sick tool |
| 5 | Eraser |
| 6 | Work from home |

Shortcuts use physical key positions, so they work on AZERTY keyboards without Shift.

On a touch screen, tap a day to paint it, or long-press and drag to paint a range.

## Development

```bash
bun install
bun run dev      # dev server
bun run test     # unit tests
bun run check    # lint + format check
bun run build    # production build
```

Built with React, TypeScript, Tailwind CSS, Radix UI and date-fns.
