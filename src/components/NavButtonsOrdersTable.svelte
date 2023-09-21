<script>
  import { db } from "../data/db";
  import Button from "../shared/Button.svelte";

  /**
   * @param {unknown} value
   */
  function isPositiveInteger(value) {
    return typeof value === "number" && value > 0 && Number.isInteger(value);
  }

  // see: https://itnext.io/javascript-work-with-clipboard-ctrl-c-ctrl-v-42bb287f1c66
  //  document.addEventListener('paste', evt => {
  //   const txt = evt.clipboardData.getData('text/plain');
  //  });

  /**
   * @param {string} text
   * @returns {Promise<void>}
   * @see {https} ://stackoverflow.com/a/65957232/1148001
   * @see {https} ://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText
  copy text to clipboard
   */
  async function copyTextToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Text copied to clipboard");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  const copyHello = () => {
    copyTextToClipboard("Hello, World!");
  };

  /**
   * @returns {Promise<string | undefined>}
   * @see https://stackoverflow.com/a/65957232/1148001
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText
   * paste text from clipboard
   */
  async function pasteTextFromClipboard() {
    // TODO: add check if data is compatible with structure of db
    try {
      const text = await navigator.clipboard.readText();
      const rows = text.split("\n").map((row) => row.split("\t"));
      const kodaNamenaData = await fetch("data/koda_namena.json").then((res) =>
        res.json()
      );
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

  const pasteData = async () => {
    // @ts-ignore
    const text = await pasteTextFromClipboard();
  };
</script>

<div class="navButton">
  <Button idButton="reinit" title="Re-init tabele">Re-init</Button>
  <Button idButton="add" title="Dodaj zapis">Dodaj</Button>
  <Button idButton="delete" title="Izbriši zapis">Izbriši</Button>
  <Button idButton="izbor" title="Dodaj filtrirane vrstice v izbor"
    >Izbor</Button
  >
  <Button idButton="preobrni" title="Preobrni izbor">Preobrni</Button>
  <Button
    clickedFunction={copyHello}
    idButton="copydata"
    title="Kopiraj podatke v odložišče">Kopiraj podatke</Button
  >
  <Button
    idButton="pasteData"
    title="Klik: Prilepi podatke iz odložišča, Dvoklik: Opis strukture podatkov"
    clickedFunction={pasteData}>Prilepi podatke</Button
  >
</div>

<style>
  .navButton {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    padding-bottom: 10px;
    justify-content: space-around;
    align-items: center;
    background-size: contain;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 20px;
  }
</style>
