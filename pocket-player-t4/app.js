const root = document.documentElement;
const header = document.querySelector('[data-header]');
const progressBar = document.querySelector('.scroll-progress i');
const reveals = document.querySelectorAll('.reveal');
const device = document.querySelector('[data-device]');
const heroObject = device?.closest('.hero-object');
const wheel = document.querySelector('[data-wheel]');
const menuButton = document.querySelector('[data-menu]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const navLinks = [...document.querySelectorAll('[data-nav] a')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let ticking = false;
const updateScrollState = () => {
  ticking = false;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (progressBar) progressBar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, ratio)) + ')';
  header?.classList.toggle('scrolled', window.scrollY > 18);

  const probe = document.elementFromPoint(Math.min(window.innerWidth - 2, window.innerWidth / 2), Math.min(70, window.innerHeight - 2));
  const dark = probe?.closest?.('.dark-section');
  header?.classList.toggle('on-dark', Boolean(dark));
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(updateScrollState);
  }
}, { passive: true });
window.addEventListener('resize', updateScrollState);
updateScrollState();

if (!reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (event) => {
    root.style.setProperty('--mx', event.clientX + 'px');
    root.style.setProperty('--my', event.clientY + 'px');
  }, { passive: true });
}

const revealObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
reveals.forEach((node) => revealObserver.observe(node));

const sectionTargets = navLinks
  .map((link) => ({ link, section: document.querySelector(link.getAttribute('href')) }))
  .filter((item) => item.section);

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    sectionTargets.forEach(({ link, section }) => link.classList.toggle('active', section === entry.target));
  });
}, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
sectionTargets.forEach(({ section }) => sectionObserver.observe(section));

const closeMenu = () => {
  document.body.classList.remove('menu-open');
  header?.classList.remove('menu-active');
  mobileNav?.classList.remove('open');
  mobileNav?.setAttribute('aria-hidden', 'true');
  menuButton?.setAttribute('aria-expanded', 'false');
};
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  if (open) return closeMenu();
  document.body.classList.add('menu-open');
  header?.classList.add('menu-active');
  mobileNav?.classList.add('open');
  mobileNav?.setAttribute('aria-hidden', 'false');
  menuButton.setAttribute('aria-expanded', 'true');
});
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

if (device && heroObject && !reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  heroObject.addEventListener('pointermove', (event) => {
    const box = heroObject.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
    const y = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
    const rx = 9 - y * 7;
    const ry = -14 + x * 9;
    const rz = 1.2 + (x - .5) * 2.2;
    heroObject.style.setProperty('--rx', rx + 'deg');
    heroObject.style.setProperty('--ry', ry + 'deg');
    heroObject.style.setProperty('--rz', rz + 'deg');
    heroObject.style.setProperty('--gx', (x * 100) + '%');
    heroObject.style.setProperty('--gy', (y * 100) + '%');
  });
  heroObject.addEventListener('pointerleave', () => {
    heroObject.style.setProperty('--rx', '6deg');
    heroObject.style.setProperty('--ry', '-11deg');
    heroObject.style.setProperty('--rz', '2deg');
    heroObject.style.setProperty('--gx', '45%');
    heroObject.style.setProperty('--gy', '20%');
  });
}

const pipeline = document.querySelector('[data-pipeline]');
const pipeSteps = [...document.querySelectorAll('.pipe-step')];
if (pipeline && pipeSteps.length && !reducedMotion) {
  let pipelineTimer = null;
  const pipelineObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    let i = 0;
    clearInterval(pipelineTimer);
    pipelineTimer = setInterval(() => {
      pipeSteps.forEach((step, index) => step.classList.toggle('signal-active', index === i));
      i += 1;
      if (i >= pipeSteps.length) {
        setTimeout(() => pipeSteps.forEach((step) => step.classList.remove('signal-active')), 700);
        clearInterval(pipelineTimer);
      }
    }, 360);
    pipelineObserver.unobserve(pipeline);
  }, { threshold: .35 });
  pipelineObserver.observe(pipeline);
}

const tracks = [
  { number: 47, title: 'MIDNIGHT PROTOCOL', duration: 240, mark: 'NS' },
  { number: 48, title: 'SIGNAL AFTER DARK', duration: 213, mark: 'SA' },
  { number: 49, title: 'NO NETWORK', duration: 268, mark: 'NN' },
  { number: 50, title: 'LOCAL FREQUENCY', duration: 225, mark: 'LF' }
];
let trackIndex = 0;
let elapsed = 138;
let volume = 64;
let playing = false;
let lastFrame = performance.now();

