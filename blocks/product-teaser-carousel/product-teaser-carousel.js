/**
 * product-teaser-carousel — skyblue band with a centred head and a horizontally scrolling track of
 * linked product teasers (live ProductTeaserCarousel + Carousel.contains-product-teasers).
 * Schema: stardust/migrated/ch-de.html (ProductTeaserCarousel: subtitle, h2, 24 ProductTeaser
 * cards, "Alle Produkte entdecken" secondary CTA).
 * Decode tier: reconstructive (one teaser per row) + section head reabsorbed from the default
 * content before the block (EW8).
 *
 * Authoring:
 *   default content before the block (same section): subtitle <p> · <h2> title
 *   one row per product: image cell | merchant <p> · title <p> · link <p><a> (card target; its
 *     label renders as the tertiary "Mehr erfahren")
 *   a row holding only a link paragraph = the section CTA under the track (<em> = secondary)
 * The whole teaser becomes the link (EW6: the authored anchor is unwrapped after reading href).
 *
 * Motion (live Carousel, options controlsOnHover + initAtScrollCenter): the track starts
 * scrolled to its centre (scrollWidth / 2 - clientWidth / 2); prev / next scroll by one item
 * (smooth); controls fade in on hover from 1024px; buttons disable at the track ends; teaser
 * image scales 85% → 95% on hover.
 *
 * @variants block: none
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRONS = {
  left: ['0 0 24 24', 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z'],
  right: ['0 0 48 48', 'M20 12L17.18 14.82L26.34 24L17.18 33.18L20 36L32 24L20 12Z'],
};
const WAVES = [
  ['mobile', '0 0 100 100',
    'M0 100 V138 H100 V22.22 C89.4722 10.3091 77.1944 3.5804 65.625 3.5804 C37.2325 3.5804 '
    + '12.19 40.9839 0 100 Z'],
  ['tablet', '0 0 768 40',
    'M0 39.5566V40H768V6.70221C693.951 2.74354 610.938 0.525391 523.261 0.525391C286.805 '
    + '0.525391 84.2704 16.6588 0 39.5566Z'],
  ['desktop', '0 0 375 40',
    'M0 39.4028V40H375V6.73263C338.773 2.75491 298.142 0.525391 255.221 0.525391C140.023 '
    + '0.525391 41.3134 16.5866 0 39.4028Z'],
];

function svgEl(viewBox, d) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  return svg;
}

function wave() {
  const w = document.createElement('div');
  w.className = 'wave';
  w.setAttribute('aria-hidden', 'true');
  WAVES.forEach(([name, viewBox, d]) => {
    const box = document.createElement('div');
    box.className = `wave-${name}`;
    const svg = svgEl(viewBox, d);
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'none');
    box.append(svg);
    w.append(box);
  });
  return w;
}

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const linkOnly = (el) => {
  const a = el.matches('a') ? el : el.querySelector('a');
  return a && el.textContent.trim() === a.textContent.trim() ? a : null;
};

/** Authored elements of a row (expands the runtime's media-led <p> wrap). */
function rowNodes(row) {
  const out = [];
  row.querySelectorAll(':scope > div').forEach((cell) => {
    [...cell.children].forEach((el) => {
      if (el.tagName === 'P' && el.querySelector('picture, img') && !el.textContent.trim()) {
        out.push(...[...el.querySelectorAll('picture, img')]
          .filter((m) => m.tagName === 'PICTURE' || !m.closest('picture')));
      } else out.push(el);
    });
  });
  return out;
}

function buildTeaser(nodes) {
  const media = nodes.find((n) => n.matches('picture, img'));
  const linkP = nodes.find((n) => n !== media && linkOnly(n));
  const link = linkP ? linkOnly(linkP) : null;
  const texts = nodes.filter((n) => n !== media && n !== linkP);
  const li = document.createElement('li');
  li.className = 'carousel-item';
  const card = document.createElement(link ? 'a' : 'div');
  card.className = 'product-teaser';
  if (link) card.href = link.getAttribute('href');
  if (media) card.append(wrapNode(wrapNode(media, 'image'), 'product-teaser-image'));
  texts.forEach((n, i) => card.append(wrapNode(n, i === 0 && texts.length > 1
    ? 'product-teaser-merchant' : 'product-teaser-title')));
  if (linkP) {
    const cta = document.createElement('div');
    cta.className = 'product-teaser-cta';
    cta.append(wrapNode(linkP, 'product-teaser-cta-inner'));
    card.append(cta);
    link.replaceWith(...link.childNodes);
  }
  li.append(card);
  return li;
}

