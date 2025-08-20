import {astar} from './ai.js';
export class Enemy {
  constructor(x,y,type='pooka'){ this.x=x; this.y=y; this.tx=x; this.ty=y; this.inflation=0; this.type=type; this.alive=true; this.ghost=false; this.cool=0; this.path=[]; this.pathCooldown=0; this.dead=false; }
  update(player, grid, dt, diff=1){
    if(!this.alive) return;
    this.cool -= dt; this.pathCooldown -= dt;
    if (this.inflation>0 && this.cool>0){
      // stunned
    } else {
      // Replan path sometimes
      if (this.pathCooldown<=0){
        const sx=Math.round(this.x), sy=Math.round(this.y);
        const gx=Math.round(player.x), gy=Math.round(player.y);
        this.path = astar(grid, [sx,sy], [gx,gy]) || [];
        this.pathCooldown = 0.6 - diff*0.1; // harder = more frequent
      }
      if (this.path && this.path.length>1){
        // step to next
        const [nx,ny] = this.path[1];
        this.tx = nx; this.ty=ny;
      } else {
        // fallback random move in tunnels
        const dirs=[[1,0],[-1,0],[0,1],[0,-1]];
        for(const [dx,dy] of dirs){ if (grid.get(this.x+dx,this.y+dy)===0){ this.tx=this.x+dx; this.ty=this.y+dy; break; } }
      }
      // occasional ghost if blocked
      if (Math.random()<0.01) this.ghost = true; else if (this.ghost && Math.random()<0.1) this.ghost=false;
      const speed = (this.ghost? 11:8 + diff)*dt;
      if(this.x!==this.tx) this.x = moveTowards(this.x, this.tx, speed);
      if(this.y!==this.ty) this.y = moveTowards(this.y, this.ty, speed);
    }
  }
  hitByPump(){ this.inflation = Math.min(4, this.inflation+1); this.cool = 0.35; if (this.inflation>=4){ this.alive=false; return true; } return false; }
}
function moveTowards(a,b,max){ const d=b-a; if (Math.abs(d)<=max) return b; return a + Math.sign(d)*max; }
