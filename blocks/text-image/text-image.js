/**
 * text-image — heading, text and CTA beside a square image (live TextImage / TextImage--wrapper).
 * Schema: stardust/eds-schema/en.json, sections 4 and 5 (heading, body, cta + 1 img).
 * Decode tier: template-slotted (fixed composition; authored nodes move into the slots).
 *
 * Authoring: one row — text cell (<h2>, text <p>s, CTA <p><strong><a>) and image cell; cells
 * are classified by content, so the cell order is free.
 *
 * @variants block: grey | wave | reverse | trailing-break (default white, no wave, text left)
 *   grey = grey band · wave = the grey wave divider above the band (live has-wave) ·
 *   reverse = image left of the text from 768px (live order-reverse) ·
 *   trailing-break = the empty line live renders under a Richtext <p> (pre-line)
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
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

function wave() {
  const w = document.createElement('div');
  w.className = 'wave';
  w.setAttribute('aria-hidden', 'true');
  WAVES.forEach(([name, viewBox, d]) => {
    const box = document.createElement('div');
    box.className = `wave-${name}`;
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('fill', 'currentColor');
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
    box.append(svg);
    w.append(box);
  });
  return w;
}

export default async function decorate(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    [...cell.children].forEach((el) => {
      if (el.tagName === 'P' && el.querySelector('picture, img') && !el.textContent.trim()) {
        nodes.push(...[...el.querySelectorAll('picture, img')]
          .filter((m) => m.tagName === 'PICTURE' || !m.closest('picture')));
      } else nodes.push(el);
    });
  });
  const media = nodes.find((n) => n.matches('picture, img'));
  const heading = nodes.find((n) => /^H[1-6]$/.test(n.tagName));
  const isCta = (n) => {
    const a = n.querySelector && n.querySelector('a');
    return a && n.textContent.trim() === a.textContent.trim();
  };
  const ctas = nodes.filter((n) => n !== media && n !== heading && isCta(n));
  const texts = nodes.filter((n) => n !== media && n !== heading && !ctas.includes(n));

  const content = document.createElement('div');
  content.className = 'text-image-content';
  if (heading) content.append(wrapNode(heading, 'text-image-title'));
  if (texts.length) {
    const t = document.createElement('div');
    t.className = 'text-image-text';
    t.append(...texts);
    content.append(t);
  }
  if (ctas.length) {
    const a = document.createElement('div');
    a.className = 'text-image-cta';
    a.append(...ctas);
    content.append(a);
  }
  const inner = document.createElement('div');
  inner.className = 'text-image-inner';
  inner.append(content);
  if (media) inner.append(wrapNode(wrapNode(media, 'image'), 'text-image-image'));
  const grid = document.createElement('div');
  grid.className = 'u-grid text-image-grid';
  grid.append(inner);
  const band = document.createElement('div');
  band.className = 'text-image-band';
  band.append(grid);
  block.replaceChildren(band);
  if (block.classList.contains('wave')) block.prepend(wave());
}
