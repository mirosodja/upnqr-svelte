/** Utils */
import Config from "$lib/qrcode/configQrDefault.js";
import { qr } from "./qr";


export const generateSvg =  (
    /** @type {string} */ qrString,
    /** @type {number} */ size,
    /** @type {string} */ color,
    /** @type {string} */ backgroundColor,
  ) => {

    // @ts-ignore
    const modules = qr(qrString, Config.QR);
    const QR_STATIC_SIZE = Config.QR.version * 4 + 17;
    const cellSize = (size / QR_STATIC_SIZE).toFixed(5);
    let svgStr = `<svg xmlns:ev="http://www.w3.org/2001/xml-events" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${Config.sizeInUnits}" height="${Config.sizeInUnits}" viewBox="0 0 ${size} ${size}">`;

    for (let row = 0; row < modules.length; row++) {
      for (let col = 0; col < modules[row].length; col++) {
        // @ts-ignore
        svgStr += `<rect x="${(row * cellSize).toFixed(5)}" y="${
          // @ts-ignore
          (col * cellSize).toFixed(3)
        }" width="${cellSize}" height="${cellSize}" fill="${
          modules[row][col] ? color : backgroundColor
        }" stroke="${modules[row][col] ? color : backgroundColor}"/>`;
      }
    }
    svgStr += "<svg>";

    return svgStr;
  };