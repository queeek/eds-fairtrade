import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import {
  icon, wrapText, pageLocale, chromeLabels, stripInstrumentation,
} from '../../scripts/chrome.js';

/**
 * Header — fairtrade.net Topbar, template-slotted from the gated prototype chrome.
 *
 * Reads the authored nav document (`/nav`, `/<locale>/nav` on locale trees, or the page's
 * `nav` metadata). Sections, identified by content with an ordinal fallback:
 *   brand   — `<p><a href=home>label</a></p>` + the logo picture
 *   nav     — one nested `<ul>`: item label > group title links > item links
 *   tools   — `<p><a href=search-page>Search</a></p>`, `<p>locale label</p>`,
 *             `<p>meta label</p>` + `<ul>` meta links
 *   locale  — title `<p>`, lead `<p>`, `<p><a>` rest-of-world, `<ul>` regions, no-match `<p>`
 *   labels  — `<ul>` of `key: value` UI strings (aria labels, placeholders)
 * Authored anchors, paragraphs and lists are MOVED into the template; text nodes are moved into
 * wrapper spans (EW1). The mobile drawer repeats the nav as presentational clones (EW4).
 * @ew-exempt labels — `key: value` UI strings are text-as-metadata (aria labels, placeholders)
 * @ew-exempt nav item labels — moved into <button> hosts (EW7); the /nav document is edited
 *   as its own page in the workspace
 * @ew-exempt mobile drawer — presentational clones of the desktop nav and meta links (EW4)
 */

const DESKTOP = window.matchMedia('(width >= 1024px)');

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === null || v === undefined || v === false) return;
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v === true ? '' : v);
  });
  node.append(...children.filter((c) => c !== null && c !== undefined));
  return node;
}

const setExpanded = (nodes, value) => nodes.forEach((t) => {
  if (t.hasAttribute('aria-expanded')) t.setAttribute('aria-expanded', value);
});

const hidden = (text) => el('span', { class: 'visuallyhidden' }, text || '');

/** Direct (non-list) label nodes of an authored `<li>`: its `<p>` children or bare text. */
function liLabel(li) {
  const p = [...li.children].find((c) => c.tagName === 'P');
  if (p) return [...p.childNodes];
  return [...li.childNodes].filter((n) => !(n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName)));
}

function liLink(li) {
  return li.querySelector(':scope > a, :scope > p > a');
}

function sublist(li) {
  return li.querySelector(':scope > ul, :scope > ol');
}

/** Classify the fragment's sections by content (ordinal fallback). */
function readSections(fragment) {
  const wrappers = [...fragment.querySelectorAll(':scope > .section')]
    .map((s) => s.querySelector('.default-content-wrapper') || s);
  const isLabels = (w) => {
    const items = [...w.querySelectorAll(':scope > ul > li')];
    return items.length && items.every((li) => /^[a-z-]+:\s/.test(li.textContent.trim()));
  };
  const labels = wrappers.find(isLabels);
  const rest = wrappers.filter((w) => w !== labels);
  const brand = rest.find((w) => w.querySelector('picture, img')) || rest[0];
  const others = rest.filter((w) => w !== brand);
  const nav = others.find((w) => w.querySelector(':scope > ul > li > ul a, :scope > ul > li > p'))
    || others[0];
  const remaining = others.filter((w) => w !== nav);
  const locale = remaining.find((w) => w.querySelector(':scope > ul > li > ul'))
    || remaining[1];
  const tools = remaining.find((w) => w !== locale) || remaining[0];
  return {
    brand, nav, tools, locale, labels: chromeLabels(labels),
  };
}

/* ------------------------------------------------------------------ builders */

function buildLogo(brand, labels) {
  const link = brand && brand.querySelector('a');
  const media = brand && brand.querySelector('picture, img');
  const logo = el('a', { class: 'topbar-logo', href: link ? link.getAttribute('href') : '/' });
  const iconBox = el('span', { class: 'ft-icon topbar-logo-icon' });
  if (media) {
    const img = media.tagName === 'IMG' ? media : media.querySelector('img');
    if (img) {
      img.setAttribute('width', '80');
      img.setAttribute('height', '80');
      img.loading = 'eager';
    }
    iconBox.append(media);
  }
  logo.append(iconBox);
  const label = el('span', { class: 'visuallyhidden' });
  if (link) label.append(...link.childNodes);
  else label.textContent = labels['logo-label'] || '';
  logo.append(label);
  return logo;
}

