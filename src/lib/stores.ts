import { writable } from 'svelte/store';

export const groupOrdersStoreIds = writable<number[]>([]);

export const titleOfPage = writable('');

export const isLoadingData = writable(false);
export const isInsertingData = writable(false);
