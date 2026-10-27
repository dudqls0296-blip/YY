/* ASHEN THRONE — Graduation Showcase deck */
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const pad = n => String(n).padStart(2, '0');
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const S = [
  { id: 's-title', name: 'TITLE', ko: '게임 타이틀', nav: 'TITLE', bars: false },
  { id: 's-world', name: 'THE ASHEN KINGDOM', ko: '작품 및 세계관', nav: 'WORLD', card: ['CHAPTER I', 'THE ASHEN KINGDOM', '세계관'] },
  { id: 's-arsenal', name: 'ARSENAL', ko: '실제 모델링', nav: 'ARSENAL', card: ['CHAPTER II', 'ARSENAL', '캐릭터 · 무기 · 환경 모델링'] },
  { id: 's-start', name: 'GAME START', ko: '게임 실행', nav: 'COMBAT', bars: false, card: ['CHAPTER III', 'INTO THE RUINS', '게임 플레이'] },
  { id: 's-loading', name: 'LOADING', ko: '로딩', nav: 'COMBAT', bars: false },
  { id: 's-tutorial', name: 'TUTORIAL', ko: '인게임 튜토리얼', nav: 'COMBAT' },
  { id: 's-system', name: 'CORE SYSTEMS', ko: '인게임 시스템', nav: 'COMBAT' },
  { id: 's-encounter', name: 'BOSS ENCOUNTER', ko: '보스전 진입', nav: 'BOSS', card: ['CHAPTER IV', 'THE ABYSS', '보스전'] },
  { id: 's-bestiary', name: 'BOSS PATTERNS', ko: '보스 패턴', nav: 'BOSS' },
  { id: 's-dev', name: 'DEVELOPMENT', ko: '제작 성과 및 계획', nav: 'DEVELOPMENT', card: ['CHAPTER V', 'DEVELOPMENT', '제작 성과와 다음 단계'] },
  { id: 's-ending', name: 'CREDITS', ko: '마무리', nav: 'CREDITS' }
];
const slides = S.map(s => document.getElementById(s.id));
let cur = -1, lock = false;

/* ─────────── ash & embers ─────────── */
(function ash() {
  const c = $('#ash'), x = c.getContext('2d'); let W, H;
  const fit = () => { W = c.width = innerWidth; H = c.height = innerHeight; }; fit(); addEventListener('resize', fit);
  const mk = init => { const e = Math.random() < .3; return { x: Math.random() * W, y: init ? Math.random() * H : H + 6, r: e ? Math.random() * 1.3 + .5 : Math.random() * 2 + .4, vx: (Math.random() - .5) * .25, vy: -(Math.random() * .4 + .12) * (e ? 1.6 : 1), a: Math.random() * .4 + .08, e, p: Math.random() * 6.3 }; };
  const P = Array.from({ length: 70 }, () => mk(true));
  (function f(t) {
    x.clearRect(0, 0, W, H);
    for (const p of P) {
      p.x += p.vx + Math.sin(t / 2600 + p.p) * .15; p.y += p.vy;
      if (p.y < -8 || p.x < -8 || p.x > W + 8) Object.assign(p, mk(false));
      x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283);
      if (p.e) { x.fillStyle = `rgba(228,204,166,${p.a * (.6 + .4 * Math.sin(t / 400 + p.p))})`; x.shadowBlur = 5; x.shadowColor = 'rgba(201,164,108,.5)'; }
      else { x.fillStyle = `rgba(175,182,192,${p.a * .8})`; x.shadowBlur = 0; }
      x.fill();
    }
    requestAnimationFrame(f);
  })(0);
})();

