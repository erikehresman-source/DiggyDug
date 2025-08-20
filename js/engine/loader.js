export class Loader {
  constructor(onProgress){ this.cache = new Map(); this.total=0; this.done=0; this.onProgress=onProgress; }
  _bump(){ this.done++; if (this.onProgress) this.onProgress(this.done, this.total); }
  async queue(list){
    this.total = list.length; this.done = 0;
    const results = [];
    for(const item of list){
      if (item.type==='image'){
        results.push(await this.loadImage(item.key, item.src));
      } else if (item.type==='json'){
        results.push(await this.loadJSON(item.src));
      } else {
        results.push(null);
      }
      this._bump();
    }
    return results;
  }
  async loadImage(key, src) {
    if (this.cache.has(key)) return this.cache.get(key);
    const img = new Image(); img.decoding='async'; img.src = src;
    try{ await img.decode(); }catch{}
    this.cache.set(key, img); return img;
  }
  async loadJSON(url){ const res = await fetch(url); return res.json(); }
  get(key){ return this.cache.get(key); }
}
