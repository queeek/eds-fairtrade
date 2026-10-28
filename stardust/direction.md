---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-28T12:18:43Z
  againstInput: https://www.fairtrade.net/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.fairtrade.net/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-10-28T12:18:43Z). Provenance: verbatim `--prep` promotion (9-page planned scope).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

## Link-audit decision — scope extension repointed to the source (2026-10-28)
The run's page scope is fixed at the 9 pages of `stardust/.labs/site-plan.json`. Every internal link whose target is one of them is root-relative on the delivered site (`localize-links.mjs --check`: 0 localizable left; 10 distinct internal hrefs, all 200 on aem.live). The ~330 other www.fairtrade.net targets (other locales such as /at-de, /ie-en, /jp-jp; news, about and topic pages under /en, /de-de, /ch-de) are outside the declared scope — SCOPE EXTENSION, kept as absolute links to the source site, so nothing 404s. They become root-relative when a later wave migrates them (re-run `localize-links.mjs`). No captured page is repointed.
