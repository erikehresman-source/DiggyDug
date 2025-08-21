// js/main_real.js — provides BOTH bootGame() and startGame() for compatibility
export async function bootGame(){ startGame(); }
export function startGame(){
  // Minimal proof-of-life: draw text on the canvas so we know code runs.
  const cv = document.getElementById('game');
  if(!cv){ throw new Error('Canvas #game not found'); }
  const ctx = cv.getContext('2d');
  ctx.fillStyle = 'black'; ctx.fillRect(0,0,cv.width,cv.height);
  ctx.fillStyle = 'white'; ctx.font = '16px monospace';
  ctx.fillText('Debug: main_real.js is running', 20, 40);
}