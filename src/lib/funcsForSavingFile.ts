import { isLoadingData } from "$lib/stores";
import type { OrderWithPngString } from "./types/Order";
// import * as pdfjsLib from "pdfjs-dist";


const replaceNonAsciiChars = (str: string) => {
    return str.replace(/Đ|đ|Š|š|Č|č|Ć|ć|Ž|ž|À|Á|Â|Ã|Ä|Å|Æ|Ç|È|É|Ê|Ë|Ì|Í|Î|Ï|Ð|Ñ|Ò|Ó|Ô|Õ|Ö|Ø|Ù|Ú|Û|Ü|Ý|Þ|ß|à|á|â|ã|ä|å|æ|ç|è|é|ê|ë|ì|í|î|ï|ð|ñ|ò|ó|ô|õ|ö|ø|ù|ú|û|ü|ý|þ|ÿ/g, (char) => {
        const charMap = {
            'Đ': 'D', 'đ': 'd',
            'Š': 'S', 'š': 's',
            'Č': 'C', 'č': 'c',
            'Ć': 'C', 'ć': 'c',
            'Ž': 'Z', 'ž': 'z',
            'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Æ': 'AE', 'Ç': 'C',
            'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
            'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
            'Ð': 'D', 'Ñ': 'N',
            'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O',
            'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
            'Ý': 'Y', 'Þ': 'TH', 'ß': 'ss',
            'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', 'æ': 'ae', 'ç': 'c',
            'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
            'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
            'ð': 'd', 'ñ': 'n',
            'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o',
            'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
            'ý': 'y', 'þ': 'th', 'ÿ': 'y'
        };
        return charMap[char as keyof typeof charMap] || char;
    });
};


export const createPdf = async (ordersForPdf: OrderWithPngString[]): Promise<void> => {
    isLoadingData.set(true);

    const { jsPDF } = await import("jspdf");
    const { fontString } = await import("$lib/fonts/Freemono-normal");
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
    });

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
        doc.setFontSize(7);
        // doc.addImage("/upnqr/img/upn-a4-1x-screen.jpg", 0, yOffset, 210, 99);
        doc.text(order.placnik, 6, 9 + yOffset, { maxWidth: 50 });
        const namen_placila = order.rok_placila
            ? order.namen_placila + ", " + order.rok_placila
            : order.namen_placila;
        doc.text(namen_placila, 6, 25 + yOffset, { maxWidth: 50 });
        doc.text(`***${order.znesek}`, 18, 37 + yOffset, { maxWidth: 38 });
        doc.text(order.trr, 6, 46 + yOffset, { maxWidth: 50 });
        doc.text(order.referenca, 6, 50 + yOffset, { maxWidth: 50 });
        doc.text(order.prejemnik, 6, 62 + yOffset, { maxWidth: 50 });

        // Talon section
        doc.setFontSize(10);
        doc.addImage(order.pngString, 64, 6 + yOffset, 39.5, 39.5);
        doc.text(order.placnik, 109, 25 + yOffset, { maxWidth: 60 });
        doc.text(`***${order.znesek}`, 116, 44 + yOffset, { maxWidth: 38 });
        doc.text(order.rok_placila, 164, 44 + yOffset, { maxWidth: 28 });
        doc.text(order.koda_namena, 66, 52 + yOffset, { maxWidth: 12 });
        doc.text(order.namen_placila, 83, 52 + yOffset, { maxWidth: 90 });
        doc.text(order.trr, 66, 61 + yOffset, { maxWidth: 130 });
        doc.text(order.referenca, 66, 69 + yOffset, { maxWidth: 97 });
        doc.text(order.prejemnik, 66, 78 + yOffset, { maxWidth: 97 });
    });

    const now = new Date();
    const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const fileName = `upn-${formattedDate}.pdf`;
    doc.save(fileName);
    isLoadingData.set(false);
};

