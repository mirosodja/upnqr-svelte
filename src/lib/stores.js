import { writable } from 'svelte/store';

export const groupOrders = writable([]);
export const titleOfPage = writable('');

export const isLoadingData = writable(false);
