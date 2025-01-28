import { writable, get } from 'svelte/store';
import Dexie, { liveQuery } from 'dexie';
import { isLoadingData, isInsertingData } from './stores';
//
import type { Order, PngTable } from '$lib/types/Order';
import { createPngStringForOrder } from './createPngString';

export const db = new Dexie('upnqrDb') as Dexie & {
  orders: Dexie.Table<Order>,
  pngStrings: Dexie.Table<PngTable>;
};

db.version(2).stores({
  orders: '++id',
  pngStrings: '++id'
});

export const numberOfAllRecords = writable(0);

export const ordersList = liveQuery(async () => {
  if (!get(isInsertingData)) { isLoadingData.set(true); }
  const collection = db.orders.orderBy('id');
  const recordsCount = await collection.count();
  numberOfAllRecords.set(recordsCount);
  if (!get(isInsertingData)) { isLoadingData.set(false); }
  return await collection.toArray();
});

export const addOrder = async (order: Order): Promise<number> => {
  const id = await db.orders.add(order);
  const pngString = await createPngStringForOrder(order);
  const pngStringRecord = { id: id, pngString: pngString };
  await db.pngStrings.put(pngStringRecord);
  return id;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await db.orders.delete(id);
  await db.pngStrings.delete(id);
};

export const readOrder = async (id: number): Promise<Order | undefined> => {
  const order = await db.orders.get(id);
  return order;
};

export const readPngString = async (id: number): Promise<PngTable | undefined> => {
  const pngStringRecord = await db.pngStrings.get(id);
  return pngStringRecord;
}

export const updateOrderPngString = async (id: number, order: Order): Promise<void> => {
  await db.orders.update(id, order);
  const pngString = await createPngStringForOrder(order);
  const pngStringRecord = { id: id, pngString: pngString };
  await db.pngStrings.put(pngStringRecord);
}
