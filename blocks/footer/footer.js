import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import {
  icon, socialIcon, wrapText, pageLocale, chromeLabels,
} from '../../scripts/chrome.js';

/**
 * Footer — fairtrade.net Footer, template-slotted from the gated prototype chrome.
 *
 * Reads the authored footer document (`/footer`, `/<locale>/footer`, or `footer` metadata).
 * Sections, identified by content:
 *   meta       — `<p>locale label</p>` (+ optional logo picture, e.g. the ZEWO seal)
 *   link lists — `<p>title</p><ul>links</ul>` repeated (one column per pair); a title that is
 *                one link (`<p><a>title</a></p>`) renders as the live chevron-led linked title
 *   social     — `<p>title</p><ul>` profile links (link text = accessible label)
 *   newsletter — `<p>title</p><p><a>CTA</a></p>`
 *   labels     — `<ul>` of `key: value` UI strings
 * Authored paragraphs, lists and anchors are MOVED into the template (EW1).
 * @ew-exempt labels — `key: value` UI strings are text-as-metadata
 * @ew-exempt locale label — moved into the <button> that opens the header's locale selector (EW7)
 */

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === null || v === undefined) return;
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  });
  node.append(...children.filter((c) => c !== null && c !== undefined));
  return node;
}

const hidden = (text) => el('span', { class: 'visuallyhidden' }, text || '');

function linkOf(li) {
  return li.querySelector(':scope > a, :scope > p > a');
}

/** Pairs each title paragraph with the list that follows it. */
function titledLists(section) {
  const pairs = [];
  let title = null;
  [...section.children].forEach((child) => {
    const next = child.nextElementSibling;
    const linkedTitle = child.tagName === 'P' && next && next.tagName === 'UL'
      && child.querySelector('a') && child.textContent.trim() === child.querySelector('a').textContent.trim();
    if ((child.tagName === 'P' && !child.querySelector('a')) || linkedTitle) {
      title = child;
    } else if (child.tagName === 'UL' || child.tagName === 'OL') {
      pairs.push({ title, list: child });
      title = null;
    }
  });
  return pairs;
}

function readSections(fragment) {
  const wrappers = [...fragment.querySelectorAll(':scope > .section')]
    .map((s) => s.querySelector('.default-content-wrapper') || s);
  const labelsSec = wrappers.find((w) => {
    const items = [...w.querySelectorAll(':scope > ul > li')];
    return items.length && items.every((li) => /^[a-z-]+:\s/.test(li.textContent.trim()));
  });
  const rest = wrappers.filter((w) => w !== labelsSec);
  const meta = rest.find((w) => !w.querySelector(':scope > ul') && !w.querySelector('a')) || null;
  const lists = rest.filter((w) => w !== meta && w.querySelector(':scope > ul'));
  const columns = lists.find((w) => titledLists(w).length > 1) || lists[0];
  const social = lists.find((w) => w !== columns) || null;
  const newsletter = rest.find((w) => w !== meta && !lists.includes(w)) || null;
  return {
    meta, columns, social, newsletter, labels: chromeLabels(labelsSec),
  };
}

function buildMeta(section, labels) {
  const logo = el('div', { class: 'ft-footer-logo' });
  const paras = section ? [...section.querySelectorAll(':scope > p')] : [];
  const media = section && section.querySelector('picture, img');
  if (media) logo.append(el('div', {}, el('a', {}, media)));
  const labelP = paras.find((p) => !p.querySelector('picture, img'));
  const button = el(
    'button',
    {
      class: 'locale-selector-trigger color-white',
      type: 'button',
      'aria-controls': 'locale-selector',
    },
    icon('globe'),
    el('span', { class: 'locale-selector-trigger-label' }, ...(labelP ? labelP.childNodes : [])),
    hidden(labels['locale-hidden']),
  );
  return el(
    'div',
    { class: 'ft-footer-meta' },
    logo,
    el('div', { class: 'ft-footer-locale-selector-trigger' }, button),
  );
}

function buildColumns(section) {
  const lists = el('ul', { class: 'ft-footer-link-lists' });
  if (!section) return lists;
  titledLists(section).forEach(({ title, list }) => {
    const inner = el('div', { class: 'ft-footer-link-list-inner' });
    if (title) {
      title.className = 'ft-footer-link-list-title';
      const titleLink = title.querySelector('a');
      if (titleLink) {
        // live FooterLinkList--title--link: a chevron-led linked column title
        titleLink.className = 'ft-footer-link-list-title-link';
        title.replaceChildren(icon('chevron-right'), titleLink);
      } else wrapText(title, '');
      inner.append(title);
    }
    list.className = 'ft-footer-link-list-list';
    [...list.children].forEach((li) => {
      li.className = 'ft-footer-link-list-item';
      const a = linkOf(li);
      if (a) {
        a.className = 'ft-footer-link-list-link';
        if (a.parentElement !== li) li.replaceChildren(a);
      }
      li.prepend(icon('chevron-right'));
    });
    inner.append(list);
    lists.append(el('li', { class: 'ft-footer-link-list' }, inner));
  });
  return lists;
}

function buildSocial(section) {
  const box = el('div', { class: 'ft-footer-social-media-links' });
  if (!section) return el('div', { class: 'ft-footer-social' }, box);
  const [pair] = titledLists(section);
  if (pair && pair.title) {
    pair.title.className = 'ft-footer-social-media-links-title';
    box.append(pair.title);
  }
  if (pair) {
    const { list } = pair;
    list.className = 'ft-footer-social-media-links-list';
    [...list.children].forEach((li) => {
      li.className = 'ft-footer-social-media-links-item';
      const a = linkOf(li);
      if (!a) return;
      const name = icon(socialIcon(a.href));
      const label = wrapText(a, 'visuallyhidden');
      a.className = 'ft-button variant-icon-primary color-leafgreen';
      a.prepend(el('span', { class: 'ft-button-icon' }, name));
      a.append(label);
      if (a.parentElement !== li) li.replaceChildren(a);
    });
    box.append(list);
  }
  return el('div', { class: 'ft-footer-social' }, box);
}

function buildNewsletter(section) {
  const box = el('div', { class: 'ft-footer-newsletter' });
  if (!section) return box;
  const title = [...section.querySelectorAll(':scope > p')].find((p) => !p.querySelector('a'));
  const cta = section.querySelector('a');
  if (title) {
    title.className = 'ft-footer-newsletter-title';
    box.append(title);
  }
  if (cta) {
    cta.className = 'ft-button ft-footer-newsletter-button variant-secondary color-leafgreen'
      + ' theme-dark';
    wrapText(cta, 'ft-button-inner');
    box.append(cta);
  }
  return box;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const locale = pageLocale();
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : `${locale ? `/${locale}` : ''}/footer`;
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  const s = readSections(fragment);
  const grid = el(
    'div',
    { class: 'ft-footer-grid' },
    buildMeta(s.meta, s.labels),
    buildColumns(s.columns),
    el('div', { class: 'ft-footer-leads' }, buildSocial(s.social), buildNewsletter(s.newsletter)),
  );
  block.replaceChildren(el('div', { class: 'ft-footer' }, grid));
}
