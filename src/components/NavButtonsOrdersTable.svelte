<script>
  import { data } from "../data/data";
  import { db } from "../data/db";

  import Button from "../shared/Button.svelte";

  async function addData() {
    console.log("Adding data");
    try {
      // @ts-ignore
      // @ts-ignore
      const id = await db.orders.add(data[1]);
    } catch (error) {
      console.log(error);
    }
  }
</script>

<div class="navButton">
  <Button idButton="reinit" title="Re-init tabele">Re-init</Button>
  <Button idButton="add" title="Dodaj zapis" onClick={addData}>Dodaj</Button>
  <Button idButton="delete" title="Izbriši zapis">Izbriši</Button>
  <Button idButton="izbor" title="Dodaj filtrirane vrstice v izbor"
    >Izbor</Button
  >
  <Button idButton="preobrni" title="Preobrni izbor">Preobrni</Button>
  <Button
    onClick={addData}
    idButton="copydata"
    title="Kopiraj podatke v odložišče">Kopiraj podatke</Button
  >
  <Button idButton="pasteData" title="Prilepi podatke iz odložišča"
    >Prilepi podatke</Button
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