/* ─────────── sound (real game BGM / greatsword) ─────────── */
const snd = {
  on: false, bgm: new Audio('audio/bgm_phase1.mp3'), hit: new Audio('audio/boss_slash1.mp3'), t: null,
  toggle() { this.on = !this.on; $$('.snd').forEach(e => e.textContent = this.on ? 'ON' : 'OFF'); $('#sndBtn').classList.toggle('on', this.on); if (!this.on) { this.bgm.pause(); this.bgm.volume = 0; } else syncBgm(); },
  fade(to) {
    clearInterval(this.t); const a = this.bgm; a.loop = true;
    if (to > 0 && this.on && a.paused) { a.volume = 0; a.play().catch(() => {}); }
    this.t = setInterval(() => { const d = to - a.volume; if (Math.abs(d) < .02) { a.volume = to; clearInterval(this.t); if (!to) a.pause(); } else a.volume = Math.min(1, Math.max(0, a.volume + Math.sign(d) * .02)); }, 60);
  },
  slash() { if (this.on) { this.hit.currentTime = 0; this.hit.volume = .7; this.hit.play().catch(() => {}); } }
};
function syncBgm() { const id = S[cur]?.id; snd.fade(snd.on && ['s-encounter', 's-bestiary'].includes(id) ? .45 : 0); }
$('#sndBtn').onclick = () => snd.toggle();
function toggleFS() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen?.().catch(() => {}); }
$('#fsBtn').onclick = toggleFS;
document.addEventListener('fullscreenchange', () => { const on = !!document.fullscreenElement; $('#fsTxt').textContent = on ? 'EXIT FULLSCREEN' : 'FULLSCREEN'; $('#fsBtn').classList.toggle('on', on); });

/* ─────────── chrome ─────────── */
const navs = [...new Set(S.map(s => s.nav))];
$('#chapters').innerHTML = navs.map(n => `<li><button data-n="${n}">${n}</button></li>`).join('');
$$('#chapters button').forEach(b => b.onclick = () => go(S.findIndex(s => s.nav === b.dataset.n)));
$$('[data-goto]').forEach(b => b.onclick = () => go(+b.dataset.goto));
$('#chapGrid').innerHTML = S.map((s, i) => `<button data-i="${i}"><i>${pad(i + 1)}</i><b>${s.name}</b><span>${s.ko}</span></button>`).join('');
$$('#chapGrid button').forEach(b => b.onclick = () => { closeOv(); go(+b.dataset.i); });
$$('[data-nav]').forEach(b => b.onclick = () => b.dataset.nav === 'next' ? next() : prev());
$$('[data-ov]').forEach(b => b.onclick = () => openOv(b.dataset.ov));
function chrome() {
  const s = S[cur];
  document.body.classList.toggle('bars-hidden', s.bars === false);
  $$('#chapters button').forEach(b => b.classList.toggle('on', b.dataset.n === s.nav));
  $$('#chapGrid button').forEach((b, i) => b.classList.toggle('on', i === cur));
  $('#deckCount').innerHTML = `<b>${pad(cur + 1)}</b> / ${S.length}`;
  $('#progFill').style.width = ((cur + 1) / S.length * 100) + '%';
  $('#sceneName').textContent = `${s.name} · ${s.ko}`;
}

/* ─────────── scene change ─────────── */
const hooks = {};
function go(i, opt = {}) {
  if (i < 0 || i >= S.length || i === cur || lock) return;
  lock = true; setTimeout(() => lock = false, 500);
  const prevI = cur, forward = i > prevI;
  const swap = () => {
    if (prevI >= 0) { slides[prevI].classList.remove('active', 'play'); $$('video', slides[prevI]).forEach(v => v.pause()); hooks[S[prevI].id]?.leave?.(); }
    cur = i; const sl = slides[i];
    sl.classList.add('active'); void sl.offsetWidth; sl.classList.add('play');
    $$('.media video', sl).forEach(v => { v.currentTime = 0; v.play().catch(() => {}); });
    hooks[S[i].id]?.enter?.(prevI);
    chrome(); syncBgm(); renderNote();
    try { sessionStorage.setItem('at3', i); } catch (e) {}
  };
  const card = S[i].card;
  if (card && forward && prevI >= 0 && !opt.noCard) {
    const cc = $('#chapterCard'); $('#ccNum').textContent = card[0]; $('#ccName').textContent = card[1]; $('#ccKo').textContent = card[2];
    cc.classList.remove('show'); void cc.offsetWidth; cc.classList.add('show');
    setTimeout(swap, 380);
  } else swap();
}
function skipCard() { $('#chapterCard').classList.remove('show'); }
const next = () => { skipCard(); if (hooks[S[cur].id]?.step?.(1)) return; go(cur + 1); };
const prev = () => { skipCard(); if (hooks[S[cur].id]?.step?.(-1)) return; go(S[cur].id === 's-tutorial' ? cur - 2 : cur - 1, { noCard: true }); };

