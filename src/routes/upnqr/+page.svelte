<script>
	import { ordersList } from "$lib/db";
	import { groupOrders } from "$lib/stores.js";
	/**
	 * @typedef {Object} Orders
	 * @property {number} id - ID.
	 * @property {string} placnik - placnik.
	 * @property {string} skupina - skupina.
	 * @property {string|number} znesek - znesek (string or number).
	 * @property {string} koda_namena - koda namena.
	 * @property {string} namen_placila - namen placila.
	 * @property {string} trr - TRR.
	 * @property {string} referenca - referenca.
	 * @property {string} prejemnik - prejemnik.
	 */

	/**
	 * @type {Orders[]}
	 */
	let items = [];

	/**
	 * @type {Orders[]}
	 */
	let orders = [];

	// code subscribes to the `ordersList` store and updates the `items` variable
	// whenever the value of `ordersList` changes. This ensures that `items` always
	// contains the latest data from the `ordersList` store.
	ordersList.subscribe((value) => {
		items = value;
	});

	$: groupOrders;

	$: orders = items.filter(item => $groupOrders.includes(item.id));

</script>

<svelte:head>
	<title>UPN QR->UPNQR v pdf</title>
	<meta
		name="description"
		content="Pretvori izbrane UPNQR zapise v pdf datoteko"
	/>
</svelte:head>

<div class="a4">
	<div>Test</div>
	<div>{$groupOrders}</div>
	{#each orders as order}
		<div>{order.id}</div>
		<div>{order.placnik}</div>
	{/each}
</div>

<style>
	.a4 {
		width: 210mm;
		height: 297mm;
		margin: auto;
		padding: 20mm;
		box-sizing: border-box;
		background: rgb(232, 134, 134);
	}

	@media print {
		:global(body *) {
			visibility: hidden;
		}
		.a4,
		.a4 * {
			visibility: visible;
		}
		.a4 {
			position: absolute;
			left: 0;
			top: 0;
		}
		@page {
			margin-left: 0;
			margin-right: 0;
			margin-top: 0;
			margin-bottom: 0;
		}
	}
</style>
