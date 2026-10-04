# Google indexing and SEO — Fiambrería Hamdan

## Public pages

The Next.js 16 App Router serves three canonical, indexable pages:

- `https://fiambreriahamdan.com/`
- `https://fiambreriahamdan.com/mayorista`
- `https://fiambreriahamdan.com/minorista`

Pizzas, sandwiches, fiambres and cheeses are existing category filters on the stores, not separate routes. History (`/#historia`) and contact (`/#contacto`) are home sections. Their links remain available; fragments and filtered/search variants are not separate sitemap entries. Store variants retain the corresponding store's canonical URL.

`src/data/seo.ts` defines public titles, descriptions, canonical URLs and social metadata. The root title is **Fiambrería Hamdan | Fiambres, Quesos, Pizzas y Sándwiches en Tucumán**. Open Graph and Twitter cards reuse the existing storefront photo, with its actual dimensions and descriptive alternative text. Existing file-based favicon, icon and Apple icon remain in place. Meta keywords are omitted.

## Crawling and internal pages

- `/robots.txt` allows public content, disallows `/admin`, `/api/` and `/pedido`, and advertises the official sitemap.
- `/sitemap.xml` uses `MetadataRoute.Sitemap`, the same public page definitions and daily revalidation. It contains only canonical, indexable pages. It omits `lastModified` because verified content modification timestamps are unavailable.
- Admin and order pages have `noindex, nofollow` metadata. Their layouts clear inherited public canonical and social metadata. Admin login has its own title and description.
- `next.config.ts` adds `X-Robots-Tag: noindex, nofollow` to admin, API and order responses, including existing redirects. Robots directives do not replace the existing authentication controls.
- The existing 404 UI has its own title and description, noindex metadata, and no inherited home canonical.

No new redirects or public routes were added. The existing `/pedido` redirect and admin authentication redirects are preserved.

## Structured data and semantics

One server-rendered JSON-LD graph describes the Store/Organization and WebSite, connected through stable IDs. It reuses the name, official domain, address, local phone, founding year, map URL and opening hours in `src/data/business.ts`, plus the existing logo and storefront photo. Store is a Schema.org LocalBusiness subtype. Serialization escapes `<` before embedding the JSON.

No ratings, reviews, awards, social profiles, geographic coordinates or price range are invented. The public pages retain one main H1 each. Product card titles use H3 under the catalog H2, with the same styling. Managed product images use their product name when the provided alternative text is blank. Cart logic, prices, catalog data, checkout behavior, WhatsApp configuration and Meta Pixel remain unchanged.

## Validation

`npm run lint`, `npx tsc --noEmit` and `npm run build` passed. HTTP and Chrome checks against the production build confirmed:

- Robots and sitemap return HTTP 200 with the expected content types and official URLs.
- Public pages have one title, one description, one H1, their own canonical/social metadata, index/follow directives, valid JSON-LD JSON and working existing icons/images.
- Real store catalogs load, product headings and image alternatives are valid, and private/technical responses carry noindex headers.
- Admin login and both order pages remain excluded; nonexistent routes return HTTP 404.
- Meta Pixel still initializes once with `2142285873032765` and records PageView on initial load, internal links, URL parameter changes and browser back navigation. Browser checks intercept Meta requests to avoid sending test traffic to the real Pixel.
- No JavaScript or hydration errors occurred in the public browser checks.

## Manual Google setup

1. Verify the `fiambreriahamdan.com` domain property in [Google Search Console](https://search.google.com/search-console), preferably through the DNS TXT record supplied by Google. No verification token is invented or added to the repository.
2. Submit `https://fiambreriahamdan.com/sitemap.xml` in the Sitemaps report.
3. Inspect the three public URLs and request indexing after deployment.
4. Check the home page with [Google Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/).
5. Confirm the existing Google Business Profile uses the same name, address, phone and opening hours, and points to the official website. No account or profile changes were made by this task.

Optional verified business data to supply later: official Instagram/Facebook profile URLs (`sameAs`), postal code, exact coordinates and an approved price range. None is required to invent a substitute. Search Console ownership/access is needed to complete submission and inspect Google's indexing status; this implementation does not claim that Google has already indexed the pages.

References: [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business), [site name structured data](https://developers.google.com/search/docs/appearance/site-names).
