// js/main.js — robust debug wrapper
(function(){
  const hud = document.createElement('div');
  hud.style.position='fixed'; hud.style.top='8px'; hud.style.left='8px';
  hud.style.padding='6px 10px'; hud.style.background='rgba(0,0,0,0.7)';
  hud.style.color='#0f0'; hud.style.font='14px monospace'; hud.style.zIndex=9999;
  hud.textContent='Booting…'; document.body.appendChild(hud);

  function showErr(e){
    hud.style.color='#f55';
    hud.textContent = 'Error: ' + (e && e.message ? e.message : e);
    console.error(e);
  }

  import('./main_real.js').then(real => {
    try{
      if (typeof real.bootGame === 'function') {
        hud.textContent='Running (bootGame)…';
        real.bootGame();
      } else if (typeof real.startGame === 'function') {
        hud.textContent='Running (startGame)…';
        real.startGame();
      } else {
        throw new Error('main_real.js loaded but exports neither bootGame nor startGame');
      }
    } catch(e){ showErr(e); }
  }).catch(showErr);
})();