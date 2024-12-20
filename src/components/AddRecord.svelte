<script>
    // form validation: https://joyofcode.xyz/working-with-forms-in-sveltekit#form-validation-in-sveltekit
    // form validator YUP:
    // https://github.com/jquense/yup
    // https://github.com/tjinauyeung/svelte-forms-lib?tab=readme-ov-file IN https://svelte-forms-lib-sapper-docs.vercel.app/field

    import { createForm } from "svelte-forms-lib";
    import * as yup from "yup";
    import { Button, Modal, Alert } from "flowbite-svelte";
    import { addOrder, updateOrder, readOrder } from "$lib/db";

    export let clickToOpenAddRecord = false;
    export let id = 0;

    // /**
    //  * @type {number}
    //  */
    // let id;
    let showInfo = false;
    let infoTitle = "";
    let infoText = "";

    $: isFormEmpty = Object.values($form).every((value) => value === "");

    const { form, errors, isValid, handleChange, handleSubmit } = createForm({
        initialValues: {
            placnik: "",
            skupina: "",
            znesek: "",
            koda_namena: "",
            namen_placila: "",
            rok_placila: "",
            trr: "",
            referenca: "",
            prejemnik: "",
        },
        validationSchema: yup.object().shape({
            placnik: yup
                .string()
                .matches(
                    /^[^,;]{1,32},[^,;]{0,32},[^,;]{0,32}$/,
                    "Plačnik je obvezen podatek v formatu: Ime Priimek(min.: 1, max.:32 znak), Naslov(max.:32), Pošta(max.:32).",
                ),
            skupina: yup
                .string()
                .max(
                    20,
                    "Skupina je neobvezen podatek, max.: 20 znakov. Namenjeno grupiranju podatkov v tabeli.",
                ),
            znesek: yup
                .string()
                .matches(
                    /^(\d{0,3}\.)?\d{1,3}(,\d{0,2})?$/,
                    "Znesek je obvezen podatek v formatu: 1.100,00",
                ),
            koda_namena: yup
                .string()
                .matches(
                    /^[A-Z]{4}$/,
                    "Koda namena je obvezen podatek, natančno 4 znaki, velike črke, samo angleška abeceda.",
                ),
            namen_placila: yup
                .string()
                .max(
                    42,
                    "Namen plačila je obvezen podatek, brez vodilnih ali sledečih presledkov.",
                ),
            rok_placila: yup
                .string()
                .matches(
                    /^(|\d{2}\.\d{2}\.\d{4})$/,
                    "Rok plačila ni obvezen podatek. Format »DD.MM.LLLL« ali prazno.",
                ),
            trr: yup
                .string()
                .matches(
                    /^[A-Z]{2}\d{2}\s\d{4}\s\d{4}\s\d{4}\s\d{3}$/,
                    "TRR je obvezen podatek v formatu: SI56 1234 5678 9123 456.",
                ),
            referenca: yup
                .string()
                .matches(
                    /(^SI\d{2}\s(?=(?:[^-]*-){0,2}[^-]*$)[0-9-]{0,22}$)|(^RF\d{2}\s[0-9A-Za-z]{0,21}$)/,
                    "Referenca je obvezen podatek v formatu: SI00 123456.",
                ),
            prejemnik: yup
                .string()
                .matches(
                    /[^,;]{1,32},[^,;]{0,32},[^,;]{0,32}/,
                    "Prejemnik je obvezen podatek v formatu: Ime Priimek(min.: 1, max.:32 znak), Naslov(max.:32), Pošta(max.:32).",
                ),
        }),
        onSubmit: (values) => {
            if (id) {
                updateOrder(id, values)
                    .then(() => {
                        infoText = `Zapis z ID-jem ${id} je posodobljen.`;
                        displayInfo();
                    })
                    .catch((error) => console.error(error));
            } else {
                addOrder(values)
                    .then((updatedId) => {
                        id = updatedId;
                        infoText = `Zapis z ID-jem ${id} je dodan.`;
                        displayInfo();
                    })
                    .catch((error) => console.error(error));
            }
        },
    });

    // create function to display info about insert/update record
    const displayInfo = () => {
        showInfo = true;
        setTimeout(() => {
            showInfo = false;
            clickToOpenAddRecord = false;
            form.set({
                placnik: "",
                skupina: "",
                znesek: "",
                koda_namena: "",
                namen_placila: "",
                rok_placila: "",
                trr: "",
                referenca: "",
                prejemnik: "",
            });
        }, 1500);
    };

    // create function to insert example data
    const insertExampleData = () => {
        const exampleData = {
            placnik: "Jože Novak, Novakova ulica 10, 1234 Novaki",
            skupina: "Primer podatkov",
            znesek: "1.005,00",
            koda_namena: "OTHR",
            namen_placila: "Plačilo storitev",
            rok_placila: "24.02.2024",
            trr: "SI56 1234 5678 9123 456",
            referenca: "SI00 123456",
            prejemnik: "Podjetje d.o.o., Podjetniška ulica 10, 1234 Kraj",
        };
        form.set(exampleData);
    };

   $: if (id) {
        infoTitle = "Urejanje zapisa";
        readOrder(id)
            .then((order) => {
                // form.set(order);
                $form = order;
            })
            .catch((error) => {
                console.error(error);
            });
    } else {
        infoTitle = "Dodajanje zapisa";
    }
