<script>
	import { onMount } from 'svelte';
	
	export let clipboardText;

	let textarea;
	
	onMount(() => {
		textarea.select();
		document.execCommand('copy');
	});
</script>

<textarea id="textFromClipboard" bind:value={clipboardText} bind:this={textarea}></textarea>

