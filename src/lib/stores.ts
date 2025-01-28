import { writable } from 'svelte/store';

export const groupOrdersStoreIds = writable([]);
export const titleOfPage = writable('');

export const isLoadingData = writable(false);
export const isInsertingData = writable(false);