function decorateFlyoutLink(a, kind) {
  a.className = `topbar-desktop-flyout-group-${kind}-link`;
  wrapText(a, `topbar-desktop-flyout-group-${kind}-link-title`);
  a.prepend(icon('chevron-right', `is-inline topbar-desktop-flyout-group-${kind}-link-icon`));
  return a;
}

/** Desktop main navigation + the data the mobile drawer needs. */
function buildMainNav(navSection, labels) {
  const list = el('ul', { class: 'topbar-main-navigation-list' });
  const model = [];
  const topItems = navSection ? [...navSection.querySelectorAll(':scope > ul > li')] : [];
  topItems.forEach((li, i) => {
    const button = el('button', {
      class: 'topbar-main-navigation-button',
      type: 'button',
      'aria-controls': `flyout-${i}`,
      'aria-expanded': 'false',
    });
    const groupsSrc = sublist(li) ? [...sublist(li).children] : [];
    button.append(...liLabel(li));
    const groups = el('div', { class: 'topbar-desktop-flyout-groups' });
    const groupModel = [];
    groupsSrc.forEach((gli) => {
      const titleLink = liLink(gli);
      const items = sublist(gli) ? [...sublist(gli).querySelectorAll(':scope > li')] : [];
      const itemLinks = items.map((x) => liLink(x)).filter(Boolean);
      const group = el('div', { class: 'topbar-desktop-flyout-group' });
      if (titleLink) {
        group.append(el('div', { class: 'topbar-desktop-flyout-group-title' }, titleLink));
        decorateFlyoutLink(titleLink, 'title');
      }
      const ul = el('ul', { class: 'topbar-desktop-flyout-group-list' });
      itemLinks.forEach((a) => {
        decorateFlyoutLink(a, 'item');
        ul.append(el('li', { class: 'topbar-desktop-flyout-group-item' }, a));
      });
      group.append(ul);
      groups.append(group);
      groupModel.push({ titleLink, itemLinks });
    });
    const single = groupsSrc.length === 1;
    const flyout = el(
      'div',
      { class: `topbar-desktop-flyout${single ? ' has-single-group' : ''}`, id: `flyout-${i}` },
      el('div', { class: 'topbar-desktop-flyout-grid' }, groups),
    );
    list.append(el('li', { class: 'topbar-main-navigation-list-item' }, button, flyout));
    model.push({ button, groups: groupModel });
  });
  const nav = el('nav', {
    class: 'topbar-main-navigation', id: 'main-nav', 'aria-label': labels['nav-aria'],
  }, list);
  const scroller = (side, glyph) => el(
    'div',
    { class: `topbar-main-navigation-scroll-${side}` },
    el(
      'button',
      {
        class: `ft-button topbar-main-navigation-scroll-${side}-button variant-icon-primary`
          + ' color-skyblue size-small',
        type: 'button',
        tabindex: '-1',
      },
      el('span', { class: 'ft-button-icon' }, icon(glyph)),
    ),
  );
  const slot = el(
    'div',
    { class: 'topbar-nav-slot scrollend-left scrollend-right' },
    scroller('left', 'chevron-left'),
    nav,
    scroller('right', 'chevron-right'),
  );
  return { slot, nav, model };
}

function buildTools(tools, labels) {
  const paras = tools ? [...tools.querySelectorAll(':scope > p')] : [];
  const searchP = paras.find((p) => p.querySelector('a'));
  const plain = paras.filter((p) => !p.querySelector('a'));
  const metaList = tools && tools.querySelector(':scope > ul');
  const prev = metaList && metaList.previousElementSibling;
  const metaP = prev && prev.tagName === 'P' ? prev : plain[1];
  const localeP = plain.find((p) => p !== metaP);
  const searchLink = searchP && searchP.querySelector('a');
  return {
    searchHref: searchLink ? searchLink.getAttribute('href') : '/en/search-results',
    searchLabel: searchLink ? [...searchLink.childNodes] : [],
    localeLabel: localeP ? [...localeP.childNodes] : [],
    metaLabel: metaP ? [...metaP.childNodes] : [],
    metaLinks: metaList
      ? [...metaList.querySelectorAll(':scope > li')].map(liLink).filter(Boolean)
      : [],
    labels,
  };
}

