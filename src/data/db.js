import Dexie from 'dexie';

export const db = new Dexie('myDatabase');

db.version(1).stores({
  orders: '++id, placnik, skupina, znesek, koda_namena, namen_placila, trr, referenca, prejemnik'
});

