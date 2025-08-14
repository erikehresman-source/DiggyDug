import {Loader} from './engine/loader.js';
import {Store} from './engine/storage.js';
import {Input} from './engine/input.js';
import {Sfx} from './engine/audio.js';
import {Game} from './game/game.js';

const cv = document.getElementById('game');
const btnPause = document.getElementById('btnPause');
const btnRestart = document.getElementById('btnRestart');
const btnPump = document.getElementById('btnPump');
const btnMenu = document.getElementById('btnMenu');
const loaderEl = document.getElementById('loader');
const barEl = document.getElementById('bar');
const pctEl = document.getElementById('pct');
const menu = document.getElementById('menu');
const worldSelect = document.getElementById('worldSelect');
const optSound = document.getElementById('optSound');
const optLefty = document.getElementById('optLefty');
const optDiff = document.getElementById('optDiff');
const scoresEl = document.getElementById('scores');
const resetScoresBtn = document.getElementById('btnResetScores');

const store = new Store();
const sfx = new Sfx();
const input = new Input(cv);
let game;

function showProgress(done,total){
  const p = total? Math.floor(done/total*100):0;
  barEl.style.width = p+'%'; pctEl.textContent = p+'%';
  if (p>=100) loaderEl.style.display='none';
}
const loader = new Loader(showProgress);

async function boot(){
  if ('serviceWorker' in navigator) {
    try { await navigator.serviceWorker.register('./sw.js'); } catch(e){ console.warn(e); }
  }
  loaderEl.style.display='block';
  await loader.queue([{type:'image', key:'sprites', src:'./assets/sprites.png'}]);
  const sprites = loader.get('sprites');

  game = new Game(cv, sfx, sprites, store);
  applySettings(); // before load
  await loadWorld(worldSelect.value);

  // resume from autosave
  const json = await store.get('saves','autosave');
  if (json){ try{ await game.importState(json); }catch{} }

  requestAnimationFrame(loop);
  cv.focus();
  await refreshScores();
}

async function loadWorld(url){
  game.attachFactory(url, 'makeLevel');
  await game.loadAndSetup(url, 'makeLevel');
}

function loop(t){
  const dt = Math.min(0.05, (loop.last? (t-loop.last)/1000 : 0)); loop.last = t;
  game.tick(dt, input);
  requestAnimationFrame(loop);
}

btnPause.onclick = ()=> game.togglePause();
btnRestart.onclick = ()=> game.restart();
btnPump.addEventListener('touchstart', e=>{ e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown',{key:' '})); }, {passive:false});
btnPump.addEventListener('touchend', e=>{ e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup',{key:' '})); }, {passive:false});
btnMenu.onclick = ()=>{ menu.showModal(); };

worldSelect.onchange = async ()=>{
  await loadWorld(worldSelect.value);
  await saveAuto();
};

optSound.onchange = ()=>{ sfx.setEnabled(optSound.checked); saveSettings(); };
optLefty.onchange = ()=>{ document.body.classList.toggle('lefty', optLefty.checked); saveSettings(); };
optDiff.onchange = ()=>{ game.difficulty = parseInt(optDiff.value,10); saveSettings(); };

resetScoresBtn.onclick = async ()=>{
  await store.del('scores','table');
  await refreshScores();
};

async function refreshScores(){
  const json = await store.get('scores','table');
  scoresEl.innerHTML = '';
  const arr = json? JSON.parse(json): [];
  arr.forEach((row, i)=>{
    const li=document.createElement('li');
    const date = new Date(row.date).toLocaleDateString();
    li.textContent = `${i+1}. ${row.score} — ${date}`;
    scoresEl.appendChild(li);
  });
}

async function saveSettings(){
  const s = { sound: optSound.checked, lefty: optLefty.checked, diff: optDiff.value };
  localStorage.setItem('ddplus_settings', JSON.stringify(s));
}
function applySettings(){
  try{
    const s = JSON.parse(localStorage.getItem('ddplus_settings')||'{}');
    optSound.checked = s.sound!==false;
    sfx.setEnabled(optSound.checked);
    optLefty.checked = !!s.lefty;
    document.body.classList.toggle('lefty', optLefty.checked);
    optDiff.value = s.diff||'1';
    if (game) game.difficulty = parseInt(optDiff.value,10);
  }catch{}
}

async function saveAuto(){
  const json = game.exportState();
  await store.set('saves','autosave', json);
}

window.addEventListener('beforeunload', saveAuto);
boot();