function localeTrigger(extraClass, labelNodesList, labels) {
  return el(
    'button',
    {
      class: `locale-selector-trigger ${extraClass}`.trim(),
      type: 'button',
      'aria-controls': 'locale-selector',
      'aria-expanded': 'false',
    },
    icon('globe'),
    el('span', { class: 'locale-selector-trigger-label' }, ...labelNodesList),
    hidden(labels['locale-hidden']),
  );
}

function buildMeta(t) {
  const { labels } = t;
  const search = el(
    'button',
    {
      class: 'topbar-search-trigger',
      type: 'button',
      'aria-controls': 'topbar-search',
      'aria-expanded': 'false',
    },
    icon('search'),
    el('span', { class: 'topbar-search-label' }, ...t.searchLabel),
    hidden(labels['search-open']),
  );
  const locale = el(
    'div',
    { class: 'topbar-locale-selector-trigger' },
    localeTrigger('topbar-locale-selector-trigger-button', t.localeLabel, labels),
  );
  const menuList = el('ul', { class: 'topbar-meta-menu-menu-content' });
  t.metaLinks.forEach((a) => {
    a.className = 'topbar-meta-menu-menu-link';
    wrapText(a, 'topbar-meta-menu-menu-link-title');
    a.prepend(icon('chevron-right', 'is-inline topbar-meta-menu-menu-link-icon'));
    menuList.append(el('li', { class: 'topbar-meta-menu-menu-item' }, a));
  });
  const meta = el(
    'div',
    { class: 'topbar-meta-menu' },
    el(
      'button',
      {
        class: 'topbar-meta-menu-open-button',
        type: 'button',
        'aria-controls': 'topbar-meta-menu',
        'aria-expanded': 'false',
      },
      icon('menu', 'is-inline topbar-meta-menu-icon-open'),
      el('span', { class: 'topbar-meta-menu-label-open' }, ...t.metaLabel),
      hidden(labels['meta-open']),
    ),
    el(
      'div',
      { class: 'topbar-meta-menu-menu', id: 'topbar-meta-menu' },
      el(
        'div',
        { class: 'topbar-meta-menu-menu-header' },
        el(
          'button',
          { class: 'topbar-meta-menu-close-button', type: 'button' },
          icon('close', 'is-inline topbar-meta-menu-icon-close'),
          el('span', { class: 'topbar-meta-menu-label-close' }, labels['meta-close'] || ''),
          hidden(labels['meta-close-hidden']),
        ),
      ),
      menuList,
    ),
  );
  const mobileOpen = icon('menu', 'mobile-menu-trigger-open-icon');
  mobileOpen.append(hidden(labels['mobile-open']));
  const mobileClose = icon('close', 'mobile-menu-trigger-close-icon');
  mobileClose.append(hidden(labels['mobile-close']));
  const mobile = el(
    'div',
    { class: 'topbar-mobile-menu-trigger' },
    el(
      'button',
      {
        class: 'mobile-menu-trigger',
        type: 'button',
        'aria-controls': 'mobile-menu',
        'aria-expanded': 'false',
      },
      mobileOpen,
      mobileClose,
    ),
  );
  return el('div', { class: 'topbar-meta' }, search, locale, meta, mobile);
}

function clearButton(label) {
  return el(
    'button',
    { class: 'ft-input-clear', type: 'button' },
    icon('trash'),
    hidden(label),
  );
}

function buildSearch(t) {
  const { labels } = t;
  const input = el('input', {
    class: 'ft-input-field',
    id: 'topbar-search-field',
    name: 'q',
    type: 'search',
    placeholder: labels['search-placeholder'] || '',
  });
  const form = el(
    'form',
    { role: 'search', action: t.searchHref },
    el(
      'div',
      { class: 'ft-input topbar-search-input has-icon' },
      el(
        'div',
        { class: 'ft-input-field-wrapper' },
        input,
        clearButton(labels['search-clear']),
        el(
          'div',
          { class: 'ft-input-submit-wrapper' },
          el(
            'button',
            {
              class: 'ft-button ft-input-submit variant-icon-primary color-skyblue',
              type: 'submit',
              disabled: true,
            },
            el('span', { class: 'ft-button-icon' }, icon('search')),
            hidden(labels['search-submit']),
          ),
        ),
      ),
    ),
  );
  const close = el(
    'button',
    { class: 'topbar-search-close', type: 'button' },
    icon('close'),
    el('span', { class: 'topbar-search-close-label' }, labels['search-close'] || ''),
    hidden(labels['search-close-hidden']),
  );
  return el(
    'div',
    { class: 'topbar-search-slot' },
    el('div', { class: 'topbar-search', id: 'topbar-search' }, form, close),
  );
}