/* ─────────── overlays ─────────── */
function openOv(id) { $('#' + id).classList.add('on'); }
function closeOv() { $$('.overlay.on').forEach(o => o.classList.remove('on')); $('#viewer').innerHTML = ''; }
$$('.overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o || e.target.closest('[data-close]') || o.id === 'viewer') closeOv(); }));
function view(src, video) { $('#viewer').innerHTML = video ? `<video src="${src}" controls autoplay muted playsinline></video>` : `<img src="${src}" alt="">`; openOv('viewer'); }
document.addEventListener('click', e => {
  const v = e.target.closest('[data-video]'); if (v) return view(v.dataset.video, true);
  const z = e.target.closest('[data-zoom]'); if (z) view(z.dataset.zoom, false);
});


/* ─────────── presenter notes (N) ─────────── */
const NOTES = {
  's-title': ['안녕하십니까, 게임 & VR 콘텐츠 디자인학과 김영빈입니다.', '졸업작품, 다크 판타지 3D 보스 액션 게임 ASHEN THRONE을 소개하겠습니다.'],
  's-world': ['잿빛으로 무너진 왕국에서, 플레이어는 대검을 든 기사가 되어 옥좌를 지키는 보스에게 도전합니다.', 'Unity 6 HDRP로 제작했고, 탐험보다 1:1 보스전의 긴장감에 집중한 작품입니다.'],
  's-arsenal': ['게임에 들어간 실제 모델입니다. 주인공 철갑 기사와 주무기 그레이트 소드, 그리고 진입 회랑 환경입니다.', '모두 PBR 텍스처로 Unity에 적용했고, 환경은 돌벽·돌바닥 모듈을 반복 배치해 구성했습니다.'],
  's-start': ['이제 실제 게임 흐름을 따라가 보겠습니다.', '타이틀에서 게임을 시작하면 로딩을 거쳐 튜토리얼 구간으로 들어갑니다.'],
  's-loading': ['로딩 화면에서는 전투 팁이 순서대로 나옵니다.', '공식 홈페이지와 같은 디자인을 게임 안에도 그대로 옮겼습니다.'],
  's-tutorial': ['회랑을 걸으며 이동, 공격, 회피, 스태미나를 순서대로 배우는 인게임 튜토리얼입니다.', '오른쪽은 실제 플레이 화면이고, 안내 문구도 게임에 구현된 그대로입니다.'],
  's-system': ['모든 행동이 스태미나를 쓰는 구조라 무작정 공격할 수 없습니다.', '버튼으로 보시면 소모 후 0.8초 뒤부터 회복되고, 바닥나면 탈진해 잠시 행동할 수 없습니다.'],
  's-encounter': ['회랑 끝에 도착하면 보스 진입 여부를 묻는 창이 뜹니다.', '도전을 선택하면 BGM과 함께 심연의 기사와의 결투가 시작됩니다.'],
  's-bestiary': ['보스는 12가지 패턴을 가지고 있고, 체력이 70, 50, 30%로 줄 때마다 새로운 패턴이 열립니다.', '패턴마다 전조, 판정, 후딜이 나뉘어 있어 전조를 읽고 피한 뒤 반격하는 흐름이 핵심입니다.'],
  's-dev': ['현재 캐릭터, 무기, 환경 모델링과 전투, 보스 AI, UI, 사운드까지 구현을 마쳤습니다.', '남은 기간에는 보스 전용 모델 제작과 전투 밸런스, 레벨 완성도를 높이겠습니다.'],
  's-ending': ['ASHEN THRONE을 하나의 완성된 게임 경험으로 끝까지 발전시키겠습니다.', '들어주셔서 감사합니다.']
};
function renderNote() { const n = NOTES[S[cur]?.id] || ['', '']; $('#noteL1').textContent = n[0]; $('#noteL2').textContent = n[1]; $('#noteTag').textContent = `${pad(cur + 1)} · ${S[cur].name}`; }
function toggleNotes() { document.body.classList.toggle('notes-on'); renderNote(); }

/* ─────────── keyboard ─────────── */
function menuOf() { const s = slides[cur]; if (S[cur].id === 's-title' && !s.classList.contains('open')) return null; return $('.menu, #encBtns', s); }
function menuMove(d) {
  const m = menuOf(); if (!m) return false;
  const it = $$('.mi, .btn', m); let k = it.findIndex(x => x.classList.contains('sel')); k = (k + d + it.length) % it.length;
  it.forEach((x, j) => x.classList.toggle('sel', j === k)); return true;
}
$$('.menu, #encBtns').forEach(m => $$('.mi, .btn', m).forEach(b => b.addEventListener('mouseenter', () => { $$('.mi, .btn', m).forEach(x => x.classList.toggle('sel', x === b)); })));
document.addEventListener('keydown', e => {
  if (!document.getElementById('boot').classList.contains('done')) return;
  const k = e.key, ov = $('.overlay.on');
  if (S[cur].id === 's-title' && !slides[cur].classList.contains('open') && !ov) { openTitle(); e.preventDefault(); return; }
  if (k === 'Escape') { ov ? closeOv() : go(0); return; }
  if (ov && !/^[mM]$/.test(k)) return;
  if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); next(); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
  else if (k === 'ArrowDown' || k === 'ArrowUp') { const d = k === 'ArrowDown' ? 1 : -1; if (hooks[S[cur].id]?.nav?.(d) || menuMove(d)) e.preventDefault(); }
  else if (k === 'Enter') { const m = menuOf(); const s = m && $('.sel', m); if (s) { e.preventDefault(); s.click(); } }
  else if (/^[mM]$/.test(k)) { $('#chapterOv').classList.contains('on') ? closeOv() : openOv('chapterOv'); }
  else if (/^[sS]$/.test(k)) snd.toggle();
  else if (/^[nN]$/.test(k)) toggleNotes();
  else if (/^[fF]$/.test(k)) toggleFS();
  else if (/^[0-9]$/.test(k)) go(k === '0' ? 9 : +k - 1, { noCard: true });
});

