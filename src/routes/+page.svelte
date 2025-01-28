<script lang="ts">
  import { titleOfPage } from "$lib/stores";
  import OrdersTable from "$lib/components/OrdersTable.svelte";

$:  titleOfPage.set("Tabela nalogov");

</script>
<OrdersTable />
