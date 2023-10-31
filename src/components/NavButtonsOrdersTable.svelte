<script>
  import { copy } from "svelte-copy";
  import pasteTextFromClipboard from "$lib/pasteTextFromClipboard";
  import ExplainDataFormat from "./ExplainDataFormat.svelte";
  import { db } from "$lib/db";
  import { groupOrders } from "$lib/stores.js";
  import { liveQuery } from "dexie";

  let pastediv = /** @type {HTMLDivElement} */ ($$props.pastediv);
  let toCopyText = "";
  let txtPasteBtn = "Prilepi podatke";
  let showInfoAboutDataFormat = false;

  const readDbAndPutIntoClipboard = async () => {
    // @ts-ignore
    const data = await db.orders.toArray();
    let arrFirstLine = [
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
    const headers = arrFirstLine.join("\t");

    // Extract values from each object
    const rows = data.map((/** @type {any} */ obj) =>
      Object.values(obj).join("\t")
    );

    // Join headers and rows with newline delimiter
    const result = [headers, ...rows].join("\n");
    toCopyText = result;
    const numberOfRecords = result.split("\n").length - 1;
    alert(`Število zapisov kopirano v odložišče: ${numberOfRecords}`);
  };

  // write text to clipboard
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
      alert("Odložišče je prazno!");
    }
    pastediv.blur();
  };

  const focusHandler = () => {
    txtPasteBtn = "Ctrl+V za vstavljanje";
    pastediv.focus();
  };

  const keyRemoveFocusHandler = (/** @type {{ key: string; }} */ event) => {
    if (event.key === "Escape") {
      pastediv.blur();
    }
  };

  const removeFocusPasteBtn = () => {
    txtPasteBtn = "Prilepi podatke";
  };

  const showInfoAboutDataFormatHandler = () => {
    showInfoAboutDataFormat = true;
  };

  const deleteHandler = () => {
    if (confirm("Ali res želite izbrisati izbrane zapise?")) {
      // @ts-ignore
      db.orders.bulkDelete($groupOrders);
    }
  };

  const invertSelectionHandler = () => {
    // select all ids from table db.orders using liveQuery
    // @ts-ignore
    db.orders.orderBy("id").keys(function (allIds) {
      $groupOrders = allIds.filter((/** @type {any} */ id) => {
        // @ts-ignore
        return !$groupOrders.includes(id);
      });
    });
  };
</script>

<div class="navButton">
  <button id="add" title="Doda zapis">Dodaj</button>
  <button
    id="delete"
    title="Izbriše izbrane zapise"
    on:click={deleteHandler}
    disabled={!$groupOrders.length}>Izbriši</button
  >
  <button id="preobrni" title="Preobrne izbrane zapise" on:click={invertSelectionHandler}
    >Preobrni</button
  >
  <button
    use:copy={toCopyText}
    on:click={readDbAndPutIntoClipboard}
    title="Kopira podatke v odložišče"
  >
    Kopiraj podatke
  </button>
  <div
    id="pastediv"
    class="pastediv"
    role="button"
    tabindex="0"
    on:click={focusHandler}
    on:keydown={keyRemoveFocusHandler}
    on:blur={removeFocusPasteBtn}
    bind:this={pastediv}
    on:paste={pasteDataHandler}
    title="Prilepi podatke iz odložišča"
  >
    {txtPasteBtn}
  </div>
  <button
    id="infoAboutDataFormat"
    title="Prikaže informacije o formatu podatkov za uvoz"
    on:click={showInfoAboutDataFormatHandler}>Info format podat.</button
  >
  <ExplainDataFormat bind:clickOutsideModal={showInfoAboutDataFormat} />
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
  .pastediv {
    box-shadow: 3px 4px 0px 0px #1564ad;
    background: linear-gradient(to bottom, #79bbff 5%, #378de5 100%);
    background-color: #79bbff;
    border-radius: 5px;
    border: 1px solid #337bc4;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    padding: 6px 24px;
    text-decoration: none;
    text-shadow: 0px 1px 0px #528ecc;
  }
  .pastediv:hover {
    background: linear-gradient(to bottom, #378de5 5%, #79bbff 100%);
    background-color: #378de5;
  }
  .pastediv:active {
    position: relative;
    top: 1px;
    animation: blink 1s alternate;
  }
  .pastediv:focus {
    background: linear-gradient(to bottom, #1a7718 5%, #175d16 100%);
    position: relative;
    top: 1px;
    animation: blink 2s alternate;
  }

  button {
    box-shadow: 3px 4px 0px 0px #1564ad;
    background: linear-gradient(to bottom, #79bbff 5%, #378de5 100%);
    background-color: #79bbff;
    border-radius: 5px;
    border: 1px solid #337bc4;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    padding: 6px 24px;
    text-decoration: none;
    text-shadow: 0px 1px 0px #528ecc;
  }

  button:hover {
    background: linear-gradient(to bottom, #378de5 5%, #79bbff 100%);
    background-color: #378de5;
  }

  button:active {
    position: relative;
    top: 1px;
    animation: blink 1s alternate;
  }

  button:disabled {
    background: linear-gradient(to bottom, #d1d1d1 5%, #f9f9f9 100%);
    background-color: #d1d1d1;
    color: #a0a0a0;
    cursor: not-allowed;
    box-shadow: none;
  }

  @keyframes blink {
    0% {
      opacity: 0.2;
    }

    50% {
      opacity: 0.6;
    }

    100% {
      opacity: 1;
    }
  }
</style>
