<script>
	import { ordersList } from "$lib/db";
	import { generateSvg } from "$lib/qrcode/createQrSvnString";
	import { groupOrders, titleOfPage } from "$lib/stores.js";
	/** Utils */
	import Config from "$lib/qrcode/configQrDefault.js";

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

	const color = Config.color;
	const background = Config.backgroundColor;
	const size = Config.size;

	/**
	 * @type {Order[]}
	 */
	let items = [];

	/**
	 * @type {Order[]}
	 */
	let orders = [];

	// watch loading
	let loading = false;

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
	$: titleOfPage.set("UPN QR");

	// @ts-ignore
	// @ts-ignore
	$: orders = items.filter((item) => $groupOrders.includes(item.id));

	// add qr svn strig to order object
	$: orders.forEach((order) => {
		const qrString = prepareOrderData(order);

		const qrSvnString = generateSvg(qrString, size, color, background);
		order.qrSvnString = qrSvnString;
	});

	/**
	 * @param {Order} order
	 * @returns {string}
	 * @description
	 * Prepare order data for UPN QR code.
	 */
	function prepareOrderData(order) {
		const konstanta = "UPNQR";
		const placnik_IBAN = "";
		const polog = "";
		const dvig = "";
		const placnik_referenca = "";
		const imePlacnik = order.placnik
			.replaceAll(", ", ",")
			.replaceAll(",", "\n");
		const znesek = order.znesek
			.toString()
			.replace(".", "")
			.replace(",", "")
			.padStart(11, "0"); // 1.628,45 => "00000162845"
		const datum_placila = "";
		const nujno = "";
		const koda_namena = order.koda_namena;
		const namen_rok_placila = order.namen_placila;
		const rok_placila = order.rok_placila;
		const prejemnik_IBAN = order.trr.replace(/\s/g, "");
		const prejemnik_referenca = order.referenca.replace(/\s/g, "");
		const imePrejemnik = order.prejemnik
			.replaceAll(", ", ",")
			.replaceAll(",", "\n");

		const orderData = `${konstanta}\n${placnik_IBAN}\n${polog}\n${dvig}\n${placnik_referenca}\n${imePlacnik}\n${znesek}\n${datum_placila}\n${nujno}\n${koda_namena}\n${namen_rok_placila}\n${rok_placila}\n${prejemnik_IBAN}\n
${prejemnik_referenca}\n${imePrejemnik}\n`;

		const controlSum = orderData.length.toString().padStart(3, "0");

		return `${orderData}${controlSum}\n`;
	}
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