function navButton(dir) {
  const b = document.createElement('button');
  b.type = 'button';
  const name = dir === 'left' ? 'previous' : 'next';
  b.className = `ft-button variant-icon-primary color-leafgreen carousel-control-${name}`;
  b.setAttribute('aria-label', dir === 'left' ? 'Previous' : 'Next');
  const span = document.createElement('span');
  span.className = 'ft-icon';
  span.append(svgEl(...CHEVRONS[dir]));
  b.append(span);
  return b;
}

/** Head nodes: the default content wrapper right before the block (EW8 — moved whole). */
function headNodes(block) {
  const wrapper = block.parentElement;
  const prevEl = wrapper && wrapper.previousElementSibling;
  if (!prevEl || !prevEl.classList.contains('default-content-wrapper')) return [];
  const nodes = [...prevEl.children];
  prevEl.remove();
  return nodes;
}

function setupTrack(carousel, list, prev, next) {
  const items = [...list.children];
  const update = () => {
    const over = list.scrollWidth > list.clientWidth + 1;
    carousel.classList.toggle('is-overflowing', over);
    prev.disabled = list.scrollLeft <= 1;
    next.disabled = list.scrollLeft >= list.scrollWidth - list.clientWidth - 1;
  };
  const step = () => (items[0] ? items[0].clientWidth : list.clientWidth);
  prev.addEventListener('click', () => list.scrollBy({ left: -step() }));
  next.addEventListener('click', () => list.scrollBy({ left: step() }));
  list.addEventListener('scroll', update, { passive: true });
  const init = () => {
    list.scroll({ left: list.scrollWidth / 2 - list.clientWidth / 2 });
    carousel.classList.add('is-initialized');
    update();
  };
  if (list.clientWidth) init();
  else {
    const ro = new ResizeObserver(() => {
      if (!list.clientWidth) return;
      ro.disconnect();
      init();
    });
    ro.observe(list);
  }
  new ResizeObserver(update).observe(list);
}

export default async function decorate(block) {
  const head = headNodes(block);
  const rows = [...block.children].map(rowNodes).filter((ns) => ns.length);
  const ctaRows = rows.filter((ns) => ns.every((n) => !n.matches('picture, img')
    && linkOnly(n)));
  const teasers = rows.filter((ns) => !ctaRows.includes(ns)).map(buildTeaser);

  const content = document.createElement('div');
  content.className = 'product-teaser-carousel-content';
  if (head.length) {
    const grid = document.createElement('div');
    grid.className = 'u-grid product-teaser-carousel-head';
    head.forEach((n) => grid.append(wrapNode(n, /^H[1-6]$/.test(n.tagName)
      ? 'product-teaser-carousel-title' : 'product-teaser-carousel-subtitle')));
    content.append(grid);
  }
  const holder = document.createElement('div');
  holder.className = 'product-teaser-carousel-track';
  const carousel = document.createElement('div');
  carousel.className = 'carousel';
  const list = document.createElement('ul');
  list.className = 'carousel-list';
  list.append(...teasers);
  const controls = document.createElement('div');
  controls.className = 'carousel-controls';
  const prev = navButton('left');
  const next = navButton('right');
  controls.append(prev, next);
  carousel.append(list, controls);
  holder.append(carousel);
  content.append(holder);
  if (ctaRows.length) {
    const actions = document.createElement('div');
    actions.className = 'u-grid product-teaser-carousel-actions';
    const inner = document.createElement('div');
    ctaRows.flat().forEach((n) => inner.append(n));
    actions.append(inner);
    content.append(actions);
  }
  block.replaceChildren(wave(), content);
  setupTrack(carousel, list, prev, next);
}
