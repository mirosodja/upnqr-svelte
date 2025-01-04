<script>
  import "../app.postcss";
  import "./styles.css";

  import MainNavigation from "../components/MainNavigation.svelte";
</script>

<div class="app">
  <MainNavigation />

  <main>
    <slot />
  </main>

  <footer>
    <p>Copyright @miro.sodja 2023</p>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 10px 30px;
    box-sizing: border-box;
  }

  footer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }

  @media (min-width: 480px) {
    footer {
      padding: 12px 0;
    }
  }
</style>
