import { isLoadingData } from "$lib/stores";

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


export const createPdf = async (
    /**
      * @type {Order[]}
      */
    ordersForPdf) => {
    isLoadingData.set(true);

    const { jsPDF } = await import("jspdf");
    const { fontString } = await import("$lib/fonts/Freemono-normal");
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
    });

    // doc.addImage("/img/upnqr-a4.png", "PNG", 0, 0, 210, 297);
    doc.addFileToVFS("FreeMono.ttf", fontString);
    doc.addFont("FreeMono.ttf", "FreeMono", "normal");
    
    doc.setFont("FreeMono", "normal");
    doc.setTextColor(0, 0, 0);

    ordersForPdf.forEach((order, index) => {
        const orderIndex = index % 3;
        const yOffset = orderIndex * 99; // Adjust the offset for each order

        if (orderIndex === 0 && index !== 0) {
            doc.addPage();
        }

        // Potrdilo section
        // po y sem dodal +2, ker je bilo previsoko
        doc.setFontSize(7);
        doc.text(order.placnik, 6, 10 + yOffset, { maxWidth: 50 });
        const namen_placila = order.rok_placila
            ? order.namen_placila + ", " + order.rok_placila
            : order.namen_placila;
        doc.text(namen_placila, 6, 26 + yOffset, { maxWidth: 50 });
        doc.text(`***${order.znesek}`, 18, 38 + yOffset, { maxWidth: 38 });
        doc.text(order.trr, 6, 47 + yOffset, { maxWidth: 50 });
        doc.text(order.referenca, 6, 51 + yOffset, { maxWidth: 50 });
        doc.text(order.prejemnik, 6, 63 + yOffset, { maxWidth: 50 });

        // Talon section
        doc.setFontSize(10);
        doc.addSvgAsImage(order.qrSvgString, 65, 6 + yOffset, 39.5, 39.5);
        doc.text(order.placnik, 109, 27 + yOffset, { maxWidth: 60 });
        doc.text(`***${order.znesek}`, 116, 45 + yOffset, { maxWidth: 38 });
        doc.text(order.rok_placila, 164, 45 + yOffset, { maxWidth: 28 });
        doc.text(order.koda_namena, 66, 53 + yOffset, { maxWidth: 12 });
        doc.text(order.namen_placila, 83, 53 + yOffset, { maxWidth: 90 });
        doc.text(order.trr, 66, 62 + yOffset, { maxWidth: 130 });
        doc.text(order.referenca, 66, 70 + yOffset, { maxWidth: 97 });
        doc.text(order.prejemnik, 66, 79 + yOffset, { maxWidth: 97 });

        // Add QR code
        // const svgString = order.qrSvnString;
        // const svg = new Blob([svgString], { type: "image/svg+xml" });
        // const url = URL.createObjectURL(svg);

        // const img = new Image();
        // img.onload = () => {
        //   const canvas = document.createElement("canvas");
        //   const context = canvas.getContext("2d");
        //   canvas.width = img.width;
        //   canvas.height = img.height;
        //   // @ts-ignore
        //   context.drawImage(img, 0, 0, img.width, img.height);
        //   const dataUrl = canvas.toDataURL("image/png");
        //   doc.addImage(dataUrl, "PNG", 65, 6 + yOffset, 39.5, 39.5);
        //   if (index < ordersForPdf.length - 1) {
        //     doc.addPage();
        //   }
        // };
        // img.src = url;
    });
    const now = new Date();
    const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const fileName = `upn-${formattedDate}.pdf`;
    doc.save(fileName);
    isLoadingData.set(false);
};