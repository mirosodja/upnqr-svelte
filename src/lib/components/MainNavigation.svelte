<script lang="ts">
  import { page } from "$app/stores";
  import {
    groupOrdersStoreIds,
    isLoadingData,
    isInsertingData,
    titleOfPage,
  } from "$lib/stores";
  import { base } from "$app/paths";
  import { Spinner } from "flowbite-svelte";

  $: disabled = !($groupOrdersStoreIds as number[]).length;
</script>

<svelte:head>
  <title>UPN QR->{$titleOfPage}</title>
  <meta name="description" content={$titleOfPage} />
</svelte:head>
{#if $isLoadingData || $isInsertingData}
  <div class="overlay">
    <Spinner color="purple" /> Trenutek, nalagam podatke ...&nbsp;&nbsp;
  </div>
{/if}
<header class:disabled={$isLoadingData || $isInsertingData}>
  <div class="corner">
    <a href="./">
      <h1>Univerzalni plačilni nalogi UPN QR - {$titleOfPage}</h1>
    </a>
  </div>
  <nav>
    <ul>
      <li aria-current={$page.url.pathname === `${base}/` ? "page" : undefined}>
        <a href="{base}/">Tabela nalogov</a>
      </li>
      <li
        aria-current={$page.url.pathname.startsWith(`${base}/upnqr`)
          ? "page"
          : undefined}
      >
        <a href="{base}/upnqr" class:disabled>Upnqr v PDF</a>
      </li>
      <li
        aria-current={$page.url.pathname.startsWith(`${base}/help`)
          ? "page"
          : undefined}
      >
        <a href="{base}/help">Help</a>
      </li>
      <li
        aria-current={$page.url.pathname.startsWith(`${base}/pravnoobvestilo`)
          ? "page"
          : undefined}
      >
        <a href="{base}/pravnoobvestilo">Pravno obvestilo</a>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    display: flex;
    flex-direction: column;
  }

  .corner {
    height: 3em;
    margin: 30px;
    /* align to left */
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: left;
    width: 100%;
    height: 100%;
  }
  .corner a:hover {
    text-decoration: none;
  }

  /* create nav css class to take all width of page with 40px left and right margin*/
  nav {
    display: flex;
    flex-wrap: wrap;
    margin: 0 30px;
    height: 3em;
    text-align: left;
    justify-content: space-between;
    align-items: center;
    background-size: contain;
    /* background: rgba(255, 255, 255, 0.7); */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
    margin: 10px;
  }

  li[aria-current="page"]::before {
    --size: 6px;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color-theme-1);
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  a:hover {
    color: var(--color-theme-1);
  }

  .disabled {
    background: linear-gradient(to bottom, #d1d1d1 5%, #f9f9f9 100%);
    background-color: #d1d1d1;
    color: #a0a0a0;
    pointer-events: none;
  }

  .overlay {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -30%);
    background: rgba(255, 255, 255, 0.8);
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    text-align: center;
    pointer-events: none;
  }
</style>
