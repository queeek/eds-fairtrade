/**
 * page-lead — coloured page title band (live PageLead) with the page breadcrumb trail
 * (live Breadcrumbs, positioned over the band top as on the live page).
 * Schema: stardust/eds-schema/en-products-fairtrade_products.json, section 1 (PageLead: title,
 * lead) + the prototype header's Breadcrumbs nav.
 * Decode tier: template-slotted (authored elements are classified by content and MOVED into
 * the live slots, EW1; rows and cells are not indexed).
 *
 * Authoring (any row / cell shape):
 *   a list (<ol>/<ul>) = the breadcrumb trail, one <li> per crumb (link = linked crumb,
 *     plain text = unlinked title); the last crumb is the current page
 *   heading = page title (the page <h1>) · paragraphs = lead · link-only paragraph = CTA
 *   images (optional, live PageLead--image) = the image band below the title band, half on
 *     the band colour: first = mobile crop (4:3 rendition), second = desktop crop (21:9
 *     rendition, shown from 768px); one image serves both
 * Separator chevrons are appended to each crumb but the last (text-free spans).
 * The mobile trail is a presentational copy of the parent crumb (label = parent crumb text,
 * href = the parent link, else the current page link — live behaviour); it carries no
 * authored instrumentation (EW4).
 *
 * @variants block: leafgreen | skyblue | nightsky | white (default leafgreen); no-gap (no
 *   bottom gap under the band)
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
// live sprite paths (chevron-left 24 viewBox, chevron-right 48 viewBox)
const CHEVRONS = {
  left: ['0 0 24 24', 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z'],
  right: ['0 0 48 48', 'M20 12L17.18 14.82L26.34 24L17.18 33.18L20 36L32 24L20 12Z'],
};

function chevron(dir) {
  const span = document.createElement('span');
  span.className = 'page-lead-breadcrumb-icon';
  span.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', CHEVRONS[dir][0]);
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRONS[dir][1]);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  span.append(svg);
  return span;
}

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const isHeading = (el) => /^H[1-6]$/.test(el.tagName);
const linkOnly = (el) => {
  const a = el.querySelector('a');
  return a && el.textContent.trim() === a.textContent.trim() ? a : null;
};

function buildBreadcrumbs(list) {
  const nav = document.createElement('nav');
  nav.className = 'page-lead-breadcrumbs';
  nav.setAttribute('aria-label', 'Breadcrumb');
  nav.append(wrapNode(list, 'page-lead-breadcrumbs-desktop'));

  const crumbs = [...list.querySelectorAll(':scope > li')];
  // separator icons (live: span.Icon after each crumb but the last) — text-free, so the
  // crumbs' textContent is unchanged (presentation refinement, EW2)
  crumbs.slice(0, -1).forEach((li) => li.append(chevron('right')));
  const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2] : crumbs[0];
  if (parent) {
    const current = crumbs[crumbs.length - 1].querySelector('a');
    const parentLink = parent.querySelector('a');
    const href = (parentLink || current)?.getAttribute('href');
    const mobile = document.createElement('div');
    mobile.className = 'page-lead-breadcrumbs-mobile';
    const a = document.createElement(href ? 'a' : 'span');
    if (href) a.href = href;
    a.textContent = parent.textContent.trim();
    mobile.append(chevron('left'), a);
    nav.append(mobile);
  }
  return nav;
}

const isMedia = (el) => el.matches('picture, img');

function buildImage(media) {
  const band = document.createElement('div');
  band.className = 'page-lead-image';
  const grid = document.createElement('div');
  grid.className = 'page-lead-image-grid';
  const [mobile, desktop] = media;
  grid.append(wrapNode(mobile, desktop ? 'image image-mobile' : 'image image-single'));
  if (desktop) grid.append(wrapNode(desktop, 'image image-desktop'));
  band.append(grid);
  return band;
}

export default async function decorate(block) {
  const media = [];
  const nodes = [];
  block.querySelectorAll(':scope > div > div > *').forEach((el) => {
    const pics = isMedia(el) ? [el] : [...el.querySelectorAll('picture, img')]
      .filter((m) => m.tagName === 'PICTURE' || !m.closest('picture'));
    if (pics.length && (isMedia(el) || !el.textContent.trim())) media.push(...pics);
    else nodes.push(el);
  });
  const list = nodes.find((n) => /^(OL|UL)$/.test(n.tagName));
  const heading = nodes.find(isHeading);

  const content = document.createElement('div');
  content.className = 'page-lead-content';
  const grid = document.createElement('div');
  grid.className = 'page-lead-content-grid';
  content.append(grid);

  if (heading) grid.append(wrapNode(heading, 'page-lead-title'));
  let cta = null;
  nodes.filter((n) => n !== list && n !== heading).forEach((n) => {
    if (n.tagName === 'P' && linkOnly(n)) {
      if (!cta) {
        cta = document.createElement('div');
        cta.className = 'page-lead-cta';
        grid.append(cta);
      }
      cta.append(n);
    } else grid.append(wrapNode(n, 'page-lead-lead'));
  });

  block.replaceChildren(...(list ? [buildBreadcrumbs(list)] : []), content);
  if (media.length) {
    block.classList.add('has-image');
    block.append(buildImage(media));
  }
}
