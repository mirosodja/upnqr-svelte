<script>
  import { titleOfPage } from "$lib/stores.js";
  import OrdersTable from "../components/OrdersTable.svelte";

$:  titleOfPage.set("Tabela nalogov");

// TODO: uredi še izgled strani, ker je A4 list
</script>
<OrdersTable />
