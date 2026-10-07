# Design Brief

## Direction

Press & Passage — a print shop's editorial confidence: deep indigo press-ink on warm paper, with a visa-stamp amber accent.

## Tone

Refined editorial/print-workshop: generous whitespace, serif headlines with ink-like weight, restrained decoration that reads as trustworthy and handcrafted rather than corporate-tech.

## Differentiation

Every surface feels like quality stock: warm off-white "paper" backgrounds with a faint grain texture, indigo ink as the dominant voice, and amber used like a rubber stamp — sparing, warm, and deliberate.

## Color Palette

| Token      | OKLCH        | Role                                              |
| ---------- | ------------ | ------------------------------------------------- |
| background | 0.985 0.004 85 | Warm paper off-white — page canvas             |
| foreground | 0.21 0.03 268  | Deep indigo ink — body and headings            |
| card       | 1.0 0.002 85   | Bright card stock — raised content surfaces    |
| primary    | 0.42 0.17 268  | Deep indigo ink — brand, CTAs, nav accents     |
| accent     | 0.74 0.15 68   | Warm amber — promotions, visa stamp, highlights |
| muted      | 0.955 0.006 268 | Soft indigo-tinted wash — section alternation  |
| success    | 0.58 0.15 152  | Booking status: confirmed / completed          |
| warning    | 0.72 0.15 82   | Booking status: pending                        |
| info       | 0.58 0.13 240  | Booking status: in progress                    |
| destructive| 0.55 0.21 25   | Booking status: cancelled, delete actions      |

## Typography

- Display: Fraunces — hero headlines, section headings, card titles, logo wordmark
- Body: Figtree — paragraphs, nav, labels, form text, buttons
- Mono: JetBrains Mono — prices, booking references, contact numbers, status codes
- Scale: hero `text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-5xl font-bold tracking-tight`, label `text-xs sm:text-sm font-semibold tracking-widest uppercase`, body `text-base md:text-lg leading-relaxed`

## Elevation & Depth

Flat paper base with layered card stock: `shadow-subtle` for resting cards, `shadow-elevated` on hover, `shadow-ink` (indigo-tinted) reserved for primary CTAs and the WhatsApp float; depth comes from surface layering, not glow.

## Structural Zones

| Zone    | Background        | Border   | Notes                                                          |
| ------- | ----------------- | -------- | -------------------------------------------------------------- |
| Header  | `bg-card`         | `border-b` | Sticky, subtle shadow on scroll; indigo wordmark + nav links |
| Content | `bg-background`   | —        | Alternate `bg-muted/40` per section; hero uses `bg-gradient-subtle` + `texture-paper` |
| Footer  | `bg-primary`      | `border-t` | Indigo ink block, white text, 3 link columns + contact        |
| Admin   | `bg-muted/40`     | —        | Sidebar `bg-sidebar` with `border-r`; dense, status-driven    |

## Spacing & Rhythm

Mobile-first: sections `py-16 md:py-24`, containers `px-4 sm:px-6 lg:px-8` with `max-w-7xl`; card grids `gap-6 md:gap-8`; micro-spacing on labels `mb-2` and icon-to-text `gap-3`.

## Component Patterns

- Buttons: pill (`rounded-full`), solid indigo primary with `shadow-ink` hover lift; outlined indigo secondary; amber reserved for promo CTAs; WhatsApp green float circle with `pulse-ring`
- Cards: `rounded-2xl`, `bg-card`, `border`, `shadow-subtle` → `shadow-elevated` on hover, `transition-smooth`
- Badges: pill, uppercase `text-xs tracking-wide`; status = success/warning/info/destructive tinted backgrounds; promo = amber accent
- Inputs: `rounded-xl`, `border-input`, `focus-visible:ring-2 ring-ring`; inline error text in `text-destructive`

## Motion

- Entrance: `animate-fade-up` staggered 60ms across hero and card grids (0.5s, ease-out)
- Hover: `transition-smooth` (0.3s) on cards/buttons — lift via shadow + `-translate-y-0.5`
- Decorative: `animate-pulse-ring` on WhatsApp float only; `animate-fade-in` for empty states and toasts

## Constraints

- Mobile-first: every layout must work at 360px before scaling up
- Semantic tokens only — no raw hex, `rgb()`, or arbitrary color classes in components
- Light mode primary (paper/ink); dark mode provided via `.dark` class for admin comfort
- No online payment UI and no email-notification UI (out of scope)
- Do not reserve space or nav for out-of-scope features

## Signature Detail

The "ink & stamp" system — indigo ink as the dominant voice with warm amber used like a rubber stamp on promotions and visa actions, set on a faintly grained paper texture that makes the whole site feel like premium print stock.
