<script>
  import Button from "../shared/Button.svelte";
  import pasteTextFromClipboard  from "$lib/pasteTextFromClipboard";
 

  // see: https://itnext.io/javascript-work-with-clipboard-ctrl-c-ctrl-v-42bb287f1c66
  //  document.addEventListener('paste', evt => {
  //   const txt = evt.clipboardData.getData('text/plain');
  //  });

  /**
   * @param {string} text
   * @returns {Promise<void>}
   * @see {https} ://stackoverflow.com/a/65957232/1148001
   * @see {https} ://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
  copy text to clipboard
   */
  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  const copyHello = () => {
    copyTextToClipboard("Hello, World!");
  };

 
  const pasteData = async () => {
    // @ts-ignore
    const text = await pasteTextFromClipboard();
  };
</script>

<div class="navButton">
  <Button idButton="reinit" title="Re-init tabele">Re-init</Button>
  <Button idButton="add" title="Dodaj zapis">Dodaj</Button>
  <Button idButton="delete" title="Izbriši zapis">Izbriši</Button>
  <Button idButton="izbor" title="Dodaj filtrirane vrstice v izbor"
    >Izbor</Button
  >
  <Button idButton="preobrni" title="Preobrni izbor">Preobrni</Button>
  <Button
    clickedFunction={copyHello}
    idButton="copydata"
    title="Kopiraj podatke v odložišče">Kopiraj podatke</Button
  >
  <Button
    idButton="pasteData"
    title="Klik: Prilepi podatke iz odložišča, Dvoklik: Opis strukture podatkov"
    clickedFunction={pasteData}>Prilepi podatke</Button
  >
</div>

<style>
  .navButton {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    padding-bottom: 10px;
    justify-content: space-around;
    align-items: center;
    background-size: contain;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
  }
</style>
