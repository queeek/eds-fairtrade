<!-- stardust:provenance
writtenBy: stardust:extract
stardustVersion: 0.36.0
mode: descriptive current-state capture; every statement below is drawn from captured page copy (stardust/current/pages/<slug>.json) or the brand surface (stardust/current/_brand-extraction.json). Nothing here was confirmed by interview.
source: https://www.fairtrade.net (9 pages: en, en-why-fairtrade-what-we-do-key-benefits, en-products-fairtrade_products, en-products-fairtrade_products-cocoa, en-get-involved-press-centre, en-search-results, de-de, de-de-produkte-produktfinder, ch-de)
-->

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site's own navigation and copy name these audiences:
- **Shoppers / consumers.** EN "Products" and "Benefits of Fairtrade". DE "Für Konsument*innen", "Alle Infos zum fairen Einkauf". CH "Warum Fairtrade-Produkte kaufen?". The DE Produkt-Finder lets people look up certified products by category, brand and organic status.
- **Businesses.** EN "For Business" and "Do you want to become Fairtrade certified?". DE "Für Unternehmen", "Zum Unternehmensbereich".
- **Activists / supporters.** EN "Get Involved". DE "Mach mit!", "Für Aktive", "Zu den Mitmachmöglichkeiten". CH "Dein Einsatz für den fairen Handel zählt".
- **Journalists.** EN Press centre ("If you are a journalist looking for information about Fairtrade…"), with national/local media routed to country organisations.
- **Farmers, workers and producer organisations.** These are the subjects of the stories, testimonials and figures (for example "1,824 producer organisations in 68 countries").

## Product Purpose

This is the public website of Fairtrade International (global, `/en`) and two national Fairtrade organisations sharing one AEM platform and design system: Fairtrade Deutschland (`/de-de`) and Fairtrade Max Havelaar Schweiz (`/ch-de`). It explains what Fairtrade is and how it works, presents certified products and commodity programmes (for example Cocoa), publishes news and press releases, and routes businesses and supporters to action. EN home: "For more than three decades, Fairtrade has been making an impact on the way trade works." DE/CH home: "Fairtrade steht für fairen Handel, bessere Preise und menschenwürdige Arbeitsbedingungen."

## Positioning

These claims come from the key-benefits page (en-why-fairtrade-what-we-do-key-benefits):
- "The only global sustainability standard where farmers and workers have representation at all levels of governance."
- "We're the only certification system to set minimum prices for all major commodities."
- "The unique Fairtrade Premium is an extra sum of money which farmers and workers receive from companies on top of the Fairtrade Minimum Price, to invest in community or business projects of their choice."

## Operating Context

- **Multi-locale.** GLOBAL-EN, DE-DE and CH-DE use a locale selector in the header ("GLOBAL • EN", "DE • DE", "CH • DE"). Navigation differs by locale: EN has Why Fairtrade / Products / For Business / Get Involved; DE-DE has Was ist Fairtrade? / Produkte / Für Unternehmen / Mach mit! / Newsroom; CH-DE has the same minus Newsroom.
- **Platform.** AEM (`/content/dam/fairtrade/…`, `/etc.clientlibs/fairtrade/…`). Usercentrics cookie consent (`_crawl-log.json#captureNotes`).
- **Content types.** Locale landing pages, static explainer pages, listing pages (products, press releases), commodity programme pages, site search (`/en/search-results.html?q=`) and a faceted Produkt-Finder (DE).

## Capabilities and Constraints

- Site search with a GET form, and a faceted product finder (brand, main category, organic; pagination).
- Filtered teaser grids with "Load more" (press centre), accordions, hero carousels and newsletter sign-up links in the footer.
- The cocoa page links to an interactive "Cocoa Dashboard".
- Fonts are self-hosted Alegreya Sans and Exo 2 (SIL OFL).
- Undecided or not captured: the content-ownership split between the international site and the national sites, and the newsletter provider. No meta descriptions or og: tags were captured on any page.

## Brand Commitments

- **Name and marks.** "Fairtrade" (one word), "the Fairtrade MARK" (EN), "Fairtrade-Siegel" (DE), "Fairtrade-Label" (CH), "Fairtrade Max Havelaar" (CH). The logo is captured at stardust/current/assets/logo.svg (fills #0FC0FC, #1E1E1E, #787878, #D4FF47).
- **Voice.** Mission-led and plain. EN uses question-led prompts ("Do you want to know the basics?"). DE/CH address the reader informally with du/dein. Gendered inclusive forms appear: "Konsument*innen" (DE), "Bäuer:innen, Arbeiter:innen" (CH).

## Evidence on Hand

- **Figures** (captured copy): "1,824 producer organisations in 68 countries"; "+37,000 products sold with the Fairtrade MARK in more than 140 countries"; "+150 externally funded projects implemented since 2021"; "+711K MT of Fairtrade cocoa was produced in 2023"; "398 Fairtrade certified cocoa producer organisations in 2023". CH variants: "1'930 Produzentenorganisationen in 70 Ländern".
- **Testimonials:** "Fairtrade has changed my life…" (en); "Cocoa is very important for me and my family…" by Dah Oho, cocoa farmer at ECAKOG, Ivory Coast (cocoa).
- **News and press:** dated InfoTeasers on en, press-centre (19), de-de and ch-de. The Annual Report 2025 is promoted in the en hero carousel.
- **Assets:** screenshots in stardust/current/assets/screenshots/, fonts in stardust/current/assets/fonts/, logo and favicon SVGs. Photography was not downloaded (URLs only, in the pages/*.json media lists).
- **Absent:** 71% of captured images (66/93) have empty alt text. Do not fabricate captions.

## Product Principles

Derived from the captured copy, not from an interview:
1. Explain before asking. Pages lead with what Fairtrade is and does, then route to action.
2. Show proof in numbers and producer voices: number-fact figures appear on all three landings, and first-person producer testimonials appear on en and cocoa.
3. Serve one global message with local voices. The national sites share the system but keep their own copy, navigation and campaigns ("Jahresthema 2026", "Darum fair.").

## Accessibility & Inclusion

No product-specific standard was captured. Observed: aria-labelled controls ("Open the search box", locale-selector state), skip-link and focus-ring styles defined in site.css (`.SkipLinks`, `#FlyingFocus`; not verified in the rendered DOM) and inclusive gendered language in DE/CH. Gaps: widespread empty alt text, a content-free "Click here" newsletter button label in the EN footer, and an EN home page with no `<h1>`.
