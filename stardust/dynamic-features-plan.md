# Dynamic features — plan

| phase | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|
| interactive | header mega menu, search overlay, locale selector, mobile drawer in the header block (rows 3, 4) | nav document authored; behaviour in block JS | chrome-compare vs stardust/chrome/header-contract.json | none | M |
| search | `widgets/search/results` reading `?q=`; corpus = query-index + captured snapshot JSON (row 5) | no authored rows | dynamics-check search-query probe "coffee" | S | M |
| listings | product-finder client filter over captured grid (row 6); teaser grids as block rows (row 7) | block rows = captured cards | gate rows | L | M |
| tags | scripts/martech.js scaffolded from stardust/martech-contract.json, every part disabled (rows 9–12) | contract edit by owner | dynamics-check martech feature | T | S |
| locale | locale links to non-migrated locales point to the source origin (row 8) | nav documents per locale | link audit | I | S |
