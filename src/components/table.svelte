<script>
</script>

<table class="responsive-table">
    <thead>
        <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data 1.1</td>
            <td>Data 1.2</td>
            <td>Data 1.3</td>
        </tr>
        <tr>
            <td>Data 2.1</td>
            <td>Data 2.2</td>
            <td>Data 2.3</td>
        </tr>
        <tr>
            <td>Data 3.1</td>
            <td>Data 3.2</td>
            <td>Data 3.3</td>
        </tr>
    </tbody>
</table>


<style>
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
    -webkit-user-select: none;  /* Safari */
    -moz-user-select: none;     /* Firefox */
    -ms-user-select: none;      /* IE/Edge */
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
