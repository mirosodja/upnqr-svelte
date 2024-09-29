<script>
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

  import { ordersList, numberOfAllRecords, db } from "$lib/db";
  import { fieldsInTable } from "$lib/constants.js";
  import NavButtonOrdersTable from "./NavButtonsOrdersTable.svelte";
  import { groupOrders } from "$lib/stores.js";

  // Query parameters:
  let groupPattern = "";
  let orderBy = "id";
  let orderDirection = true;
  let numberOfFiltered = 0;
  let checkedSelectAll = false;
  let filterByColumn = "skupina";

  /**
   * @typedef {Object} Orders
   * @property {number} id - ID.
   * @property {string} placnik - placnik.
   * @property {string} skupina - skupina.
   * @property {string|number} znesek - znesek (string or number).
   * @property {string} koda_namena - koda namena.
   * @property {string} namen_placila - namen placila.
   * @property {string} trr - TRR.
   * @property {string} referenca - referenca.
   * @property {string} prejemnik - prejemnik.
   */

  /**
   * @type {Orders[]}
   */
  let items = [];

  /**
   * @type {Orders[]}
   */
  let filteredOrderList = [];

  ordersList.subscribe((value) => {
    items = value;
  });

  $: groupOrders;

  $: {
    groupPattern;
    orderDirection;
    orderBy;
  }
  // function to order the list of orders by the selected column
  const orderByHandler = (/** @type {string} */ sortColumn) => {
    orderDirection = !orderDirection;
    orderBy = sortColumn;
  };

  const selectAllHandlers = (/** @type {any} */ event) => {
    if (event.target.checked) {
      const /** @type {any}[] */ groupOrdersIds = filteredOrderList.map(
          (/** @type {{ id: any; }} */ order) => order.id,
        );
      groupOrders.set(groupOrdersIds);
    } else {
      groupOrders.set([]);
    }
  };

  const editOrderHandler = (/** @type {number} */ orderId) => {
    const order = items.find((item) => item.id === orderId);
    console.log("Edit order: ", order);
  };

  $: filteredOrderList = items
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
  $: numberOfFiltered = filteredOrderList.length;
  $: if (numberOfFiltered > 0)
    checkedSelectAll = $groupOrders.length === numberOfFiltered;
</script>

<NavButtonOrdersTable />
<div class="grid grid-cols-5">
  <div class="col-span-3">
    <b>Skupaj zapisov:</b>
    {$numberOfAllRecords}
    <b>Izbranih zapisov:</b>
    {$groupOrders.length}
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
                type="text"
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
            class="cursor-pointer">Skupina {orderBy === "skupina"
            ? orderDirection
              ? "↑"
              : "↓"
            : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("znesek")}
            class="cursor-pointer">Znesek {orderBy === "znesek"
            ? orderDirection
              ? "↑"
              : "↓"
            : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("koda_namena")}
            class="cursor-pointer">Koda namena {orderBy === "koda_namena"
            ? orderDirection
              ? "↑"
              : "↓"
            : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("namen_placila")}
            class="cursor-pointer">Namen plačila {orderBy === "namen_placila"
            ? orderDirection
              ? "↑"
              : "↓"
            : ""}</TableHeadCell
          >
          <TableHeadCell
            on:click={() => orderByHandler("trr")}
            class="cursor-pointer">TRR {orderBy === "trr"
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
            <!-- TODO: add cotrol sum calculation for SI12 -->
          </TableHeadCell>
          <TableHeadCell
            on:click={() => orderByHandler("prejemnik")}
            class="cursor-pointer">Prejemnik {orderBy === "prejemnik"
            ? orderDirection
              ? "↑"
              : "↓"
            : ""}</TableHeadCell
          >
        </tr>
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
                title="Klik za urejanje zapisa z ID={order.id}"
                on:click={() => editOrderHandler(order.id)}
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
    </Table>
  </div>
</div>

<style>
  .line-between-head-rows {
    border-bottom: groove #aec7d1;
  }
</style>
