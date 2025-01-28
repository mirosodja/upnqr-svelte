import { db } from "$lib/db";
import { isInsertingData } from "$lib/stores";
import { createPngStringForOrder } from "$lib/createPngString";
import type { Order } from "$lib/models/Order";

/**
 * Checks if the given value is a positive integer.
 *
 * @param value - The value to check.
 * @returns True if the value is a positive integer, otherwise false.
 */
function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && value > 0 && Number.isInteger(value);
}

async function pasteTextFromClipboard(pastedText: string): Promise<void> {
  let numberOfImportedRows = 0;
  isInsertingData.set(true);
  try {
    const text = pastedText;
    const rows = text.split("\n").map((row) => row.split("\t"));
    if (rows[0].length !== 10) {
      alert("Napaka: Nepravilno število polj v vrstici!");
      return;
    }
    rows.shift();
    for (const row of rows) {
      const obj: Order = {
        id: +row[0],
        placnik: row[1],
        skupina: row[2],
        znesek: row[3],
        koda_namena: row[4],
        namen_placila: row[5],
        rok_placila: row[6],
        trr: row[7],
        referenca: row[8],
        prejemnik: row[9],
      };
      if (row.length === 10) {
        if (!isPositiveInteger(obj.id)) {
          alert(`Napaka: Id=${obj.id} ni pozitivno celo število!`);
          return;
        }

        if (!obj.placnik.match(/^[^,;]{1,32},[^,;]{0,32},[^,;]{0,32}$/)) {
          alert(`Napaka: Polje 'Placnik=${obj.placnik}' v vrstici z id=${obj.id} ne ustreza zahtevanemu formatu!`);
          return;
        }

        if (obj.skupina.length > 20) {
          alert(`Napaka: Dolžina polja 'Skupina=${obj.skupina}' v vrstici z id=${obj.id} je prevelika!`);
          return;
        }

        if (!obj.znesek.match(/^(\d{0,3}\.)?\d{1,3}(,\d{0,2})?$/)) {
          alert(`Napaka: Polje 'Znesek=${obj.znesek}' v vrstici z id=${obj.id} ne ustreza zahtevanemu formatu!`);
          return;
        }

        if (!obj.koda_namena.match(/^[A-Z]{4}$/)) {
          alert(`Napaka: Polje 'Koda namena=${obj.koda_namena}' v vrstici z id=${obj.id} ne ustreza zahtevanemu formatu!`);
          return;
        }

        if (obj.namen_placila.length > 42) {
          alert(`Napaka: Dolžina polja 'Namen plačila=${obj.namen_placila}' v vrstici z id=${obj.id} je prevelika!`);
          return;
        }

        if (obj.rok_placila !== "" && !obj.rok_placila.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
          alert(`Napaka: Polje 'Rok plačila=${obj.rok_placila}' v vrstici z id=${obj.id} ne ustreza zahtevanemu formatu!`);
          return;
        }

        if (!obj.trr.match(/^[A-Z]{2}\d{2}\s\d{4}\s\d{4}\s\d{4}\s\d{3}$/)) {
          alert(`Napaka: Polje 'TRR=${obj.trr}' v vrstici z id=${obj.id} ne ustreza zahtevanemu formatu!`);
          return;
        }

        if (!obj.referenca.match(/(^SI\d{2}\s(?=(?:[^-]*-){0,2}[^-]*$)[0-9-]{0,22}$)|(^RF\d{2}\s[0-9A-Za-z]{0,21}$)/)) {
          alert(`Napaka: Polje 'Referenca=${obj.referenca}' v vrstici z id=${obj.id} ne ustreza zahtevanemu formatu!`);
          return;
        }

        if (!obj.prejemnik.match(/^[^,;]{1,32},[^,;]{1,32},[^,;]{1,32}$/)) {
          alert(`Napaka: Polje 'Prejemnik=${obj.prejemnik}' v vrstici z id=${obj.id} ne ustreza zahtevanemu formatu!`);
          return;
        }

        const existingKey = await db.orders.get({ id: obj.id });
        if (!existingKey) {
          Object.keys(obj).forEach((key) => {
            if (typeof obj[key as keyof Order] === 'string') {
              // @ts-ignore
              obj[key as keyof Order] = (obj[key as keyof Order] as string).trim();
            }
          });
          const pngString = await createPngStringForOrder(obj);
          const objWithPng = { id: obj.id, pngString: pngString };
          await db.pngStrings.put(objWithPng);
          await db.orders.put(obj);
          numberOfImportedRows++;
        }
      }
    }
  } catch (err) {
    alert("Napaka pri uvozu podatkov: " + err);
  } finally {
    isInsertingData.set(false);
    alert(`Uvoženo ${numberOfImportedRows} vrstic.`);
  }
}

export default pasteTextFromClipboard;
