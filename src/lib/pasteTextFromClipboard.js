import { db } from "../data/db";
  
  /**
   * @param {unknown} value
   */
  function isPositiveInteger(value) {
    return typeof value === "number" && value > 0 && Number.isInteger(value);
  }

 /**
   * @returns {Promise<string | undefined>}
   * @see https://stackoverflow.com/a/65957232/1148001
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText
   * paste text from clipboard
   */
 // @ts-ignore
 async function pasteTextFromClipboard(pastedText) {
    // TODO: add check if data is compatible with structure of db
    try {
      const text = pastedText;
      // @ts-ignore
      const rows = text.split("\n").map((row) => row.split("\t"));
      if (rows[0].length !== 9) {
        alert("Error: Incorrect number of elements in a row.");
        return;
      }
      rows.shift();
      let numberOfImportedRows = 0;
      for (const row of rows) {
        // 7. Create array of objects with validations
        const obj = {
          id: +row[0],
          placnik: row[1],
          skupina: row[2],
          znesek: row[3],
          koda_namena: row[4],
          namen_placila: row[5],
          trr: row[6],
          referenca: row[7],
          prejemnik: row[8],
        };
        if (row.length === 9) {
          if (
            !isPositiveInteger(obj.id) ||
            !obj.placnik.match(/^[^,;]{1,32},[^,;]{1,32},[^,;]{1,32}$/) ||
            obj.skupina.length > 20 ||
            !obj.znesek.match(/^(\d{0,3}\.)?\d{1,3},\d{2}$/) ||
            obj.namen_placila.length > 42 ||
            !obj.trr.match(/^[A-Z]{2}\d{2}\s\d{4}\s\d{4}\s\d{4}\s\d{3}$/) ||
            !obj.referenca.match(
              /(^SI\d{2}\s(?=(?:[^-]*-){0,2}[^-]*$)[0-9-]{0,22}$)|(^RF\d{2}\s[0-9A-Za-z]{0,21}$)/
            ) ||
            !obj.prejemnik.match(/^[^,;]{1,32},[^,;]{1,32},[^,;]{1,32}$/)
          ) {
            alert(`Error: Data validation failed at id=${obj.id}.`);
            return;
          }
          // @ts-ignore
          const existingKey = await db.orders.get({ id: obj.id });
          if (!existingKey) {
            // @ts-ignore
            // @ts-ignore
            const id = await db.orders.put(obj);
            numberOfImportedRows++;
          }
        }
      }
      alert(`Imported ${numberOfImportedRows} rows.`);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  }

  export default pasteTextFromClipboard;