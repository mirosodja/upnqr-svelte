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
    Checkbox
  } from "flowbite-svelte";

  import NavButtonOrdersTable from "./NavButtonsOrdersTable.svelte";

  // @ts-ignore
  let items = liveQuery(
    async () => {
      // @ts-ignore
      return await db.orders
        .toArray().
        catch((/** @type {any} */ error) => {
          console.log(error);
        });
      });

  // $: items = ordersArray;
</script>

<NavButtonOrdersTable />
<div class="py-5">
  <div class="shadow-md sm:rounded-lg">
    <Table
      striped={true}
      hoverable={true}
      class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
    >
      <TableHead>
        <TableHeadCell>
          <!-- TODO: add button for invert selection -->
          <Checkbox id="selectall" />
        </TableHeadCell>
        <TableHeadCell>Id</TableHeadCell>
        <TableHeadCell>Plačnik</TableHeadCell>
        <TableHeadCell>Skupina</TableHeadCell>
        <TableHeadCell>Znesek</TableHeadCell>
        <TableHeadCell>Koda namena</TableHeadCell>
        <TableHeadCell>Namen plačila</TableHeadCell>
        <TableHeadCell>TRR</TableHeadCell>
        <TableHeadCell>Referenca
          <!-- TODO: add cotrol sum calculation for SI12 -->
        </TableHeadCell>
        <TableHeadCell>Prejemnik</TableHeadCell>
      </TableHead>
      <TableBody>
        {#if $items}
          {#each $items as item}
            <TableBodyRow>
              <TableBodyCell>
                <Checkbox id={item.id} />
              </TableBodyCell>
              <TableBodyCell>{item.id}</TableBodyCell>
              <TableBodyCell class="whitespace-normal"
                >{item.placnik}</TableBodyCell
              >
              <TableBodyCell>{item.skupina}</TableBodyCell>
              <TableBodyCell>{item.znesek}</TableBodyCell>
              <TableBodyCell>{item.koda_namena}</TableBodyCell>
              <TableBodyCell class="whitespace-normal"
                >{item.namen_placila}</TableBodyCell
              >
              <TableBodyCell class="whitespace-normal">{item.trr}</TableBodyCell
              >
              <TableBodyCell class="whitespace-normal"
                >{item.referenca}</TableBodyCell
              >
              <TableBodyCell class="whitespace-normal"
                >{item.prejemnik}</TableBodyCell
              >
            </TableBodyRow>
          {/each}
        {/if}
      </TableBody>
    </Table>
  </div>
</div>
