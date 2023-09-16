<script>

  import { page } from "$app/stores";
  // import logo from '$lib/images/svelte-logo.svg';
  // import github from '$lib/images/github.svg';
</script>

<header>
  <div class="corner">
    <a href="./">
      <h1>Univerzalni plačilni nalogi - UPN QR program</h1>
    </a>
  </div>

  <nav>
    <!-- <svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg> -->
    <ul>
      <li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
        <a href="/">Tabela nalogov</a>
      </li>
      <li aria-current={$page.url.pathname === "/upnqr" ? "page" : undefined}>
        <a href="/upnqr">Upnqr v PDF</a>
      </li>
      <li
        aria-current={$page.url.pathname.startsWith("/help")
          ? "page"
          : undefined}
      >
        <a href="/help">Help</a>
      </li>
    </ul>
    <!-- <svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg> -->
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
    width: calc(100% - 80px);
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

  /* svg {
		width: 2em;
		height: 3em;
		display: block;
	} */

  /* path {
		fill: var(--background);
	} */

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
</style>
