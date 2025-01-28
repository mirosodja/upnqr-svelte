import { get } from 'svelte/store';
import { readOrder, readPngString } from '$lib/db';
import { groupOrdersStoreIds, isLoadingData } from "$lib/stores";
import qrcodegen from '$lib/qrcode/qrcodegen';
import { Order, OrderWithPngString } from '$lib/types/Order';


/**
 * Converts an SVG string to a PNG data URL.
 *
 * @param svg - The SVG string to convert.
 * @param width - The width of the resulting PNG image. Defaults to 150.
 * @param height - The height of the resulting PNG image. Defaults to 150.
 * @returns A promise that resolves to a PNG data URL.
 * @throws Will throw an error if the 2D context of the canvas cannot be obtained.
 */

async function svg2png(svg: string, width: number = 150, height: number = 150): Promise<string> {
    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    [canvas.width, canvas.height] = [width, height];

    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
    } else {
        throw new Error("Failed to get 2D context");
    }

    return canvas.toDataURL("image/png");
}

/**
 * Prepares an order with a PNG string by reading the order and PNG string records from the database.
 * Ensures all properties are assigned default values if they are undefined.
 *
 * @param {Object} params - The parameters for the function.
 * @param {number} params.id - The ID of the order to be prepared.
 * @returns {Promise<OrderWithPngString>} A promise that resolves to an object containing the order details and the PNG string.
 */
async function prepareOrderWithPngString({ id }: { id: number; }): Promise<OrderWithPngString> {
    const order = await readOrder(id);
    const pngStringRecord = await readPngString(id);
    // Ensure all properties are assigned default values if they are undefined
    const orderWithPngString: OrderWithPngString = {
        id: order?.id ?? 0,
        placnik: order?.placnik ?? '',
        skupina: order?.skupina ?? '',
        znesek: order?.znesek ?? '',
        koda_namena: order?.koda_namena ?? '',
        namen_placila: order?.namen_placila ?? '',
        rok_placila: order?.rok_placila ?? '',
        trr: order?.trr ?? '',
        referenca: order?.referenca ?? '',
        prejemnik: order?.prejemnik ?? '',
        pngString: pngStringRecord?.pngString ?? ''
    };
    return orderWithPngString;
}

/**
 * Prepares order data in a specific format for further processing.
 *
 * @param {Order} order - The order object containing necessary details.
 * @returns {string} - The formatted order data string.
 *
 * The function processes the order details such as payer's name, amount, payment purpose, 
 * payment deadline, recipient's IBAN, and reference, and formats them into a specific 
 * string format. It also calculates a control sum based on the length of the formatted 
 * order data and appends it to the end of the string.
 */
function prepareOrderData(order: Order): string {
    const konstanta = "UPNQR";
    const placnik_IBAN = "";
    const polog = "";
    const dvig = "";
    const placnik_referenca = "";
    const imePlacnik = order.placnik
        .replaceAll(", ", ",")
        .replaceAll(",", "\n");
    const znesek = order.znesek
        .toString()
        .replace(".", "")
        .replace(",", "")
        .padStart(11, "0"); // 1.628,45 => "00000162845"
    const datum_placila = "";
    const nujno = "";
    const koda_namena = order.koda_namena;
    const namen_rok_placila = order.namen_placila;
    const rok_placila = order.rok_placila;
    const prejemnik_IBAN = order.trr.replace(/\s/g, "");
    const prejemnik_referenca = order.referenca.replace(/\s/g, "");
    const imePrejemnik = order.prejemnik
        .replaceAll(", ", ",")
        .replaceAll(",", "\n");

    const orderData = `${konstanta}\n${placnik_IBAN}\n${polog}\n${dvig}\n${placnik_referenca}\n${imePlacnik}\n${znesek}\n${datum_placila}\n${nujno}\n${koda_namena}\n${namen_rok_placila}\n${rok_placila}\n${prejemnik_IBAN}\n${prejemnik_referenca}\n${imePrejemnik}\n`;

    const controlSum = orderData.length.toString().padStart(3, "0");
    return `${orderData}${controlSum}\n`;
}


/**
 * Converts a QR code object to an SVG string representation.
 *
 * @param {qrcodegen.QrCode} qr - The QR code object to convert.
 * @param {number} border - The width of the border to add around the QR code. Must be non-negative.
 * @param {string} lightColor - The color to use for the light (background) areas of the QR code.
 * @param {string} darkColor - The color to use for the dark (foreground) areas of the QR code.
 * @returns {string} The SVG string representation of the QR code.
 * @throws {RangeError} If the border is negative.
 */
function toSvgString(qr: qrcodegen.QrCode, border: number, lightColor: string, darkColor: string): string {
    if (border < 0)
        throw new RangeError("Border must be non-negative");
    /**
     * @type {Array<string>}
     */
    let parts: string[] = [];
    for (let y = 0; y < qr.size; y++) {
        for (let x = 0; x < qr.size; x++) {
            if (qr.getModule(x, y))
                parts.push(`M${x + border},${y + border}h1v1h-1z`);
        }
    }
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qr.size + border * 2} ${qr.size + border * 2}" stroke="none">
<rect width="100%" height="100%" fill="${lightColor}"/>
<path d="${parts.join(" ")}" fill="${darkColor}"/>
</svg>
`;
}

/**
 * Asynchronously creates orders with QR code SVG strings.
 *
 * This function retrieves an array of order IDs from the store, reads each order,
 * prepares the order data, generates a QR code for the order data, converts the QR code
 * to an SVG string, and assigns the SVG string to the order. Finally, it returns an array
 * of orders with the QR code SVG strings.
 *
 * @returns {Promise<Order[]>} A promise that resolves to an array of orders with QR code SVG strings.
 *
 * @throws Will throw an error if there is an issue generating the QR codes.
 */
export async function createOrdersWithPngString(): Promise<OrderWithPngString[]> {
    isLoadingData.set(true);
    let orders: OrderWithPngString[] = [];
    try {
        // Get the array of IDs from the store
        const groupOrdersIds: number[] = get(groupOrdersStoreIds);

        orders = await Promise.all(groupOrdersIds.map(async (id) => {
            const orderWithPngString: OrderWithPngString = await prepareOrderWithPngString({ id });
            return orderWithPngString;
        }));
        return orders;
    } catch (error) {
        console.error('Error generating order QR codes:', error);
        throw error;
    } finally {
        isLoadingData.set(false);
    }
}

/**
 * Generates a PNG string representation of a QR code for a given order.
 *
 * @param {Order} order - The order object for which the QR code is to be generated.
 * @returns {Promise<string>} A promise that resolves to a PNG string of the QR code.
 * @throws Will throw an error if there is an issue generating the QR code.
 */
export async function createPngStringForOrder(order: Order): Promise<string> {
    try {
        const str = prepareOrderData(order);
        const QRC = qrcodegen.QrCode;
        const qr0 = QRC.encodeText(str, QRC.Ecc.MEDIUM);
        const svgString = toSvgString(qr0, 2, '#FFFFFF', '#000000');
        const pngString = await svg2png(svgString);
        return pngString;
    } catch (error) {
        console.error('Error generating order QR codes:', error);
        throw error;
    }
}