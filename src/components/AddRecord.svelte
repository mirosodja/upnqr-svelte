<script>
    import { Button, Modal } from "flowbite-svelte";
    export let clickToOpenAddRecord = false;
</script>

<Modal title="Dodajanje zapisa" bind:open={clickToOpenAddRecord} autoclose>
    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
        Vnesite podatke za nov zapis.
    </p>
    <!-- create input fields here for adding new record: Plačnik, Skupina, Znesek, Koda
    namena, Namen plačila, TRR, Referenca, Prejemnik -->
    <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="placnik">
            Plačnik
        </label>
        <input
            type="text"
            id="placnik"
            name="placnik"
            placeholder="Npr.: Ime Priimek, Neka ulica 10, 1234 Kraj"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
    </div>
    <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="skupina">
            Skupina
        </label>
        <input
            type="text"
            id="skupina"
            name="skupina"
            placeholder="Npr.: Skupina A"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
    </div>
    <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="znesek">
            Znesek
        </label>
        <input
            type="text"
            id="znesek"
            name="znesek"
            placeholder="Npr.: 100,00"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
    </div>
    <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="kodaNamena">
            Koda namena
        </label>
        <input
            type="text"
            id="kodaNamena"
            name="kodaNamena"
            placeholder="Npr.: OTHR"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
    </div>
    <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="namenPlacila">
            Namen plačila
        </label>
        <input
            type="text"
            id="namenPlacila"
            name="namenPlacila"
            placeholder="Npr.: Plačilo storitev"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
    </div>
    <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="rokPlacila">
            Rok plačila
        </label>
        <input
            type="text"
            id="rokPlacila"
            name="rokPlacila"
            placeholder="Npr.: 13.12.2009"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
    </div>
    <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="trr">
            TRR
        </label>
        <input
            type="text"
            id="trr"
            name="trr"
            placeholder="Npr.: SI56 1234 5678 9123 456"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
    </div>
    <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="referenca">
            Referenca
        </label>
        <input
            type="text"
            id="referenca"
            name="referenca"
            placeholder="Npr.: SI00 123456"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
    </div>
    <div class="mt-4">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="prejemnik">
            Prejemnik
        </label>
        <input
            type="text"
            id="prejemnik"
            name="prejemnik"
            placeholder="Npr.: Podjetje d.o.o., Podjetniška ulica 10, 1234 Kraj"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
    </div>
    <div class="mt-4 flex items-center justify-center">
        <Button color="primary" size="sm">Shrani</Button>
    </div>
</Modal>
