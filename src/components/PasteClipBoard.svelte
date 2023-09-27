<script>
  import { Textarea } from "flowbite-svelte";
  import Button from "../shared/Button.svelte";

  /**
   * @type {HTMLTextAreaElement}
   */
  let textarea;

  const info = () => {
    alert("info");
  };

  //TODO: naredil bom textarea v katero bo prilepil podatke nato pa kliknil gumb in se bodo podatki shranili v bazov podatkov
</script>

  <textarea
    id="clipboard"
    rows="1"
    class="noResize"
    placeholder="Prilepi podatke tu, nato klik na gumb 'Vstavi podatke'. Dvoklik za info o podatkih"
    on:dblclick={info}
  />
  <Button idButton="paste" title="Vstavi podatke">Vstavi podatke</Button>

<style>
  .noResize {
    width: 70%;
    resize: none;
    margin: 10px;
  }
</style>
