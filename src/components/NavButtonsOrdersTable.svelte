<script>
  import { data } from "../data/data";
  import { db } from "../data/db";

  import Button from "../shared/Button.svelte";

  async function addData() {
    console.log("Adding data");
    try {
      // @ts-ignore
      // @ts-ignore
      const id = await db.orders.put(data[1]);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @param {string} text
   * @returns {Promise<void>}
   * @see https://stackoverflow.com/a/65957232/1148001
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
   * copy text to clipboard
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

  /**
   * @returns {Promise<string | undefined>}
   * @see https://stackoverflow.com/a/65957232/1148001
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText
   * paste text from clipboard
   */
  async function pasteTextFromClipboard() {
    // TODO: add check if data is compatible with structure of db

    try {
      const text = await navigator.clipboard.readText();
      if (text === "") {
        alert("Clipboard is empty");
        return;
      }
      console.log("Pasted content: ", text);
      return text;
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  }

  const pasteData = async () => {
    const text = await pasteTextFromClipboard();
    // if (text) {
    console.log("Pasted content: ", text);
    // @ts-ignore
    // const id = await db.orders.put(text);
    // }
  };
</script>

<div class="navButton">
  <Button idButton="reinit" title="Re-init tabele">Re-init</Button>
  <Button idButton="add" title="Dodaj zapis" onClick={addData}>Dodaj</Button>
  <Button idButton="delete" title="Izbriši zapis">Izbriši</Button>
  <Button idButton="izbor" title="Dodaj filtrirane vrstice v izbor"
    >Izbor</Button
  >
  <Button idButton="preobrni" title="Preobrni izbor">Preobrni</Button>
  <Button
    onClick={copyHello}
    idButton="copydata"
    title="Kopiraj podatke v odložišče">Kopiraj podatke</Button
  >
  <Button
    idButton="pasteData"
    title="Klik: Prilepi podatke iz odložišča, Dvoklik: Opis strukture podatkov"
    onClick={pasteData}>Prilepi podatke</Button
  >
</div>
<input type="text" class="show" id="clipboardInput"/>

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

  .show {
    display: none;
  }
</style>
