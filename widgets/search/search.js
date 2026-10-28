import { icon } from '../../scripts/chrome.js';

/*
 * Site search results widget (live SearchResults module), reading `?q=`.
 * Corpus: the captured source result snapshot (search-snapshot.json, the source's result set per
 * captured term, rendered verbatim) + the site query-index (title / description match).
 * Authored content: the page `<h1>` in the same section, reabsorbed into the head slot.
 */

const base = () => (window.hlx && window.hlx.codeBasePath) || '';

async function fetchJson(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    return await resp.json();
  } catch (e) {
    return null;
  }
}

/** Appends text with `<strong>` markers (captured highlight) as text nodes + strong elements. */
function appendMarked(parent, marked) {
  String(marked).split(/(<strong>.*?<\/strong>)/).forEach((part) => {
    const m = part.match(/^<strong>(.*?)<\/strong>$/);
    if (m) {
      const strong = document.createElement('strong');
      [, strong.textContent] = m;
      parent.append(strong);
    } else if (part) {
      parent.append(document.createTextNode(part.replace(/<[^>]*>/g, '')));
    }
  });
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Marks every case-insensitive occurrence of the term with `<strong>` markers. */
function mark(text, term) {
  const plain = String(text || '').replace(/<[^>]*>/g, '');
  return plain.replace(new RegExp(`(${escapeRe(term)})`, 'gi'), '<strong>$1</strong>');
}

function resultItem(r) {
  const li = document.createElement('li');
  li.className = 'search-results-item';
  const box = document.createElement('div');
  box.className = 'search-result';
  const title = document.createElement('div');
  title.className = 'search-result-title';
  appendMarked(title, r.title);
  const link = document.createElement('a');
  link.className = 'search-result-link';
  link.href = r.url;
  link.textContent = r.text || r.url;
  box.append(title, link);
  if (r.description) {
    const desc = document.createElement('div');
    desc.className = 'search-result-description';
    appendMarked(desc, r.description);
    box.append(desc);
  }
  li.append(box);
  return li;
}

/** Results for a term: the captured snapshot when the term was captured, else a corpus match. */
async function search(term) {
  const snapshot = await fetchJson(`${base()}/widgets/search/search-snapshot.json`);
  const queries = (snapshot && snapshot.queries) || {};
  const captured = queries[term.toLowerCase()];
  if (captured) return captured.results;

  const index = await fetchJson('/query-index.json');
  const rows = (index && Array.isArray(index.data)) ? index.data : [];
  const corpus = [
    ...rows.map((row) => ({
      title: row.title,
      url: new URL(row.path, window.location.origin).href,
      description: row.description,
    })),
    ...Object.values(queries).flatMap((q) => q.results),
  ];
  const needle = term.toLowerCase();
  const seen = new Set();
  return corpus.filter((r) => {
    const hay = `${r.title || ''} ${r.description || ''}`.replace(/<[^>]*>/g, '').toLowerCase();
    if (!r.title || seen.has(r.url) || !hay.includes(needle)) return false;
    seen.add(r.url);
    return true;
  }).map((r) => ({
    ...r,
    title: mark(r.title, term),
    description: r.description ? mark(r.description, term) : undefined,
  }));
}

function decorateForm(widget, term) {
  widget.querySelectorAll('[data-icon]').forEach((slot) => {
    slot.replaceWith(icon(slot.dataset.icon));
  });
  const form = widget.querySelector('form');
  form.action = window.location.pathname;
  const input = form.querySelector('input');
  const submit = form.querySelector('.ft-input-submit');
  input.value = term;
  const sync = () => { submit.disabled = !input.value.trim(); };
  input.addEventListener('input', sync);
  sync();
  form.querySelector('.ft-input-clear').addEventListener('click', () => {
    input.value = '';
    sync();
    input.focus();
  });
}

export default async function decorate(widget) {
  // reabsorb the authored page heading (same section) into the head slot
  const section = widget.closest('.section');
  const heading = section && section.querySelector('.default-content-wrapper h1');
  if (heading) {
    const wrapper = heading.closest('.default-content-wrapper');
    widget.querySelector('.search-results-title').append(heading);
    if (!wrapper.children.length) wrapper.remove();
  }

  const term = (new URLSearchParams(window.location.search).get('q') || '').trim();
  decorateForm(widget, term);
  if (!term) {
    widget.classList.add('no-query');
    return;
  }

  const results = await search(term);
  const count = widget.querySelector('.search-results-count');
  count.dataset.count = results.length;
  count.querySelector('.search-results-total').textContent = results.length;
  count.querySelector('.search-results-term').textContent = term;
  count.hidden = false;
  if (!results.length) {
    widget.classList.add('no-results');
    return;
  }
  widget.querySelector('.search-results-list').append(...results.map(resultItem));
}
