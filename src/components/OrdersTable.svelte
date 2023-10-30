<script>
  import { db } from "$lib/db";
  import { liveQuery } from "dexie";
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Checkbox,
  } from "flowbite-svelte";

  import NavButtonOrdersTable from "./NavButtonsOrdersTable.svelte";

  /**
   * @type {(number)[]}
   */
  let groupOrders = [];
  // Query parameters:
  let namePattern = "";
  let orderBy = "id";
  let orderDirection = true;
  let numberOfFiltered = 0;
  let numberOfRecords = 0;

  // List every query parameter:
  $: {
    namePattern;
    orderBy;
  }

  $: ordersList = liveQuery(async () => {
    /**
     * @type {any}
     */
    const collection =
      // @ts-ignore
      db.orders.orderBy(orderBy);

    // Return result:
    numberOfRecords = await collection.count();
    if (orderDirection) {
      return await collection.toArray();
    } else {
      return await collection.reverse().toArray();
    }
  });

  const orderByHandler = (/** @type {string} */ value) => {
    orderDirection = !orderDirection;
    orderBy = value;
  };

  const selectAllHandlers = (/** @type {any} */ event) => {
    if (event.target.checked) {
      groupOrders = $ordersList.map(
        (/** @type {{ id: any; }} */ order) => order.id
      );
    } else {
      groupOrders = [];
    }
  };
</script>

<NavButtonOrdersTable />
<div>
  <b>Izbranih zapisov:</b>
  {groupOrders.length} <b>Filtriranih zapisov:</b>
  {numberOfFiltered} <b>Skupaj zapisov:</b>
  {numberOfRecords}
</div>

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
          <Checkbox id="selectall" on:click={selectAllHandlers} />
        </TableHeadCell>
        <TableHeadCell
          on:click={() => orderByHandler("id")}
          class="cursor-pointer">Id</TableHeadCell
        >
        <TableHeadCell
          on:click={() => orderByHandler("placnik")}
          class="cursor-pointer">Plačnik</TableHeadCell
        >
        <TableHeadCell
          on:click={() => orderByHandler("skupina")}
          class="cursor-pointer">Skupina</TableHeadCell
        >
        <TableHeadCell
          on:click={() => orderByHandler("znesek")}
          class="cursor-pointer">Znesek</TableHeadCell
        >
        <TableHeadCell
          on:click={() => orderByHandler("koda_namena")}
          class="cursor-pointer">Koda namena</TableHeadCell
        >
        <TableHeadCell
          on:click={() => orderByHandler("namen_placila")}
          class="cursor-pointer">Namen plačila</TableHeadCell
        >
        <TableHeadCell
          on:click={() => orderByHandler("trr")}
          class="cursor-pointer">TRR</TableHeadCell
        >
        <TableHeadCell
          on:click={() => orderByHandler("referenca")}
          class="cursor-pointer"
          >Referenca
          <!-- TODO: add cotrol sum calculation for SI12 -->
        </TableHeadCell>
        <TableHeadCell
          on:click={() => orderByHandler("prejemnik")}
          class="cursor-pointer">Prejemnik</TableHeadCell
        >
      </TableHead>
      <TableBody>
        {#if $ordersList}
          {#each $ordersList as order (order.id)}
            <TableBodyRow>
              <TableBodyCell>
                <Checkbox
                  id={order.id}
                  bind:group={groupOrders}
                  value={order.id}
                />
              </TableBodyCell>
              <TableBodyCell
                class="cursor-pointer"
                title="Dvoklik za urejanje zapisa z ID={order.id}"
                >{order.id}</TableBodyCell
              >
              <TableBodyCell class="whitespace-normal"
                >{order.placnik}</TableBodyCell
              >
              <TableBodyCell>{order.skupina}</TableBodyCell>
              <TableBodyCell>{order.znesek}</TableBodyCell>
              <TableBodyCell>{order.koda_namena}</TableBodyCell>
              <TableBodyCell class="whitespace-normal"
                >{order.namen_placila}</TableBodyCell
              >
              <TableBodyCell class="whitespace-normal"
                >{order.trr}</TableBodyCell
              >
              <TableBodyCell class="whitespace-normal"
                >{order.referenca}</TableBodyCell
              >
              <TableBodyCell class="whitespace-normal"
                >{order.prejemnik}</TableBodyCell
              >
            </TableBodyRow>
          {/each}
        {:else}
          <TableBodyRow>
            <TableBodyCell colspan="10">Ni podatkov</TableBodyCell>
          </TableBodyRow>
        {/if}
      </TableBody>
    </Table>
  </div>
</div>

<style>
</style>
