<script>
  import OrdersTable from "../components/OrdersTable.svelte";
</script>

<svelte:head>
  <title>Tabela nalogov</title>
  <meta name="description" content="Tabela nalogov UPNQR" />
</svelte:head>

<section>
  <OrdersTable />
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