function mobileLink(a, level) {
  const clone = stripInstrumentation(a.cloneNode(true));
  const text = clone.querySelector('[class$="-link-title"]');
  const label = el('span');
  label.append(...(text ? text.childNodes : clone.childNodes));
  return el(
    'a',
    { class: 'mobile-menu-link', 'data-level': level, href: a.getAttribute('href') },
    icon('chevron-right'),
    label,
  );
}

function backButton(labels) {
  return el(
    'div',
    { class: 'mobile-sub-menu-back' },
    el(
      'button',
      { class: 'mobile-sub-menu-back-button', type: 'button' },
      icon('arrow-left'),
      el('span', {}, labels['mobile-back'] || ''),
    ),
  );
}

function menuButton(labelText, level, controls) {
  return el(
    'button',
    {
      class: 'mobile-menu-button',
      type: 'button',
      'data-level': String(level),
      'aria-controls': controls,
      'aria-expanded': 'false',
    },
    el('span', {}, labelText),
    icon('arrow-right'),
  );
}

function buildMobile(navModel, t, root) {
  const { labels } = t;
  const inner = el('div', { class: 'mobile-menu-inner' });
  const mainList = el('ul');
  const subs = [];
  navModel.forEach((top, i) => {
    const label = top.button.textContent;
    const id2 = `mobile-submenu-1-${i}`;
    mainList.append(el(
      'li',
      { class: 'mobile-navigation-main-list-item' },
      menuButton(label, 1, id2),
    ));
    const list2 = el('ul', { class: 'mobile-sub-menu-list' });
    const level3 = [];
    top.groups.forEach((g, j) => {
      const id3 = `mobile-submenu-2-${i}-${j}`;
      const title = g.titleLink
        ? g.titleLink.querySelector('.topbar-desktop-flyout-group-title-link-title').textContent
        : '';
      list2.append(el('li', { class: 'mobile-sub-menu-list-item' }, menuButton(title, 2, id3)));
      const list3 = el('ul', { class: 'mobile-sub-menu-list' });
      g.itemLinks.forEach((a) => list3.append(el(
        'li',
        { class: 'mobile-sub-menu-list-item' },
        mobileLink(a, 'last'),
      )));
      level3.push(el(
        'div',
        { class: 'mobile-sub-menu', id: id3, 'data-mobile-menu-level': '3' },
        backButton(labels),
        el(
          'div',
          { class: 'mobile-sub-menu-top' },
          g.titleLink ? mobileLink(g.titleLink, null) : null,
          list3,
        ),
      ));
    });
    subs.push(el(
      'div',
      { class: 'mobile-sub-menu', id: id2, 'data-mobile-menu-level': '2' },
      backButton(labels),
      el(
        'div',
        { class: 'mobile-sub-menu-top' },
        el('span', { class: 'mobile-menu-link' }, el('span', {}, label)),
        list2,
      ),
    ), ...level3);
  });
  const metaList = el('ul', { class: 'mobile-navigation-meta-list' });
  t.metaLinks.forEach((a) => metaList.append(el(
    'li',
    { class: 'mobile-navigation-meta-list-item' },
    mobileLink(a, 'meta'),
  )));
  const localeLabel = root.querySelector(
    '.topbar-locale-selector-trigger-button .locale-selector-trigger-label',
  );
  const mobileLocale = localeTrigger(
    'variant-mobile-menu',
    localeLabel ? [...localeLabel.cloneNode(true).childNodes] : [],
    labels,
  );
  inner.append(
    el(
      'div',
      { class: 'mobile-navigation', 'data-mobile-menu-level': '1' },
      el('nav', { class: 'mobile-navigation-main', 'aria-label': labels['nav-aria'] }, mainList),
      mobileLocale,
      el('nav', { class: 'mobile-navigation-meta', 'aria-label': labels['meta-aria'] }, metaList),
    ),
    ...subs,
  );
  return el('div', { class: 'mobile-menu', id: 'mobile-menu' }, inner);
}

