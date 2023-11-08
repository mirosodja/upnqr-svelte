<script>
  import { ordersList, numberOfAllRecords } from "$lib/db";
  import {
    TableSearch,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Checkbox,
    Input,
    Label,
  } from "flowbite-svelte";

  import NavButtonOrdersTable from "./NavButtonsOrdersTable.svelte";
  import { groupOrders } from "$lib/stores.js";

  // Query parameters:
  let groupPattern = "";
  let orderBy = "id";
  let orderDirection = true;
  let numberOfFiltered = 0;
  let checkedSelectAll = false;

  /**
   * @type {any[]}
   */
  let items = [];

  /**
   * @type {any[]}
   */
  let filteredOrderList = [];

  ordersList.subscribe((value) => {
    items = value;
  });

  $: groupOrders;

  $: {
    groupPattern;
    orderBy;
  }

  const orderByHandler = (/** @type {string} */ value) => {
    orderDirection = !orderDirection;
    orderBy = value;
  };

  const selectAllHandlers = (/** @type {any} */ event) => {
    if (event.target.checked) {
      const /** @type {any}[] */ groupOrdersIds = filteredOrderList.map(
          (/** @type {{ id: any; }} */ order) => order.id
        );
      groupOrders.set(groupOrdersIds);
    } else {
      groupOrders.set([]);
    }
  };

  $: filteredOrderList = items.filter(
    (item) =>
      item.skupina.toLowerCase().indexOf(groupPattern.toLowerCase()) !== -1
  );
  //! number of filtered records when filter is not used is equal to number of all records
  $: numberOfFiltered = filteredOrderList.length;
  $: if (numberOfFiltered > 0)
    checkedSelectAll = $groupOrders.length === numberOfFiltered;
</script>

<NavButtonOrdersTable />
<div class="grid grid-cols-5">
  <div class="col-span-3">
    <b>Izbranih zapisov:</b>
    {$groupOrders.length} <b>Filtriranih zapisov:</b>
    {numberOfFiltered} <b>Skupaj zapisov:</b>
    {$numberOfAllRecords}
  </div>
  <div class="col-span-2">
    <Label for="filter"><b>Filter:</b></Label>
    <Input type="text" id="filter" placeholder="Filter plačnik ali skupina" />
  </div>
</div>

<div class="py-5">
  <div class="shadow-md sm:rounded-lg">
    <TableSearch
      striped={true}
      hoverable={true}
      placeholder="Išči skupino"
      class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
      bind:inputValue={groupPattern}
    >
      <TableHead>
        <TableHeadCell>
          Izberi vse
          <Checkbox
            id="selectall"
            on:click={selectAllHandlers}
            bind:checked={checkedSelectAll}
          />
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
        {#if filteredOrderList}
          {#each filteredOrderList as order (order.id)}
            <TableBodyRow>
              <TableBodyCell>
                <Checkbox
                  id={order.id}
                  bind:group={$groupOrders}
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
            <TableBodyCell colspan="10">Nalagam podatke</TableBodyCell>
          </TableBodyRow>
        {/if}
      </TableBody>
    </TableSearch>
  </div>
</div>

<style>
</style>
