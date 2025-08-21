// Placeholder for real game logic
export function startGame() {
  const hud = document.createElement('div');
  hud.style.position = 'absolute';
  hud.style.bottom = '10px';
  hud.style.left = '10px';
  hud.style.padding = '6px 10px';
  hud.style.background = 'rgba(0,0,0,0.7)';
  hud.style.color = '#0ff';
  hud.style.font = '14px monospace';
  hud.style.zIndex = 9999;
  hud.innerText = 'JS OK';
  document.body.appendChild(hud);

  const canvas = document.getElementById('game');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillText('Game loop would start here...', 20, 40);
  }
}