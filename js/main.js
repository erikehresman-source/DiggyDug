import { Input } from './engine/input.js';
const cv = document.getElementById('game');
const hud = document.getElementById('hud');
const btnPump = document.getElementById('btn-pump');

const input = new Input(cv);

document.querySelectorAll('.touchpad [data-dir]').forEach(btn=>{
  const dir = btn.getAttribute('data-dir');
  btn.addEventListener('touchstart', e=>{ e.preventDefault(); input.setTouchDir(dir,true); }, {passive:false});
  btn.addEventListener('touchend', e=>{ e.preventDefault(); input.setTouchDir(dir,false); }, {passive:false});
});
btnPump.addEventListener('touchstart', e=>{ e.preventDefault(); input.setPump(true); }, {passive:false});
btnPump.addEventListener('touchend', e=>{ e.preventDefault(); input.setPump(false); }, {passive:false});

hud.textContent = "Game ready (stub)";