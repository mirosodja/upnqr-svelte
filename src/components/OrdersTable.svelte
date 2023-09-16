<script>
  import { data } from "../data/data";
  import Button from "../shared/Button.svelte";
  import { db } from "../data/db";
  import { liveQuery } from "dexie";
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';

  // @ts-ignore
  let ordersArray = liveQuery(() => db.orders.toArray());

  $: items = ordersArray;

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

<Table striped={true} hoverable={true}>
  <TableHead>
    <TableHeadCell>Id</TableHeadCell>
    <TableHeadCell>Plačnik</TableHeadCell>
    <TableHeadCell>Skupina</TableHeadCell>
    <TableHeadCell>Znesek</TableHeadCell>
    <TableHeadCell>Koda namena</TableHeadCell>
    <TableHeadCell>Namen plačila</TableHeadCell>
    <TableHeadCell>TRR</TableHeadCell>
    <TableHeadCell>Referenca</TableHeadCell>
    <TableHeadCell>Prejemnik</TableHeadCell>
  </TableHead>
  <TableBody>
    {#if $items}
    {#each $items as item}
    <TableBodyRow>
      <TableBodyCell>{item.id}</TableBodyCell>
      <TableBodyCell>{item.placnik}</TableBodyCell>
      <TableBodyCell>{item.skupina}</TableBodyCell>
      <TableBodyCell>{item.znesek}</TableBodyCell>
      <TableBodyCell>{item.koda_namena}</TableBodyCell>
      <TableBodyCell>{item.namen_placila}</TableBodyCell>
      <TableBodyCell>{item.trr}</TableBodyCell>
      <TableBodyCell>{item.referenca}</TableBodyCell>
      <TableBodyCell>{item.prejemnik}</TableBodyCell>
    </TableBodyRow>
    {/each}
    {/if}
  </TableBody>
</Table>
<style>
  .navButton {
    display: flex;
    flex-wrap: wrap;
    /* text-align: left; */
    width: calc(100% - 2em);
    padding-top: 10px;
    padding-bottom: 10px;

    justify-content: space-around;
    /* gap: 1em; */
    align-items: center;
    background-size: contain;
    /* background: rgba(255, 255, 255, 0.7); */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    /* transform: translateY(-2px); */
    margin-bottom: 20px;
  }

</style>