/* ═════════ 01 TITLE ═════════ */
function openTitle() { const s = $('#s-title'); if (s.classList.contains('open')) return; s.classList.add('open'); document.body.classList.remove('bars-hidden'); }
$('#s-title').addEventListener('click', e => { if (!e.target.closest('.mi')) openTitle(); });
$$('#titleMenu .mi').forEach(b => b.onclick = e => {
  e.stopPropagation(); const a = b.dataset.act;
  if (a === 'new' || a === 'overview') go(1); else if (a === 'controls') openOv('controlsOv'); else if (a === 'fullscreen') toggleFS(); else snd.toggle();
});
hooks['s-title'] = { enter() { $('#s-title').classList.remove('open'); } };

/* ═════════ 02 WORLD ═════════ */
$('#pillars').innerHTML = AT.features.map((f, i) => `<div class="in" style="--d:${1300 + i * 120}"><i>${ROMAN[i]}</i><b>${f[0]}</b><span>${f[1]}</span></div>`).join('');

/* ═════════ 03 ARSENAL ═════════ */
const CATS = { CHARACTER: '캐릭터', WEAPON: '무기', ENVIRONMENT: '환경' };
let aCat = 'CHARACTER', aIdx = 0;
$('#arsCats').innerHTML = Object.keys(AT.armory).map(c => `<button data-c="${c}">${c}<small>${CATS[c]}</small></button>`).join('');
$$('#arsCats button').forEach(b => b.onclick = () => { aCat = b.dataset.c; aIdx = 0; renderArs(); });
function renderArs() {
  const list = AT.armory[aCat], it = list[aIdx];
  $$('#arsCats button').forEach(b => b.classList.toggle('on', b.dataset.c === aCat));
  $('#arsGhost').textContent = it.bg;
  const img = $('#arsModel'); img.classList.add('swap');
  setTimeout(() => {
    const chain = [it.img, it.fallback, it.shots[0] && it.shots[0][0]].filter(Boolean);
    let k = 0;
    const tryNext = () => { if (k >= chain.length) return; const src = chain[k++]; img.classList.toggle('shot', !!it.wide || src === (it.shots[0] && it.shots[0][0])); img.classList.toggle('wide', !!it.wide); img.classList.toggle('soft', src === it.fallback); img.src = src; };
    img.onerror = tryNext; img.onload = () => img.classList.remove('swap');
    tryNext();
  }, 220);
  const items = list.length > 1 ? `<div class="ars-items">${list.map((x, i) => `<button data-i="${i}" class="${i === aIdx ? 'on' : ''}">${x.name}</button>`).join('')}</div>` : '';
  $('#arsInfo').innerHTML = `
    <div class="kicker">${aCat}</div>
    <h2 class="h-l">${it.en}</h2>
    <div class="ko-title">${it.name} &nbsp; <span class="st ${it.status[0]}">${it.status[1]}</span></div>
    ${items}
    <p class="lead">${it.lead}</p>
    <p class="body">${it.desc}</p>
    <div class="specs">${it.stats.map(s => `<div><span>${s[0]}</span><b>${s[1]}</b></div>`).join('')}</div>
    <div class="ars-reel">${it.shots.map(s => `<figure data-zoom="${s[0]}"><img src="${s[0]}" alt=""></figure>`).join('')}</div>`;
  $$('#arsInfo .ars-items button').forEach(b => b.onclick = () => { aIdx = +b.dataset.i; renderArs(); });
}
renderArs();
hooks['s-arsenal'] = { nav(d) { const flat = Object.keys(AT.armory).flatMap(c => AT.armory[c].map((_, i) => [c, i])); let k = flat.findIndex(([c, i]) => c === aCat && i === aIdx); [aCat, aIdx] = flat[(k + d + flat.length) % flat.length]; renderArs(); return true; } };

