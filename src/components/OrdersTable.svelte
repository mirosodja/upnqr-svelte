<script>
  import { db } from "../data/db";
  import { liveQuery } from "dexie";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";

  import NavButtonOrdersTable from "./NavButtonsOrdersTable.svelte";

  // @ts-ignore
  let ordersArray = liveQuery(() => db.orders.toArray());

  $: items = ordersArray;

</script>
<NavButtonOrdersTable />

<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
  <Table
    striped={true}
    hoverable={true}
    class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
  >
    <TableHead>
      <TableHeadCell>
        <div class="flex items-center">
          <input
            id="select-all"
            type="checkbox"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label for="select-all" class="sr-only">checkbox</label>
        </div>
      </TableHeadCell>
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
            <TableBodyCell>
              <div class="flex items-center">
                <input
                  id={item.id}
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label for={item.id} class="sr-only"
                  >checkbox</label
                >
              </div>
            </TableBodyCell>
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
</div>
