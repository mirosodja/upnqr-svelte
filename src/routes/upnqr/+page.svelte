<script>

</script>
<svelte:head>
	<title>UPN QR->UPNQR v pdf</title>
	<meta name="description" content="Pretvori izbrane UPNQR zapise v pdf datoteko" />
</svelte:head>

<div class="a4">
	<div>Test</div>
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
		.a4, .a4 * {
			visibility: visible;
		}
		.a4 {
			position: absolute;
			left: 0;
			top: 0;
		}
	}
</style>
