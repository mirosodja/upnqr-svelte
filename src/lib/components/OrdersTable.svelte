<script lang="ts">
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Checkbox,
    Label,
    Select,
    Input,
  } from "flowbite-svelte";
  import { ordersList, numberOfAllRecords } from "$lib/db";
  import { fieldsInTable } from "$lib/fieldsInTable";
  import NavButtonOrdersTable from "$lib/components/NavButtonsOrdersTable.svelte";
  import { groupOrdersStoreIds } from "$lib/stores";
  import AddRecord from "$lib/components/AddRecord.svelte";
  import type { Order } from "$lib/types/Order";
    import { get } from "svelte/store";
  // modal for editing record
  let showAddRecord = false;
  let id = 0;

  // Query parameters:
  let groupPattern = "";
  let orderBy = "id";
  let orderDirection = true;
  let numberOfFiltered = 0;
  let checkedSelectAll = false;
  let filterByColumn = "skupina";

  let items: Order[] = [];

  let filteredOrders: Order[] = [];

  // code subscribes to the `ordersList` store and updates the `items` variable
  // whenever the value of `ordersList` changes. This ensures that `items` always
  // contains the latest data from the `ordersList` store.
  ordersList.subscribe((value) => {
    items = value;
  });

  // The reactive statement `$: groupOrdersStoreIds` is used to automatically update the grouped orders whenever the dependencies change.

  $: groupOrdersStoreIds;

  $: {
    groupPattern;
    orderDirection;
    orderBy;
  }
  // function to order the list of orders by the selected column
  const orderByHandler = (sortColumn: string) => {
    const groupedOrdersIds: number[] = get(groupOrdersStoreIds);
    orderDirection = !orderDirection;
    orderBy = sortColumn;
    groupOrdersStoreIds.set(groupedOrdersIds);
  };

  const selectAllHandlers = (event: any) => {
    if (event.target.checked) {
      const groupOrdersIds: number[] = filteredOrders.map(
        (order) => order.id,
      );
      groupOrdersStoreIds.set(groupOrdersIds);
    } else {
      groupOrdersStoreIds.set([]);
    }
  };

  const editOrderHandler = (orderId: number) => {
    id = orderId;
    showAddRecord = true;
  };

  $: filteredOrders = items
    .filter(
      (item) =>
        // @ts-expect-error
        item[filterByColumn]
          .toLowerCase()
          .indexOf(groupPattern.toLowerCase()) !== -1,
    )
    .sort((a, b) => {
      if (orderDirection) {
        // @ts-ignore
        return a[orderBy] > b[orderBy] ? 1 : -1;
      } else {
        // @ts-ignore
        return a[orderBy] < b[orderBy] ? 1 : -1;
      }
    });

  //! number of filtered records when filter is not used is equal to number of all records
  $: numberOfFiltered = filteredOrders.length;
  $: if (numberOfFiltered > 0)
    checkedSelectAll = $groupOrdersStoreIds.length === numberOfFiltered;
</script>

