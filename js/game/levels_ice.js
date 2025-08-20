export function makeLevel(seed=3){
  function rnd(){ seed = (seed*1664525 + 1013904223) % 4294967296; return (seed/4294967296); }
  const cols=28, rows=38;
  const enemies=[]; const rocks=[];
  for(let i=0;i<8;i++){ enemies.push({x: 3+Math.floor(rnd()*22), y: 6+Math.floor(rnd()*28), type: rnd()<0.25?'fygar':'pooka'}); }
  for(let i=0;i<8;i++){ rocks.push({x: 2+Math.floor(rnd()*24), y: 5+Math.floor(rnd()*31)}); }
  return {theme:'ice', cols, rows, enemies, rocks, player:{x:Math.floor(cols/2),y:1}};
}