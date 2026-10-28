import { icon } from '../../scripts/chrome.js';

/*
 * Product finder widget (search widget family, live ProductFinder module).
 * Data: product-finder-snapshot.json — the captured page-1 state of the source finder (24
 * product cards, the total count, the brand / category / organic facets with their captured
 * counts). The source queries a same-origin server API that is not reachable from this site, so
 * the filter runs client-side over the captured grid (dynamic-features row 6, interim):
 *   - no search term and no facet selected: the captured state (count, 24 cards, pagination);
 *     a page beyond the captured one opens the source finder (the full catalogue)
 *   - otherwise: the captured cards whose title / merchant contain the term and whose merchant
 *     matches a selected brand; category / organic carry no per-card data in the capture, so a
 *     selected value matches only cards that declare it (none today → the no-result state)
 * Behaviour as live: form change / submit applies, tags per checked value + "clear all",
 * dropdown selects, filter accordion (mobile header), pagination window (mobile-first quirk:
 * the live module starts in its 640px window and switches only on a media change).
 * Authored content: none (the widget link); the page heading is the page-lead block.
 */

const base = () => (window.hlx && window.hlx.codeBasePath) || '';
const SVG_NS = 'http://www.w3.org/2000/svg';
const CHECKMARK = 'M15.854 3.146l-1.5-1.5a.5.5 0 00-.707 0L5.5 9.793 2.354 6.647a.5.5 0 00-.707 0'
  + 'l-1.5 1.499a.5.5 0 000 .707l5 5a.498.498 0 00.707 0l10-9.999a.5.5 0 000-.707v-.001z';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function checkmark() {
  const span = el('span', 'ft-icon size-small pf-checkbox-fake-checkbox-icon');
  span.setAttribute('aria-hidden', 'true');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'none');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHECKMARK);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  span.append(svg);
  return span;
}

function option(facetId, name, opt, i) {
  const li = el('li', 'pf-select-option');
  const box = el('div', 'pf-checkbox pf-select-option-checkbox');
  const input = el('input', 'pf-checkbox-hidden-checkbox visuallyhidden');
  input.type = 'checkbox';
  input.name = name;
  input.id = `pf-facet-${facetId}-${i}`;
  input.value = opt.value;
  const fake = el('div', 'pf-checkbox-fake-checkbox');
  fake.append(checkmark());
  const label = el('label', 'pf-checkbox-label', opt.label);
  label.htmlFor = input.id;
  label.dataset.count = opt.count;
  box.append(input, fake, label);
  li.append(box);
  return li;
}

function card(p, more) {
  const li = el('li', 'pf-product-teaser-grid-card');
  const a = el('a', 'pf-product-teaser');
  a.href = p.href;
  const media = el('div', 'pf-product-teaser-image');
  const frame = el('div', 'pf-image square');
  const img = el('img');
  img.src = p.image;
  img.alt = '';
  img.loading = 'lazy';
  frame.append(img);
  media.append(frame);
  const cta = el('div', 'pf-product-teaser-cta');
  const fake = el('span', 'ft-button pf-product-teaser-fake-link variant-tertiary');
  fake.setAttribute('aria-hidden', 'true');
  fake.tabIndex = -1;
  fake.append(el('span', 'ft-button-inner', more));
  cta.append(fake);
  a.append(
    media,
    el('div', 'pf-product-teaser-merchant', p.merchant),
    el('div', 'pf-product-teaser-title', p.title),
    cta,
  );
  li.append(a);
  return li;
}

/** Live getPageArray: page window with "..." separators. */
function pageArray(pages, current, mobile) {
  const max = mobile ? 7 : 9;
  const span = mobile ? 5 : 7;
  const edge = mobile ? 3 : 5;
  const all = Array.from({ length: pages }, (_, i) => i + 1);
  if (pages <= max) return all;
  if (current <= edge) return [...all.slice(0, span), '...', pages];
  if (current > pages - edge) return [1, '...', ...all.slice(-span)];
  const half = Math.floor(span / 2);
  return [1, '...', ...all.slice(current - half + 1, current + half), '...', pages];
}

function decorateIcons(widget) {
  widget.querySelectorAll('[data-icon]').forEach((slot) => {
    const classes = slot.className.replace(/\bft-icon\b/, '').trim();
    const node = icon(slot.dataset.icon, classes);
    node.setAttribute('aria-hidden', 'true');
    slot.replaceWith(node);
  });
}

