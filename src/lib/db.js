import { writable } from 'svelte/store';
import Dexie, { liveQuery } from 'dexie';
import { isLoadingData } from './stores';

export const db = new Dexie('upngrDb');


db.version(2).stores({
  orders: '++id'
  // , [placnik+skupina], placnik, skupina, znesek, koda_namena, namen_placila, trr, referenca, prejemnik
});

export const numberOfAllRecords = writable(0);

export const ordersList = liveQuery(async () => {
  isLoadingData.set(true);
  // @ts-expect-error
  const collection = await db.orders.orderBy('id');
  // where('placnik').startsWithIgnoreCase('')
  const recordsCount = await collection.count();
  numberOfAllRecords.set(recordsCount);
  isLoadingData.set(false);
  return await collection.toArray();
});

// create function for adding new order
export const addOrder = async (/** @type {any} */ order) => {
  // @ts-ignore
  const id = await db.orders.add(order);
  return id;
};

// create function for deleting order
// @ts-ignore
export const deleteOrder = async (id) => {
  // @ts-ignore
  await db.orders.delete(id);
};

// create function for updating order
// @ts-ignore
export const updateOrder = async (id, /** @type {any} */ order) => {
  // @ts-ignore
  await db.orders.update(id, order);
};

// create function for reading order
// @ts-ignore
export const readOrder = async (id) => {
  // @ts-ignore
  const order = await db.orders.get(id);
  return order;
};




