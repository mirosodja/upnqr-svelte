<script>
  import { titleOfPage } from "$lib/stores.js";
  import OrdersTable from "$lib/components/OrdersTable.svelte";

$:  titleOfPage.set("Tabela nalogov");

</script>
<OrdersTable />
