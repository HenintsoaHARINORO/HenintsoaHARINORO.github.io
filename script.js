// Load photo.jpg into the avatar if it exists
const img = new Image();
img.onload = () => { const a = document.getElementById('avatar'); a.textContent = ''; a.style.backgroundImage = 'url(./img/photo.jpg)'; };
img.src = './img/photo.jpg';

// Tab navigation
const tabs = document.querySelectorAll('.nav button');
tabs.forEach(t => t.addEventListener('click', () => {
  tabs.forEach(x => x.setAttribute('aria-selected', x === t));
  document.querySelectorAll('.slide').forEach(s => s.classList.toggle('active', s.id === t.dataset.go));
}));

document.querySelectorAll('[data-jump]').forEach(b => b.addEventListener('click', () =>
  document.querySelector(`.nav [data-go="${b.dataset.jump}"]`).click()));

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Jelly squish on the clicked tab
tabs.forEach(t => t.addEventListener('click', () => {
  if (calm) return;
  t.classList.remove('jelly'); void t.offsetWidth; t.classList.add('jelly');
}));

// Hearts burst out when a card flips
function burst(x, y) {
  if (calm) return;
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span'), a = (i / 6) * 2 * Math.PI + Math.random() * .5, d = 50 + Math.random() * 30;
    h.className = 'burst'; h.textContent = '♥';
    h.style.left = x + 'px'; h.style.top = y + 'px';
    h.style.setProperty('--dx', Math.cos(a) * d + 'px'); h.style.setProperty('--dy', Math.sin(a) * d + 'px');
    h.style.setProperty('--r', (Math.random() * 60 - 30) + 'deg');
    document.body.appendChild(h); h.addEventListener('animationend', () => h.remove());
  }
}

// Sparkle trail behind the mouse (desktop only)
if (!calm && matchMedia('(pointer: fine)').matches) {
  let last = 0;
  document.addEventListener('mousemove', e => {
    const now = performance.now(); if (now - last < 45) return; last = now;
    const s = document.createElement('span');
    s.className = 'spark'; s.textContent = Math.random() < .5 ? '✦' : '✧';
    s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
    document.body.appendChild(s); s.addEventListener('animationend', () => s.remove());
  });
}

// Falling sakura petals
if (!calm) {
  const box = document.querySelector('.petals');
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('span'), size = 8 + Math.random() * 8;
    p.className = 'petal';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.width = size + 'px'; p.style.height = size * .8 + 'px';
    p.style.animationDuration = 9 + Math.random() * 9 + 's';
    p.style.animationDelay = -Math.random() * 18 + 's';
    p.style.setProperty('--sway', (Math.random() * 160 - 80) + 'px');
    p.style.setProperty('--spin', (Math.random() * 720 - 360) + 'deg');
    box.appendChild(p);
  }
}

// Typewriter heading
const type = document.querySelector('.type');
if (!calm) {
  const text = type.dataset.text; let i = 0;
  type.textContent = ''; type.classList.add('typing');
  setTimeout(function tick() {
    type.textContent = text.slice(0, ++i);
    if (i < text.length) setTimeout(tick, 70);
  }, 500);
}

// Stats count up
if (!calm) document.querySelectorAll('[data-count]').forEach(b => {
  const end = +b.dataset.count, suffix = b.dataset.suffix || '', t0 = performance.now();
  (function step(now) {
    const k = Math.min((now - t0) / 1200, 1);
    b.textContent = Math.round(end * (1 - (1 - k) ** 3)) + suffix;
    if (k < 1) requestAnimationFrame(step);
  })(t0);
});

// Split the sidebar name into letters for the hover wave
const wave = document.querySelector('.wave');
wave.innerHTML = [...wave.textContent].map((ch, i) => `<span style="--i:${i}">${ch}</span>`).join('');

// Arrow keys switch tabs
document.addEventListener('keydown', e => {
  if (!['ArrowRight', 'ArrowLeft'].includes(e.key) || e.target.closest('.card')) return;
  const list = [...tabs], i = list.findIndex(t => t.getAttribute('aria-selected') === 'true');
  list[(i + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length].click();
});

// Flip cards (links inside don't flip)
document.querySelectorAll('.card').forEach(c => {
  const flip = e => {
    if (e.target.closest('a')) return;
    c.classList.toggle('flipped');
    const r = c.getBoundingClientRect();
    burst(e.clientX || r.left + r.width / 2, e.clientY || r.top + r.height / 2);
  };
  c.addEventListener('click', flip);
  c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(e); } });
});
