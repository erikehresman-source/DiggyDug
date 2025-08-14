export class Store {
  constructor(dbName='diggydug+', storeNames=['saves','scores']){ this.dbName=dbName; this.storeNames=storeNames; this.db=null; }
  async open(){
    if (this.db) return this.db;
    return new Promise((resolve,reject)=>{
      const req = indexedDB.open(this.dbName,1);
      req.onupgradeneeded = ()=>{
        const db = req.result;
        this.storeNames.forEach(n=>{ if(!db.objectStoreNames.contains(n)) db.createObjectStore(n); });
      };
      req.onsuccess = ()=>{ this.db=req.result; resolve(this.db); };
      req.onerror = ()=> reject(req.error);
    });
  }
  async set(store, key, val){
    const db = await this.open();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction(store,'readwrite');
      tx.objectStore(store).put(val, key);
      tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error);
    });
  }
  async get(store, key){
    const db = await this.open();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction(store,'readonly');
      const req = tx.objectStore(store).get(key);
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error);
    });
  }
  async del(store, key){
    const db = await this.open();
    return new Promise((resolve,reject)=>{
      const tx = db.transaction(store,'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error);
    });
  }
}