/* ═════════ 04 START ═════════ */
$$('#startMenu .mi').forEach(b => b.onclick = () => b.dataset.act === 'start' ? go(4) : go(2, { noCard: true }));

/* ═════════ 05 LOADING ═════════ */
const tips = [['Watch the blade, not the knight.', '모든 공격에는 전조가 있다. 공격 타이밍을 관찰하라.'], ['Roll through the strike.', '구르기 직후 0.44초는 무적이다. 공격 범위를 벗어나라.'], ['Mind your breath.', '공격과 회피에는 스태미나가 든다. 바닥나면 잠시 움직일 수 없다.']];
let lt = null;
hooks['s-loading'] = {
  enter() {
    let p = 0, ti = -1; const bar = $('#loadBar'), pc = $('#loadPct');
    const tip = i => { if (i === ti) return; ti = i; $('#tipEn').style.opacity = $('#tipKo').style.opacity = 0; setTimeout(() => { $('#tipEn').textContent = tips[i][0]; $('#tipKo').textContent = tips[i][1]; $('#tipEn').style.opacity = $('#tipKo').style.opacity = 1; }, i ? 350 : 0); };
    tip(0); bar.style.width = '0';
    clearInterval(lt); lt = setInterval(() => {
      p = Math.min(100, p + (100 / 230) * (.8 + Math.random() * .6)); bar.style.width = p + '%'; pc.textContent = Math.floor(p) + '%'; tip(Math.min(2, Math.floor(p / 34)));
      if (p >= 100) { clearInterval(lt); setTimeout(() => { if (S[cur].id === 's-loading') go(5); }, 700); }
    }, 20);
  },
  leave() { clearInterval(lt); }
};
$('#s-loading').addEventListener('click', () => go(5));

/* ═════════ 06 TUTORIAL ═════════ */
let tI = 0;
$('#tutList').innerHTML = AT.tutorial.map((t, i) => `<button class="tut-item" data-i="${i}"><i>${ROMAN[i]}</i><b>${t.ko}</b><span>${t.t}</span></button>`).join('');
$$('#tutList .tut-item').forEach(b => b.onclick = () => pickTut(+b.dataset.i));
function pickTut(i) {
  tI = i; const t = AT.tutorial[i];
  $$('#tutList .tut-item').forEach((b, j) => b.classList.toggle('on', j === i));
  const m = $('#tutMedia'); const old = $('video', m);
  const v = document.createElement('video'); v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.poster = t.img; v.src = t.video;
  v.style.cssText = 'position:absolute;inset:0;opacity:0;transition:opacity .6s ease';
  m.appendChild(v); v.play().catch(() => {}); requestAnimationFrame(() => v.style.opacity = 1);
  if (old) setTimeout(() => old.remove(), 650);
  $('#tutCard').innerHTML = `
    <div class="kicker">${ROMAN[i]} · ${t.t}</div>
    <h3 class="h-m" style="margin-top:.7rem">${t.ko}</h3>
    <div class="keys">${t.keys.map(k => `<span><span class="kbd">${k[0]}</span>${k[1]}</span>`).join('')}</div>
    <p class="body" style="color:var(--bone)">${t.text}</p>
    <div class="vals">${t.facts.map(f => `<div><b>${f[1]}</b>${f[0]}</div>`).join('')}</div>`;
}
hooks['s-tutorial'] = { enter() { pickTut(tI); }, nav(d) { pickTut((tI + d + AT.tutorial.length) % AT.tutorial.length); return true; } };

