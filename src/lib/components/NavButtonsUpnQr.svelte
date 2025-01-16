<script>
  import { Dropdown, Radio, Helper } from "flowbite-svelte";
  // import { ChevronDownOutline } from 'flowbite-svelte-icons';
  import saveAs from "file-saver";

  import { createPdf } from "$lib/createPdf";

  // radio button group

  /**
   * @type {"pdf" | "zipPDF" | "zipPNG"}
   * Represents the type of file to save.
   */
  let saveType = "pdf";
  let dropdownOpen = false;

  /**
   * @typedef {Object} Order
   * @property {number} id - ID.
   * @property {string} placnik - placnik.
   * @property {string} skupina - skupina.
   * @property {string|number} znesek - znesek (string or number).
   * @property {string} koda_namena - koda namena.
   * @property {string} namen_placila - namen placila.
   * @property {string} rok_placila - rok placila.
   * @property {string} trr - TRR.
   * @property {string} referenca - referenca.
   * @property {string} prejemnik - prejemnik.
   * @property {string} qrSvgString - qr svn string.
   */

  //  * @property {string} [upnQrString] - UPN QR string.

  /**
   * @type {Order[]}
   */

  export let ordersForPdf = []; // ordersForPdf is an array of orders from the UPN QR page (src/routes/upnqr/+page.svelte)

  //! This function is not used, but it is left here for future reference
  // const htmlToJpg = () => {
  //   var canvas = document.querySelector(".to-print");
  //   screenWidth = parseFloat(window.getComputedStyle(canvas).width);

  //   var problematic = document.querySelectorAll(".convert-to-jpg");
  //   problematic.forEach(function (el) {
  //     html2canvas(el, {
  //       scale: 2480 / screenWidth, // 2480px - size for A4 paper, 300 dpi
  //     }).then(function (canvas) {
  //       var img = canvas.toDataURL("image/jpeg");
  //       el.innerHTML = '<img src="' + img + '" class="img">';
  //     });
  //   });
  // };

  // function to create a PNG image file from the order. The image is then added to zip file for download
  // const createPng = async () => {
  //   const { downloadZip } = await import("client-zip");

  //   const zip = new downloadZip();

  //   ordersForPdf.forEach((order, index) => {
  //     const svgString = order.qrSvgString;
  //     const svg = new Blob([svgString], { type: "image/svg+xml" });
  //     const url = URL.createObjectURL(svg);

  //     const img = new Image();
  //     img.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d");
  //       canvas.width = img.width;
  //       canvas.height = img.height;
  //       // @ts-ignore
  //       context.drawImage(img, 0, 0, img.width, img.height);
  //       const dataUrl = canvas.toDataURL("image/png");
  //       console.log(dataUrl);
  //       zip.file(`upn-qr-${index}.png`, dataUrl.split(",")[1], {
  //         base64: true,
  //       });
  //     };
  //     img.src = url;
  //   });

  //   zip.generateAsync({ type: "blob" }).then((/** @type {any} */ content) => {
  //     saveAs(content, "upn-qr.zip");
  //   });
  // };

  /**
   * @typedef {Object} FileEntry
   * @property {string} name
   * @property {string} input
   * @property {Object} options
   * @property {boolean} options.base64
   */
  // Function to create a PNG image file from the order. The image is then added to zip file for download
  const createPng = async () => {
    const { downloadZip } = await import("client-zip");

    /** @type {FileEntry[]} */
    const files = [];

    ordersForPdf.forEach((order, index) => {
      const svgString = order.qrSvgString;
      const svg = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svg);

      const img = new Image(100, 100);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
          const dataUrl = canvas.toDataURL("image/png");
          console.log(dataUrl);
          files.push({
            name: `upn-qr-${index}.png`,
            input: dataUrl.split(",")[1],
            options: { base64: true },
          });
        }
      };
      img.src = url;
    });

    const zipBlob = await downloadZip(files).blob();
    const zipUrl = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = zipUrl;
    a.download = "orders.zip";
    a.click();
  };

  const saveFileHandler = () => {
    if (saveType === "pdf") {
      createPdf(ordersForPdf);
    } else if (saveType === "zipPDF") {
      alert("Not implemented yet");
    } else {
      createPng();
    }
  };
</script>

<div class="navButton">
  <button
    id="topdf"
    title="Shrani UPN QR naloge v izbranem formatu"
    on:click={saveFileHandler}>Shrani PDF</button
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
      <Helper class="ps-6">Shrani zip datoteko, kjer je vsak nalog v svoji PDF datoteki.</Helper>
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
      <Helper class="ps-6">Shrani zip datoteko, kjer je vsak nalog v svoji PNG datoteki.</Helper>
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
