/**
 * teaser-grid — grid of linked info teasers (live TeaserGrid / InfoTeaser).
 * Schema: stardust/eds-schema/en.json, section 3 (3 × TeaserGrid--item: img, date tag,
 * pretitle + title heading, text, "Read more").
 * Decode tier: reconstructive (one card per row; a flattened cell is segmented on <h3>).
 * The section head ("Latest News") stays default content, styled in place.
 *
 * Authoring rows (one row per card):
 *   cell 1: image (left empty = the live empty image box: an article without a teaser image)
 *   cell 2: date <p> (before the heading) · <h3> with a leading <strong> pretitle · text <p> ·
 *           link <p><a> (card target; its label renders as the tertiary "Read more")
 * The whole card becomes the link (EW6: the authored anchor is unwrapped after reading href).
 *
 * Filter row (variant `filter`, live FilteredTeaserGrid select): a row holding only a list
 *   (<ul>/<ol>, one <li> per option, first = selected) becomes the select above the grid. The
 *   authored list MOVES into the options popup (EW1); the field label is a presentational copy
 *   of the selected option (EW4, no instrumentation). The cards are a static snapshot
 *   (dynamic-features row 7), so choosing an option changes the selection state only.
 *
 * @variants block: small | filter (default regular) — small = 2 / 3 columns at 768 / 1024;
 *   filter = the option-list row renders as the live select
 */

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

const isHeading = (el) => /^H[1-6]$/.test(el.tagName);
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

const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON_DOWN = 'M18.3125 9.70492L16.9025 8.29492L12.3125 12.8749L7.7225 8.29492L6.3125 '
  + '9.70492L12.3125 15.7049L18.3125 9.70492Z';

/** A row whose only authored node is a list = the filter options (variant `filter`). */
const isFilterRow = (row) => {
  const ns = rowNodes(row);
  return ns.length === 1 && /^(UL|OL)$/.test(ns[0].tagName) ? ns[0] : null;
};

function buildFilter(list) {
  const wrap = document.createElement('div');
  wrap.className = 'teaser-grid-filter';
  const form = document.createElement('form');
  form.className = 'teaser-grid-select';
  form.addEventListener('submit', (e) => e.preventDefault());
  const select = document.createElement('div');
  select.className = 'select';
  const field = document.createElement('div');
  field.className = 'select-field';
  const fake = document.createElement('button');
  fake.type = 'button';
  fake.className = 'select-fake';
  fake.setAttribute('role', 'combobox');
  fake.setAttribute('aria-haspopup', 'listbox');
  fake.setAttribute('aria-expanded', 'false');
  const icon = document.createElement('span');
  icon.className = 'ft-button variant-icon-secondary color-skyblue select-icon';
  icon.setAttribute('aria-hidden', 'true');
  const ic = document.createElement('span');
  ic.className = 'ft-icon';
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRON_DOWN);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  ic.append(svg);
  icon.append(ic);
  field.append(fake, icon);
  const pop = document.createElement('div');
  pop.className = 'select-options';
  list.setAttribute('role', 'listbox');
  const items = [...list.children];
  const choose = (li) => {
    items.forEach((o) => o.setAttribute('aria-selected', String(o === li)));
    fake.textContent = li.textContent; // presentational copy of the selected option (EW4)
  };
  items.forEach((li) => {
    li.setAttribute('role', 'option');
    li.tabIndex = 0;
    li.addEventListener('click', () => {
      choose(li);
      select.classList.remove('is-open');
      fake.setAttribute('aria-expanded', 'false');
    });
  });
  if (items[0]) choose(items[0]);
  pop.append(list);
  fake.addEventListener('click', () => {
    const open = select.classList.toggle('is-open');
    fake.setAttribute('aria-expanded', String(open));
  });
  select.append(field, pop);
  form.append(select);
  wrap.append(form);
  return wrap;
}

