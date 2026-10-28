<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-28T12:20:05.128Z · input stardust/current/_dynamics.json (6 pages, 27 findings) · target probe https://main--bdafc086--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · target = the delivery form (widget where no authored rows remain) · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | target | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 6/6 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 2 | a-cms-app-settings-object-adobedatalayer | A | CMS / app settings object adobeDataLayer | 6/6 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-cms-app-settings-object-granite | A | CMS / app settings object Granite | 6/6 | static-snapshot | content | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 4 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 1/6 | static-snapshot | — | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | d-first-party-data-file-get-libs-granite-csrf-token-json | D | first-party data file GET /libs/granite/csrf/token.json | 6/6 (reach 9/9) | data-fed | content | self | pending | sheet-sync | none (sync from the source origin) | **dead on target (404)** |
| 6 | i18n-locale-variants-at-de-be-fr-bg-bg-ca-en-ca-fr | I18N | locale variants at-de,be-fr,bg-bg,ca-en,ca-fr | 3/6 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 7 | i18n-locale-variants-bg-bg-hr-hr-gr-el-hu-hu-mt-en | I18N | locale variants bg-bg,hr-hr,gr-el,hu-hu,mt-en | 2/6 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 8 | i18n-locale-variants-bg-bg-ca-en-hr-hr-gr-el-hu-hu | I18N | locale variants bg-bg,ca-en,hr-hr,gr-el,hu-hu | 1/6 | rebuild-native | runtime | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 9 | l-listing-candidate-swiper-wrapper-3-cards | L | listing candidate swiper-wrapper (3 cards) | 1/6 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 10 | l-listing-candidate-teasergrid-grid-16-cards | L | listing candidate TeaserGrid--grid (16 cards) | 1/6 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 11 | l-listing-candidate-productteasergrid-24-cards | L | listing candidate ProductTeaserGrid (24 cards) | 1/6 | index-backed | block | needs-business-decision | pending | listing-index-backed | index-driven or editorially curated? |  |
| 12 | m-modal-trigger-aria-haspopup-chrome-only-dialog-form | M | modal trigger aria-haspopup (chrome only) → dialog:form | 5/6 (reach 31/9) | rebuild-native | runtime | self | pending | chrome-interaction | none (the header contract is the spec) |  |
| 13 | m-modal-trigger-aria-haspopup-dialog-form-listbox-form | M | modal trigger aria-haspopup → dialog:form/listbox:form | 1/6 (reach 31/9) | rebuild-native | runtime | self | pending | modal-loader | none |  |
| 14 | s-site-search-form-js-submitted | S | site search form → (JS-submitted) | 6/6 (reach 2/9) | index-backed | widget | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 15 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 16 | t-consent-usercentrics | T | consent: Usercentrics | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 17 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 6/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | t-unknown-third-party-host-images-connectfairtrade-org | T | unknown third-party host images.connectfairtrade.org | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 19 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 20 | t-unknown-third-party-host-s-pinimg-com | T | unknown third-party host s.pinimg.com | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 21 | t-unknown-third-party-host-sc-static-net | T | unknown third-party host sc-static.net | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 22 | t-unknown-third-party-host-tr-snapchat-com | T | unknown third-party host tr.snapchat.com | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 23 | t-unknown-third-party-host-www-facebook-com | T | unknown third-party host www.facebook.com | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 24 | t-unknown-third-party-host-pixel-tapad-com | T | unknown third-party host pixel.tapad.com | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 25 | t-unknown-third-party-host-svrdntfctn-com | T | unknown third-party host svrdntfctn.com | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 26 | t-unknown-third-party-host-analytics-ipv6-tiktokw-us | T | unknown third-party host analytics-ipv6.tiktokw.us | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 27 | t-unknown-third-party-host-tr6-snapchat-com | T | unknown third-party host tr6.snapchat.com | 1/6 | embed-passthrough | embed | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 7 row(s) — read-settings, sheet-sync, chrome-interaction, modal-loader, search-index-backed.
- **One owner decision batch:** 20 row(s) — inspect the XHR, add a vendor row · scope of the locale trees · index-driven or editorially curated? · which tags run on the new host; property ids · CMP domain script reuse on the new host.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 1 of 1 probed API paths — the off-origin data work.
- **Martech:** no CMP · 0/2 route(s) enabled by the owner — `stardust/martech-handoff.md`.

## Phases

- **tags** — 13
- **detect** — 4
- **locale wave** — 3
- **listings** — 3
- **interactive** — 2
- **data** — 1
- **search** — 1
