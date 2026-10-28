# Journal — fairtrade.net replica

## Extract — 9 planned pages captured live, screenshots retaken with fine scroll (2026-10-28)

- `crawl.mjs --pages <9 urls> --dynamics` → 9/9 live (Playwright provenance on every record). Slugs aligned to the site-plan slugs.
- Vision check: 4 ok, 5 recaptured. Cause: the site's `content-fader` reveals sections (`[data-module~=content-fader]>*` → `.is-visible`) only as they scroll into view; the crawler's 4-step scroll left them at opacity 0. Usercentrics consent overlay on the Produktfinder page. Ground-truth screenshots retaken at 1440 with ≤500 px scroll steps and consent accepted (`[data-testid=uc-accept-all-button]`).
- Fonts: Alegreya Sans (headings, 900) + Exo 2 (body, variable 100–900) — both SIL OFL, self-hosted from the site's clientlib; 32 woff2 files under `current/assets/fonts/`.
- Page types: landing (en, de-de, ch-de), static (key-benefits), listing (products, press-centre), program (cocoa), search (search-results, produktfinder) → 5 archetypes.
- Census at 1440 + 360, cap-probe on the 5 archetypes (content cap 1920, shell fluid on some archetypes), header contract via chrome-explore (root `.Topbar`).
- Capture gaps: no locale root recognised (`/en.html`, `/de-de.html` paths) — scope is fixed by the site plan.

## Preserve-direction — current spec promoted verbatim, empty register, dynamics triaged (2026-10-28)