function groups(block) {
  const rows = [...block.children].filter((r) => !isFilterRow(r));
  const perRow = rows.map((row) => {
    const ns = rowNodes(row);
    const cells = row.querySelectorAll(':scope > div');
    ns.emptyMedia = cells.length > 1 && !cells[0].children.length && !cells[0].textContent.trim();
    return ns;
  });
  if (perRow.length > 1) return perRow.filter((ns) => ns.length);
  // flattened single cell: one card per heading; media / tags before a heading join it
  const out = [];
  let cur = [];
  let hasHeading = false;
  (perRow[0] || []).forEach((n) => {
    if (hasHeading && (n.matches('picture, img') || (!isHeading(n) && !linkOnly(n)
      && cur.some((c) => linkOnly(c))))) {
      out.push(cur);
      cur = [];
      hasHeading = false;
    }
    if (isHeading(n)) {
      if (hasHeading) {
        out.push(cur);
        cur = [];
      }
      hasHeading = true;
    }
    cur.push(n);
  });
  if (cur.length) out.push(cur);
  return out;
}

function buildCard(nodes) {
  const media = nodes.find((n) => n.matches('picture, img'));
  const heading = nodes.find(isHeading);
  const linkP = nodes.find((n) => !isHeading(n) && linkOnly(n));
  const link = linkP ? linkOnly(linkP) : null;
  const hIdx = heading ? nodes.indexOf(heading) : -1;
  const others = nodes.filter((n) => n !== media && n !== heading && n !== linkP);
  const tags = others.filter((n) => hIdx >= 0 && nodes.indexOf(n) < hIdx);
  const texts = others.filter((n) => !tags.includes(n));

  const li = document.createElement('li');
  li.className = 'teaser-grid-item';
  const card = document.createElement(link ? 'a' : 'div');
  card.className = 'info-teaser';
  if (link) card.href = link.getAttribute('href');
  const inner = document.createElement('div');
  inner.className = 'info-teaser-inner';
  if (media) {
    inner.append(wrapNode(wrapNode(media, 'image'), 'info-teaser-image'));
  } else if (nodes.emptyMedia) {
    const box = document.createElement('div');
    box.className = 'image';
    inner.append(wrapNode(box, 'info-teaser-image'));
  }
  if (tags.length) {
    const t = document.createElement('div');
    t.className = 'info-teaser-tags';
    tags.forEach((n) => t.append(wrapNode(n, 'tag')));
    inner.append(t);
  }
  const content = document.createElement('div');
  content.className = 'info-teaser-content';
  if (heading) {
    // presentation refinement (EW2): the title text after the <strong> pretitle MOVES into a
    // span, as the live pretitle / title spans; textContent and the wrapper styles are unchanged
    const titleNodes = [...heading.childNodes].filter((n) => !(n.nodeType === 1
      && n.matches('strong, b')));
    if (titleNodes.length && titleNodes.length < heading.childNodes.length) {
      const title = document.createElement('span');
      title.className = 'info-teaser-title';
      titleNodes.forEach((n) => title.append(n));
      heading.append(title);
    }
    content.append(wrapNode(heading, 'info-teaser-header'));
  }
  texts.forEach((n) => content.append(wrapNode(n, 'info-teaser-text')));
  if (linkP) {
    const cta = document.createElement('div');
    cta.className = 'info-teaser-cta';
    const label = document.createElement('div');
    label.className = 'info-teaser-cta-inner';
    label.append(linkP);
    cta.append(label);
    content.append(cta);
    link.replaceWith(...link.childNodes);
  }
  inner.append(content);
  card.append(inner);
  li.append(card);
  return li;
}

export default async function decorate(block) {
  const filterRow = [...block.children].find(isFilterRow);
  const filter = filterRow ? buildFilter(isFilterRow(filterRow)) : null;
  const cards = groups(block).map(buildCard);
  const wrap = document.createElement('div');
  wrap.className = 'teaser-grid-inner';
  const ul = document.createElement('ul');
  ul.className = 'teaser-grid-grid';
  ul.append(...cards);
  wrap.append(ul);
  block.replaceChildren(...(filter ? [filter, wrap] : [wrap]));
  if (filter) block.classList.add('has-filter');
}
