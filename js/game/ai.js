// Simple A* pathfinding over tunnel cells
export function astar(grid, start, goal, maxNodes=500){
  const key=(x,y)=>x+'_'+y;
  const open = new Map(); const came = new Map();
  const g = new Map(); const f = new Map();
  const h=(a,b)=> Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
  const skey=key(...start), gkey=key(...goal);
  open.set(skey, start); g.set(skey,0); f.set(skey, h(start, goal));
  let nodes=0;
  while(open.size && nodes<maxNodes){
    nodes++;
    // get lowest f
    let currentKey=null, current=null, best=1e9;
    for(const [k,v] of open){ const fv=f.get(k)??1e9; if(fv<best){best=fv; currentKey=k; current=v;} }
    if(currentKey===gkey){ // reconstruct
      const path=[goal]; let ck=currentKey;
      while(came.has(ck)){ ck = came.get(ck); const [x,y]=ck.split('_').map(Number); path.unshift([x,y]); }
      return path;
    }
    open.delete(currentKey);
    const [cx,cy]=current;
    for(const [nx,ny] of [[cx+1,cy],[cx-1,cy],[cx,cy+1],[cx,cy-1]]){
      if (grid.get(nx,ny)!==0) continue;
      const nk=key(nx,ny);
      const tentative = (g.get(currentKey)??1e9) + 1;
      if (tentative < (g.get(nk)??1e9)){
        came.set(nk, currentKey);
        g.set(nk, tentative);
        f.set(nk, tentative + h([nx,ny], goal));
        if(!open.has(nk)) open.set(nk, [nx,ny]);
      }
    }
  }
  return null;
}
