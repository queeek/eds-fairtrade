# Dynamic features — www.fairtrade.net (9-page replica scope)

Curated from `stardust/dynamics/dynamic-features.generated-plan.md` (27 draft rows, `_dynamics.json`). Hands-off run: owner decisions are named, interim tiers ship, nothing is decided-out.

## Listings contract
Listing blocks in scope are editorially curated on the source (fixed card sets captured verbatim): news teasers on the home pages, product teaser grid on Fairtrade products, press-release grid on the Press centre (paged with "Load more"), product grid on the DE Produkt-Finder. Interim: cards ship as authored block rows (captured content). No query-index listing until the owner decides (decision L below). Page metadata emitted per page: `title`, `description`, `og:image`.

## Features
| # | id | feature | class | reach | disposition | target | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-settings | CMS settings objects (dataLayer, adobeDataLayer, Granite) | A | 9/9 | static-snapshot | content | self | pending | read-settings | none — AEM-runtime objects, no consumer on EDS except the martech dataLayer (row 9) | _dynamics.json |
| 2 | d-csrf | GET /libs/granite/csrf/token.json | D | 9/9 | static-snapshot | content | self | pending | — | none — AEM author/form plumbing, no consumer on the migrated pages; reason: host-bound (404 on target), revisit at rollout | target probe 404 |
| 3 | m-header | header mega menu, search overlay, locale selector, mobile drawer | M | 9/9 | rebuild-native | runtime | self | pending | chrome-interaction | none — header contract is the spec | stardust/chrome/header-contract.json |
| 4 | m-modal | aria-haspopup dialogs (filters, locale list) | M | 2/9 | rebuild-native | runtime | self | pending | modal-loader | none | _dynamics.json |
| 5 | s-search | site search box + results page (`?q=`) | S | 9/9 | index-backed | widget | self | pending | search-index-backed | interim: corpus = migrated pages + captured source result snapshot for the probe term; owner decision S (full-site search backend) | probe "coffee": 49 results; top titles "Coffee Tree Management - Climate Academy 2020", "Monitoring the scope and benefits of Fairtrade: Coffee – Monitoring report, 10th Edition", "Fairtrade increases coffee Minimum Price as farmers face mounting economic and climate pressures" |
| 6 | l-product-finder | DE Produkt-Finder filters + product grid (24 cards, pagination) | L | 1/9 | client-only | widget | self | pending | listing-client-filter | interim: captured grid snapshot, filters client-side over it; owner decision L | ProductTeaserGrid 24 cards |
| 7 | l-teasers | news / press / product teaser grids and swiper carousels | L | 6/9 | static-snapshot | block | self | pending | listing-curated | reason: editorially curated on the source; unfreeze when the owner chooses index-driven (decision L) | TeaserGrid 16, swiper 3 |
| 8 | i18n | locale selector (40+ locale variants) | I18N | 9/9 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | decision I: only en, de-de, ch-de in scope; other locales link to the source origin | locale list in header |
| 9 | t-gtm | Google Tag Manager (GTM container) | T | 9/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | decision T: carried over disabled in stardust/martech-contract.json | gtm.js |
| 10 | t-consent | Usercentrics CMP (settings eFjo_1PKCmgDC9 EN, lV6MBy4S36YZ05 DE) | T | 9/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | decision T: carried over disabled | api.usercentrics.eu/settings |
| 11 | t-analytics | Google Analytics / Ads, ad pixels (Meta, Pinterest, Snapchat, TikTok, Tapad, others) — fired by GTM | T | 9/9 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | decision T: arrive via GTM, nothing re-implemented | 3rd-party hosts in _dynamics.json |
| 12 | a-google | www.google.com XHR (reCAPTCHA / ads via GTM) | T | 1/9 | embed-passthrough | embed | needs-business-decision | pending | inspect | decision T (GTM-fired) | _dynamics.json |
| 13 | t-connect-images | images.connectfairtrade.org | T | 1/9 | embed-passthrough | embed | self | pending | — | image host for Produkt-Finder cards; hot-linked as captured | _dynamics.json |

## Decision batch
One message to the owner (hands-off: interim tiers ship, decisions stay open):
- **T — tags & consent:** GTM container and Usercentrics CMP are carried over switched off (`stardust/martech-handoff.md`). Turn on `consent.cmp` / routes when ready; GTM fires GA/Ads and the ad pixels.
- **S — search backend:** the rebuilt search covers the migrated pages plus the captured source results; full-site search needs a backend or an index of the whole site.
- **L — listings:** teaser grids ship as curated content; say if any should be index-driven.
- **I — locales:** only EN global, DE-DE and CH-DE pages are in this run; other locale links point to the source site.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| (none) | | |
