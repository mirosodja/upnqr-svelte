<script>
	import { onMount } from "svelte";
	import { titleOfPage } from "$lib/stores.js";
	/** Utils */
	import { createOrdersWithSvgString } from "$lib/createOrdersWithSvgString";
	import NavButtonsUpnQr from "$lib/components/NavButtonsUpnQr.svelte";

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
		createOrdersWithSvgString()
			.then((result) => {
				orders = result;
				numOfOrders = orders.length;
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				orders = orders.map((order) => ({
					...order,
					placnik: order.placnik.replace(/, ?/g, "\n"),
					prejemnik: order.prejemnik.replace(/, ?/g, "\n"),
				}));
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

<NavButtonsUpnQr ordersForPdf={orders} />

{#each Array(Math.ceil(orders.length / 3)) as _, pageIndex}
	<page size="A4">
		{#each orders.slice(pageIndex * 3, pageIndex * 3 + 3) as order, orderIndex}
			<div class="order" style={getOrderPosition(orderIndex)}>
				<div class="potrdilo">
					<div class="ime-placnik-potrdilo">
						{order.placnik}
					</div>
					<div class="namen-rok-placila-potrdilo">
						{order.namen_placila}{#if order.rok_placila}<br />{/if}
						{order.rok_placila}
					</div>
					<div class="znesek-potrdilo">***{order.znesek}</div>
					<div class="prejemnik-iban-potrdilo">{order.trr}</div>
					<div class="prejemnik-referenca-potrdilo">
						{order.referenca}
					</div>
					<div class="ime-prejemnik-potrdilo">{order.prejemnik}</div>
				</div>
				<div class="talon">
					<div class="qrcode">{@html order.qrSvnString}</div>
					<div class="ime-placnik">
						{order.placnik}
					</div>
					<div class="znesek">***{order.znesek}</div>
					<div class="rok-placila">
						{order.rok_placila}
					</div>
					<div class="koda-namena">{order.koda_namena}</div>
					<div class="namen-placila">
						{order.namen_placila}
					</div>
					<div class="prejemnik-iban">{order.trr}</div>
					<div class="prejemnik-referenca">{order.referenca}</div>
					<div class="ime-prejemnik">{order.prejemnik}</div>
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
		background-image: url("https://potep.eu/upn-test/img/upnqr-a4.png");
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
		font-family: "Courier New", Courier, monospace;
		font-size: 7pt;
	}

	.ime-placnik-potrdilo {
		position: absolute;
		top: 2mm;
		left: 2mm;
		width: 50mm;
		white-space: pre-line;
	}

	.namen-rok-placila-potrdilo {
		position: absolute;
		top: 18mm;
		left: 2mm;
		width: 50mm;
		white-space: pre-line;
	}

	.znesek-potrdilo {
		position: absolute;
		top: 30mm;
		left: 14mm;
		width: 38mm;
	}

	.prejemnik-iban-potrdilo {
		position: absolute;
		top: 39mm;
		left: 2mm;
		width: 50mm;
	}

	.prejemnik-referenca-potrdilo {
		position: absolute;
		top: 43mm;
		left: 2mm;
		width: 50mm;
	}

	.ime-prejemnik-potrdilo {
		position: absolute;
		top: 54mm;
		left: 2mm;
		width: 50mm;
		white-space: pre-line;
	}

	.talon {
		position: absolute;
		top: 0;
		left: 60mm;
		width: 150mm;
		height: 99mm;
		font-family: "Courier New", Courier, monospace;
		font-size: 10pt;
	}

	.qrcode {
		position: absolute;
		top: 6mm;
		left: 5mm;
		width: 39.5mm;
		height: 39.5mm;
	}
	.ime-placnik {
		position: absolute;
		top: 23mm;
		left: 49mm;
		width: 60mm;
		white-space: pre-line;
	}

	.rok-placila {
		position: absolute;
		top: 50mm;
		left: 118mm;
		width: 28mm;
	}

	.koda-namena {
		position: absolute;
		top: 50mm;
		left: 6mm;
		width: 12mm;
	}

	.namen-placila {
		position: absolute;
		top: 50mm;
		left: 23mm;
		width: 90mm;
	}

	.znesek {
		position: absolute;
		top: 41mm;
		left: 56mm;
		width: 38mm;
	}

	.prejemnik-iban {
		position: absolute;
		top: 59mm;
		left: 6mm;
		width: 130mm;
	}

	.prejemnik-referenca {
		position: absolute;
		top: 67mm;
		left: 6mm;
		width: 97mm;
	}

	.ime-prejemnik {
		position: absolute;
		top: 75mm;
		left: 6mm;
		width: 97mm;
		white-space: pre-line;
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
