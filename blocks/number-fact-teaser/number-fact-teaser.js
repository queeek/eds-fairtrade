/**
 * number-fact-teaser — number facts in bubbles beside a sticky intro (live NumberFactTeaser).
 * Schema: stardust/eds-schema/en.json, sections 1 and 6 (2 × NumberFactTeaser--item, then
 * label / heading / body / cta).
 * Decode tier: reconstructive facts + reabsorbed section head.
 *
 * Authoring:
 *   section head = default content before the block (EW8, reabsorbed into the block grid):
 *     label <p><strong>, <h2>, text <p>, CTA <p><em><a> (secondary button)
 *   block rows: one row per fact — first <p> = the number, the following <p>s = the fact.
 *   A head authored as leading block rows (a row holding a heading or a link) is accepted too.
 *
 * @variants block: eggplant (default flower) — the bubble colour (eggplant = white text)
 * Behaviour (live): below 768px the facts are a snap-scroll slider with prev / next buttons.
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRONS = {
  left: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z',
  right: 'M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z',
};
const BUBBLE = 'M14.1082 290.5C40.7449 193.681 94.4564 111.976 147.182 61.5808C201.266 10.5752 '
  + '254.364 -9.12045 311.194 3.89536C367.813 16.9369 422.737 56.6462 476.236 103.181C528.604 '
  + '150.705 579.547 205.047 602.152 270.409C624.706 335.325 610.69 404.384 557.162 468.001'
  + 'C504.801 530.613 412.92 587.8 306.68 606.017C200.674 624.99 106.15 597.901 53.5555 538.058'
  + 'C-0.440844 478.842 -12.5139 386.872 14.1082 290.5Z';

function svgEl(viewBox, d, extra = {}) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', viewBox);
  svg.setAttribute('aria-hidden', 'true');
  Object.entries(extra).forEach(([k, v]) => svg.setAttribute(k, v));
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  return svg;
}

function navButton(dir) {
  const b = document.createElement('button');
  b.type = 'button';
  const name = dir === 'left' ? 'prev' : 'next';
  b.className = `ft-button variant-icon-primary color-skyblue slider-${name}`;
  b.setAttribute('aria-label', dir === 'left' ? 'Previous fact' : 'Next fact');
  const span = document.createElement('span');
  span.className = 'ft-icon';
  span.append(svgEl('0 0 24 24', CHEVRONS[dir]));
  b.append(span);
  return b;
}

/** Elements of the section head (default content before the block, or leading head rows). */
function headNodes(block, rows) {
  const nodes = [];
  const wrapper = block.parentElement;
  const prevEl = wrapper && wrapper.previousElementSibling;
  if (prevEl && prevEl.classList.contains('default-content-wrapper')) {
    nodes.push(...prevEl.children);
    prevEl.remove();
  }
  // defensive decode: head rows inside the table (a heading or a lone link)
  while (rows.length && rows[0].querySelector('h1, h2, h3, h4, a')) {
    const row = rows.shift();
    row.querySelectorAll(':scope > div > *').forEach((el) => nodes.push(el));
    row.remove();
  }
  return nodes;
}

function buildHead(nodes) {
  const content = document.createElement('div');
  content.className = 'nft-content';
  let seenHeading = false;
  nodes.forEach((n) => {
    if (/^H[1-6]$/.test(n.tagName)) {
      seenHeading = true;
      content.append(wrapNode(n, 'nft-title'));
    } else if (n.querySelector && n.querySelector('a')
      && n.textContent.trim() === n.querySelector('a').textContent.trim()) {
      content.append(wrapNode(n, 'nft-cta'));
    } else if (!seenHeading) {
      content.append(wrapNode(n, 'nft-label'));
    } else {
      content.append(wrapNode(n, 'nft-text'));
    }
  });
  return content;
}

function buildFact(row) {
  const ps = [];
  row.querySelectorAll(':scope > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) ps.push(...kids);
    else if (cell.textContent.trim()) {
      // harness-only fallback (EW5): bare text cell — move its text node into a <p>
      const p = document.createElement('p');
      p.append(...cell.childNodes);
      ps.push(p);
    }
  });
  if (!ps.length) return null;
  const li = document.createElement('li');
  li.className = 'nft-item';
  const fact = document.createElement('div');
  fact.className = 'number-fact';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.append(svgEl('0 0 613 612', BUBBLE, { preserveAspectRatio: 'none', fill: 'none' }));
  const content = document.createElement('div');
  content.className = 'number-fact-content';
  const [num, ...rest] = ps;
  content.append(wrapNode(num, 'number'));
  if (rest.length) {
    const factText = document.createElement('div');
    factText.className = 'fact';
    factText.append(...rest);
    content.append(factText);
  }
  fact.append(bubble, content);
  li.append(fact);
  return li;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const head = buildHead(headNodes(block, rows));

  const slider = document.createElement('div');
  slider.className = 'nft-slider';
  const list = document.createElement('ul');
  list.className = 'nft-items';
  rows.map(buildFact).filter(Boolean).forEach((li) => list.append(li));
  const prev = navButton('left');
  const next = navButton('right');
  slider.append(list, prev, next);

  const grid = document.createElement('div');
  grid.className = 'u-grid nft-grid';
  grid.append(slider);
  if (head.children.length) grid.append(head);
  block.replaceChildren(grid);

  const step = (d) => list.scrollBy({ left: d * list.clientWidth, behavior: 'smooth' });
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
}
