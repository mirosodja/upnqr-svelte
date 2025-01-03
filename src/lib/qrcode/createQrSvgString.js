/** Utils */
import Config from "$lib/qrcode/configQrDefault.js";
import { qr } from "$lib/qrcode/qr";


export const createQrSvgString = (
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
        }" width="${cellSize}" height="${cellSize}" fill="${modules[row][col] ? color : backgroundColor
        }" stroke="${modules[row][col] ? color : backgroundColor}"/>`;
    }
  }
  svgStr += "<svg>";

  return svgStr;
};

export const createImgTag = (
  /** @type {string} */ qrString,
/** @type {number} */ cellSize,
/** @type {number} */ margin,
/** @type {string} */ alt
) => {
  // @ts-ignore
  const modules = qr(qrString, Config.QR);
  cellSize = cellSize || 2;
  margin = (typeof margin == 'undefined') ? cellSize * 4 : margin;

  // @ts-ignore
  const size = modules * cellSize + margin * 2;

  let img = '';
  img += '<img';
  img += '\u0020src="';
  img += createDataURL(cellSize, margin);
  img += '"';
  img += '\u0020width="';
  img += size;
  img += '"';
  img += '\u0020height="';
  img += size;
  img += '"';
  if (alt) {
    img += '\u0020alt="';
    img += escapeXml(alt);
    img += '"';
  }
  img += '/>';

  return img;
};

const escapeXml = (/** @type {string} */s) => {
  var escaped = '';
  for (let i = 0; i < s.length; i += 1) {
    let c = s.charAt(i);
    switch (c) {
      case '<': escaped += '&lt;'; break;
      case '>': escaped += '&gt;'; break;
      case '&': escaped += '&amp;'; break;
      case '"': escaped += '&quot;'; break;
      default: escaped += c; break;
    }
  }
  return escaped;
};

const createDataURL = (/** @type {number} */ cellSize,
    /** @type {number} */ margin, /** @type {number} */ pixelSize) => {
  // @ts-ignore
  const modules = qr(qrString, Config.QR);
  cellSize = cellSize || 2;
  margin = (typeof margin == 'undefined') ? cellSize * 4 : margin;

  // @ts-ignore
  const size = modules * cellSize + margin * 2;
  const min = margin;
  const max = size - margin;

  for (let row = 0; row < modules.length; row++) {
    for (let col = 0; col < modules[row].length; col++) {
      if (min <= row && row < max && min <= col && col < max) {
        var c = Math.floor((row - min) / cellSize);
        var r = Math.floor((col - min) / cellSize);
        return isDark(r, c) ? 0 : 1;
      } else {
        return 1;
      }
    }
  }
};


const isDark = (/** @type {number} */ row, /** @type {number} */ col) => {
  // @ts-ignore
  const modules = qr(qrString, Config.QR);
  if (row < 0 || modules.length <= row || col < 0 || modules.length <= col) {
    throw row + ',' + col;
  }
  return modules[row][col];
};

