---
name: Fairtrade International (current state)
description: Captured design system of www.fairtrade.net (GLOBAL-EN, DE-DE, CH-DE), descriptive, not prescriptive.
colors:
  skyblue: "#0fc0fc"
  skyblue-hover: "#0eade3"
  skyblue-deep: "#035e7c"
  leafgreen: "#d4ff47"
  leafgreen-hover: "#aacc39"
  leafgreen-deep: "#4f5d18"
  eggplant: "#7b1dab"
  nightsky: "#001b6e"
  flower: "#ff4571"
  ink: "#1e1e1e"
  paper: "#ffffff"
  mist: "#f4f4f4"
  rule: "#dadada"
  stone: "#787878"
typography:
  display:
    fontFamily: "Alegreya Sans, system-ui"
    fontSize: "72px"
    fontWeight: 900
    lineHeight: 1.1
  headline:
    fontFamily: "Alegreya Sans, system-ui"
    fontSize: "48px"
    fontWeight: 900
    lineHeight: 1.1
  title:
    fontFamily: "Alegreya Sans, system-ui"
    fontSize: "32px"
    fontWeight: 900
    lineHeight: 1.1
  subtitle:
    fontFamily: "Alegreya Sans, system-ui"
    fontSize: "20px"
    fontWeight: 800
    lineHeight: 1.1
  quote-lg:
    fontFamily: "Alegreya Sans, system-ui"
    fontSize: "72px"
    fontWeight: 900
    lineHeight: 0.875
  body:
    fontFamily: "Exo 2, system-ui"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  body-m:
    fontFamily: "Exo 2, system-ui"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Exo 2, system-ui"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1
rounded:
  md: "12px"
  lg: "16px"
  pill: "100px"
  circle: "100%"
spacing:
  xs: "4px"
  sm: "8px"
  s: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  4xl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.skyblue}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.skyblue-hover}"
  button-primary-leafgreen:
    backgroundColor: "{colors.leafgreen}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "48px"
  button-primary-leafgreen-hover:
    backgroundColor: "{colors.leafgreen-hover}"
  button-secondary:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 32px"
    height: "48px"
  input-search:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "16px 24px"
  tag:
    rounded: "{rounded.lg}"
    padding: "4px 12px"
  card-product:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.lg}"
  hero-media:
    rounded: "{rounded.md}"
---