const createPdfForZip = async (ordersForPdf: OrderWithPngString): Promise<{ blob: Blob; fileName: string; }> => {
    const { jsPDF } = await import("jspdf");
    const { fontString } = await import("$lib/fonts/Freemono-normal");
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [210, 99],
        putOnlyUsedFonts: true,
    });

    doc.addFileToVFS("FreeMono.ttf", fontString);
    doc.addFont("FreeMono.ttf", "FreeMono", "normal");

    doc.setFont("FreeMono", "normal");
    doc.setTextColor(0, 0, 0);

    // doc.addPage();
    // Potrdilo section
    doc.setFontSize(7);
    doc.addImage("/upnqr/img/upn-a4-1x-screen.jpg", 0, 0, 210, 99);
    doc.text(ordersForPdf.placnik, 6, 9, { maxWidth: 50 });
    const namen_placila = ordersForPdf.rok_placila
        ? ordersForPdf.namen_placila + ", " + ordersForPdf.rok_placila
        : ordersForPdf.namen_placila;
    doc.text(namen_placila, 6, 25, { maxWidth: 50 });
    doc.text(`***${ordersForPdf.znesek}`, 18, 37, { maxWidth: 38 });
    doc.text(ordersForPdf.trr, 6, 46, { maxWidth: 50 });
    doc.text(ordersForPdf.referenca, 6, 50, { maxWidth: 50 });
    doc.text(ordersForPdf.prejemnik, 6, 62, { maxWidth: 50 });

    // Talon section
    doc.setFontSize(10);
    doc.addImage(ordersForPdf.pngString, 64, 6, 39.5, 39.5);
    doc.text(ordersForPdf.placnik, 109, 25, { maxWidth: 60 });
    doc.text(`***${ordersForPdf.znesek}`, 116, 44, { maxWidth: 38 });
    doc.text(ordersForPdf.rok_placila, 164, 44, { maxWidth: 28 });
    doc.text(ordersForPdf.koda_namena, 66, 52, { maxWidth: 12 });
    doc.text(ordersForPdf.namen_placila, 83, 52, { maxWidth: 90 });
    doc.text(ordersForPdf.trr, 66, 61, { maxWidth: 130 });
    doc.text(ordersForPdf.referenca, 66, 69, { maxWidth: 97 });
    doc.text(ordersForPdf.prejemnik, 66, 78, { maxWidth: 97 });

    const now = new Date();
    const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    let placnik = replaceNonAsciiChars(ordersForPdf.placnik);
    placnik = placnik.replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${ordersForPdf.id}-${placnik}.pdf`;
    const arrayBuffer = doc.output("arraybuffer");
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });
    return { blob, fileName };
};

export const createPdfZip = async (ordersForPdf: OrderWithPngString[]): Promise<void> => {
    isLoadingData.set(true);

    const { downloadZip } = await import("client-zip");
    const files = await Promise.all(
        ordersForPdf.map(async (order) => {
            const { blob, fileName } = await createPdfForZip(order);
            return { name: fileName, input: blob };
        })
    );

    const zipBlob = await downloadZip(files).blob();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const fileName = `upnPdfZip-${formattedDate}.zip`;
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    isLoadingData.set(false);
}


// TODO: Implement this function for saving png files in zip
// export const createPngZip = async (ordersForPdf: OrderWithPngString[]): Promise<void> => {
//     isLoadingData.set(true);
//     const { downloadZip } = await import("client-zip");
//     // from ordersForPdf create pdf file, then create canvas and put pdf on canvas, then convert canvas to png and put it in zip as blob
//     const files = await Promise.all(
//         ordersForPdf.map(async (order) => {
//             const { blob, fileName } = await createPdfForZip(order);
//             const pdfBlob = blob;
//             const pdfUrl = URL.createObjectURL(pdfBlob);
//             pdfjsLib.GlobalWorkerOptions.workerSrc = "$lib/workers/pdf.worker.min.mjs";
//             const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
//             const page = await pdf.getPage(1);
//             const viewport = page.getViewport({ scale: 1 });
//             const canvas = document.createElement("canvas");
//             const context = canvas.getContext("2d");
//             if (!context) {
//                 throw new Error("Failed to get 2D context");
//             }
//             canvas.height = viewport.height;
//             canvas.width = viewport.width;
//             await page.render({ canvasContext: context, viewport }).promise;
//             const pngBlob = await new Promise<Blob>((resolve, reject) => {
//                 canvas.toBlob((blob) => {
//                     if (blob) {
//                         resolve(blob);
//                     } else {
//                         reject(new Error("Failed to create PNG blob"));
//                     }
//                 }, "image/png");
//             });
//             return { name: fileName.replace(".pdf", ".png"), input: pngBlob };
//         })
//     );

//     const zipBlob = await downloadZip(files).blob();
//     const zipUrl = URL.createObjectURL(zipBlob);
//     const a = document.createElement("a");
//     a.href = zipUrl;
//     a.download = "orders.zip";
//     a.click();
//     isLoadingData.set(false);
// }
