(() => {
  const slideTitles = [
    'Portada',
    'Vibe Coding — Karpathy',
    'Vibe Coding: pros y contras',
    'Agentic Engineering',
    'Espectro de estructura',
    'OpenCode',
    'Modo plan y build',
    'Spec Driven Development',
    'Implementación SDD',
    'OpenSpec',
    'OpenSpec — detalle',
    'Cierre'
  ];
  const total = slideTitles.length;

  const fileFor = (n) => `slide-${String(n).padStart(2, '0')}.html`;

  const current = parseInt(document.body.dataset.slide, 10) || 1;

  const progressFill = document.getElementById('progressFill');
  const currentEl = document.getElementById('current');
  const totalEl = document.getElementById('total');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const overviewBtn = document.getElementById('overviewBtn');
  const overview = document.getElementById('overview');
  const overviewGrid = document.getElementById('overviewGrid');
  const hint = document.getElementById('hint');

  if (progressFill) progressFill.style.width = `${(current / total) * 100}%`;
  if (currentEl) currentEl.textContent = current;
  if (totalEl) totalEl.textContent = total;
  if (prevBtn) prevBtn.disabled = current === 1;
  if (nextBtn) nextBtn.disabled = current === total;

  function go(n) {
    if (n >= 1 && n <= total && n !== current) {
      window.location.href = fileFor(n);
    }
  }
  function next() { go(current + 1); }
  function prev() { go(current - 1); }

  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  function overviewOpen() {
    return overview && overview.classList.contains('active');
  }
  function toggleOverview(force) {
    if (!overview) return;
    const willShow = force !== undefined ? force : !overview.classList.contains('active');
    overview.classList.toggle('active', willShow);
  }

  document.addEventListener('keydown', (e) => {
    if (overviewOpen()) {
      if (e.key === 'Escape') toggleOverview(false);
      return;
    }
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
        e.preventDefault(); next(); break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault(); prev(); break;
      case 'Home':
        e.preventDefault(); go(1); break;
      case 'End':
        e.preventDefault(); go(total); break;
      case 'Escape':
        toggleOverview(true); break;
    }
  });

  // Touch / swipe
  let touchStartX = 0;
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
    }
  }, { passive: true });

  // Overview
  if (overviewGrid) {
    slideTitles.forEach((title, i) => {
      const n = i + 1;
      const card = document.createElement('button');
      card.className = 'overview-card';
      if (n === current) card.style.borderColor = 'var(--purple)';
      card.innerHTML = `
        <span class="ov-num">${String(n).padStart(2, '0')}</span>
        <span class="ov-title">${title}</span>
      `;
      card.addEventListener('click', () => go(n));
      overviewGrid.appendChild(card);
    });
  }

  if (overviewBtn) overviewBtn.addEventListener('click', () => toggleOverview());
  if (overview) {
    overview.addEventListener('click', (e) => {
      if (e.target === overview) toggleOverview(false);
    });
  }

  // Hide hint after a few seconds
  if (hint) setTimeout(() => hint.classList.add('hidden'), 5000);

  // Mouse wheel navigation (debounced)
  let wheelLock = false;
  document.addEventListener('wheel', (e) => {
    if (overviewOpen()) return;
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 30) return;
    wheelLock = true;
    if (e.deltaY > 0) next(); else prev();
    setTimeout(() => { wheelLock = false; }, 600);
  }, { passive: true });
})();