</script>

<Modal
    title={infoTitle}
    bind:open={clickToOpenAddRecord}
    autoclose={false}
    on:close={() => (id = 0)}
>
    <div class="mt-4 flex items-center justify-between space-x-4">
        <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {#if id}
                Urejanje zapisa z ID-jem {id}. Vnesite podatke za posodobitev
                zapisa.
            {:else}
                Vnesite podatke za nov zapis. Če želiš, lahko vstaviš primer
                podatkov s klikom na gumb "Vstavi primer podatkov".
            {/if}
        </p>
        {#if !id}
            <Button
                type="button"
                color="primary"
                disabled={!isFormEmpty}
                on:click={insertExampleData}>Vstavi primer podatkov</Button
            >
        {/if}
    </div>

    <form on:submit={handleSubmit}>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="placnik"
            >
                Plačnik
            </label>
            <input
                type="text"
                id="placnik"
                name="placnik"
                on:input={handleChange}
                bind:value={$form.placnik}
                placeholder="Npr.: Ime Priimek, Neka ulica 10, 1234 Kraj"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                autocomplete="off"
            />
            {#if $errors.placnik}
                <p class="text-red-500 text-xs italic mt-1">
                    {$errors.placnik}
                </p>
            {/if}
        </div>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="skupina"
            >
                Skupina
            </label>
            <input
                type="text"
                id="skupina"
                name="skupina"
                placeholder="Npr.: Skupina A"
                on:input={handleChange}
                bind:value={$form.skupina}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {#if $errors.skupina}
                <p class="text-red-500 text-xs italic mt-1">
                    {$errors.skupina}
                </p>
            {/if}
        </div>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="znesek"
            >
                Znesek
            </label>
            <input
                id="znesek"
                name="znesek"
                placeholder="Npr.: 100,00"
                on:input={handleChange}
                bind:value={$form.znesek}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {#if $errors.znesek}
                <p class="text-red-500 text-xs italic mt-1">
                    {$errors.znesek}
                </p>
            {/if}
        </div>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="koda_namena"
            >
                Koda namena
            </label>
            <input
                type="text"
                id="koda_namena"
                name="koda_namena"
                placeholder="Npr.: OTHR"
                on:input={handleChange}
                bind:value={$form.koda_namena}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {#if $errors.koda_namena}
                <p class="text-red-500 text-xs italic mt-1">
                    {$errors.koda_namena}
                </p>
            {/if}
        </div>
        <div class="mt-4">
            <label placeholder="Npr.: Plačilo storitev" for="namen_placila">
                Namen plačila
            </label>
            <input
                type="text"
                id="namen_placila"
                name="namen_placila"
                placeholder="Npr.: Plačilo storitev"
                on:input={handleChange}
                bind:value={$form.namen_placila}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {#if $errors.namen_placila}
                <p class="text-red-500 text-xs italic mt-1">
                    {$errors.namen_placila}
                </p>
            {/if}
        </div>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="rok_placila"
            >
                Rok plačila
            </label>
            <input
                type="text"
                id="rok_placila"
                name="rok_placila"
                placeholder="Npr.: 24.02.2024"
                on:input={handleChange}
                bind:value={$form.rok_placila}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {#if $errors.rok_placila}
                <p class="text-red-500 text-xs italic mt-1">
                    {$errors.rok_placila}
                </p>
            {/if}
        </div>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="trr"
            >
                TRR
            </label>
            <input
                id="trr"
                name="trr"
                placeholder="Npr.: SI56 1234 5678 9123 456"
                on:input={handleChange}
                bind:value={$form.trr}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {#if $errors.trr}
                <p class="text-red-500 text-xs italic mt-1">
                    {$errors.trr}
                </p>
            {/if}
        </div>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="referenca"
                >Referenca
            </label>
            <input
                type="text"
                id="referenca"
                name="referenca"
                placeholder="Npr.: SI00 123456"
                on:input={handleChange}
                bind:value={$form.referenca}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {#if $errors.referenca}
                <p class="text-red-500 text-xs italic mt-1">
                    {$errors.referenca}
                </p>
            {/if}
        </div>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="prejemnik"
            >
                Prejemnik
            </label>
            <input
                type="text"
                id="prejemnik"
                name="prejemnik"
                placeholder="Npr.: Podjetje d.o.o., Podjetniška ulica 10, 1234 Kraj"
                on:input={handleChange}
                bind:value={$form.prejemnik}
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {#if $errors.prejemnik}
                <p class="text-red-500 text-xs italic mt-1">
                    {$errors.prejemnik}
                </p>
            {/if}
        </div>
        {#if showInfo}
            <Alert color="blue">
                <span class="font-bold">{infoText}</span>
            </Alert>
        {/if}
        <div class="mt-4 flex items-center justify-center">
            <Button type="submit" color="primary">Shrani</Button>
        </div>
    </form></Modal
>
