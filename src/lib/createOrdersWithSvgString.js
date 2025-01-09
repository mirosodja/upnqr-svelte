import { get } from 'svelte/store';
import { readOrder } from './db';
import { groupOrdersStoreIds, isLoadingData } from "./stores";
import qrcodegen from '$lib/qrcode/qrcodegen';


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
            // const svgString = createQrSvgString(str, configQrDefault.size, configQrDefault.color, configQrDefault.backgroundColor);
            const QRC = qrcodegen.QrCode;
            const qr0 = QRC.encodeText(str, QRC.Ecc.MEDIUM);
            const svgString = toSvgString(qr0, 2, '#FFFFFF', '#000000');
            order.qrSvnString = svgString;
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