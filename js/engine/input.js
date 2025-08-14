export class Input {
  constructor(canvas) {
    this.keys = new Set();
    canvas.addEventListener('touchstart', e=> e.preventDefault(), {passive:false});
    window.addEventListener('keydown', e=>{ this.keys.add(e.key.toLowerCase()); });
    window.addEventListener('keyup', e=>{ this.keys.delete(e.key.toLowerCase()); });
  }
  get pump(){ return this.keys.has(' ') || this.keys.has('space'); }
  get dirX(){ return (this.keys.has('arrowleft')||this.keys.has('a')?-1:0) + (this.keys.has('arrowright')||this.keys.has('d')?1:0); }
  get dirY(){ return (this.keys.has('arrowup')||this.keys.has('w')?-1:0) + (this.keys.has('arrowdown')||this.keys.has('s')?1:0); }
}