<AddRecord bind:clickToOpenAddRecord={showAddRecord} bind:id />
<NavButtonOrdersTable />
<div class="grid grid-cols-5">
  <div class="col-span-3">
    <b>Skupaj zapisov:</b>
    {$numberOfAllRecords}
    <b>Izbranih zapisov:</b>
    {$groupOrdersStoreIds.length}
    {#if groupPattern !== ""}
      <b>Filtriranih zapisov:</b>
      {numberOfFiltered}
    {/if}
  </div>
</div>

<div class="py-5">
  <div class="shadow-md sm:rounded-lg overflow-x-auto">
    <Table
      striped={true}
      hoverable={true}
      class="w-full text-sm text-left text-gray-500 dark:text-gray-400"
    >
      <TableHead defaultRow={false} theadClass="normal-case">
        <tr>
          <TableHeadCell colspan="10">
            <div class="flex flex-row gap-2">
              <Label for="filterByColumn"><b>Stolpec za filtriranje:</b></Label>
              <Select
                id="filterByColumn"
                items={fieldsInTable}
                bind:value={filterByColumn}
                class="w-60"
              />
              <Label for="search"><b>Filter:</b></Label>
              <Input
                id="search"
                placeholder="Vnesi: {filterByColumn}"
                bind:value={groupPattern}
                class="w-60"
              />
            </div>
          </TableHeadCell>
        </tr>
        <tr class="line-between-head-rows">
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
            class="cursor-pointer"
          >
            Id {orderBy === "id" ? (orderDirection ? "↑" : "↓") : ""}
          </TableHeadCell>
          <TableHeadCell
            on:click={() => orderByHandler("placnik")}
            class="cursor-pointer"
            >Plačnik {orderBy === "placnik"
              ? orderDirection
                ? "↑"
                : "↓"
              : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("skupina")}
            class="cursor-pointer"
            >Skupina {orderBy === "skupina"
              ? orderDirection
                ? "↑"
                : "↓"
              : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("znesek")}
            class="cursor-pointer"
            >Znesek {orderBy === "znesek"
              ? orderDirection
                ? "↑"
                : "↓"
              : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("koda_namena")}
            class="cursor-pointer"
            >Koda namena {orderBy === "koda_namena"
              ? orderDirection
                ? "↑"
                : "↓"
              : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("namen_placila")}
            class="cursor-pointer"
            >Namen plačila {orderBy === "namen_placila"
              ? orderDirection
                ? "↑"
                : "↓"
              : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("rok_placila")}
            class="cursor-pointer"
            >Rok plačila {orderBy === "rok_placila"
              ? orderDirection
                ? "↑"
                : "↓"
              : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("trr")}
            class="cursor-pointer"
            >TRR {orderBy === "trr"
              ? orderDirection
                ? "↑"
                : "↓"
              : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("referenca")}
            class="cursor-pointer"
            >Referenca {orderBy === "referenca"
              ? orderDirection
                ? "↑"
                : "↓"
              : ""}
          </TableHeadCell>
          <TableHeadCell
            on:click={() => orderByHandler("prejemnik")}
            class="cursor-pointer"
            >Prejemnik {orderBy === "prejemnik"
              ? orderDirection
                ? "↑"
                : "↓"
              : ""}</TableHeadCell
          >
        </tr>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#if filteredOrders}
          {#each filteredOrders as item}
            <!-- TODO id should be sorted to -->
            <!-- TODO check if key is ok -->
            <TableBodyRow>
              <TableBodyCell>
                <Checkbox
                  id={item.id}
                  bind:group={$groupOrdersStoreIds}
                  value={item.id}
                  key={item.id}
                />
              </TableBodyCell>
              <TableBodyCell
                class="cursor-pointer text-red-400 hover:font-extrabold"
                title="Klik za urejanje zapisa z ID={item.id}"
                on:click={() => editOrderHandler(item.id)}
                >{item.id}</TableBodyCell
              >
              <TableBodyCell class="whitespace-normal"
                >{item.placnik}</TableBodyCell
              >
              <TableBodyCell>{item.skupina}</TableBodyCell>
              <TableBodyCell>{item.znesek}</TableBodyCell>
              <TableBodyCell>{item.koda_namena}</TableBodyCell>
              <TableBodyCell class="whitespace-normal"
                >{item.namen_placila}</TableBodyCell
              >
              <TableBodyCell class="whitespace-normal"
                >{item.rok_placila}</TableBodyCell
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
        {:else}
          <TableBodyRow>
            <TableBodyCell colspan="11">Ni podatkov</TableBodyCell>
          </TableBodyRow>
        {/if}
      </TableBody>
    </Table>
  </div>
</div>

<style>
  .line-between-head-rows {
    border-bottom: groove #aec7d1;
  }
</style>
