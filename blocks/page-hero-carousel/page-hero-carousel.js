/**
 * page-hero-carousel — the landing hero carousel (live PageHeroCarousel / PageHeroSlide).
 * Schema: stardust/eds-schema/en.json, section 0 (3 × PageHeroSlide: heading, body, cta, 2 imgs).
 * Decode tier: reconstructive (one slide per heading; authors add / remove slides).
 *
 * Authoring rows (one row per slide):
 *   cell 1: the slide images — first = mobile crop (16:9 rendition shown square < 768px),
 *           second = desktop crop (21:9 rendition shown 16:9 >= 768px); one image serves both
 *   cell 2: headline (<h1> on the first slide, <h2> on the others — one page <h1>), text <p>,
 *           CTA <p> (<em><strong><a> = leafgreen accent button)
 * A flattened single cell is segmented on the headings; images before a heading join its slide.
 *
 * @variants block: leafgreen | nightsky (default skyblue) — the band colour
 * Behaviour (live): prev / next controls and bullets move the 600ms track; clicking the
 * peeking next slide activates it; below 1024px the last slide loops in left of the first
 * until the first move. No autoplay (none observed on the source).
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

function chevron(dir) {
  const span = document.createElement('span');
  span.className = 'ft-icon';
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRONS[dir]);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  span.append(svg);
  return span;
}

/** Authored elements of every cell, in order (expands the runtime's media-led <p> wrap). */
function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    [...cell.children].forEach((el) => {
      const media = el.matches('picture, img') ? el : null;
      if (media) {
        out.push(media);
        return;
      }
      if (el.tagName === 'P' && el.querySelector('picture, img')) {
        // a paragraph that only carries images → the images; anything else stays a paragraph
        const pics = [...el.querySelectorAll('picture, img')]
          .filter((m) => m.tagName === 'PICTURE' || !m.closest('picture'));
        if (!el.textContent.trim()) {
          out.push(...pics);
          return;
        }
      }
      out.push(el);
    });
  });
  return out;
}

function segment(nodes) {
  const slides = [];
  let cur = null;
  let pending = [];
  nodes.forEach((n) => {
    if (n.matches('picture, img')) {
      if (cur && cur.heading) {
        // an image after a complete slide opens the next one
        pending.push(n);
      } else if (cur) cur.media.push(n);
      else pending.push(n);
      return;
    }
    if (/^H[1-6]$/.test(n.tagName)) {
      if (!cur || cur.heading) {
        cur = {
          media: pending, heading: null, texts: [], ctas: [],
        };
        pending = [];
        slides.push(cur);
      }
      cur.heading = n;
      return;
    }
    if (!cur) {
      cur = {
        media: pending, heading: null, texts: [], ctas: [],
      };
      pending = [];
      slides.push(cur);
    }
    const a = n.querySelector('a');
    if (a && n.textContent.trim() === a.textContent.trim()) {
      cur.ctas.push(n);
    } else cur.texts.push(n);
  });
  if (pending.length && cur) cur.media.push(...pending);
  return slides;
}

function buildSlide(s) {
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.setAttribute('aria-roledescription', 'slide');
  const media = document.createElement('div');
  media.className = 'slide-media';
  const [mobile, desktop] = s.media;
  if (mobile) media.append(wrapNode(mobile, desktop ? 'image image-mobile' : 'image image-single'));
  if (desktop) media.append(wrapNode(desktop, 'image image-desktop'));
  s.media.slice(2).forEach((m) => media.append(wrapNode(m, 'image image-extra')));
  const content = document.createElement('div');
  content.className = 'slide-content';
  const inner = document.createElement('div');
  inner.className = 'slide-content-inner';
  if (s.heading) inner.append(wrapNode(s.heading, 'slide-title'));
  s.texts.forEach((t) => inner.append(wrapNode(t, 'slide-text')));
  if (s.ctas.length) {
    const actions = document.createElement('div');
    actions.className = 'slide-actions';
    actions.append(...s.ctas);
    inner.append(actions);
  }
  content.append(inner);
  slide.append(media, content);
  return slide;
}

function controlButton(dir) {
  const b = document.createElement('button');
  b.type = 'button';
  const name = dir === 'left' ? 'previous' : 'next';
  b.className = `ft-button variant-icon-primary color-leafgreen control-${name}`;
  b.setAttribute('aria-label', dir === 'left' ? 'Previous slide' : 'Next slide');
  b.append(chevron(dir));
  return b;
}

export default async function decorate(block) {
  const slidesData = segment(collectNodes(block));
  if (!slidesData.length) return;
  block.setAttribute('aria-roledescription', 'carousel');

  const grid = document.createElement('div');
  grid.className = 'u-grid hero-grid';
  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  const carousel = document.createElement('div');
  carousel.className = 'hero-carousel';
  const track = document.createElement('div');
  track.className = 'hero-track';
  const slides = slidesData.map(buildSlide);
  track.append(...slides);
  carousel.append(track);
  inner.append(carousel);

  const pagination = document.createElement('div');
  pagination.className = 'hero-pagination';
  const bullets = slides.map((s, k) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'hero-bullet';
    b.setAttribute('aria-label', `${k + 1} / ${slides.length}`);
    pagination.append(b);
    return b;
  });
  const controls = document.createElement('div');
  controls.className = 'hero-controls';
  const prev = controlButton('left');
  const next = controlButton('right');
  controls.append(prev, next);
  if (slides.length > 1) inner.append(pagination, controls);
  grid.append(inner);
  block.replaceChildren(grid);

  let i = 0;
  // live Swiper runs in loop mode past three slides: the controls never disable
  const loop = slides.length > 3;
  const paint = () => {
    slides.forEach((s, k) => {
      s.classList.toggle('is-active', k === i);
      s.classList.toggle('is-next', k === i + 1);
      s.classList.toggle('is-prev', k < i);
      s.classList.toggle('is-after', k > i + 1);
    });
    bullets.forEach((b, k) => {
      b.classList.toggle('is-active', k === i);
      if (k === i) b.setAttribute('aria-current', 'true');
      else b.removeAttribute('aria-current');
    });
    prev.disabled = !loop && i === 0;
    next.disabled = !loop && i === slides.length - 1;
  };
  const go = (n) => {
    i = loop ? (n + slides.length) % slides.length : Math.max(0, Math.min(slides.length - 1, n));
    paint();
    block.classList.add('is-moved');
    block.style.setProperty('--hero-index', String(i));
  };
  // initial state: the last slide is the looped one (left of the first below 1024px)
  if (slides.length > 2) slides[slides.length - 1].classList.add('is-loop');
  paint();
  prev.addEventListener('click', () => go(i - 1));
  next.addEventListener('click', () => go(i + 1));
  bullets.forEach((b, k) => b.addEventListener('click', () => go(k)));
  slides.forEach((s, k) => s.addEventListener('click', (e) => {
    if (k === i) return;
    if (e.target.closest('a')) e.preventDefault();
    go(k);
  }));
}