function setupSelects(widget) {
  const selects = [...widget.querySelectorAll('.pf-select')];
  const close = (except) => selects.forEach((s) => {
    if (s === except) return;
    s.classList.remove('is-open');
    s.querySelector('.pf-select-fake-select').setAttribute('aria-expanded', 'false');
  });
  selects.forEach((s) => {
    const button = s.querySelector('.pf-select-fake-select');
    button.addEventListener('click', () => {
      const open = !s.classList.contains('is-open');
      close(s);
      s.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest || !e.target.closest('.pf-select')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

function setupAccordion(widget) {
  const acc = widget.querySelector('.pf-accordion');
  const toggle = acc.querySelector('.pf-accordion-toggle');
  const content = acc.querySelector('.pf-accordion-content');
  toggle.addEventListener('click', () => {
    const open = !acc.classList.contains('is-open');
    acc.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    content.setAttribute('aria-hidden', String(!open));
  });
}

export default async function decorate(widget) {
  decorateIcons(widget);
  setupSelects(widget);
  setupAccordion(widget);

  let data;
  try {
    const resp = await fetch(`${base()}/widgets/search/product-finder-snapshot.json`);
    data = resp.ok ? await resp.json() : null;
  } catch (e) {
    data = null;
  }
  if (!data) return;

  const q = (sel) => widget.querySelector(`[data-pf="${sel}"]`);
  const form = q('form');
  const input = form.querySelector('.ft-input-field');
  const grid = q('teaser-grid');
  const count = q('count');
  const countLabel = q('count-label');
  const tags = q('tags');
  const list = q('pagination-list');
  const prev = q('prev');
  const next = q('next');
  const media = window.matchMedia('(max-width: 640px)');
  const state = {
    page: 1, mobile: true, results: data.products, total: data.total,
  };

  widget.querySelectorAll('[data-pf="filter"]').forEach((sel) => {
    const facet = data.facets[sel.dataset.facet];
    if (!facet) return;
    sel.querySelector('.pf-select-options')
      .append(...facet.options.map((opt, i) => option(sel.dataset.facet, facet.name, opt, i)));
  });

  const checked = () => [...form.querySelectorAll('input[type="checkbox"]:checked')];
  const active = () => input.value.trim() !== '' || checked().length > 0;

  const renderPagination = () => {
    const pages = Math.max(1, Math.ceil(state.total / data.pageSize));
    list.replaceChildren(...pageArray(pages, state.page, state.mobile).map((p) => {
      const li = el('li');
      if (p === '...') {
        li.append(el('span', 'pf-pagination-dots', p));
        return li;
      }
      const a = el('a', `pf-pagination-link ${p === state.page ? 'is-current' : ''}`, String(p));
      a.href = `#${p}`;
      a.setAttribute('aria-current', p === state.page ? 'page' : '');
      a.setAttribute('aria-label', p === state.page
        ? `${data.labels.currentPage}${p}` : `${data.labels.goToPage}${p}`);
      li.append(a);
      return li;
    }));
    prev.toggleAttribute('disabled', state.page <= 1);
    next.toggleAttribute('disabled', state.page >= pages);
  };

  const render = () => {
    const start = (state.page - 1) * data.pageSize;
    const shown = active() ? state.results.slice(start, start + data.pageSize) : data.products;
    grid.replaceChildren(...shown.map((p) => card(p, data.labels.more)));
    count.dataset.count = state.total;
    countLabel.textContent = state.total;
    widget.classList.toggle('no-results', shown.length === 0);
    renderPagination();
  };

  const renderTags = () => {
    const all = tags.querySelector('[data-pf-delete="all"]');
    const items = checked().map((box) => {
      const tag = el('button', 'pf-tag dark');
      tag.type = 'button';
      tag.dataset.pfDelete = box.id;
      const del = el('span', 'pf-tag-delete');
      del.append(icon('close', 'size-small'));
      tag.append(el('span', 'pf-tag-label', form.querySelector(`label[for="${box.id}"]`)
        .textContent), del);
      return tag;
    });
    tags.replaceChildren(all, ...items);
    tags.dataset.activeFilters = items.length;
  };

  const apply = () => {
    state.page = 1;
    renderTags();
    if (!active()) {
      state.results = data.products;
      state.total = data.total;
      render();
      return;
    }
    const term = input.value.trim().toLowerCase();
    const selected = {};
    checked().forEach((box) => {
      const { facet } = box.closest('[data-pf="filter"]').dataset;
      const label = form.querySelector(`label[for="${box.id}"]`).textContent;
      (selected[facet] = selected[facet] || []).push({ value: box.value, label });
    });
    state.results = data.products.filter((p) => {
      if (term && !`${p.title} ${p.merchant}`.toLowerCase().includes(term)) return false;
      return Object.entries(selected).every(([facet, values]) => values.some((v) => {
        if (facet === 'brand') return v.label.toLowerCase() === p.merchant.toLowerCase();
        return p[facet] !== undefined && String(p[facet]) === v.value;
      }));
    });
    state.total = state.results.length;
    render();
  };

  const goTo = (page) => {
    if (!active() && page > 1) {
      window.location.href = data.source;
      return;
    }
    state.page = page;
    render();
  };

  form.addEventListener('change', apply);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    apply();
  });
  form.querySelector('.ft-input-clear').addEventListener('click', () => {
    input.value = '';
    input.focus();
    apply();
  });
  tags.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    const id = button && button.dataset.pfDelete;
    if (!id) return;
    const boxes = id === 'all' ? checked() : [form.querySelector(`#${CSS.escape(id)}`)];
    boxes.forEach((box) => { if (box) box.checked = false; });
    apply();
  });
  list.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    e.preventDefault();
    goTo(Number.parseInt(link.getAttribute('href').slice(1), 10));
  });
  prev.addEventListener('click', () => goTo(state.page - 1));
  next.addEventListener('click', () => goTo(state.page + 1));
  media.addEventListener('change', (e) => {
    state.mobile = e.matches;
    renderPagination();
  });

  render();
}
