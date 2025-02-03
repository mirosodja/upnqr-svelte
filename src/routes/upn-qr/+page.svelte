<script lang="ts">
	import { onMount } from "svelte";
	import { titleOfPage } from "$lib/stores";
	/** Utils */
	import { createOrdersWithPngString } from "$lib/createPngString";
	import NavButtonsUpnQr from "$lib/components/NavButtonsUpnQr.svelte";
	import type { OrderWithPngString } from "$lib/types/Order";

	$: titleOfPage.set("UPN QR");

	let orders: OrderWithPngString[] = [];
	let numOfordersWithPng = 0;

	// This code runs when the component is mounted. It performs the following actions:
	// 1. Calls the `createOrdersWithPngString` function to fetch orders data from Db.
	// 2. On successful fetch, assigns the result to the `orders` variable and updates the `numOfordersWithPng` with the length of the orders array.
	// 3. If an error occurs during the fetch, it logs the error to the console.
	// 4. Finally, it processes each order to replace commas followed by optional spaces with newline characters in the `placnik` and `prejemnik` fields.
	onMount(() => {
		createOrdersWithPngString()
			.then((result) => {
				orders = result;
				numOfordersWithPng = orders.length;
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				if (orders.length === 0) {
					window.location.href = "/upnqr/";
				}
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
	const getOrderPosition = (index: number): string => {
		return `top: ${index * 99}mm; left: 0mm;`;
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
					<div class="qrcode">
						<img src={order.pngString} alt="qrcode-id-{order.id}" />
					</div>
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
		position: relative;
		/* background: white; */
		width: 210mm;
		height: 297mm;
		display: block;
		margin: 0 0 0.5cm 0;
		background-size: 100%;
		box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
		page-break-after: always;
	}

	.order {
		position: absolute;
		width: 210mm;
		height: 99mm;
		/* build */
		/* background-image: url("./img/upnqr.jpg"); */
		/* dev */
		background-image: url("/upnqr/img/upn-a4-1x-screen.jpg");
		background-position: 0 0;
		background-size: 100%;
		background-repeat: no-repeat;
	}

	.potrdilo {
		/* TODO !! ni na izhodišču 0,0 
		!!! left je že popravljen
		*/
		position: absolute;
		left: 0mm;
		top: 0mm;
		width: 60mm;
		height: 99mm;
		font-family: "Courier New", Courier, monospace;
		font-size: 7pt;
	}

	.ime-placnik-potrdilo {
		position: absolute;
		left: 6mm;
		top: 6mm;
		width: 50mm;
		white-space: pre-line;
	}

	.namen-rok-placila-potrdilo {
		position: absolute;
		left: 6mm;
		top: 23mm;
		width: 50mm;
		white-space: pre-line;
	}

	.znesek-potrdilo {
		position: absolute;
		left: 18mm;
		top: 34mm;
		width: 38mm;
	}

	.prejemnik-iban-potrdilo {
		position: absolute;
		left: 6mm;
		top: 43mm;
		width: 50mm;
	}

	.prejemnik-referenca-potrdilo {
		position: absolute;
		left: 6mm;
		top: 47mm;
		width: 50mm;
	}

	.ime-prejemnik-potrdilo {
		position: absolute;
		left: 6mm;
		top: 59mm;
		width: 50mm;
		white-space: pre-line;
	}

	.talon {
		position: absolute;
		left: 60mm;
		top: 0mm;
		width: 150mm;
		height: 99mm;
		font-family: "Courier New", Courier, monospace;
		font-size: 10pt;
	}

	.qrcode {
		position: absolute;
		top: 6mm;
		left: 4mm;
		width: 39.5mm;
		height: 39.5mm;
	}
	.ime-placnik {
		position: absolute;
		left: 49mm;
		top: 21mm;
		width: 60mm;
		white-space: pre-line;
	}
	.znesek {
		position: absolute;
		left: 56mm;
		top: 40mm;
		width: 38mm;
	}
	.rok-placila {
		position: absolute;
		left: 118mm;
		top: 49mm;
		width: 28mm;
	}
	.koda-namena {
		position: absolute;
		left: 6mm;
		top: 49mm;
		width: 12mm;
	}
	.namen-placila {
		position: absolute;
		left: 23mm;
		top: 49mm;
		width: 90mm;
	}
	.prejemnik-iban {
		position: absolute;
		left: 6mm;
		top: 58mm;
		width: 130mm;
	}
	.prejemnik-referenca {
		position: absolute;
		left: 6mm;
		top: 66mm;
		width: 97mm;
	}
	.ime-prejemnik {
		position: absolute;
		left: 6mm;
		top: 73mm;
		width: 97mm;
		white-space: pre-line;
	}

	@media print {
		:global(*) {
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
