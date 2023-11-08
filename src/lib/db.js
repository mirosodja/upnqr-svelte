import { writable } from 'svelte/store';
import Dexie, { liveQuery } from 'dexie';

export const db = new Dexie('myDatabase');

db.version(2).stores({
  orders: '++id, [placnik+skupina], placnik, skupina, znesek, koda_namena, namen_placila, trr, referenca, prejemnik'
});

export const numberOfAllRecords = writable(0);

export const ordersList = liveQuery(async () => {
  // @ts-expect-error
  const collection = await db.orders.orderBy('id');
  // where('placnik').startsWithIgnoreCase('')
  const recordsCount = await collection.count();
  numberOfAllRecords.set(recordsCount);
  return await collection.toArray();
});




