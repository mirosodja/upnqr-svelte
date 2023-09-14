<script>
  import { data } from "../data/data";
  import Button from "../shared/Button.svelte";
  import { db } from "../data/db";
  import { liveQuery } from "dexie";

  async function addData() {
    console.log("Adding data");
    try {
      const id = await db.orders.add(data[5]);
    } catch (error) {
      console.log(error);
    }
  }

  let ordersArray = liveQuery(() => db.orders.toArray());
</script>

<nav>
  <Button idButton="test">Test</Button>
  <Button onClick={addData} idButton="adddata">Add data</Button>
</nav>

<table class="responsive-table">
  <thead>
    <tr>
      <th>Id</th>
      <th>Plačnik</th>
      <th>Skupina</th>
      <th>Znesek</th>
      <th>Koda namena</th>
      <th>Namen plačila</th>
      <th>TRR</th>
      <th>Referenca</th>
      <th>Prejemnik</th>
    </tr>
  </thead>
  <tbody>
    {#if $ordersArray}
      {#each $ordersArray as row (row.id)}
        <tr>
          <td data-label="Id">{row.id}</td>
          <td data-label="Plačnik">{row.placnik}</td>
          <td data-label="Skupina">{row.skupina}</td>
          <td data-label="Znesek">{row.znesek}</td>
          <td data-label="Koda namena">{row.koda_namena}</td>
          <td data-label="Namen plačila">{row.namen_placila}</td>
          <td data-label="TRR">{row.trr}</td>
          <td data-label="Referenca">{row.referenca}</td>
          <td data-label="Prejemnik">{row.prejemnik}</td>
        </tr>
      {/each}
    {/if}
  </tbody>
</table>

<style>
  nav {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% - 80px);
    padding: 10px;
    text-align: left;
    justify-content: space-around;
    gap: 1em;
    align-items: center;
    background-size: contain;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  /* Default table styles */
  .responsive-table {
    width: 100%;
    border-collapse: collapse;
  }

  .responsive-table th,
  .responsive-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  /* CSS to prevent selection of the first column 
  Do I need style for the first row? 
  */
  .responsive-table th:first-child,
  .responsive-table :first-child {
    user-select: none;
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
  }

  /* Responsive table styles */
  @media (max-width: 600px) {
    /* Adjust the breakpoint as needed */
    .responsive-table,
    .responsive-table thead,
    .responsive-table tbody,
    .responsive-table th,
    .responsive-table td,
    .responsive-table tr {
      display: block;
    }

    .responsive-table thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    .responsive-table tr {
      margin: 0 0 1rem 0;
    }

    .responsive-table td {
      border: none;
      border-bottom: 1px solid #ddd;
      position: relative;
      padding-left: 50%; /* Adjust as needed */
    }

    .responsive-table td::before {
      position: absolute;
      top: 6px;
      left: 6px;
      width: 45%; /* Adjust as needed */
      padding-right: 10px;
      white-space: nowrap;
      content: attr(data-label);
    }
  }
</style>
