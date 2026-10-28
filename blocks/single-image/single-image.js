/**
 * single-image — one content-width image with an optional caption (live SingleImage).
 * Schema: stardust/eds-schema/en-why-fairtrade-what-we-do-key-benefits.json, sections 2 and 5
 * (SingleImage: 2 × Image + figcaption).
 * Decode tier: template-slotted (fixed composition; authored nodes are classified by content
 * and MOVED into the slots, EW1; rows and cells are not indexed).
 *
 * Authoring (any row / cell shape):
 *   images = the picture: first = mobile crop (4:3 rendition, shown < 768px), second = desktop
 *     crop (16:9 rendition, shown from 768px); one image serves both
 *   paragraphs = the caption (shown after the live caption triangle icon)
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
// live sprite symbol #caption
const CAPTION = ['-6 -6 24 24', 'M5.106.789a1 1 0 011.788 0l4.382 8.764A1 1 0 0110.382 11H1.618'
  + 'a1 1 0 01-.894-1.447L5.106.789z'];

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

function captionIcon() {
  const span = document.createElement('span');
  span.className = 'single-image-caption-icon';
  span.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', CAPTION[0]);
  svg.setAttribute('fill', 'none');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CAPTION[1]);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  span.append(svg);
  return span;
}

const isMedia = (el) => el.matches('picture, img');

export default async function decorate(block) {
  const media = [];
  const texts = [];
  block.querySelectorAll(':scope > div > div > *').forEach((el) => {
    const pics = isMedia(el) ? [el] : [...el.querySelectorAll('picture, img')]
      .filter((m) => m.tagName === 'PICTURE' || !m.closest('picture'));
    if (pics.length && (isMedia(el) || !el.textContent.trim())) media.push(...pics);
    else texts.push(el);
  });

  const figure = document.createElement('figure');
  figure.className = 'single-image-figure';
  const [mobile, desktop] = media;
  // live DOM order: desktop image, then mobile image
  if (desktop) figure.append(wrapNode(desktop, 'image image-desktop'));
  if (mobile) figure.append(wrapNode(mobile, desktop ? 'image image-mobile' : 'image image-single'));
  if (texts.length) {
    const caption = document.createElement('figcaption');
    caption.className = 'single-image-caption';
    const text = document.createElement('div');
    text.className = 'single-image-caption-text';
    text.append(...texts);
    caption.append(captionIcon(), text);
    figure.append(caption);
  }
  const grid = document.createElement('div');
  grid.className = 'u-grid single-image-grid';
  grid.append(figure);
  block.replaceChildren(grid);
}
