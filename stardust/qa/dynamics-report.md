# Dynamics parity check — https://main--bdafc086--aemcoder.aem.live — 2026-10-28T19:40:11.526Z

Replayed 9 checks over 6 features · pass 9 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| header mega menu, search overlay, locale selector, mobile drawer | M | done | dom-count | PASS | 1 × header [aria-controls="topbar-search"] (min 1) |  |
| header mega menu, search overlay, locale selector, mobile drawer | M | done | dom-count | PASS | 2 × header [aria-controls="locale-selector"] (min 1) |  |
| header mega menu, search overlay, locale selector, mobile drawer | M | done | dom-count | PASS | 4 × header [aria-controls^="flyout-"] (min 3) |  |
| site search results page (?q=) | S | interim | search-query | PASS | 49 results (source 49) · first: coffee tree management - climate academy 2020 · matches the source |  |
| DE Produkt-Finder filters + product grid | L | interim | dom-count | PASS | 24 × .pf-product-teaser-grid-card (min 24) | images.connectfairtrade.org:200×12 |
| news / press / product teaser grids and carousels | L | interim | dom-count | PASS | 1 × .teaser-grid (min 1) |  |
| news / press / product teaser grids and carousels | L | interim | dom-count | PASS | 1 × .page-hero-carousel (min 1) |  |
| all delivered pages run without script errors | A | done | no-page-errors | PASS | none on 9 page(s) |  |
| martech: consent + tag routing | T | scaffolded-off | martech | PASS | no tag host requested (1 gated · 0 cross-site host(s) blocked) |  |

## Features without checks
