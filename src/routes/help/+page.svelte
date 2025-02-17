<script lang="ts">
  import { titleOfPage } from "$lib/stores";
  $: titleOfPage.set("Pomoč");
</script>

<!-- TODO: uredi še izgled strani, ker je A4 list 
  in napiši: "Hiter začetek"
-->
<div class="text-column">
  <h2>
    Pomoč za uporabo programa "Univerzalni plačilni nalogi - UPN QR program"
  </h2>
  <h3>Hiter začetek:</h3>
  <p>
    Z gumbom "Dodaj" kreiraj primer zapisa, nato ga skopiraj v program za
    urejanje tabel in ga uporabi kot predlogo za vnos podatkov. Te podatke
    ponovno skopiraj nazaj v tabelo nalogov. Izbrane zapise označiš, klikneš
    "UPNQR V PDF" in shraniš naloge.
  </p>
  <h3>Program "Univerzalni plačilni nalogi - UPN QR program"</h3>
  <ul>
    <li>
      je namenjen vnosu podatkov o posameznem nalogu (gumb "Dodaj") ali prenosu
      iz drugega programa preko odložišča. Stuktura podatkov je opisana na
      začetni strani programa, do nje pridemo s klikom na gumb "Info format
      podat.".
    </li>
    <li>
      pripravi pdf datoteke za izpis položnic na printer (povezava "Upnqr v PDF"
      in nato "Shrani") (obvezno preberi razdelek: <strong
        >Tiskanje - važno</strong
      >),
    </li>
    <li>
      pripravo položnic za pošiljanje preko e - maila (naloge zapakira v zip
      datoteko za prenos na računalnik, v zip datoteki so pdf-ji posameznih
      nalogov) (povezava "Upnqr v PDF" in nato "Shrani").
    </li>
  </ul>
  <p>
    Pripravljeno pdf/zip datoteko lahko izpišemo na laserskem tiskalniku na
    obrazec UPN QR formata A4 oziroma pošljemo preko elektronske pošte.
  </p>
  <p>
    Program teče v brskalniku (t.i. SPA - single page application) in podatki
    ostanejo v brskalniku in se ne prenašajo na strežnik.
  </p>
  <h3>O programu</h3>
  <p>
    Program zna izpisati UPN naloge s QR kodo v pdf datoteko, tako, da naloge
    lahko tiskamo iz programa za branje pdf datotek. Do posameznega izpisa
    pridemo tako, da na začetni strai kliknemo gumb "Upnqr"
    <strong>(izbrana mora biti vsaj ena vrstica)</strong>. Ko se odpre nova
    stran lahko prenesemo PDF dokument (gumb "Prenos PDF") ali ZIP datoteko
    (gumb "Prenos PDF ZIP"). PDF dokument je namenjen tiskanju na standardne
    (prednatisnjene) obrazce UPN QR formata A4, ZIP datoteka pa pošiljanju preko
    emaila. V ZIP datoteki so zapakirane PDF datoteke izbranih vrstic (vsaka
    vrstica kot ena datoteka) v tabeli na začetni strani, format zapisa pa je
    tak, da ga ni možno tiskati na standardne obrazce (format je 210mm x 99mm).
  </p>
  <h3>O uporabljeni bazi podatkov</h3>
  <p>
    Baza podatkov je v klientovem (vašem) brskalniku, uporabljen je t.i.
    IndexedDB API (več:
    <a
      href="https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API"
      target="_blank"
      >IndexedDB API).
    </a>
  </p>
  <p>
    Ker so podatki v IndexedDB v vašem brskalniku, to pomeni, da uporabljajte
    vedno isti brskalnik, saj se podatki med brskalniki ne prenašajo. Prav tako
    je potrebno paziti na "www" zapis pred imenom domene "potep.eu".
    "www.potep.eu" in "potep.eu" za IndexedDB ni isti server, IndexedDB pa
    shranjuje glede na ime serverja. V kolikor ne pazite na to, to povzroča
    težave, saj baza kar naenkrat "izgine". Torej pazite, da <strong
      >delate vedno</strong
    >
    ali na
    <strong>"potep.eu/upnqr"</strong> ali na
    <strong>"www.potep.eu/upnqr"</strong> naslovu.
  </p>
  <h3 id="tiskanje">Tiskanje - važno</h3>
  <p>
    <strong
      >Tiskati je možno samo na laserske tiskalnike na standardne obrazce A4 za
      laserske tiskalnike (ne na obrazce, ki so namenjeni igličnim tiskalnikom s
      podajalnikom). V programu, v katerem pregledujete PDF dokument,
      <u style="color: blueviolet"
        >morate imeti pri tiskanju v razdelku velikost papirja izbrano opcijo
        "Dejanska velikost papirja" oziroma v nekaterih programih povečavo
        "100%" .</u
      >
    </strong>
  </p>
  <h3>Sklic - izračun kontrolne številke</h3>
  <p>
    Program izračunava samo kontrolno vsoto za model SI12 in sicer tako, da
    zapisom v izboru prišteva +1. Priporočljivo je dati "govorečo kodo", primer
    LLLLMMDDID (npr.: 2021022801 - max 12 številk) za primer, ko je UPN nalog
    bil tiskan 28. februarja 2021 z id= 01 (202102280 = 2021 - leto + 02 - mesec
    + 28 - dan v mesecu + 01 - id).
  </p>
  <p>
    <strong
      >Za ostale model (npr.: SI00, SI99) program ne izračunava kontrolne vsote
      sklica. Zato je v vsaki vrstici v tabeli na začetni strani potrebno vnesti
      sklic posebej, če želimo, da bodo sklici različni. Ker banka tudi pri
      nekaterih ostalih modelih izračunava kontrolno vsoto, to lahko pomeni, da
      uporabnik ne bo mogel vnesti naloga, če mu niste navedli sklica s pravilno
      kontrolno vsoto.
    </strong>
  </p>
</div>

<style>
  ul {
    list-style-type: disc;
    margin-left: 20px;
  }

  li {
    margin-bottom: 10px;
  }
</style>
