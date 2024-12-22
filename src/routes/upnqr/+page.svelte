<script>
	import { ordersList } from "$lib/db";
	import { generateSvg } from "$lib/qrcode/createQrSvnString ";
	import { groupOrders, titleOfPage } from "$lib/stores.js";
	/** Utils */
	import Config from "$lib/qrcode/configQrDefault.js";
	import { qr } from "$lib/qrcode/qr";

	/**
	 * @typedef {Object} Orders
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
	 * @property {string} qrModulesString - qr modules string.
	 * @property {string} qrSvnString - qr svn string.
	 */

	const color = Config.color;
	const background = Config.backgroundColor;
	const size = Config.size;

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

	// @ts-ignore
// @ts-ignore
		$: groupOrders;

	// @ts-ignore
// @ts-ignore
		$: titleOfPage.set("UPN QR v pdf");

	// @ts-ignore
	// @ts-ignore
	$: orders = items.filter((item) => $groupOrders.includes(item.id));

	// add qr svn strig to order object
	orders.forEach(async (order) => {
		const qrString =
			order.id +
			order.placnik +
			order.skupina +
			order.znesek +
			order.koda_namena +
			order.namen_placila +
			order.rok_placila +
			order.trr +
			order.referenca +
			order.prejemnik;

		// @ts-ignore
		const qrModulesString = qr(qrString, Config.QR);

		order.qrModulesString = JSON.stringify(qrModulesString);

		const qrSvnString = generateSvg(
			qrModulesString,
			size,
			color,
			background,
		);
		order.qrSvnString = qrSvnString;
	});
</script>

<div class="a4">
	<div>Test</div>
	{#each orders as order}
		<div>{order.id}</div>
		<div>{order.placnik}</div>
		<div>{order.qrModulesString}</div>
		<div>{order.qrSvnString}</div>
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
