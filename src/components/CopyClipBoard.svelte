<script>
	import { onMount } from 'svelte';
	
	/**
   * @type {any}
   */
	 export let clipboardText;

	/**
   * @type {HTMLTextAreaElement}
   */
	let textarea;
	
	onMount(() => {
		console.log('onMount');
		console.log(clipboardText);
		textarea.select();
		document.execCommand('copy');
	});
</script>

<textarea id="textFromClipboard" bind:value={clipboardText} bind:this={textarea}></textarea>

