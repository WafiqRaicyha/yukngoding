# YukNgoding — Page Override Specification (SPEC.md Alignment)

> Overrides `design-system/yukngoding/MASTER.md` where SPEC.md defines explicit brand palette, target audience (SMP & SMA learners), and educational simulation rules.

## Resolved Design Tokens

| Token | Value | Purpose |
|-------|-------|---------|
| `--color-background` | `#F8FAFC` | 60% crisp neutral light learning canvas |
| `--color-card` | `#FFFFFF` | 30% clean elevated card surface |
| `--color-border` | `#E2E8F0` | Hairline structural border |
| `--color-brand-deep` | `#1E3A8A` | Deep educational navy |
| `--color-primary` | `#2563EB` | Primary interactive CTA & focus accent |
| `--color-gamify` | `#7C3AED` | XP, Level, and interactive simulation accent |
| `--color-success` | `#10B981` | Completion, correct feedback, TRUE logic state |
| `--color-warning` | `#D97706` | Daily Challenge & intermediate highlight |
| `--color-destructive` | `#DC2626` | Error & reset danger confirmation |

## Typography Override (SMP & SMA Readability)

- **Headings:** `Plus Jakarta Sans` (600–800) with `text-wrap: balance`
- **Body:** `DM Sans` (400–600) at 15–16px (`line-height: 1.6`)
- **Code & Metrics:** `JetBrains Mono` with `font-variant-numeric: tabular-nums`

## Pre-Delivery Accessibility & UX Rules

- Zero emojis as UI icons (use Lucide SVG & custom inline SVG illustrations).
- Visible keyboard focus rings (`focus-visible:ring-2`).
- State never signaled by color alone (always paired with text + SVG icon).
- Two-zone split layout for interactive Canvas/SVG simulations (`60%` stage + `40%` control deck).
- Respect `prefers-reduced-motion` across all transitions and Canvas animations.
