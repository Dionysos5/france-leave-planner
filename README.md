# France Leave Planner

Plan your French leave days visually — paint CP, RTT and unpaid days onto a year calendar and watch your balances update as you go.

## Features

- **Visual planning** — click or drag days to paint leave; weekends and public holidays are handled automatically
- **Balance checkpoints** — enter a balance you know from your HR portal at any date; the projection corrects itself from there
- **Any year** — public holidays (including the Easter-based ones) are generated for the year you're viewing
- **Balance projections** — monthly CP/RTT ledger with the year-end reference labeled in the header
- **Bilingual** — French and English UI
- **Local-first** — your plan stays in your browser; older saved formats migrate automatically

## Keyboard shortcuts

| Key | Action |
| --- | ------ |
| 1 | CP tool |
| 2 | RTT tool |
| 3 | Unpaid tool |
| 4 | Eraser |

Shortcuts use physical key positions, so they work on AZERTY keyboards without Shift.

## Development

```bash
bun install
bun run dev      # dev server
bun run test     # unit tests
bun run check    # lint + format check
bun run build    # production build
```

Built with React, TypeScript, Tailwind CSS, Radix UI and date-fns.
