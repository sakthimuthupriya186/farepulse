# Design Brief

## Direction

FAREPULSE "Flight Deck" — a futuristic aviation + fintech analytics interface that turns fare observations into a live, glassy Base-100 airfare index.

## Tone

Dark-navy avionics command center: deep navy base, electric cyan/blue gradients, glassmorphism surfaces, premium geometric type, and restrained motion that reads as instrument-grade, not toy-like.

## Differentiation

Index numbers and chart lines are set in JetBrains Mono like cockpit readouts, with cyan "flight-path" dash animations and glass panels that make live data feel instrumented and authoritative.

## Color Palette

| Token      | OKLCH (dark)    | Role                          |
| ---------- | --------------- | ----------------------------- |
| background | 0.13 0.02 260   | deep navy base                |
| foreground | 0.95 0.015 240  | primary text                  |
| card       | 0.17 0.025 260  | glass surface                 |
| primary    | 0.72 0.16 230   | electric cyan-blue            |
| accent     | 0.78 0.13 200   | cyan highlight                |
| muted      | 0.22 0.02 260   | secondary surface             |
| success    | 0.62 0.16 150   | index up / healthy feed       |
| warning    | 0.74 0.15 85    | index volatile / caution      |
| destructive| 0.62 0.2 22     | index down / errors           |

## Typography

- Display: Space Grotesk — headings, hero, nav wordmark, stat numerals
- Body: DM Sans — paragraphs, labels, UI copy
- Mono: JetBrains Mono — index values, chart axes, data readouts
- Scale: hero `text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-sm font-semibold tracking-widest uppercase`, body `text-base`

## Elevation & Depth

Glass surfaces (`glass`/`glass-strong`) with subtle `shadow-subtle` resting and `shadow-elevated` on hover; depth comes from layered translucency and cyan glow on interactive elements, not heavy drop shadows.

## Structural Zones

| Zone    | Background           | Border   | Notes                                |
| ------- | -------------------- | -------- | ------------------------------------ |
| Header  | glass (translucent)  | border-b | sticky, blurred over content         |
| Content | bg-background        | —        | alternate bg-muted/30 per section    |
| Footer  | bg-muted/40          | border-t | wordmark + SIH credits + disclaimer  |

## Spacing & Rhythm

Section gaps `py-20 md:py-28`, content max-w `7xl` with `px-6 md:px-10`; cards breathe with `p-6 md:p-8`; micro-spacing on `4px` grid for tight instrument readouts.

## Component Patterns

- Buttons: `rounded-xl`, gradient-primary for primary CTA, glass for secondary, hover lift + glow
- Cards: `rounded-2xl` glass with `border-border/70`, hover `shadow-elevated`
- Badges: `rounded-full` pill, tinted by semantic color (success/warning/destructive)

## Motion

- Entrance: `fade-up` staggered on cards/hero (0.6s cubic-bezier)
- Hover: card lift + glow, button gradient shift (0.3s smooth)
- Decorative: `flight-dash` on chart route lines, `pulse-glow` on live indicator, `float` on hero orbs

## Constraints

- Token-only styling: no raw hex/rgb in components, no arbitrary color classes
- AA+ contrast in both dark and light modes
- Demo data must carry "Demo Data – Replace with permissioned live fare feeds." disclaimer; never claim real-time

## Signature Detail

JetBrains Mono index readouts with a pulsing cyan "LIVE" dot and dashed flight-path chart lines make every metric feel like an instrument on an airfare radar.
