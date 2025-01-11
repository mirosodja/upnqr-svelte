<script>
  import saveAs from "file-saver";

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
   * @property {string} qrSvnString - qr svn string.
   */

  //  * @property {string} [upnQrString] - UPN QR string.

  /**
   * @type {Order[]}
   */

  export let ordersForPdf = []; // ordersForPdf is an array of orders from the UPN QR page (src/routes/upnqr/+page.svelte)

  const createPdf = async () => {
    // @ts-ignore
    const { jsPDF } = await import("jspdf");

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    ordersForPdf.forEach((order, index) => {
      const svgString = order.qrSvnString;
      const svg = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svg);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        // @ts-ignore
        context.drawImage(img, 0, 0, img.width, img.height);
        const dataUrl = canvas.toDataURL("image/png");
        doc.addImage(dataUrl, "PNG", 0, 0, 297, 210);
        if (index < ordersForPdf.length - 1) {
          doc.addPage();
        }
      };
      img.src = url;
    });

    doc.save("upn-qr.pdf");
  };

  // function to create a PNG image file from the order. The image is then added to zip file for download
  const createPng = async () => {
    const { downloadZip } = await import("client-zip");

    // @ts-ignore
    const zip = new downloadZip();

    ordersForPdf.forEach((order, index) => {
      const svgString = order.qrSvnString;
      const svg = new Blob([svgString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svg);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        // @ts-ignore
        context.drawImage(img, 0, 0, img.width, img.height);
        const dataUrl = canvas.toDataURL("image/png");
        zip.file(`upn-qr-${index}.png`, dataUrl.split(",")[1], {
          base64: true,
        });
      };
      img.src = url;
    });

    zip.generateAsync({ type: "blob" }).then((/** @type {any} */ content) => {
      saveAs(content, "upn-qr.zip");
    });
  };

</script>

<div class="navButton">
  <button
    id="topdf"
    title="Pretvori UPN QR naloge v PDF za tiskanje"
    on:click={createPdf}>V PDF</button
  >
  <button
    id="tozip"
    title="Pretvori UPN QR naloge v ZIP datoteko za pošiljanje"
    on:click={createPng}>V ZIP</button
  >
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
