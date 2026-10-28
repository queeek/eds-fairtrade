/**
 * cta-section — a lone centred call-to-action band (live CTASection).
 * Schema: stardust/eds-schema/en.json — the CTASection divs between modules (one cta each).
 * Decode tier: template-slotted (the authored CTA paragraphs move into one actions slot, EW3).
 *
 * Authoring: one cell holding the CTA paragraph(s) — <strong><a> = primary (skyblue, large),
 * <em><a> = secondary, <em><strong><a> = accent. Any other authored element follows them.
 * A link-less <em> paragraph (live: an in-page control, e.g. the listing's "Load more" paging
 * button) renders as a secondary <button>; the authored text moves into it (EW1).
 */

function toButton(p) {
  const em = p.children.length === 1 && p.firstElementChild.matches('em')
    && !p.querySelector('a') && p.textContent.trim() === p.firstElementChild.textContent.trim()
    ? p.firstElementChild : null;
  if (!em) return;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button secondary';
  button.append(...em.childNodes);
  em.replaceWith(button);
  p.classList.add('button-wrapper');
}

export default async function decorate(block) {
  const nodes = [...block.querySelectorAll(':scope > div > div > *')];
  const actions = document.createElement('div');
  actions.className = 'cta-section-actions';
  nodes.filter((n) => n.tagName === 'P').forEach(toButton);
  actions.append(...nodes);
  block.replaceChildren(actions);
}
