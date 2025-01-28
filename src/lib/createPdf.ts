import { isLoadingData } from "$lib/stores";

interface OrderWithPngString {
    id: number;
    placnik: string;
    skupina: string;
    znesek: string; // znesek je bil prej string ali number?
    koda_namena: string;
    namen_placila: string;
    rok_placila: string;
    trr: string;
    referenca: string;
    prejemnik: string;
    pngString: string;
}

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
        doc.addImage(order.pngString, 65, 6 + yOffset, 39.5, 39.5);
        doc.text(order.placnik, 109, 27 + yOffset, { maxWidth: 60 });
        doc.text(`***${order.znesek}`, 116, 45 + yOffset, { maxWidth: 38 });
        doc.text(order.rok_placila, 164, 45 + yOffset, { maxWidth: 28 });
        doc.text(order.koda_namena, 66, 53 + yOffset, { maxWidth: 12 });
        doc.text(order.namen_placila, 83, 53 + yOffset, { maxWidth: 90 });
        doc.text(order.trr, 66, 62 + yOffset, { maxWidth: 130 });
        doc.text(order.referenca, 66, 70 + yOffset, { maxWidth: 97 });
        doc.text(order.prejemnik, 66, 79 + yOffset, { maxWidth: 97 });
    });

    const now = new Date();
    const formattedDate = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const fileName = `upn-${formattedDate}.pdf`;
    doc.save(fileName);
    isLoadingData.set(false);
};