/* ═════════ 07 SYSTEMS ═════════ */
let sI = 3;
$('#sysList').innerHTML = AT.systems.map((s, i) => `<div class="sys-row" data-i="${i}"><button><span class="nm">${s.name}</span><span class="ix">${ROMAN[i]}</span></button><div class="sys-body"><p>${s.text}</p><ul>${s.items.map(x => `<li>${x}</li>`).join('')}</ul></div></div>`).join('');
$$('#sysList .sys-row > button').forEach(b => b.onclick = () => pickSys(+b.parentElement.dataset.i));
function pickSys(i) { sI = i; $$('#sysList .sys-row').forEach((r, j) => r.classList.toggle('on', j === i)); }
pickSys(sI);
hooks['s-system'] = { nav(d) { pickSys((sI + d + AT.systems.length) % AT.systems.length); return true; } };
const ST = { v: 100, last: -9, delay: .8, ex: false, t: 0 }, COST = { attack: 15, heavy: 25, dodge: 25, sprint: 12 }, NM = { attack: '공격', heavy: '강공격', dodge: '구르기', sprint: '질주 1초' };
const log = m => { const l = $('#hudLog'), d = document.createElement('div'); d.textContent = m; l.prepend(d); while (l.children.length > 3) l.lastChild.remove(); };
$$('[data-st]').forEach(b => b.onclick = () => {
  const a = b.dataset.st, now = performance.now() / 1000;
  if (ST.ex) { log(`탈진 상태 — ${NM[a]} 불가`); return; }
  ST.v = Math.max(0, ST.v - COST[a]); ST.last = now; ST.delay = .8;
  if (ST.v <= 0) { ST.ex = true; ST.delay = 1.2; log(`${NM[a]} −${COST[a]} → 탈진`); } else log(`${NM[a]} −${COST[a]}`);
  if (a === 'attack' || a === 'heavy') snd.slash();
});
(function loop() {
  const now = performance.now() / 1000, dt = Math.min(.1, now - (ST.t || now)); ST.t = now;
  if (now >= ST.last + ST.delay && ST.v < 100) { ST.v = Math.min(100, ST.v + 25 * dt); if (ST.ex && ST.v >= 20) { ST.ex = false; log('탈진 해제'); } }
  if (S[cur]?.id === 's-system') {
    $('#stFill').style.width = ST.v + '%'; $('#stVal').textContent = Math.round(ST.v);
    $('#hudCard').classList.toggle('ex', ST.ex);
    const h = $('#hudState'); h.classList.toggle('ex', ST.ex);
    h.textContent = ST.ex ? 'EXHAUSTED · 20까지 행동 불가' : (now < ST.last + ST.delay ? 'RECOVERY DELAY' : (ST.v < 100 ? 'RECOVERING' : ''));
  }
  requestAnimationFrame(loop);
})();

/* ═════════ 08 ENCOUNTER ═════════ */
$$('#encBtns .btn').forEach(b => b.onclick = () => { if (b.dataset.act === 'yes') { snd.slash(); go(8, { noCard: true }); } else go(6, { noCard: true }); });

