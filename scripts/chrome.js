/**
 * Chrome icon set (header + footer), lifted from the gated prototype sprite and the live
 * capture (tiktok, youtube). Inline SVG paths; currentColor fill.
 */
const ICONS = {
  'arrow-left': {
    viewBox: '0 0 24 24',
    paths: [
      'M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z',
    ],
  },
  'arrow-right': {
    viewBox: '0 0 24 24',
    paths: [
      'M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z',
    ],
  },
  'chevron-down': {
    viewBox: '0 0 24 24',
    paths: [
      'M18.3125 9.70492L16.9025 8.29492L12.3125 12.8749L7.7225 8.29492L6.3125 9.70492L12.3125'
        + ' 15.7049L18.3125 9.70492Z',
    ],
  },
  'chevron-left': {
    viewBox: '0 0 24 24',
    paths: [
      'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z',
    ],
  },
  'chevron-right': {
    viewBox: '0 0 48 48',
    paths: [
      'M20 12L17.18 14.82L26.34 24L17.18 33.18L20 36L32 24L20 12Z',
    ],
  },
  close: {
    viewBox: '0 0 24 24',
    paths: [
      'M20.4144 5.00003L19.0002 3.58582L12.0002 10.5858L5.00015 3.58582L3.58594'
        + ' 5.00003L10.5859 12L3.58594 19L5.00015 20.4142L12.0002 13.4142L19.0002 20.4142L20.4144'
        + ' 19L13.4144 12L20.4144 5.00003Z',
    ],
  },
  facebook: {
    viewBox: '0 0 24 24',
    paths: [
      'M9.03153 23L9 13H5V9H9V6.5C9 2.7886 11.2983 1 14.6091 1C16.1951 1 17.5581 1.11807'
        + ' 17.9553 1.17085V5.04948L15.6591 5.05052C13.8584 5.05052 13.5098 5.90614 13.5098'
        + ' 7.16171V9H18.75L16.75 13H13.5098V23H9.03153Z',
    ],
  },
  globe: {
    viewBox: '0 0 24 24',
    paths: [
      'M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48'
        + ' 17.52 2 11.99 2ZM18.92 8H15.97C15.65 6.75 15.19 5.55 14.59 4.44C16.43 5.07 17.96 6.35'
        + ' 18.92 8ZM12 4.04C12.83 5.24 13.48 6.57 13.91 8H10.09C10.52 6.57 11.17 5.24 12'
        + ' 4.04ZM4.26 14C4.1 13.36 4 12.69 4 12C4 11.31 4.1 10.64 4.26 10H7.64C7.56 10.66 7.5'
        + ' 11.32 7.5 12C7.5 12.68 7.56 13.34 7.64 14H4.26ZM5.08 16H8.03C8.35 17.25 8.81 18.45'
        + ' 9.41 19.56C7.57 18.93 6.04 17.66 5.08 16ZM8.03 8H5.08C6.04 6.34 7.57 5.07 9.41'
        + ' 4.44C8.81 5.55 8.35 6.75 8.03 8ZM12 19.96C11.17 18.76 10.52 17.43 10.09 16H13.91C13.48'
        + ' 17.43 12.83 18.76 12 19.96ZM14.34 14H9.66C9.57 13.34 9.5 12.68 9.5 12C9.5 11.32 9.57'
        + ' 10.65 9.66 10H14.34C14.43 10.65 14.5 11.32 14.5 12C14.5 12.68 14.43 13.34 14.34'
        + ' 14ZM14.59 19.56C15.19 18.45 15.65 17.25 15.97 16H18.92C17.96 17.65 16.43 18.93 14.59'
        + ' 19.56ZM16.36 14C16.44 13.34 16.5 12.68 16.5 12C16.5 11.32 16.44 10.66 16.36'
        + ' 10H19.74C19.9 10.64 20 11.31 20 12C20 12.69 19.9 13.36 19.74 14H16.36Z',
    ],
  },
  instagram: {
    viewBox: '0 0 24 24',
    paths: [
      'M8 3C5.243 3 3 5.243 3 8V16C3 18.757 5.243 21 8 21H16C18.757 21 21 18.757 21 16V8C21'
        + ' 5.243 18.757 3 16 3H8ZM8 5H16C17.654 5 19 6.346 19 8V16C19 17.654 17.654 19 16'
        + ' 19H8C6.346 19 5 17.654 5 16V8C5 6.346 6.346 5 8 5ZM17 6C16.7348 6 16.4804 6.10536'
        + ' 16.2929 6.29289C16.1054 6.48043 16 6.73478 16 7C16 7.26522 16.1054 7.51957 16.2929'
        + ' 7.70711C16.4804 7.89464 16.7348 8 17 8C17.2652 8 17.5196 7.89464 17.7071'
        + ' 7.70711C17.8946 7.51957 18 7.26522 18 7C18 6.73478 17.8946 6.48043 17.7071'
        + ' 6.29289C17.5196 6.10536 17.2652 6 17 6ZM12 7C9.243 7 7 9.243 7 12C7 14.757 9.243 17 12'
        + ' 17C14.757 17 17 14.757 17 12C17 9.243 14.757 7 12 7ZM12 9C13.654 9 15 10.346 15 12C15'
        + ' 13.654 13.654 15 12 15C10.346 15 9 13.654 9 12C9 10.346 10.346 9 12 9Z',
    ],
  },
  linkedin: {
    viewBox: '0 0 24 24',
    paths: [
      'M5 3C3.895 3 3 3.895 3 5V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V5C21'
        + ' 3.895 20.105 3 19 3H5ZM5 5H19V19H5V5ZM7.7793 6.31641C6.9223 6.31641 6.4082 6.83158'
        + ' 6.4082 7.51758C6.4082 8.20358 6.92236 8.7168 7.69336 8.7168C8.55036 8.7168 9.06445'
        + ' 8.20358 9.06445 7.51758C9.06445 6.83158 8.5503 6.31641 7.7793 6.31641ZM6.47656'
        + ' 10V17H9V10H6.47656ZM11.082 10V17H13.6055V13.1738C13.6055 12.0348 14.4181 11.8711'
        + ' 14.6621 11.8711C14.9061 11.8711 15.5586 12.1158 15.5586 13.1738V17H18V13.1738C18'
        + ' 10.9768 17.0237 10 15.8027 10C14.5817 10 13.9305 10.4066 13.6055 10.9766V10H11.082Z',
    ],
  },
  menu: {
    viewBox: '0 0 24 24',
    paths: [
      'M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z',
    ],
  },
  search: {
    viewBox: '0 0 24 24',
    paths: [
      'M22.5623 20.4389L17.3293 15.2059C18.6419 13.3612 19.2134 11.0906 18.9306'
        + ' 8.84432C18.6478 6.59801 17.5313 4.53994 15.8025 3.0781C14.0736 1.61626 11.8586'
        + ' 0.857357 9.59656 0.951841C7.33449 1.04633 5.19048 1.98729 3.58956 3.58822C1.98864'
        + ' 5.18914 1.04767 7.33314 0.953184 9.59522C0.8587 11.8573 1.6176 14.0723 3.07944'
        + ' 15.8011C4.54128 17.53 6.59935 18.6465 8.84566 18.9293C11.092 19.2121 13.3626 18.6405'
        + ' 15.2073 17.3279L20.4403 22.5609C20.7217 22.8423 21.1033 23.0004 21.5013'
        + ' 23.0004C21.8992 23.0004 22.2809 22.8423 22.5623 22.5609C22.8437 22.2796 23.0018'
        + ' 21.8979 23.0018 21.4999C23.0018 21.102 22.8437 20.7203 22.5623 20.4389ZM3.00129'
        + ' 9.99995C3.00129 8.61548 3.41183 7.2621 4.181 6.11096C4.95017 4.95981 6.04342 4.0626'
        + ' 7.32251 3.53279C8.60159 3.00298 10.0091 2.86435 11.3669 3.13445C12.7248 3.40455'
        + ' 13.9721 4.07123 14.951 5.0502C15.93 6.02917 16.5967 7.27645 16.8668 8.63432C17.1369'
        + ' 9.99218 16.9983 11.3997 16.4684 12.6787C15.9386 13.9578 15.0414 15.0511 13.8903'
        + ' 15.8202C12.7391 16.5894 11.3858 16.9999 10.0013 16.9999C8.14543 16.9978 6.36618'
        + ' 16.2597 5.05388 14.9474C3.74159 13.6351 3.00341 11.8558 3.00129 9.99995Z',
    ],
  },
  trash: {
    viewBox: '0 0 24 24',
    paths: [
      'M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5'
        + ' 3H9.5L8.5 4H5V6H19V4H15.5Z',
    ],
  },
  tiktok: {
    viewBox: '0 0 24 24',
    paths: [
      'M20.8,7c-1.1,0-2.2-.4-3-1-1-.7-1.7-1.8-1.9-3,0-.3,0-.6,0-.9h-3.3v13.8c0,1.3-.9,2.4-2,2.8'
        + '-.3.1-.7.2-1.1.1-.5,0-1-.2-1.4-.4-.9-.5-1.4-1.4-1.4-2.5,0-1.7,1.3-3,3-3s.6,0,.9.1v-3.3c-'
        + '.3,0-.6,0-.9,0-1.8,0-3.5.8-4.7,2.1-.9,1-1.5,2.3-1.5,3.7-.1,1.8.5,3.5,1.8,4.8.2.2.4.4.6.5'
        + ',1.1.8,2.4,1.3,3.8,1.3s.6,0,.9,0c1.3-.2,2.5-.8,3.5-1.7,1.2-1.2,1.8-2.7,1.8-4.4v-7.3c.5.4'
        + ',1.2.8,1.8,1.1,1,.4,2.1.7,3.2.7v-3.3s0,0,0,0h0Z',
    ],
  },
  youtube: {
    viewBox: '0 0 24 24',
    paths: [
      'M12 4C12 4 5.74555 3.99997 4.18555 4.41797C3.32455 4.64797 2.64797 5.32555 2.41797'
        + ' 6.18555C1.99997 7.74555 2 12 2 12C2 12 1.99997 16.2545 2.41797 17.8145C2.64797 18.6755'
        + ' 3.32555 19.352 4.18555 19.582C5.74555 20 12 20 12 20C12 20 18.2545 20 19.8145'
        + ' 19.582C20.6745 19.352 21.352 18.6745 21.582 17.8145C22 16.2545 22 12 22 12C22 12 22'
        + ' 7.74555 21.582 6.18555C21.352 5.32555 20.6745 4.64797 19.8145 4.41797C18.2545 3.99997'
        + ' 12 4 12 4ZM12 6C14.882 6 18.4909 6.13361 19.2969 6.34961C19.4659 6.39461 19.6044'
        + ' 6.53312 19.6504 6.70312C19.8914 7.60113 20 10.342 20 12C20 13.658 19.8914 16.3979'
        + ' 19.6504 17.2969C19.6054 17.4659 19.4669 17.6044 19.2969 17.6504C18.4919 17.8664 14.882'
        + ' 18 12 18C9.119 18 5.51012 17.8664 4.70312 17.6504C4.53413 17.6054 4.39561 17.4669'
        + ' 4.34961 17.2969C4.10861 16.3989 4 13.658 4 12C4 10.342 4.10861 7.60117 4.34961'
        + ' 6.70117C4.39461 6.53317 4.53312 6.39461 4.70312 6.34961C5.50813 6.13361 9.118 6 12'
        + ' 6ZM10 8.53516V15.4648L16 12L10 8.53516Z',
    ],
  },
};

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Injects the hidden symbol sprite once (live + prototype render icons as <use> refs). */
function ensureSprite() {
  if (document.getElementById('ft-icon-sprite')) return;
  const sprite = document.createElementNS(SVG_NS, 'svg');
  sprite.id = 'ft-icon-sprite';
  sprite.setAttribute('aria-hidden', 'true');
  sprite.style.display = 'none';
  Object.entries(ICONS).forEach(([name, def]) => {
    const symbol = document.createElementNS(SVG_NS, 'symbol');
    symbol.id = `ft-icon-${name}`;
    symbol.setAttribute('viewBox', def.viewBox);
    symbol.setAttribute('fill', 'none');
    def.paths.forEach((d) => {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'currentColor');
      symbol.append(path);
    });
    sprite.append(symbol);
  });
  document.body.prepend(sprite);
}

