(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const progressFill = document.getElementById('progressFill');
  const currentEl = document.getElementById('current');
  const totalEl = document.getElementById('total');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const overviewBtn = document.getElementById('overviewBtn');
  const overview = document.getElementById('overview');
  const overviewGrid = document.getElementById('overviewGrid');
  const hint = document.getElementById('hint');

  let index = 0;
  totalEl.textContent = total;

  const slideTitles = [
    'Portada',
    'Vibe Coding — Karpathy',
    'Qué es (y qué no) el vibe coding',
    'Agentic Engineering',
    'Ejemplo: el prompt del martes',
    'Ejemplo: lo que devuelve el agente',
    'Ejemplo: tres maneras de romperlo',
    'Ejemplo: lo mismo, spec-driven',
    'El muro',
    'Espectro de estructura',
    'OpenCode',
    'Modo plan y build',
    'Spec Driven Development',
    'De autocompletado a ingeniero',
    'El workflow de 3 fases',
    'Implementación SDD',
    'El ecosistema',
    'OpenSpec',
    'OpenSpec — detalle',
    'Cierre'
  ];

  function render() {
    slides.forEach((s, i) => {
      s.classList.remove('active', 'prev');
      if (i === index) s.classList.add('active');
      else if (i < index) s.classList.add('prev');
    });
    currentEl.textContent = index + 1;
    progressFill.style.width = `${((index + 1) / total) * 100}%`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;
    history.replaceState(null, '', `#${index + 1}`);
  }

  function go(n) {
    index = Math.max(0, Math.min(total - 1, n));
    render();
  }

  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  document.addEventListener('keydown', (e) => {
    if (overview.classList.contains('active')) {
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
        e.preventDefault(); go(0); break;
      case 'End':
        e.preventDefault(); go(total - 1); break;
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
  function buildOverview() {
    overviewGrid.innerHTML = '';
    slides.forEach((s, i) => {
      const card = document.createElement('button');
      card.className = 'overview-card';
      card.innerHTML = `
        <span class="ov-num">${String(i + 1).padStart(2, '0')}</span>
        <span class="ov-title">${slideTitles[i] || ''}</span>
      `;
      card.addEventListener('click', () => {
        go(i);
        toggleOverview(false);
      });
      overviewGrid.appendChild(card);
    });
  }

  function toggleOverview(force) {
    const willShow = force !== undefined ? force : !overview.classList.contains('active');
    overview.classList.toggle('active', willShow);
  }

  overviewBtn.addEventListener('click', () => toggleOverview());
  overview.addEventListener('click', (e) => {
    if (e.target === overview) toggleOverview(false);
  });
  buildOverview();

  // Hash navigation on load
  const hash = parseInt(window.location.hash.replace('#', ''), 10);
  if (!isNaN(hash) && hash >= 1 && hash <= total) {
    index = hash - 1;
  }
  render();

  // Hide hint after a few seconds
  setTimeout(() => hint.classList.add('hidden'), 5000);

  // Mouse wheel navigation (debounced)
  let wheelLock = false;
  document.addEventListener('wheel', (e) => {
    if (overview.classList.contains('active')) return;
    if (wheelLock) return;
    if (Math.abs(e.deltaY) < 30) return;
    wheelLock = true;
    if (e.deltaY > 0) next(); else prev();
    setTimeout(() => { wheelLock = false; }, 600);
  }, { passive: true });
})();
