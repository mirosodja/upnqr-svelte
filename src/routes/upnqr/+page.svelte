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

	//  * @property {string} [upnQrString] - UPN QR string.

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

	/**
	 * Retrieves the order position based on the given index.
	 *
	 * @param {number} index - The index for which to get the order position.
	 * @returns {string} The order position corresponding to the given index.
	 */
	const getOrderPosition = (index) => {
		return `top: ${index * 99}mm; left: 0;`;
	};
</script>

{#each Array(Math.ceil(orders.length / 3)) as _, pageIndex}
	<page size="A4">
		{#each orders.slice(pageIndex * 3, pageIndex * 3 + 3) as order, orderIndex}
			<div class="order" style={getOrderPosition(orderIndex)}>
				<div class="potrdilo">
					<div class="ime-placnik">{order.placnik.replace(/\n/g, '<br>')}</div>
					<div class="namen-rok-placila">{order.namen_placila}</div>
					<div class="znesek">***{order.znesek}</div>
				</div>
				<div class="talon">
					<div class="prejemnik-iban">{order.trr}</div>
					<div class="prejemnik-referenca">{order.referenca}</div>
					<div class="ime-prejemnik">{order.prejemnik}</div>
					<div class="qrcode">{@html order.qrSvnString}</div>
				</div>
			</div>
		{/each}
	</page>
{/each}

<style>
	page[size="A4"] {
		/* background: white; */
		width: 21cm;
		height: 29.7cm;
		display: block;
		margin: 0 0 0.5cm 0;
		background-size: 100%;
		/*! for production use point in path */
		background-image: url("./img/upnqr-a4.png");
		box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
		page-break-after: always;
	}

	.order {
		position: relative;
		width: 100%;
	}

	.potrdilo {
		position: absolute;
		top: 6mm;
		left: 4mm;
		width: 52.5mm;
		height: 99mm;
		font-family: 'Courier New', Courier, monospace;
		font-size: 8pt;
	}

	.talon {
		position: absolute;
		top: 0;
		left: 60mm;
		width: 150mm;
		height: 99mm;
		font-family: 'Courier New', Courier, monospace;
		font-size: 10pt;
	}

	.ime-placnik {
		position: absolute;
		top: 2mm;
		left: 2mm;
		width: 50mm;
	}

	.namen-rok-placila {
		position: absolute;
		top: 24mm;
		left: 10mm;
		width: 60mm;
	}

	.znesek {
		position: absolute;
		top: 36mm;
		left: 70mm;
		width: 30mm;
	}

	.prejemnik-iban {
		position: absolute;
		top: 45mm;
		left: 10mm;
		width: 60mm;
	}

	.prejemnik-referenca {
		position: absolute;
		top: 61mm;
		left: 10mm;
		width: 60mm;
	}

	.ime-prejemnik {
		position: absolute;
		top: 75mm;
		left: 10mm;
		width: 60mm;
	}

	.qrcode {
		position: absolute;
		top: 6mm;
		left: 100mm;
		width: 39.5mm;
		height: 39.5mm;
	}

	@media print {
		* {
			visibility: hidden;
		}

		:global(main) {
			/* visibility: visible !important;
			margin: 0; */
			visibility: visible;
			position: absolute;
			top: 0;
			left: 0;
			padding: 0mm;
			margin: 0mm;
		}

		:global(main) * {
			visibility: visible;
		}

		page[size="A4"] {
			margin: 0;
			box-shadow: 0;
			top: 0;
			left: 0;
		}
	}
</style>
