<script>
	import { onMount } from "svelte";
	import { titleOfPage } from "$lib/stores.js";
	/** Utils */
	import { createOrdersWithSvgString } from "$lib/createOrdersWithSvgString";

	$: titleOfPage.set("UPN QR");

	/**
	 * @typedef {Object} Order
	 * @property {number} id - ID.
	 * @property {string} placnik - placnik.
	 * @property {string} skupina - skupina.
	 * @property {string|number} znesek - znesek (string or number).
	 * @property {string} koda_namena - koda namena.
	 * @property {string} namen_placila - namen placila.
	 * @property {string} rok_placila - rok placila.
	 * @property {string} trr - TRR.
	 * @property {string} referenca - referenca.
	 * @property {string} prejemnik - prejemnik.
	 * @property {string} qrSvnString - qr svn string.
	 */

	/**
	 * @type {Order[]}
	 */
	let orders = [];
	let numOfOrders = 0;

	onMount(() => {
		createOrdersWithSvgString().then((result) => {
			orders = result;
			numOfOrders = orders.length;
		});
	});
</script>

{#each Array(Math.ceil(orders.length / 3)) as _, pageIndex}
	<page size="A4">
		{#each orders.slice(pageIndex * 3, pageIndex * 3 + 3) as order}
			<div class="ime">{order.id}</div>
			<div class="ime">{order.placnik}</div>
			<div class="qrcode">{@html order.qrSvnString}</div>
		{/each}
	</page>
{/each}

<style>
	page[size="A4"] {
		background: white;
		width: 21cm;
		height: 29.7cm;
		display: block;
		margin: 0 auto;
		margin-bottom: 0.5cm;
		box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
	}

	.qrcode {
		margin: 10mm;
		width: 32.6mm;
		height: 32.6mm;
	}

	.ime {
		margin: 10mm;
	}

	@media print {
		page[size="A4"] {
			margin: 0;
			box-shadow: 0;
		}

		:global(header footer) {
			display: none !important;
		}

		/* :global(main *) {
			visibility: visible !important;
		} */
	}
</style>
