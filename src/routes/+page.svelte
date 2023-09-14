<script>
  import Table from "../components/Table.svelte";
  import Button from "../shared/Button.svelte";
</script>

<svelte:head>
  <title>Tabela nalogov</title>
  <meta name="description" content="Tabela nalogov UPNQR" />
</svelte:head>

<section>
  <Table />
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
