<script>
  import Button from "../shared/Button.svelte";
  import CopyClipBoard from "../components/CopyClipBoard.svelte";
  import PasteClipBoard from "../components/PasteClipBoard.svelte";
  import pasteTextFromClipboard from "$lib/pasteTextFromClipboard";
  import { db } from "../data/db";

  let clipboardText = "No data in clipboard";
  /** @type {HTMLDivElement} */
  let pastediv = /** @type {HTMLDivElement} */ ($$props.pastediv);

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
  };

  const readDbAndPutIntoClipboard = async () => {
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
    console.log("readDbAndPutIntoClipboard");
    return copy(result);
  };

  // @ts-ignore
  const pasteDataHandler = async (event) => {
    event.preventDefault();
    // @ts-ignore
    let pastedText = (event.clipboardData || window.clipboardData).getData(
      "text"
    );
    if (pastedText) {
      pasteTextFromClipboard(pastedText);
    } else {
      alert("Nothing to paste");
    }
    pastediv.blur();
  };

  const focusHandler = () => {
    pastediv.focus();
  };

  const removeFocusHandler = (/** @type {{ key: string; }} */ event) => {
    if (event.key === "Escape") {
      pastediv.blur();
    }
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
    onClickFunction={readDbAndPutIntoClipboard}
    idButton="copydata"
    title="Kopiraj podatke v odložišče">Kopiraj podatke</Button
  >
  <PasteClipBoard />
  <div
    id="pastediv"
    class="pastediv"
    role="button"
    tabindex="0"
    on:click={focusHandler}
    on:keydown={removeFocusHandler}
    bind:this={pastediv}
    on:paste={pasteDataHandler}
  >
    Klikni in prilepi
  </div>
</div>
<div id="clipboard" class="show" />

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

  .pastediv {
    outline: 1px solid hsl(320, 80%, 80%);
  }

  .pastediv:focus {
    outline: 4px solid hsl(120, 60%, 40%);
  }
</style>