- PRODUCT.md / DESIGN.md / DESIGN.json promoted byte-for-byte from `stardust/current/`; `stardust/direction.md` records preserve mode.
- Inconsistency register empty — pure replica (cap-probe's shell-width divergence noted as informational).
- Dynamics: 27 findings → 13 curated rows in `stardust/dynamic-features.md`, every row with a disposition, nothing decided-out. Search probe "coffee" recorded (49 results, top 3 titles).
- Martech: GTM + Usercentrics (via GTM) carried over in `stardust/martech-contract.json`, every part disabled; hand-off note names the Usercentrics settings ids.

## Recreate — five archetypes re-authored on a shared canon (2026-10-28)

- landing `en` first: canon.css (fonts, tokens, header with mega menu/search/locale/drawer, footer, fade-in, PageLead, Breadcrumbs) + en.css; then static (key-benefits), listing (Fairtrade products), program (cocoa), search (search-results?q=coffee) built cumulatively on canon — each prototype generated from captured content by templated generators (stardust/.work/assemble-*.cjs), values lifted from site.css.
- Interaction parity per archetype (motion-observe/compare): header contract behaviours, hero carousel, accordion, fade-in, card hovers, search clear; header scroll morph dead on live.

## Source-fidelity gate — 5/5 archetypes pass at 1440 and 360 (2026-10-28)

- 1440 / 360 pixel: en 0.20 / 0.64 · key-benefits 0.22 / 0.44 · products 0.71 / 0.89 · cocoa 0.22 / 0.48 · search 0.22 / 0.46; Δh 0 everywhere; content-diff 0 🔴; clip 0; overflow ok; cap-probe PASS ×5.
- Prototype tables `gates/prototypes-1440` 5/5 PASS, `prototypes-360` 4/5 + 1 override (search: 5 `<mark>`s cut by the source's own 2-line clamp, identical on live).
- Instrument trap: unit-geometry's live cache `stardust/current/measure/<slug>-units.json` is width-blind — running two widths concurrently (or back to back) cross-reads it. Clear the cache between widths.

## Plan — migrate plan for the 9 planned pages (2026-10-28)

- Path A (approved archetypes) 5: en, key-benefits, Fairtrade products, cocoa, search-results. Path A′ siblings 4: de-de + ch-de (landing), Press-centre (listing), Produktfinder (search). Path B 0. Page map 9 entries, 0 collisions.
- Siblings render only after their archetype is live and gated on the preview origin (C-archetype units). Units in stardust/migrate/progress.json.

## A-inventory — 9 coverage rows, DA coordinates filled (2026-10-28)

- inventory.mjs --state: 9 pages (5 archetypes pending, 4 siblings content-pending). DA aemcoder/bdafc086 ref main; preview main--bdafc086--aemcoder.aem.page, live .aem.live.

## B-block — 8 distinct blocks, one conversion point each (2026-10-28)

- page-lead, text-image, cta-section, number-fact-teaser, teaser-grid, accordion, page-hero-carousel, search; 15 instances → 8 conversions. Header/footer are foundation (C0), not plan rows.

## B2-dynamic — inventory re-verified against fresh evidence, no new rows (2026-10-28)

- dynamics-detect on the 5 archetypes (fresh): 14 findings / 18 plan rows — a strict subset of the Phase 2 evidence (6 pages, 27 findings); the fresh draft is kept at stardust/.work/dynamics/b2-fresh-plan.md, the richer Phase 2 evidence and the martech contract (2 GTM containers, all parts disabled) stay as recorded.
- Target probe: /libs/granite/csrf/token.json host-bound (404 on target) — already dispositioned (AEM author CSRF, not needed on EDS). stardust/dynamic-features.md: 13 rows, every row dispositioned.

## C-deliver — 9/9 pages delivered and gated on the published origin (2026-10-28)
- Units: foundation, 5 archetype units, 3 sibling clusters (landing, listing, search), gate-all, final — all `done` in stardust/rollout/progress.json.
- C-final: foundation-freeze check clean; foundation-requests.md applied once (heading margin collapse → styles.css; linked footer column title for /ch-de), two requests declined with reasons recorded there (header scroll-state root, breadcrumbs in header).
- gate-all ran after the C-final edits (EDS captures re-taken), 9/9 delivered at 1440 and 360; documented overrides: /ch-de Δh @1440 (live header scroll-arrow overflow), Produktfinder (live catalogue drift).
- update-coverage --gate at both widths: 9/9 rows matched, all gate.pass true.

## Render — 5 archetypes and 4 siblings rendered, all delivered (2026-10-28)
- Units archetypes, landing, listing, search done in stardust/migrate/progress.json; each sibling cluster rendered after its archetype unit was live and gated.
- Report: 9/9 pages rendered and delivered; stardust/state.json advanced 9/9 to migrated through state.mjs.

## D-site — redirects sheet live, root answers, served sitemap = 9 pages (2026-10-28)
- Source root `https://www.fairtrade.net/` answers 302 (→ /us-en.html, out of scope), so the redirects sheet carries `/` and `/index.html` → `/en`, plus every `.html` source path from stardust/redirects.tsv → its delivered path (11 rows). PUT to DA `/redirects.json`, preview 200, live 200; `/` → `/en` 200 on aem.page and aem.live.
- Chrome documents (/nav, /footer, /de-de/*, /ch-de/*) already carry `Robots | noindex`.
- Coverage fix: inventory.mjs records the migrated tree's source-shaped path (`/en/products/Fairtrade_products`) while deploy delivers the eds-path normalised one (`/en/products/fairtrade-products`); 4 rows corrected to the delivered path (taken from `delivery.deployedUrl`), which also clears done-check's `pages_not_live:4`. Do NOT re-run inventory.mjs (it would restore the source-shaped paths).
- `assemble.mjs --verify-origin https://main--bdafc086--aemcoder.aem.live`: served 9 = assembled 9, exit 0.

## D2-dynamic — 9/9 parity checks pass on the live origin (2026-10-28)
- stardust/dynamics/parity.json written from the curated rows (header, search, product finder, teasers, page errors; martech added from the contract).
- dynamics-check --origin aem.live: exit 0 — search "coffee" 49 results = source 49, top titles match; Produktfinder 24 cards; header controls present; 0 page errors on 9 pages; martech gate: no tag host requested (all contract parts disabled).
- Search and product finder are interim widgets over captured snapshots (owner decisions S and L stay open); no query-index needed.

## E-full-site — 9/9 verified on the live origin (2026-10-28)
- verify.mjs --base aem.live --all: 7 verified, 2 flagged only for `href="/widgets/search/{search,product-finder}.html"` — the code-only widget units (contract: widgets/<path>/<name>, no authored content). verify.mjs's link check knows coverage pages only; both URLs answer 200 on aem.live and the D2 replay passed both flows, so the two rows were recorded verified through update-coverage.mjs (no hand edit).
- Render check: the only `restoreAtDelivery` entry is the search widget (D2: 49 results = source 49); the source showed no autoplay video and no idle-rotating carousel (motion media blocks empty for every archetype).
- Coverage: 9 verified / 0 deployed / 0 remaining; every row delivery.gate.pass true.

## E2-link-audit — 0 broken internal links; out-of-scope targets stay on the source (2026-10-28)
- localize-links --check: CHECK PASS, 0 links still localizable; ~330 out-of-scope source targets kept absolute (named decision in stardust/direction.md).
- Internal hrefs of 9 pages + 6 chrome documents on aem.live: 10 distinct, 10 × 200.

## F-optimize — health 100/100, 0 open findings after restoring the source JSON-LD (2026-10-28)
- First run: 0 P1, 9 P2 `ai-search/jsonld` — the source carries a WebSite JSON-LD on every page (alternateName Fairtrade / Fairtrade Deutschland / Fairtrade Switzerland) that the delivered pages lacked: a content loss, not an improvement.
- Fix: a `JSON-LD` metadata row carrying the source object verbatim in each of the 9 page documents (the pipeline renders it server-side as `<script type="application/ld+json">` in the head — probed on /en first), deploy-batch --force, ledger stardust/deploy/ledger-jsonld.json, 9/9 live. Head-only change; the pixel gate rows stand.
- Re-run: health 100/100, open P1 0 · P2 0 · P3 0, fixed 9 P2. Source-parity informational: 2 P3 title-length (/en "English", cocoa "Cocoa" — the source titles verbatim).

## G-aem — nothing to fix (2026-10-28)
- autofix-aem --dry-run: candidates 0 (no open findings after F-optimize); no project edit, no re-deploy.

## H-report — 9/9 pages verified, 8/8 blocks, health 100 (2026-10-28)
- Pages: 9 total · 9 verified · 0 deployed-only · 0 pending · 0 failed (templates: landing 3, static 1, listing 2, program 1, search 2).
- Blocks: 8 distinct (7 blocks + the search/product-finder widget unit), 8 verified — recorded at H (the cluster units had not written block rows).
- Quality: published-origin gate 9/9 at 1440 and 360 (2 documented overrides per width); optimize health 100/100, 0 open findings; dynamic parity 9/9 checks; internal links 10/10.
- To deliver: nothing in scope. Owner decisions open: T (turn on tags/consent from stardust/martech-handoff.md), S (full-site search backend), L (index-driven listings), I (further locales).
- Learnings: stardust/learnings.md (4 entries).

## I-dashboard — delivery dashboard written (2026-10-28)
- dashboard.mjs → stardust/rollout/dashboard/{index.html,data.json}: 9 identified · 9 prototyped · 9 deployed · 7 optimised (the other 2 carry only the source-parity title P3s, informational).

## Header parity — scroll-state closed on the live host, roster re-gated (2026-10-28)
- done-check's header_parity gap: header-parity.json had been compared on aem.page and carried 8 undecided scroll-state errors (the C-final request declined as a probe artefact). Only a fix or an owner decision clears them, so it was fixed: the header block box (`header > .header`) is now the fixed, hide-on-scroll element (`.header.is-hidden` translate -100%, z-index 11; `.topbar` stays fixed inside), JS toggles the class on the block. Verified on a code branch first (chrome-compare 0 errors), then shipped on main (ee68546).
- chrome-explore on aem.live/en + chrome-compare --profile replica: 0 errors, 6 warnings (path normalisation, out-of-scope locale links, capture budget) → stardust/chrome/header-parity.json.
- Roster re-gated with fresh build captures: 1440 7 PASS + 2 overrides = 9 delivered; 360 7 PASS + 2 overrides = 9 delivered — the same verdicts and pixel numbers as before the change. A first 1440 pass read "units off" on 6 pages because unit-geometry's origin cache (stardust/current/measure, keyed by slug only) held the 360 inventory; re-run with the cache moved aside (stardust/learnings.md).
- update-coverage --gate both widths: 9/9 matched, 0 flips. foundation-freeze re-frozen (header.css/header.js changed after C-final). done-check.mjs: complete.

## Handoff — 9/9 pages live on aem.live and gated; run complete (2026-10-28)
- migrate → deploy → rollout A…I all ended; 9/9 pages published live, verified, gate rows pass (2 documented overrides per width); redirects sheet and 6 chrome documents live; served sitemap = 9.
- Martech carried over with every contract part disabled (stardust/martech-contract.json, stardust/martech-handoff.md, scripts/martech.js); dynamics-check martech gate passes.
- done-check (runner and local): complete, no gaps. Owner decisions open: T, S, L, I (stardust/dynamic-features.md § Decision batch).
