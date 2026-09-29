const header = document.querySelector('[data-header]');
const reveals = document.querySelectorAll('.reveal');
const device = document.querySelector('.device');

const onScroll = () => {
  header?.classList.toggle('scrolled', window.scrollY > 20);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

reveals.forEach((node) => observer.observe(node));

if (device && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const host = device.closest('.hero-object');
  host?.addEventListener('pointermove', (event) => {
    const box = host.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    device.style.transform = 'rotateY(' + (-11 + x * 7) + 'deg) rotateX(' + (6 - y * 5) + 'deg) rotateZ(' + (2 + x * 1.5) + 'deg)';
  });
  host?.addEventListener('pointerleave', () => {
    device.style.transform = 'rotateY(-11deg) rotateX(6deg) rotateZ(2deg)';
  });
}