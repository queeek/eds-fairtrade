/**
 * accordion — FAQ list of expandable items under a section title (live AccordionSection).
 * Schema: stardust/eds-schema/en.json, section 8 (title heading + 4 × AccordionSection--item:
 * heading, body, cta).
 * Decode tier: reconstructive items + reabsorbed section head.
 *
 * Authoring:
 *   section head = default content before the block (<h2>), reabsorbed into the block (EW8)
 *   block rows: one row per item — question cell (<h3>) | answer cell (<p>s, link <p><a>
 *   rendered as the live tertiary button). A row with a single cell: its first heading (or
 *   first paragraph) is the question, the rest the answer.
 *
 * EW7: the question moves into a div title; a sibling <button> (named by a visually hidden
 * presentational copy of the question, as live) covers the header row and toggles the item.
 * Behaviour (live): grid-rows .3s open, chevron turns half a turn.
 */

let seq = 0;

function wrapNode(node, className) {
  const w = document.createElement('div');
  w.className = className;
  w.append(node);
  return w;
}

// Presentational clones must not keep the editor's indices (EW4).
function stripInstrumentation(node) {
  if (node.nodeType !== 1) return node;
  const attrs = ['data-prose-index', 'data-image-index', 'data-block-index'];
  [node, ...node.querySelectorAll('*')].forEach((n) => attrs.forEach((a) => n.removeAttribute(a)));
  return node;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON_DOWN = 'M18.3125 9.70492L16.9025 8.29492L12.3125 12.8749L7.7225 8.29492L6.3125 '
  + '9.70492L12.3125 15.7049L18.3125 9.70492Z';

function chevron() {
  const span = document.createElement('span');
  span.className = 'ft-button variant-icon-primary color-skyblue size-small accordion-chevron';
  span.setAttribute('aria-hidden', 'true');
  const icon = document.createElement('span');
  icon.className = 'ft-icon';
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRON_DOWN);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  icon.append(svg);
  span.append(icon);
  return span;
}

function cellNodes(cell) {
  const kids = [...cell.children];
  if (kids.length) return kids;
  if (!cell.textContent.trim()) return [];
  // harness-only fallback (EW5): bare text cell — move its text nodes into a <p>
  const p = document.createElement('p');
  p.append(...cell.childNodes);
  return [p];
}

function buildItem(row) {
  const cells = [...row.querySelectorAll(':scope > div')];
  let question;
  let answer;
  if (cells.length >= 2) {
    [question, ...answer] = cellNodes(cells[0]);
    cells.slice(1).forEach((c) => answer.push(...cellNodes(c)));
  } else {
    const all = cellNodes(cells[0] || row);
    question = all.find((n) => /^H[1-6]$/.test(n.tagName)) || all[0];
    answer = all.filter((n) => n !== question);
  }
  if (!question) return null;
  seq += 1;
  const id = `accordion-${seq}`;

  const li = document.createElement('li');
  li.className = 'accordion-item';
  const acc = document.createElement('div');
  acc.className = 'accordion-panel';
  const header = document.createElement('div');
  header.className = 'accordion-header';
  const title = wrapNode(question, 'accordion-title');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'accordion-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', `${id}-body`);
  // live: the toggle carries a visually hidden copy of the question (presentational clone, EW4)
  const label = document.createElement('span');
  label.className = 'visuallyhidden';
  [...question.childNodes].forEach((n) => label.append(stripInstrumentation(n.cloneNode(true))));
  toggle.append(label);
  header.append(toggle, chevron(), title);

  const body = document.createElement('div');
  body.className = 'accordion-body';
  body.id = `${id}-body`;
  const wrapper = document.createElement('div');
  wrapper.className = 'accordion-content-wrapper';
  const box = document.createElement('div');
  box.className = 'accordion-content';
  const isCta = (n) => {
    const a = n.querySelector && n.querySelector('a');
    return a && n.textContent.trim() === a.textContent.trim();
  };
  const text = document.createElement('div');
  text.className = 'accordion-text';
  answer.filter((n) => !isCta(n)).forEach((n) => text.append(n));
  if (text.children.length) box.append(text);
  answer.filter(isCta).forEach((n) => box.append(wrapNode(n, 'accordion-cta')));
  wrapper.append(box);
  body.append(wrapper);
  acc.append(header, body);
  li.append(acc);

  const set = (open) => {
    acc.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => set(!acc.classList.contains('is-open')));
  return li;
}

export default async function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'u-grid accordion-grid';

  // section head: the default content before the block (EW8)
  const prevEl = block.parentElement && block.parentElement.previousElementSibling;
  if (prevEl && prevEl.classList.contains('default-content-wrapper')) {
    const head = document.createElement('div');
    head.className = 'accordion-section-title';
    head.append(...prevEl.childNodes);
    prevEl.remove();
    grid.append(head);
  }
  const list = document.createElement('ul');
  list.className = 'accordion-list';
  rows.map(buildItem).filter(Boolean).forEach((li) => list.append(li));
  grid.append(list);
  block.replaceChildren(grid);
}