/**
 * Builds an icon element: <span class="ft-icon …"><svg aria-hidden="true"><use href="#…">.
 * @param {string} name icon key
 * @param {string} [classes] extra classes for the wrapper span
 * @returns {HTMLSpanElement}
 */
export function icon(name, classes = '') {
  const span = document.createElement('span');
  span.className = `ft-icon ${classes}`.trim();
  if (!ICONS[name]) return span;
  ensureSprite();
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS(SVG_NS, 'use');
  use.setAttribute('href', `#ft-icon-${name}`);
  svg.append(use);
  span.append(svg);
  return span;
}

/**
 * Picks the social icon key for a profile URL.
 * @param {string} href
 * @returns {string}
 */
export function socialIcon(href) {
  const host = (() => {
    try {
      return new URL(href, window.location.href).hostname;
    } catch (e) {
      return '';
    }
  })();
  return ['facebook', 'instagram', 'linkedin', 'tiktok', 'youtube']
    .find((k) => host.includes(k)) || 'arrow-right';
}

/**
 * Wraps a node's direct text in a span with the given class (moves the text nodes).
 * @param {Element} el
 * @param {string} cls
 * @returns {HTMLSpanElement}
 */
export function wrapText(el, cls) {
  const span = document.createElement('span');
  span.className = cls;
  span.append(...el.childNodes);
  el.append(span);
  return span;
}

/**
 * Locale of the current page from its first path segment (en, de-de, ch-de …).
 * @returns {string} '' for the global English tree
 */
export function pageLocale() {
  const seg = window.location.pathname.split('/')[1] || '';
  return /^[a-z]{2}-[a-z]{2}$/.test(seg) ? seg : '';
}

/**
 * Reads a `key: value` UI-string list (the chrome documents' labels section).
 * @param {Element} [section]
 * @returns {Object<string, string>}
 */
export function chromeLabels(section) {
  const map = {};
  if (!section) return map;
  section.querySelectorAll('li').forEach((li) => {
    const m = li.textContent.match(/^\s*([a-z-]+):\s?([\s\S]*?)\s*$/);
    if (m) {
      const [, key, value] = m;
      map[key] = value;
    }
  });
  return map;
}

/**
 * Removes Experience Workspace instrumentation from a presentational clone (EW4).
 * @param {Element} node
 * @returns {Element}
 */
export function stripInstrumentation(node) {
  const attrs = ['data-prose-index', 'data-image-index', 'data-block-index'];
  [node, ...node.querySelectorAll('*')].forEach((n) => attrs.forEach((a) => n.removeAttribute(a)));
  return node;
}
