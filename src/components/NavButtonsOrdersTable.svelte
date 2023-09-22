<script>
  import Button from "../shared/Button.svelte";
  import CopyClipBoard from "../components/CopyClipBoard.svelte";
  import pasteTextFromClipboard from "$lib/pasteTextFromClipboard";
  import { db } from "../data/db";

  let clipboardText = "Clipboard text";

  // see: https://itnext.io/javascript-work-with-clipboard-ctrl-c-ctrl-v-42bb287f1c66
  //  document.addEventListener('paste', evt => {
  //   const txt = evt.clipboardData.getData('text/plain');
  //  });

  const copy = (/** @type {any} */ text) => {
    clipboardText = text;
    const app = new CopyClipBoard({
      // @ts-ignore
      target: document.getElementById("clipboard"),
      props: { clipboardText },
    });
    app.$destroy();
    clipboardText = "Clipboard text";
  };

  const readDb = async () => {
    // @ts-ignore
    const data = await db.orders.toArray();
    let arrNaslovna = [
      "ID",
      "PLAČNIK",
      "SKUPINA",
      "ZNESEK",
      "KODA NAMENA",
      "NAMEN PLAČILA",
      "TRR",
      "REFERENCA",
      "PREJEMNIK",
    ];
    const headers = arrNaslovna.join("\t");

    // Extract values from each object
    const rows = data.map((/** @type {any} */ obj) =>
      Object.values(obj).join("\t")
    );

    // Join headers and rows with newline delimiter
    const result = [headers, ...rows].join("\n");
    return copy(result);
  };

  const pasteData = async () => {
    // @ts-ignore
    const text = await pasteTextFromClipboard();
  };
</script>

<div class="navButton">
  <Button idButton="reinit" title="Re-init tabele" onClickFunction={readDb}
    >Re-init</Button
  >
  <Button idButton="add" title="Dodaj zapis">Dodaj</Button>
  <Button idButton="delete" title="Izbriši zapis">Izbriši</Button>
  <Button idButton="izbor" title="Dodaj filtrirane vrstice v izbor"
    >Izbor</Button
  >
  <Button idButton="preobrni" title="Preobrni izbor">Preobrni</Button>
  <Button
    onClickFunction={copy}
    idButton="copydata"
    title="Kopiraj podatke v odložišče">Kopiraj podatke</Button
  >
  <Button
    idButton="pasteData"
    title="Klik: Prilepi podatke iz odložišča, Dvoklik: Opis strukture podatkov"
    onClickFunction={pasteData}>Prilepi podatke</Button
  >
</div>
<div id="clipboard" />

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
