// js/main.js  (DEBUG WRAPPER)
function show(msg){
  const hud = document.getElementById('hud');
  if (hud) hud.textContent = String(msg);
}
(async () => {
  try {
    show('Booting…');

    // Quick proof that JS is running:
    const pct = document.getElementById('pct');
    if (pct) pct.textContent = 'JS OK';

    // Load the real game code safely
    const real = await import('./main_real.js').catch(e => {
      throw new Error('import main_real.js failed: ' + e.message);
    });

    await real.bootGame();   // call exported function
    show('Running');
  } catch (e) {
    show('Error: ' + (e && e.message ? e.message : e));
    console.error(e);
  }
})();
