// One adapter per site. Netflix selectors may need tweaking.
const ADAPTERS = {
  'www.youtube.com': {
    segment: '.ytp-caption-segment',
    read: '.ytp-caption-segment',
    show: () => document.title.replace(/^\(\d+\)\s*/, '').replace(/ - YouTube$/, ''),
  },
  'www.netflix.com': {
    segment: '.player-timedtext-text-container span',
    read: '.player-timedtext-text-container',
    show: () => document.querySelector('[data-uia="video-title"]')?.textContent || document.title,
  },
};
const adapter = ADAPTERS[location.hostname];

export const getVideo = () => document.querySelector('video');
export const getShow = () => (adapter ? adapter.show() : document.title);
export const getCurrentSentence = () =>
  adapter
    ? [...document.querySelectorAll(adapter.read)].map((el) => el.textContent.trim()).join(' ').replace(/\s+/g, ' ').trim()
    : '';

const clean = (w) => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');

function wrap(el) {
  if (el.querySelector('.subtra-word')) return;
  el.dataset.subtraWrapped = '1';
  const parts = el.textContent.split(/(\s+)/);
  el.textContent = '';
  parts.forEach((p) => {
    if (!p.trim()) return el.append(p);
    const span = document.createElement('span');
    span.className = 'subtra-word';
    span.textContent = p;
    el.append(span);
  });
}

export function startObserver(onWord) {
  if (!adapter) return () => {};

  const style = document.createElement('style');
  style.textContent = `${adapter.segment}{cursor:pointer;pointer-events:auto!important}
    .subtra-word{border-radius:3px;transition:background .12s}
    .subtra-word:hover{background:rgba(59,130,246,.55)}`;
  document.head.append(style);

  const scan = () =>
    document.querySelectorAll(`${adapter.segment}:not(.subtra-word):not([data-subtra-wrapped])`).forEach(wrap);
  const mo = new MutationObserver(scan);
  mo.observe(document.body, { childList: true, subtree: true });

  const onClick = (e) => {
    const el = e.target.closest?.('.subtra-word');
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    const word = clean(el.textContent);
    if (!word) return;
    getVideo()?.pause();
    onWord({ word, sentence: getCurrentSentence(), show: getShow(), rect: el.getBoundingClientRect() });
  };
  document.addEventListener('click', onClick, true);

  return () => {
    mo.disconnect();
    document.removeEventListener('click', onClick, true);
    style.remove();
  };
}
