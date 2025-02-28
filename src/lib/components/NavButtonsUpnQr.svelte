<script lang="ts">
  import Dropdown from "flowbite-svelte/Dropdown.svelte";
  import Radio from "flowbite-svelte/Radio.svelte";
  import Helper from "flowbite-svelte/Helper.svelte";
  import {
    createPdf,
    createPdfZip,
    createPngZip,
  } from "$lib/funcsForSavingFile";
  import type { OrderWithPngString } from "$lib/types/Order";

  let saveType: "pdf" | "zipPDF" | "zipPNG" = "pdf";
  let dropdownOpen = false;

  //  ordersForPdf is an array of orders from the UPN QR page (src/routes/upn-qr/+page.svelte)
  export let ordersForPdf: OrderWithPngString[] = [];

  const saveFileHandler = () => {
    if (saveType === "pdf") {
      createPdf(ordersForPdf);
    } else if (saveType === "zipPDF") {
      createPdfZip(ordersForPdf);
    } else {
      createPngZip(ordersForPdf);
    }
  };
</script>

<div class="navButton">
  <button
    id="topdf"
    title="Shrani UPN QR naloge v izbranem formatu"
    on:click={saveFileHandler}>Shrani</button
  >
  <button class="right-align"
    >Shrani v: {saveType}<svg
      class="w-2.5 h-2.5 ms-3"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 6"
      ><path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m1 1 4 4 4-4"
      /></svg
    ></button
  >
  <Dropdown class="w-60 p-3 space-y-1" bind:open={dropdownOpen}>
    <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
      <Radio
        name="saveType"
        bind:group={saveType}
        on:click={() => {
          dropdownOpen = false;
          saveType = "pdf";
        }}
        value="pdf">PDF</Radio
      >
      <Helper class="ps-6">Shrani PDF datoteko. Primerno za tiskanje.</Helper>
    </li>
    <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
      <Radio
        name="saveType"
        bind:group={saveType}
        on:click={() => {
          dropdownOpen = false;
          saveType = "zipPDF";
        }}
        value="zipPDF">PDF v zip</Radio
      >
      <Helper class="ps-6"
        >Shrani zip datoteko, kjer je vsak nalog v svoji PDF datoteki.</Helper
      >
    </li>

    <li class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600">
      <Radio
        name="saveType"
        bind:group={saveType}
        on:click={() => {
          dropdownOpen = false;
          saveType = "zipPNG";
        }}
        value="zipPNG">PNG v zip</Radio
      >
      <Helper class="ps-6"
        >Shrani zip datoteko, kjer je vsaka QR koda v svoji PNG datoteki (samo QR koda).</Helper
      >
    </li>
  </Dropdown>
</div>

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

  .right-align {
    margin-left: auto;
    margin-right: 20px;
  }

  svg {
    display: inline-block;
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
