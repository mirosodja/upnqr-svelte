import { get } from 'svelte/store';
import { readOrder } from '$lib/db';
import { groupOrdersStoreIds, isLoadingData } from "$lib/stores";
import qrcodegen from '$lib/qrcode/qrcodegen';

/**
 * Converts an SVG string to a PNG data URL.
 *
 * @param {string} svgString - The SVG string to convert.
 * @returns {Promise<string>}
 */
function svgToPngV1(svgString) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        img.src = URL.createObjectURL(blob);
        img.onload = () => {
            if (ctx) {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const png = canvas.toDataURL('image/png');
                resolve(png);
            } else {
                reject(new Error("Failed to get 2D context"));
            }
        };
        img.onerror = (error) => reject(error);
    });
}

/**
 * Converts an SVG string to a PNG data URL.
 *
 * @param {string} svgString - The SVG string to convert.
 * @returns {Promise<string>}
 */
function svgToPngV2(svgString) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const img = new Image(canvas.width, canvas.height);
        img.src = URL.createObjectURL(blob);
        img.onload = () => {
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(URL.createObjectURL(blob));
                    } else {
                        reject(new Error("Failed to convert canvas to blob"));
                    }
                }, 'image/png');
            } else {
                reject(new Error("Failed to get 2D context"));
            }
        };
        img.onerror = (error) => reject(error);
    });
}

/**
 * Converts an svg string into a data:image/png;base64 string.
 * @param {string} svg
 * @param {number | undefined} width
 * @param {number | undefined} height
 */
async function svg2png(svg, width = 150, height = 150) {
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
 */

/**
 * @param {Order} order
 * @returns {string}
 * @description
 * Prepare order data for UPN QR code.
 */
function prepareOrderData(order) {
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
function toSvgString(qr, border, lightColor, darkColor) {
    if (border < 0)
        throw new RangeError("Border must be non-negative");
    /**
     * @type {Array<string>}
     */
    let parts = [];
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


export async function createOrdersWithSvgString() {
    isLoadingData.set(true);
    try {

        /**
         * @type {Order[]}
         */
        let orders;

        // Get the array of IDs from the store
        /**
         * @type { number[]}
         */
        const ids = get(groupOrdersStoreIds);

        /**
         * @type {Order[]}
         */
        return orders = await Promise.all(ids.map(async (id) => {
            // @ts-ignore
            const order = await readOrder(id);
            const str = prepareOrderData(order);
            const QRC = qrcodegen.QrCode;
            const qr0 = QRC.encodeText(str, QRC.Ecc.MEDIUM);
            const svgString = toSvgString(qr0, 1, '#FFFFFF', '#000000');
            order.qrSvgString = svgString;
            return order;
        }));
    } catch (error) {
        console.error('Error generating order QR codes:', error);
        throw error;
    }
    finally {
        isLoadingData.set(false);
    }
}


/**
 * @typedef {Object} Order2
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
 */
/**
 * Generates PNG strings for orders and updates the orders with the generated PNG strings.
 *
 * @param {Order2} order - The ID of the order.
 * @returns {Promise<string>} A promise that resolves to an array of updated orders with PNG strings.
 * @throws Will throw an error if there is an issue generating the order QR codes.
 */
export async function createPngStringForOrder(order) {
    try {
        const str = prepareOrderData(order);
        const QRC = qrcodegen.QrCode;
        const qr0 = QRC.encodeText(str, QRC.Ecc.MEDIUM);
        const svgString = toSvgString(qr0, 2, '#FFFFFF', '#000000');
        const pngString = await svg2png(svgString);
        return pngString;
    }
    catch (error) {
        console.error('Error generating order QR codes:', error);
        throw error;
    }
}