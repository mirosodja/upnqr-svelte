<script>
  import { titleOfPage } from "$lib/stores.js";
  import OrdersTable from "../components/OrdersTable.svelte";

$:  titleOfPage.set("Tabela nalogov");

</script>
<OrdersTable />
