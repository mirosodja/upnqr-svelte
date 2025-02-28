<script lang="ts">
  import  Modal  from "flowbite-svelte/Modal.svelte";
  export let clickToOpenExplainDataFormat: boolean = false;
</script>

<Modal
  title="Zahtevani format podatkov za uvoz ali izvoz preko odložišča"
  bind:open={clickToOpenExplainDataFormat}
  autoclose
>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    <strong>Namig:</strong> Z gumbom "Dodaj" kreiraj primer zapisa, nato ga skopiraj
    v program za urejanje tabel in ga uporabi kot predlogo za vnos podatkov.
  </p>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Podatke za uvoz morajo ustrezati formatu tabele. Prva vrstica mora vsebovati
    imena stolpcev, ki so obvezni za uvoz (vrstica se ne uvozi). Vrstice, ki
    sledijo, morajo vsebovati podatke, ki ustrezajo imenom stolpcev. Podatke za
    uvoz kopiramo iz programa Excel, Google sheets ali drugega programa za
    urejanje tabel. Podatke za izvoz kopiramo prav tako v program za urejanje
    tabel.
  </p>
  <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Podatki morajo vsebovati naslednje stolpce:
  </p>
  <ul>
    <li>
      <strong>Id</strong> - pozitivno enolično celo število, ki predstavlja identifikator
      zapisa;
    </li>
    <li>
      <strong>Plačnik</strong> - ime in priimek, ulica in hiš.št., št.pošte in pošta
      plačnika. Podatki morajo biti ločeni z vejicami. Max. dolžina (z vejicami)
      98 znakov, posamezno podpolje max. 32 zankov. Primer: "Janez Plačnik, Plačnikova
      ulica 12, 4256 Plačnikova pošta";
    </li>
    <li>
      <strong>Skupina</strong> - največ 20 znakov - neobvezno polje, namenjeno grupiranju
      podatkov s pomočjo filtra;
    </li>
    <li>
      <strong>Znesek</strong> - znesek plačila. Podatek mora biti zapisan v formatu
      z decimalno vejico, tisočice so lahko ločene s piko. Primer: 1.012,34 ali 1012,34;
    </li>
    <li>
      <strong>Koda namena</strong> - koda namena v skladu z šifrantom kod namenov
      plačil. Preverja se: dolžina (natančno 4 znaki), velike črke, samo angleška
      abeceda;
    </li>
    <li>
      <strong>Namen plačila</strong> - opis namena plačila. Max. dolžina je 42 znakov.
      Primer: "Nakup na tržnici";
    </li>
    <li>
      <strong>Rok plačila</strong> - datum plačila. Preverja se: format datuma (dd.mm.yyyy),
      veljaven datum ali prazno polje;
    </li>
    <li>
      <strong>TRR</strong> - transakcijski račun prejemnika. Preverja se: dolžina
      (natančno 19 znakov), prva dva znaka oznaka države, npr.: "SI56 1234 5678 9012
      345";
    </li>
    <li>
      <strong>Referenca</strong> - referenca plačila. Niz "SI" ali "RF" in
      dvomestna številka, presledek in številka, ki ima lahko pomišljaje, v
      skladu s standardom;
      <ul>
        <li>
          <strong>SI</strong> - referenca SI, max. dolžina za presledkom je 22 znakov.
          Primer: "SI00 1234"
        </li>
        <li>
          <strong>RF</strong> - referenca RF, max. dolžina za presledkom je 21 znakov.
          Primer: "RF00 1234 5678 9012 3456"
        </li>
      </ul>
    </li>
    <li>
      <strong>Prejemnik</strong> - ime in priimek, ulica in hiš.št., št.pošte in
      pošta prejemnika. Podatki morajo biti ločeni z vejicami. Max. dolžina (z vejicami)
      98 znakov, posamezno podpolje max. 32 zankov. Primer: "Franc Prejemnik, Prejemnikova
      ulica 12, 4256 Prejemnikova pošta";
    </li>
  </ul>
</Modal>

<style>
  ul {
    margin-left: 1.5rem;
    list-style-type: disc;
  }
</style>
