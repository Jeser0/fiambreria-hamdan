<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Fiambrería Hamdan — agent guide

This repository is the public website and wholesale-ordering experience for Fiambrería Hamdan in San Miguel de Tucumán, Argentina.

## Product direction

- Preserve the warm, artisanal Hamdan identity: cream, burgundy, cheese-gold and wood/kraft tones.
- Hamdini is the brand mascot. Use it as a guide, not as visual noise.
- The first operational focus is wholesale sales and inquiries.
- Do not invent prices, stock, product availability, opening hours, addresses, phone numbers or payment status.
- Prices and availability must remain explicitly confirmable by Hamdan until an authenticated admin source exists.
- Do not present Google login, Mercado Pago, transfer checkout or customer accounts as functional until real integrations are configured and verified.
- Keep the retail catalog separable from the wholesale catalog so it can be added later without restructuring the whole application.

## Current business data

- Brand: Fiambrería Hamdan
- Since: 1992
- Address: Av. Colón 340, San Miguel de Tucumán
- Local phone: +54 381 255 0960
- Wholesale WhatsApp: +54 381 351 4449
- Hours: Monday–Saturday 09:00–13:30 and 18:00–21:30

If these values need to change, update every affected metadata/contact surface consistently.

## Engineering rules

- Stack: Next.js 16 App Router, React 19, TypeScript and Tailwind CSS 4.
- Prefer small reusable components in `src/components` over growing `page.tsx` files.
- Keep reusable catalog/business data outside UI components.
- Use Server Components by default; add `"use client"` only when interactivity requires it.
- Use `next/link` for internal routes and `next/image` for image assets.
- Maintain mobile responsiveness and keyboard/accessibility semantics.
- Respect `prefers-reduced-motion` for effects.
- Avoid adding a dependency when platform APIs or the existing stack are sufficient.
- Never commit API keys, OAuth secrets, Mercado Pago credentials or private environment values.

## Validation before finishing a change

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

If the execution environment cannot run `next build` because platform binaries cannot be downloaded, report that limitation explicitly; do not treat it as a source-code failure.

## Git conventions

Use focused English Conventional Commit-style messages, for example:

```text
feat: add wholesale catalog filters
fix: correct mobile navigation
style: refine Hamdan action buttons
refactor: centralize business data
docs: update authentication roadmap
```

Do not bundle unrelated visual, authentication and payment changes into one commit.