function buildLocaleSelector(section, labels) {
  const paras = section ? [...section.querySelectorAll(':scope > p')] : [];
  const regions = section && section.querySelector(':scope > ul');
  const restP = paras.find((p) => p.querySelector('a'));
  const plain = paras.filter((p) => p !== restP);
  const kids = section ? [...section.children] : [];
  const after = plain.filter((p) => regions && kids.indexOf(p) > kids.indexOf(regions));
  const before = plain.filter((p) => !after.includes(p));
  const [title, lead] = before;
  const noMatch = after[0];
  if (title) {
    title.className = 'locale-selector-lead-title';
    title.id = 'locale-selector-title';
  }
  if (lead) lead.className = 'locale-selector-lead-text';
  const content = el('div', { class: 'locale-selector-content' });
  content.append(el('div', { class: 'locale-selector-lead' }, title, lead));
  const rest = restP && restP.querySelector('a');
  if (rest) {
    rest.className = 'ft-button locale-selector-rest-of-the-world variant-secondary color-skyblue';
    wrapText(rest, 'ft-button-inner');
    content.append(rest);
  }
  const filter = el('input', {
    class: 'ft-input-field',
    id: 'locale-selector-filter',
    type: 'search',
    placeholder: labels['locale-filter'] || '',
  });
  content.append(el(
    'div',
    { class: 'locale-selector-filter' },
    el(
      'div',
      { class: 'ft-input' },
      el(
        'label',
        { class: 'ft-input-label visuallyhidden', for: 'locale-selector-filter' },
        labels['locale-filter'] || '',
      ),
      el(
        'div',
        { class: 'ft-input-field-wrapper' },
        filter,
        clearButton(labels['locale-filter-clear']),
      ),
    ),
  ));
  if (regions) {
    regions.className = 'locale-selector-regions';
    [...regions.children].forEach((li) => {
      li.className = 'locale-selector-region';
      const nested = sublist(li);
      const p = [...li.children].find((c) => c.tagName === 'P');
      let name = p;
      if (!name) {
        name = el('span');
        name.append(...liLabel(li));
        li.prepend(name);
      }
      name.classList.add('locale-selector-region-name');
      const locales = nested || el('ul');
      locales.className = 'locale-selector-locales';
      if (!nested) li.append(locales);
      [...locales.children].forEach((x) => {
        x.className = 'locale-selector-locale';
        const a = liLink(x);
        if (a) {
          a.className = 'locale-selector-locale-link';
          if (a.parentElement !== x) x.replaceChildren(a);
        }
      });
    });
    content.append(regions);
  }
  if (noMatch) {
    noMatch.className = 'locale-selector-no-match-found';
    content.append(noMatch);
  }
  return el(
    'div',
    {
      class: 'locale-selector',
      id: 'locale-selector',
      role: 'dialog',
      'aria-labelledby': 'locale-selector-title',
    },
    el(
      'button',
      {
        class: 'ft-button locale-selector-close variant-icon-secondary color-skyblue size-small',
        type: 'button',
      },
      el('span', { class: 'ft-button-icon' }, icon('close')),
      hidden(labels['locale-close']),
    ),
    content,
  );
}

/* ------------------------------------------------------------------ behaviour */