/* ═════════ 09 BOSS PATTERNS — video keeps playing, left panel steps through ═════════ */
const ORDER = [...AT.patterns].sort((a, b) => a.n - b.n);
const GATE_INFO = {
  1:  { cls: 'always', badge: '항상 사용 (HP 100%)', label: '항상 사용', hpText: 'HP 100%' },
  .7: { cls: 'g70', badge: '체력 70% 이하 해금', label: '체력 70% 이하 해금', hpText: 'HP ≤ 70%' },
  .5: { cls: 'g50', badge: '체력 50% 이하 · 2페이즈', label: '체력 50% 이하 · 2페이즈', hpText: 'HP ≤ 50%' },
  .3: { cls: 'g30', badge: '체력 30% 이하 · 필살기', label: '체력 30% 이하 · 필살기', hpText: 'HP ≤ 30%' }
};
const gateOf = p => GATE_INFO[p.gate] || GATE_INFO[1];
let pK = 0;
$('#patIndex').innerHTML = ORDER.map((p, k) => {
  const g = gateOf(p);
  return `<button data-k="${k}" class="${g.cls}" title="${pad(p.n)}. ${p.name} [${g.label}]">${pad(p.n)}</button>`;
}).join('');
$$('#patIndex button').forEach(b => b.onclick = () => showPat(+b.dataset.k));
function showPat(k) {
  pK = k; const p = ORDER[k], g = gateOf(p);
  $$('#patIndex button').forEach((b, j) => { b.classList.toggle('on', j === k); b.classList.toggle('seen', j < k); });
  $('#bhpFill').style.width = p.gate * 100 + '%'; $('#bhpTxt').textContent = g.hpText; $('#gateTxt').textContent = g.label;
  const c = $('#patCard'); c.classList.remove('swap'); void c.offsetWidth; c.classList.add('swap');
  c.innerHTML = `
    <div class="pc-num-row">
      <div class="pc-num">${pad(p.n)}<small>/ 12</small></div>
      <span class="pc-gate-badge ${g.cls}"><i class="badge-dot"></i>${g.badge}</span>
    </div>
    <h3 class="pc-name">${p.name}${p.sub ? ` <small class="pc-sub">(${p.sub})</small>` : ''}</h3>
    <div class="pc-en">${p.id.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()}</div>
    <p class="pc-desc">${p.desc}</p>
    <div class="timing"><div class="w" style="flex:${p.w}">${p.w}s</div><div class="a" style="flex:${p.a}">${p.a}s</div><div class="r" style="flex:${p.r}">${p.r}s</div></div>
    <div class="timing-key"><span>전조</span><span>판정</span><span>반격 기회</span></div>
    <div class="pc-meta"><span class="pc-unlock-meta">해금 조건 <b>${g.badge}</b></span><span>피해 <b>${p.dmg}</b></span><span>사거리 <b>${p.range}</b></span><span>패링 <b>${p.parry ? '가능' : '불가'}</b></span></div>
    <div class="counter"><span class="label">COUNTER</span>${p.counter}</div>`;
}
showPat(0);
hooks['s-bestiary'] = {
  enter(prev) { const v = $('#bossVideo'); if (prev !== 8) { v.currentTime = 0; } v.play().catch(() => {}); if (prev > 8) showPat(ORDER.length - 1); else if (prev < 8) showPat(0); },
  leave() { $('#bossVideo').pause(); },
  nav(d) { const k = pK + d; if (k < 0 || k >= ORDER.length) return false; showPat(k); return true; },
  step(d) { const k = pK + d; if (k < 0 || k >= ORDER.length) return false; showPat(k); return true; }
};

/* ═════════ 10 DEVELOPMENT ═════════ */
const LB = { done: '완료', wip: '진행 중', plan: '예정' };
const cnt = s => AT.ledger.filter(r => r[1] === s).length;
$('#tally').innerHTML = `<div><b>${cnt('done')}</b><span>COMPLETE</span></div><div><b>${cnt('wip')}</b><span>IN PROGRESS</span></div><div><b>${cnt('plan')}</b><span>PLANNED</span></div>`;
$('#ledger').innerHTML = AT.ledger.map(r => `<div><b>${r[0]}</b><span class="st ${r[1]}">${LB[r[1]]}</span><p>${r[2]}</p></div>`).join('');
$('#road').insertAdjacentHTML('beforeend', AT.roadmap.map(r => `<li><b>${r[0]}</b><span>${r[1]}</span></li>`).join(''));

/* ═════════ 11 ENDING ═════════ */
$$('#endMenu .mi').forEach(b => b.onclick = () => go(b.dataset.act === 'replay' ? 1 : 0, { noCard: true }));

/* ─────────── boot (same rhythm as the official site preloader) ─────────── */
addEventListener('load', () => {
  let p = 0, resume = 0; try { resume = +sessionStorage.getItem('at3') || 0; } catch (e) {}
  if (resume === 4) resume = 3;
  const iv = setInterval(() => {
    p = Math.min(100, p + (100 / 90) * (.8 + Math.random() * .6)); $('#bootBar').style.width = p + '%'; $('#bootPct').textContent = Math.floor(p) + '%';
    if (p >= 100) { clearInterval(iv); setTimeout(() => { $('#boot').classList.add('done'); go(resume, { noCard: true }); }, 300); }
  }, 20);
});
window.ATgo = go;
