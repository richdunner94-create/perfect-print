# Project Guidance

## User Preferences

- Professional, clean visual design
- Fully mobile responsive layout
- Simple, easy-to-navigate structure
- Installable PWA with manifest and app icon
- WhatsApp contact via wa.me/241777913361
- All public content is admin-managed, never hardcoded

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- Internet Identity login() must be called synchronously inside a real click handler; a form onSubmit or any await before it blocks the signer window with 'Signer window should not be opened outside of click handler'.
- Admin gating uses the backend's isCallerAdmin() via React Query; the admin password field is a UX gate, not the security boundary.
- The sonner <Toaster /> must be rendered in main.tsx inside the provider tree, or every toast call is silently dropped.
- OKLCH CSS variables in index.css only produce Tailwind utilities when their names are registered in tailwind.config.js theme.extend.colors.
- Motoko has no triple-quoted strings; author long static text as concatenated escaped single-line literals.
- With Enhanced Migration check-limit=1, a fresh project must have exactly one pending migration; fold new stable state into the init migration rather than adding a second timestamped file.
- OQL entities for records with ?Text or variant fields need .toEntityManual<K,V> with explicit payload converters; auto-derivation only handles all-primitive records.
- A Map keyed on a custom variant type needs a compare function in that type's own module so the implicit compare resolves at every call site.
- Motoko Time.now() values are nanosecond bigints; route every timestamp through a formatting helper before any Date formatting.
- PWA installability needs both 192x192 and 512x512 icon entries whose declared sizes match the real PNG dimensions, plus apple-mobile-web-app meta tags alongside the manifest link.
