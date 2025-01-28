<script lang="ts">
  import { get } from "svelte/store";
  import pasteTextFromClipboard from "$lib/pasteTextFromClipboard";
  import ExplainDataFormat from "$lib/components/ExplainDataFormat.svelte";
  import AddRecord from "$lib/components/AddRecord.svelte";
  import { db, numberOfAllRecords } from "$lib/db";
  import { groupOrdersStoreIds } from "$lib/stores";
  import type { Order } from "$lib/types/Order";

  let pastediv: HTMLDivElement = $$props.pastediv;
  let txtPasteBtn = "Prilepi podatke";
  let showInfoAboutDataFormat = false;
  let showAddRecord = false;

  // read data from indexedDB and put into clipboard
  const readDbAndPutIntoClipboard = async () => {
    const data = await db.orders.toArray();
    // select all data from db.orders where id is in $groupOrdersStoreIds
    const ids: number[] = get(groupOrdersStoreIds);
    const selectedData = data.filter((obj: Order) => ids.includes(obj.id));
    // const selectedData = data.filter((obj: Order) =>
    //   $groupOrdersStoreIds.includes(obj.id),
    // );
    let arrFirstLine = [
      "Id",
      "Plačnik",
      "Skupina",
      "Znesek",
      "Koda namena",
      "Namen plačila",
      "Trr",
      "Rok plačila",
      "Referenca",
      "Prejemnik",
    ];
    const headers = arrFirstLine.join("\t");

    // Extract values from each object
    const rows = selectedData.map((/** @type {any} */ obj) =>
      Object.values(obj).join("\t"),
    );

    // Join headers and rows with newline delimiter
    const result = [headers, ...rows].join("\n");
    const type = "text/plain";
    const blob = new Blob([result], { type });
    const dataForClipboard = [new ClipboardItem({ [type]: blob })];
    await navigator.clipboard.write(dataForClipboard);
    const numberOfRecords = result.split("\n").length - 1;
    alert(`Število zapisov kopirano v odložišče: ${numberOfRecords}`);
  };

  // paste text from clipboard
  // @ts-ignore
  const pasteDataHandler = async (event) => {
    event.preventDefault();
    // @ts-ignore
    let pastedText = (event.clipboardData || window.clipboardData).getData(
      "text",
    );
    if (pastedText) {
      pasteTextFromClipboard(pastedText);
    } else {
      alert("Odložišče je prazno!");
    }
    pastediv.blur();
  };

  const focusHandler = () => {
    txtPasteBtn = "Ctrl/Cmd+V za vstavljanje/ESC";
    pastediv.focus();
  };

  const keyRemoveFocusHandler = (event: { key: string }) => {
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

  const addRecordHandler = () => {
    showAddRecord = true;
  };

  const deleteHandler = async () => {
    if (confirm("Ali res želite izbrisati izbrane zapise?")) {
      await db.orders.bulkDelete($groupOrdersStoreIds);
      // remove ids from groupOrdersStoreIds
      groupOrdersStoreIds.set([]);
    }
  };

  const invertSelectionHandler = () => {
    // select all ids from table db.orders using liveQuery
    db.orders.orderBy("id").keys(function (allIds) {
      // @ts-ignore
      $groupOrdersStoreIds = allIds.filter((id: number) => {
        // @ts-ignore
        return !$groupOrdersStoreIds.includes(id);
      });
    });
  };
</script>

<div class="navButton">
  <button id="add" title="Dodaj zapis" on:click={addRecordHandler}>Dodaj</button
  >
  <!-- TODO preveri še disabled buttons kje bi bilo smiselno -->
  <button
    id="delete"
    title="Izbriše izbrane zapise"
    on:click={deleteHandler}
    disabled={!$groupOrdersStoreIds.length}>Izbriši</button
  >
  <button
    id="preobrni"
    title="Preobrne izbrane zapise"
    on:click={invertSelectionHandler}
    disabled={$numberOfAllRecords === 0}>Preobrni</button
  >
  <button
    on:click={readDbAndPutIntoClipboard}
    title="Kopira podatke v odložišče"
    disabled={!$groupOrdersStoreIds.length}
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
    title="Prilepi podatke iz odložišča/Esc za preklic"
  >
    {txtPasteBtn}
  </div>
  <button
    id="infoAboutDataFormat"
    title="Prikaže informacije o formatu podatkov za uvoz"
    on:click={showInfoAboutDataFormatHandler}>Info format podat.</button
  >
  <AddRecord bind:clickToOpenAddRecord={showAddRecord} />
  <ExplainDataFormat
    bind:clickToOpenExplainDataFormat={showInfoAboutDataFormat}
  />
</div>

<!-- TODO: add button: sum calculation for SI12 for selected records -->
<style>
  .navButton {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    padding-bottom: 10px;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
    background-size: contain;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding-left: 10px;
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
