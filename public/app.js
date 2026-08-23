(function () {
  const STORAGE_KEY = 'ff_progress_v2';
  const MASTER_AT = 3;

  const cards = DECK.map((c, i) => ({ ...c, id: i }));
  const categories = [...new Set(cards.map(c => c.cat))];

  let progress = loadProgress();
  let currentCat = 'All';
  let queue = [];
  let current = null;
  let sessionStreak = 0;
  let isFlipped = false;

  const el = {
    card: document.getElementById('card'),
    cardWrap: document.getElementById('cardWrap'),
    frontCat: document.getElementById('frontCat'),
    frontText: document.getElementById('frontText'),
    backEn: document.getElementById('backTextEn'),
    backDe: document.getElementById('backTextDe'),
    deWrap: document.getElementById('deWrap'),
    dontKnowBtn: document.getElementById('dontKnowBtn'),
    knowBtn: document.getElementById('knowBtn'),
    cardStreak: document.getElementById('cardStreak'),
    controls: document.getElementById('controls'),
    emptyState: document.getElementById('emptyState'),
    resetCatBtn: document.getElementById('resetCatBtn'),
    categoryBar: document.getElementById('categoryBar'),
    progressFill: document.getElementById('progressFill'),
    statActive: document.getElementById('statActive'),
    statMastered: document.getElementById('statMastered'),
    statStreak: document.getElementById('statStreak'),
    tabs: document.querySelectorAll('.tab'),
    studyView: document.getElementById('studyView'),
    masteredView: document.getElementById('masteredView'),
    masteredList: document.getElementById('masteredList'),
    masteredCount: document.getElementById('masteredCount'),
    resetAllBtn: document.getElementById('resetAllBtn'),
    confetti: document.getElementById('confetti'),
  };

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }
  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
  function getP(id) {
    if (!progress[id]) progress[id] = { streak: 0, mastered: false };
    return progress[id];
  }

  function catCards(cat) {
    return cat === 'All' ? cards : cards.filter(c => c.cat === cat);
  }
  function activeCards(cat) {
    return catCards(cat).filter(c => !getP(c.id).mastered);
  }
  function masteredCards(cat) {
    return catCards(cat).filter(c => getP(c.id).mastered);
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildQueue() {
    queue = shuffle(activeCards(currentCat)).map(c => c.id);
  }

  function renderCategoryBar() {
    const all = ['All', ...categories];
    el.categoryBar.innerHTML = '';
    all.forEach(cat => {
      const count = activeCards(cat).length;
      const chip = document.createElement('button');
      chip.className = 'chip' + (cat === currentCat ? ' active' : '');
      chip.innerHTML = `${cat} <span class="count">${count}</span>`;
      chip.onclick = () => {
        currentCat = cat;
        buildQueue();
        renderCategoryBar();
        nextCard();
      };
      el.categoryBar.appendChild(chip);
    });
  }

  function updateStats() {
    el.statActive.textContent = activeCards('All').length;
    el.statMastered.textContent = masteredCards('All').length;
    el.statStreak.textContent = sessionStreak;
    const totalInCat = catCards(currentCat).length;
    const masteredInCat = masteredCards(currentCat).length;
    el.progressFill.style.width = totalInCat ? `${(masteredInCat / totalInCat) * 100}%` : '0%';
  }

  function nextCard() {
    isFlipped = false;
    el.card.classList.remove('flipped');
    if (queue.length === 0) {
      current = null;
      el.cardWrap.hidden = true;
      el.controls.hidden = true;
      el.emptyState.hidden = false;
      updateStats();
      return;
    }
    el.cardWrap.hidden = false;
    el.controls.hidden = false;
    el.emptyState.hidden = true;
    const id = queue.shift();
    current = cards[id];
    const p = getP(id);
    el.frontCat.textContent = current.cat;
    el.frontText.textContent = (current.emoji ? current.emoji + ' ' : '') + current.fr;
    el.backEn.textContent = current.en;
    if (current.de) {
      el.deWrap.hidden = false;
      el.backDe.hidden = false;
      el.backDe.textContent = current.de;
    } else {
      el.deWrap.hidden = true;
      el.backDe.hidden = true;
      el.backDe.textContent = '';
    }
    el.cardStreak.textContent = p.streak > 0 ? `+${p.streak}` : '';
    updateStats();
  }

  function flip() {
    isFlipped = !isFlipped;
    el.card.classList.toggle('flipped', isFlipped);
  }

  function answer(knew) {
    if (!current) return;
    const p = getP(current.id);
    if (knew) {
      p.streak += 1;
      sessionStreak += 1;
      if (p.streak >= MASTER_AT) {
        p.mastered = true;
        burstConfetti();
        el.card.classList.add('pop');
        setTimeout(() => el.card.classList.remove('pop'), 400);
      } else {
        queue.splice(Math.min(queue.length, 3 + Math.floor(Math.random() * 3)), 0, current.id);
      }
    } else {
      p.streak = 0;
      sessionStreak = 0;
      el.card.classList.add('shake');
      setTimeout(() => el.card.classList.remove('shake'), 400);
      queue.splice(Math.min(queue.length, 2 + Math.floor(Math.random() * 2)), 0, current.id);
    }
    saveProgress();
    renderCategoryBar();
    setTimeout(nextCard, knew && p.mastered ? 550 : 120);
  }

  function burstConfetti() {
    const colors = ['#ff5da2', '#7c5cff', '#37e6c5', '#ffd166', '#26c281'];
    for (let i = 0; i < 28; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = 1.2 + Math.random() * 1.1 + 's';
      piece.style.opacity = 0.7 + Math.random() * 0.3;
      el.confetti.appendChild(piece);
      setTimeout(() => piece.remove(), 2500);
    }
  }

  function renderMasteredView() {
    const list = masteredCards('All');
    el.masteredCount.textContent = `${list.length} card${list.length === 1 ? '' : 's'} mastered`;
    el.masteredList.innerHTML = '';
    if (list.length === 0) {
      el.masteredList.innerHTML = '<li class="mastered-empty">Nothing mastered yet — get studying! 💪</li>';
      return;
    }
    list.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<div><div class="m-fr">${c.fr}</div><div class="m-en">${c.en}</div></div><span class="pill">${c.cat}</span>`;
      el.masteredList.appendChild(li);
    });
  }

  // events
  el.card.addEventListener('click', flip);
  el.knowBtn.addEventListener('click', () => answer(true));
  el.dontKnowBtn.addEventListener('click', () => answer(false));
  el.resetCatBtn.addEventListener('click', () => {
    catCards(currentCat).forEach(c => { progress[c.id] = { streak: 0, mastered: false }; });
    saveProgress();
    buildQueue();
    renderCategoryBar();
    nextCard();
  });
  el.resetAllBtn.addEventListener('click', () => {
    if (!confirm('Reset ALL progress? This clears every mastered card.')) return;
    progress = {};
    saveProgress();
    buildQueue();
    renderCategoryBar();
    renderMasteredView();
    nextCard();
  });

  el.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      el.tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const view = tab.dataset.view;
      el.studyView.hidden = view !== 'study';
      el.masteredView.hidden = view !== 'mastered';
      if (view === 'mastered') renderMasteredView();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (el.studyView.hidden) return;
    if (e.code === 'Space') { e.preventDefault(); flip(); }
    else if (e.code === 'ArrowRight') answer(true);
    else if (e.code === 'ArrowLeft') answer(false);
  });

  // init
  buildQueue();
  renderCategoryBar();
  nextCard();
})();