<!-- stardust:provenance
writtenBy: stardust:extract
stardustVersion: 0.36.0
mode: descriptive current-state capture (no invention)
readArtifacts: stardust/current/_brand-extraction.json, stardust/current/_computed-styles.json, stardust/current/css/site.css, stardust/current/pages/*.json, stardust/current/pages/*.html (component class census), stardust/current/assets/screenshots/en.png
-->

# Design System: Fairtrade International (current state)

## Overview

**Creative North Star: "Bright market stall on white paper"** (descriptive label for the captured system, not a target)

The live site is a white-ground, ink-text editorial system punctuated by flat blocks of two saturated brand colours, Sky Blue `#0fc0fc` and Leaf Green `#d4ff47`. Those two colours fill hero carousels, page-lead title bands, wave dividers and pill buttons. Heavy Alegreya Sans 900 headlines sit over Exo 2 body copy at 18px/1.6. The one organic shape is the pink "flower" (`#ff4571`) blob behind number facts. Everything else is pills (100px), 12px-rounded photography, and 16px-rounded cards and tags.

Content runs as a vertical stack of AEM components: PageLead or PageHeroCarousel, then RichtextSection, TextImage, NumberFactTeaser, FilteredTeaserGrid, AccordionSection and CTASection, with SVG waves between colour changes. The pattern is the same on all three locales (EN global, DE-DE, CH-DE). Only the copy, navigation labels and some modules differ by locale (NavigationTeasers and ProductTeaser appear only in DE/CH).

**Key Characteristics:**
- Two-brand-colour system (Sky Blue + Leaf Green) on white. Eggplant `#7b1dab` is used only for text links. Night Sky `#001b6e` is an occasional dark band.
- Ultra-black display type (Alegreya Sans 900, 72/48/32px) over a sans body (Exo 2, 18px/1.6).
- Pill buttons and inputs (100px radius, 48px tall), 12px-rounded media, and 16px cards and tags.
- Organic blob number facts and SVG wave dividers are the signature motifs.
- Elevation is almost absent. A single soft shadow `0 4px 8px rgba(30,30,30,.1)` sits on accordion headers and carousel controls.

## Colors

The palette is high-key and saturated on a white ground. Colour is applied in flat fields, never as gradients except for the hard-stop split band.

### Primary
- **Sky Blue** (#0fc0fc): primary button fill (`.Button.variant-primary.color-skyblue`, 36 button backgrounds in census), `theme-skyblue` hero carousel band, secondary-button outline, wave divider. Hover `#0eade3`, deep/active `#035e7c` (also the link-hover colour).

### Secondary
- **Leaf Green** (#d4ff47): the most-used saturated fill (census weight 254). It fills PageLead bands (`.PageLead --background-color`), leafgreen buttons, the outlined newsletter button in the footer, TeaserGrid theme and wave dividers. Hover `#aacc39`, deep `#4f5d18`, dark-theme light `#e5ff91`.

### Tertiary
- **Eggplant** (#7b1dab): text links in rich text (`.Richtext a`), and a secondary number-fact bubble colour. In the census it is used only as text and link colour (226).
- **Night Sky** (#001b6e): dark PageLead band on the cocoa programme page, and the checked fill for checkboxes and radios.
- **Flower** (#ff4571): organic NumberFact bubble fill (`.Bubble.color-flower`, 9 instances). The census misses it because it is painted as an SVG fill.

### Neutral
- **Ink** (#1e1e1e): all body text, headings and button labels (census 1684).
- **Paper** (#ffffff): page background and cards.
- **Mist** (#f4f4f4): `theme-grey` TextImage band and monochrome wave.
- **Rule** (#dadada): borders and dividers (180). Lighter variant `#e8e8e8` (98).
- **Stone** (#787878): secondary text (90).

### Named Rules
**The Flat Field Rule.** Brand colour appears as solid fields: bands, pills and blobs. The only gradients are hard-stop splits (`linear-gradient(#d4ff47 33.33%, #fff 33.33%)`) that make a band end one-third of the way down.

## Typography

**Display Font:** Alegreya Sans (with system-ui), self-hosted woff2, weights 100–900 incl. italics, SIL OFL
**Body Font:** Exo 2 (with system-ui), self-hosted variable woff2 (100–900), SIL OFL

**Character:** A humanist sans set at weight 900 for every headline, paired with a geometric-techno sans for running text and labels. Headlines are mixed-case (0% uppercase across 117 captured headings).

### Hierarchy
- **Display** (900, 72px, 1.1): PageLead titles and hero h1 (`.PageLead--title`, `.t-headline-xl` at ≥1024px). `.t-quote-lg` uses the same size at line-height .875.
- **Headline** (900, 48px, 1.1): section h2 (census mode for h2, 26 instances).
- **Title** (900, 32px, 1.1): h3 / card titles at desktop.
- **Subtitle** (800, 20px): h4 tier.
- **Body** (400, 18px, 1.6): `body`; `.t-body-m` 17px, `.t-body-l` 20px, `.t-body-s` 15px, `.t-body-xs` 13px, all line-height 1.6.
- **Label** (700, 18px, 1.0): button labels (`.t-button-label`); small 16px.

The heading scale is ad-hoc (72→48→32→20, ratios 1.5/1.5/1.6). The CSS utility scale `.t-headline-xxl…xxs` steps 56/48/40/32/24/20/16 in 8px increments.

## Layout

The page is a single-column stack of full-bleed components. Section bands change colour via `theme-*` classes and are joined by `.Wave` SVG dividers (40px tall on mobile). The header is fixed height via `--topbar-height` (72px, 104px at ≥640px). Observed spacing values come from site.css declaration frequency: 24px (195), 16px (141), 20px (94), 32px (78), 40px (64), 48px (53), 80px (45), 64px (42), 12px (41). That gives a 4px base. Accordion sections pad 64px block and 18px inline. Teaser cards run three-up at 1440px (409×314 images). Container max-width was not measured. Responsive breakpoints are recorded separately by the breakpoint probe.

## Elevation & Depth

The system is essentially flat. Depth comes from colour bands, rounded photography and the blob shapes. One shadow appears in the census (28 instances).

### Shadow Vocabulary
- **Control lift** (`box-shadow: 0 4px 8px rgba(30,30,30,0.1)`): accordion headers, carousel previous/next controls.
- **Overlay** (`box-shadow: 0 8px 12px 0 rgba(0,0,0,0.15)`): overlay panels (site.css `.Overlay--inner`, not seen in census).

## Shapes

- **Radius 12px** (census mode, 274 instances by count and by area): hero slide media (`.PageHeroSlide--media`) and teaser imagery.
- **16px** (160): `.ProductTeaser` cards and `.Tag` chips.
- **100px pill** (91): every primary/secondary button and the search input wrapper.
- **100% circle** (132): icon buttons and input icon wrappers.
- **120px** (8): seen on de-de and Produktfinder (element not identified).
- The organic **blob** (`.Bubble` SVG) behind number facts and the **wave** (`.Wave` SVG) section edge are the two non-rectilinear silhouettes.

## Components

### Buttons
- **Shape:** pill (100px), 48px tall, 0 32px padding, 2px border, Exo 2 700 18px label.
- **Primary:** Sky Blue `#0fc0fc` or Leaf Green `#d4ff47` fill with ink label.
- **Hover / Focus:** fill darkens (`#0eade3` / `#aacc39`) and border shifts to the deep tone (`#035e7c` / `#4f5d18`), with a `.2s ease-in-out` transition. In dark theme the label/icon hover turns mint `#09fbd3`.
- **Secondary:** transparent, with a 2px Sky Blue / Leaf Green / white outline. Hover fills a 25% tint.
- **Tertiary:** 16px bold text link with icon. **Icon buttons** are circles.

### Chips
- **Style:** `.Tag` 16px radius, 4px 12px padding, used as category tags on InfoTeaser cards and as filters.

### Cards / Containers
- **InfoTeaser (news/press/product-page cards):** 12px-rounded image, a date + category pretitle ("Press releases", "Fairtrade news", "Product pages"), an Alegreya title, an excerpt and "Read more". No shadow, no border.
- **ProductTeaser:** white, 16px radius, product image + brand + name + "Mehr erfahren" (DE/CH only).

### Inputs / Fields
- **Style:** pill field wrapper (100px), borderless input with 16px 24px padding, circular icon wrapper. Checkboxes and radios fill Night Sky `#001b6e` when checked.

### Navigation
- White topbar: 80px logo (56px mobile) on the left and a horizontal main nav with mega flyouts (`TopbarDesktopFlyout`). EN has 4 items (Why Fairtrade, Products, For Business, Get Involved); DE-DE has 5 (adds Newsroom); CH-DE has 4. Search, locale selector ("GLOBAL • EN") and a meta menu sit on the right. Mobile uses a drawer (`MobileMenu`). The footer has three link columns plus social links and a newsletter.

### Number Fact Teaser (signature)
- A big Alegreya 900 figure ("1,824", "+37,000", "+711K MT") with a short Exo label, set on a pink (`#ff4571`) or eggplant organic blob. Used on all three landings and the cocoa programme page.

### Page Hero Carousel (signature)
- Swiper carousel on a Sky Blue (or Leaf Green) band. Each slide is 12px-rounded 16:9 photography with an overlaid title, text and a pill CTA. Circular prev/next controls. Used on the three locale landings.

## Do's and Don'ts

### Do:
- **Do** keep headlines in Alegreya Sans 900 at 72/48/32px, line-height 1.1, mixed case.
- **Do** set running text in Exo 2 18px/1.6 in ink `#1e1e1e` on white.
- **Do** use pill buttons (100px radius, 48px height, 0 32px padding) in Sky Blue `#0fc0fc` or Leaf Green `#d4ff47` with ink labels.
- **Do** round photography at 12px and cards and tags at 16px.
- **Do** join colour bands with the SVG wave, and present key figures on the organic blob.

### Don't:
- **Don't** add drop shadows to cards. The site's only shadow (`0 4px 8px rgba(30,30,30,.1)`) is for accordion headers and carousel controls.
- **Don't** use soft gradients. The only gradients are hard-stop 33.33% split bands.
- **Don't** put white text on Sky Blue or Leaf Green fills. Labels on those fills are ink `#1e1e1e`.