const refs = {
  title: document.querySelector('[data-track-title]'),
  number: document.querySelector('[data-track-number]'),
  volume: document.querySelector('[data-volume]'),
  progress: document.querySelector('[data-player-progress]'),
  elapsed: document.querySelector('[data-elapsed]'),
  remaining: document.querySelector('[data-remaining]'),
  state: document.querySelector('[data-player-state]'),
  uiTrack: document.querySelector('[data-ui-track]'),
  uiNumber: document.querySelector('[data-ui-number]'),
  uiVolume: document.querySelector('[data-ui-volume]'),
  uiProgress: document.querySelector('[data-ui-progress]'),
  uiElapsed: document.querySelector('[data-ui-elapsed]'),
  uiDuration: document.querySelector('[data-ui-duration]'),
  album: document.querySelector('[data-album-mark]'),
  uiDemo: document.querySelector('[data-ui-demo]')
};

const formatTime = (seconds) => {
  const value = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(value / 60);
  const secs = String(value % 60).padStart(2, '0');
  return minutes + ':' + secs;
};
const renderPlayer = () => {
  const track = tracks[trackIndex];
  const ratio = Math.min(1, elapsed / track.duration);
  const splitTitle = track.title.split(' ');
  const midpoint = Math.ceil(splitTitle.length / 2);
  const heroTitle = splitTitle.slice(0, midpoint).join(' ') + (splitTitle.length > 1 ? '<br>' + splitTitle.slice(midpoint).join(' ') : '');

  if (refs.title) refs.title.innerHTML = heroTitle;
  if (refs.number) refs.number.textContent = 'SD / ' + String(track.number).padStart(3, '0');
  if (refs.volume) refs.volume.textContent = 'VOL ' + volume;
  if (refs.progress) refs.progress.style.width = (ratio * 100) + '%';
  if (refs.elapsed) refs.elapsed.textContent = formatTime(elapsed);
  if (refs.remaining) refs.remaining.textContent = '-' + formatTime(track.duration - elapsed);
  if (refs.state) refs.state.textContent = playing ? 'PLAYING' : 'PAUSED';

  if (refs.uiTrack) refs.uiTrack.textContent = track.title;
  if (refs.uiNumber) refs.uiNumber.textContent = 'TRACK ' + String(track.number).padStart(3, '0');
  if (refs.uiVolume) refs.uiVolume.textContent = 'VOL ' + volume;
  if (refs.uiProgress) refs.uiProgress.style.width = (ratio * 100) + '%';
  if (refs.uiElapsed) refs.uiElapsed.textContent = formatTime(elapsed);
  if (refs.uiDuration) refs.uiDuration.textContent = formatTime(track.duration);
  if (refs.album) refs.album.textContent = track.mark;
  refs.uiDemo?.classList.toggle('playing', playing);

  document.querySelectorAll('[data-action="play"]').forEach((button) => {
    button.textContent = playing ? 'Ⅱ' : '▶';
    button.setAttribute('aria-pressed', String(playing));
  });
  wheel?.setAttribute('aria-valuenow', String(volume));
  wheel?.style.setProperty('--wheel', (volume * 2.4 - 120) + 'deg');
};
const changeTrack = (direction) => {
  trackIndex = (trackIndex + direction + tracks.length) % tracks.length;
  elapsed = 0;
  renderPlayer();
};
const changeVolume = (delta) => {
  volume = Math.max(0, Math.min(100, volume + delta));
  renderPlayer();
};
const togglePlay = () => {
  playing = !playing;
  lastFrame = performance.now();
  renderPlayer();
};
document.addEventListener('click', (event) => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'play') togglePlay();
  if (action === 'next') changeTrack(1);
  if (action === 'previous') changeTrack(-1);
  if (action === 'volume-up') changeVolume(4);
  if (action === 'volume-down') changeVolume(-4);
});

let draggingWheel = false;
const wheelValueFromPointer = (event) => {
  if (!wheel) return;
  const r = wheel.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  let angle = Math.atan2(event.clientY - cy, event.clientX - cx) * 180 / Math.PI + 90;
  if (angle < 0) angle += 360;
  const clamped = Math.max(0, Math.min(240, angle));
  volume = Math.round(clamped / 240 * 100);
  renderPlayer();
};
wheel?.addEventListener('pointerdown', (event) => {
  draggingWheel = true;
  wheel.setPointerCapture(event.pointerId);
  wheelValueFromPointer(event);
});
wheel?.addEventListener('pointermove', (event) => {
  if (draggingWheel) wheelValueFromPointer(event);
});
wheel?.addEventListener('pointerup', () => { draggingWheel = false; });
wheel?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') { event.preventDefault(); changeVolume(2); }
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') { event.preventDefault(); changeVolume(-2); }
});

const animatePlayer = (now) => {
  if (playing) {
    const delta = (now - lastFrame) / 1000;
    elapsed += Math.min(delta, .1);
    const duration = tracks[trackIndex].duration;
    if (elapsed >= duration) {
      trackIndex = (trackIndex + 1) % tracks.length;
      elapsed = 0;
    }
    renderPlayer();
  }
  lastFrame = now;
  requestAnimationFrame(animatePlayer);
};
renderPlayer();
requestAnimationFrame(animatePlayer);