function wireBehaviour(root) {
  const doc = document.documentElement;
  const topbar = root.querySelector('.topbar');
  const panels = [];
  // scroll lock stays while any panel is open (the drawer under a locale selector it opened)
  const lock = (on) => {
    doc.style.overflow = on || panels.some((p) => p.isOpen()) ? 'hidden' : '';
  };
  let opener = null;
  const closeAll = (except) => panels.forEach((p) => {
    if (p !== except) p.close();
  });

  // header: hide when scrolling down past the bar, show again on scroll up
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (doc.style.overflow === 'hidden') return;
    root.classList.toggle('is-hidden', y > lastY && y > topbar.offsetHeight);
    lastY = y;
  }, { passive: true });

  // desktop mega-menu flyouts
  const navButtons = [...root.querySelectorAll('.topbar-main-navigation-button')];
  const flyouts = {
    close() {
      navButtons.forEach((b) => {
        b.setAttribute('aria-expanded', 'false');
        b.classList.remove('is-active');
        root.querySelector(`#${b.getAttribute('aria-controls')}`).classList.remove('is-open');
      });
      topbar.classList.remove('is-darkened');
      lock(false);
    },
    isOpen: () => navButtons.some((b) => b.getAttribute('aria-expanded') === 'true'),
  };
  panels.push(flyouts);
  navButtons.forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = b.getAttribute('aria-expanded') !== 'true';
    closeAll(flyouts);
    flyouts.close();
    if (!open) return;
    opener = b;
    b.setAttribute('aria-expanded', 'true');
    b.classList.add('is-active');
    root.querySelector(`#${b.getAttribute('aria-controls')}`).classList.add('is-open');
    topbar.classList.add('is-darkened');
    lock(true);
  }));

  // generic panel toggles (search, locale selector, meta menu)
  const panel = (triggerSel, elm, closeBtns, focusSel) => {
    const triggers = () => [...document.querySelectorAll(triggerSel)];
    const p = {
      close() {
        if (!elm.classList.contains('is-open')) return;
        elm.classList.remove('is-open');
        setExpanded(triggers(), 'false');
        lock(false);
      },
      open(from) {
        const keep = from && from.closest('.mobile-menu') ? panels.find((x) => x.drawer) : null;
        panels.forEach((x) => {
          if (x !== p && x !== keep) x.close();
        });
        elm.classList.add('is-open');
        setExpanded(triggers(), 'true');
        lock(true);
        const f = focusSel && elm.querySelector(focusSel);
        if (f) setTimeout(() => f.focus(), 50);
      },
      isOpen: () => elm.classList.contains('is-open'),
    };
    document.addEventListener('click', (e) => {
      const t = e.target.closest(triggerSel);
      if (!t) return;
      e.stopPropagation();
      if (p.isOpen()) {
        p.close();
      } else {
        opener = t;
        p.open(t);
      }
    });
    closeBtns.forEach((c) => c && c.addEventListener('click', (e) => {
      e.stopPropagation();
      p.close();
      if (opener && opener.isConnected) opener.focus();
    }));
    panels.push(p);
    return p;
  };
  const search = root.querySelector('#topbar-search');
  panel('.topbar-search-trigger', search, [root.querySelector('.topbar-search-close')], 'input');
  const localeSel = root.querySelector('#locale-selector');
  const localeClose = root.querySelector('.locale-selector-close');
  panel('.locale-selector-trigger', localeSel, [localeClose], 'input');
  const meta = root.querySelector('.topbar-meta-menu');
  const metaPanel = panel(
    '.topbar-meta-menu-open-button',
    meta,
    [meta.querySelector('.topbar-meta-menu-close-button')],
    'a',
  );
  document.addEventListener('click', (e) => {
    if (e.target.closest('.topbar-meta-menu-open-button')) return;
    if (!e.target.closest('.topbar-desktop-flyout, .topbar-meta-menu-menu')) {
      if (flyouts.isOpen()) flyouts.close();
      metaPanel.close();
    }
  });

  // mobile drawer with sliding sub-menus (Escape does not close it — header contract)
  const drawer = root.querySelector('#mobile-menu');
  const trigger = root.querySelector('.mobile-menu-trigger');
  const stack = [];
  const setLevel = () => drawer.style.setProperty('--level', String(stack.length + 1));
  const drawerPanel = {
    close() {
      if (!drawer.classList.contains('is-open')) return;
      drawer.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      stack.splice(0).forEach((m) => m.classList.remove('is-open'));
      setExpanded([...drawer.querySelectorAll('.mobile-menu-button')], 'false');
      setLevel();
      lock(false);
    },
    isOpen: () => drawer.classList.contains('is-open'),
    escape: false,
    drawer: true,
  };
  panels.push(drawerPanel);
  trigger.addEventListener('click', () => {
    if (drawerPanel.isOpen()) {
      drawerPanel.close();
      return;
    }
    closeAll(drawerPanel);
    drawer.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    lock(true);
  });
  drawer.querySelectorAll('.mobile-menu-button').forEach((b) => b.addEventListener('click', () => {
    const sub = drawer.querySelector(`#${b.getAttribute('aria-controls')}`);
    const lvl = Number(sub.dataset.mobileMenuLevel) - 1;
    stack.splice(lvl - 1).forEach((m) => {
      m.classList.remove('is-open');
      setExpanded([...drawer.querySelectorAll(`[aria-controls="${m.id}"]`)], 'false');
    });
    sub.classList.add('is-open');
    b.setAttribute('aria-expanded', 'true');
    stack.push(sub);
    setLevel();
  }));
  const backs = drawer.querySelectorAll('.mobile-sub-menu-back-button');
  backs.forEach((b) => b.addEventListener('click', () => {
    const m = stack.pop();
    if (m) setExpanded([...drawer.querySelectorAll(`[aria-controls="${m.id}"]`)], 'false');
    setLevel();
    setTimeout(() => m && m.classList.remove('is-open'), 300);
  }));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = panels.filter((p) => p.escape !== false && p.isOpen());
    if (!open.length) return;
    open.forEach((p) => p.close());
    if (opener && opener.isConnected) opener.focus();
  });

  // locale filter
  const filter = root.querySelector('#locale-selector-filter');
  const regions = [...root.querySelectorAll('.locale-selector-region')];
  const noMatch = root.querySelector('.locale-selector-no-match-found');
  filter.addEventListener('input', () => {
    const q = filter.value.trim().toLowerCase();
    let n = 0;
    regions.forEach((r) => {
      const hit = !q || r.textContent.toLowerCase().includes(q);
      r.classList.toggle('is-hidden', !hit);
      n += hit ? 1 : 0;
    });
    if (noMatch) noMatch.classList.toggle('is-visible', !n);
  });

  // live: the search submit stays disabled until the field has a value
  const field = root.querySelector('#topbar-search-field');
  const submit = root.querySelector('.ft-input-submit');
  field.addEventListener('input', () => {
    submit.disabled = !field.value.trim();
  });

  // clear buttons of the search inputs
  root.querySelectorAll('.ft-input-clear').forEach((btn) => btn.addEventListener('click', () => {
    const input = btn.closest('.ft-input-field-wrapper').querySelector('input');
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.focus();
  }));

  // nav scroll affordances (only visible when the list overflows)
  const slot = root.querySelector('.topbar-nav-slot');
  const scroller = root.querySelector('.topbar-main-navigation');
  const ends = () => {
    const max = scroller.scrollWidth - scroller.clientWidth;
    slot.classList.toggle('scrollend-left', scroller.scrollLeft <= 0);
    slot.classList.toggle('scrollend-right', scroller.scrollLeft >= max - 1);
  };
  scroller.addEventListener('scroll', ends, { passive: true });
  window.addEventListener('resize', ends);
  slot.querySelector('.topbar-main-navigation-scroll-left-button')
    .addEventListener('click', () => scroller.scrollBy({ left: -200, behavior: 'smooth' }));
  slot.querySelector('.topbar-main-navigation-scroll-right-button')
    .addEventListener('click', () => scroller.scrollBy({ left: 200, behavior: 'smooth' }));
  ends();

  // leaving the desktop layout closes desktop-only panels
  DESKTOP.addEventListener('change', () => closeAll());
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const locale = pageLocale();
  const navMeta = getMetadata('nav');
  const navPath = navMeta
    ? new URL(navMeta, window.location).pathname
    : `${locale ? `/${locale}` : ''}/nav`;
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  const s = readSections(fragment);
  const labels = s.labels || {};
  const tools = buildTools(s.tools, labels);
  const logo = buildLogo(s.brand, labels);
  const mainNav = buildMainNav(s.nav, labels);
  const meta = buildMeta(tools);
  const searchSlot = buildSearch(tools);
  const topbar = el(
    'div',
    { class: 'topbar', id: 'topbar' },
    el(
      'div',
      { class: 'topbar-bar-wrapper' },
      el('div', { class: 'topbar-content' }, logo, mainNav.slot, meta, searchSlot),
    ),
  );
  block.replaceChildren(topbar);
  const mobile = buildMobile(mainNav.model, tools, block);
  const localeSelector = buildLocaleSelector(s.locale, labels);
  block.append(mobile, localeSelector);
  wireBehaviour(block);
}
