// Debug wrapper main.js
(async function() {
  const hud = document.createElement('div');
  hud.style.position = 'absolute';
  hud.style.top = '10px';
  hud.style.left = '10px';
  hud.style.padding = '6px 10px';
  hud.style.background = 'rgba(0,0,0,0.7)';
  hud.style.color = '#0f0';
  hud.style.font = '14px monospace';
  hud.style.zIndex = 9999;
  hud.innerText = 'Booting...';
  document.body.appendChild(hud);

  try {
    const module = await import('./main_real.js');
    hud.innerText = 'Running';
    if (module && module.startGame) {
      module.startGame();
    }
  } catch (e) {
    hud.style.color = '#f00';
    hud.innerText = 'Error: ' + e.message;
    console.error(e);
  }
})();