<script>
	import { tick } from "svelte";
	import { ordersList } from "$lib/db";
	import { groupOrders, titleOfPage } from "$lib/stores.js";
	import HeadlessQr from "../../components/HeadlessQr.svelte";

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
	 */

	//  * @property {string} [upnQrString] - UPN QR string.

	/**
	 * @type {Order[]}
	 */
	let items = [];

	/**
	 * @type {Order[]}
	 */
	let orders = [];

	// code subscribes to the `ordersList` store and updates the `items` variable
	// whenever the value of `ordersList` changes. This ensures that `items` always
	// contains the latest data from the `ordersList` store.
	ordersList.subscribe((value) => {
		items = value;
	});

	$: groupOrders;

	$: titleOfPage.set("UPN QR v pdf");

	$: orders = items.filter((item) => $groupOrders.includes(item.id));

	let loading = false;

	// create function to prepare orderData to string for QR code
	// from the each order in orders you should create new object with keys and values
	// and then stringify it
	// keys: konstanta: string, placnik_IBAN: string, polog: string, dvig: string, placnik_referenca: string, imePlacnik: string, znesek: string, datum_placila: string, nujno: string, koda_namena: string, namen_rok_placila: string, rok_placila: string, prejemnik_IBAN: string, prejemnik_referenca: string, imePrejemnik: string
	// values: konstanta: "UPNQR", placnik_IBAN: "", polog: "", dvig: "", placnik_referenca: "", imePlacnik: order.placnik, znesek: order.znesek, datum_placila: "", nujno: "", koda_namena: order.koda_namena, namen_rok_placila: order.namen_placila, rok_placila: order.rok_placila, prejemnik_IBAN: order.trr, prejemnik_referenca: order.referenca, imePrejemnik: order.prejemnik
	// order.placnik and order.prejemnik should be in format "Ime Priimek, Ulica, PostnaStevilka Posta" but "," has to be replaced with "\n"
	// order.znesek should be in format number with 2 decimal places, decimal delimiter should be ",", order.znesek is then stringified without decimal delimiter and length of 11 characters, for example 1.628,45 => "00000162845"
	// order.rok_placila should be in format "DDMMYYYY"
	// order.trr all spaces should be removed
	// order.referenca all spaces should be removed
	// in all fields trailing and leading spaces should be removed
	// UTF-8 has to be changed to ISO-8859-2
	// all fields has to be in as one string with values only and at the end of should be "\n"
	// at the end of the string should be number of characters in the string (without "\n"), for example 123 => "123", if number of characters (control sum) is less than 100, then it should be filled with leading zeros, for example 5 => "005"
	// example of the string: "UPNQR\n\n\n\n\nJanez Novak\nDunajska ulica 1\n1000 Ljubljana\n00000008105\n\n\nRENT\nPlačilo najemnine za marec 2017\n01.04.2017\n SI56020170014356205\nSI121234567890120\nRentaCar d.o.o.\nPohorska ulica 22\n2000 Maribor\n201\n"
	// string should be in ISO-8859-2
	// string should Mode Byte (Binary) and Error Correction Level M

	/**
	 * @param {Order} order
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

		const orderData = `${konstanta}\n${placnik_IBAN}\n${polog}\n${dvig}\n${placnik_referenca}\n${imePlacnik}\n${znesek}\n${datum_placila}\n${nujno}\n${koda_namena}\n${namen_rok_placila}\n${rok_placila}\n${prejemnik_IBAN}\n${prejemnik_referenca}\n${imePrejemnik}\n`;

		const controlSum = orderData.length.toString().padStart(3, "0");

		return `${orderData}${controlSum}\n`;
	}

	async function load() {
		loading = true;
		await tick();
		loading = false;
	}
</script>

<div class="a4">
	<div>Test</div>
	<div>{$groupOrders}</div>
	{#each orders as order}
		<div>{order.id}</div>
		<div>{order.placnik}</div>
		{#await load()}
			{#if loading}
				<p class="bg-red-600">Loading Qr code...</p>
			{/if}
		{:then}
			<HeadlessQr input={prepareOrderData(order)} />
		{:catch error}
			<p>error: {error.message}</p>
		{/await}
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
