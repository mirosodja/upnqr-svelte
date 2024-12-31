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
	onMount(() => {
		createOrdersWithSvgString().then((result) => {
			orders = result;
		});
	});
</script>

<div class="a4">
	<div>Test</div>
	{#each orders as order}
		<div>{order.id}</div>
		<div>{order.placnik}</div>
		<div>{@html order.qrSvnString}</div>
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
