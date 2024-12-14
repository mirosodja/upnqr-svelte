<script>
    import { createForm } from "svelte-forms-lib";
    import * as yup from "yup";
    import { Button } from "flowbite-svelte";

    const { form, errors, handleChange, handleSubmit } = createForm({
        initialValues: {
            placnik: "",
            skupina: "",
            znesek: "",
            kodaNamena: "",
            namenPlacila: "",
            rokPlacila: "",
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
            kodaNamena: yup
                .string()
                .matches(
                    /^[A-Z]{4}$/,
                    "Koda namena je obvezen podatek, natančno 4 znaki, velike črke, samo angleška abeceda.",
                ),
            namenPlacila: yup
                .string()
                .max(
                    42,
                    "Namen plačila je obvezen podatek, brez vodilnih ali sledečih presledkov.",
                ),
            rokPlacila: yup
                .string()
                .required(
                    "Rok plačila je neobvezen podatek. Format »DD.MM.LLLL« ali prazno.",
                ),
            trr: yup.string().required("TRR je obvezen podatek."),
            referenca: yup.string().required("Referenca je obvezen podatek."),
            prejemnik: yup.string().required("Prejemnik je obvezen podatek."),
        }),
        onSubmit: (values) => {
            console.log("Shrani is clicked");
            alert(JSON.stringify(values));
        },
    });
</script>

<p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
    Vnesite podatke za nov zapis.
</p>
<!-- create input fields here for adding new record: Plačnik, Skupina, Znesek, Koda
namena, Namen plačila, TRR, Referenca, Prejemnik -->
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
            bind:value={$form.placnik}
            on:input={handleChange}
            on:blur={handleChange}
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
            bind:value={$form.skupina}
            on:input={handleChange}
            on:blur={handleChange}
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
            bind:value={$form.znesek}
            on:input={handleChange}
            on:blur={handleChange}
            id="znesek"
            name="znesek"
            placeholder="Npr.: 100,00"
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
            for="kodaNamena"
        >
            Koda namena
        </label>
        <input
            type="text"
            id="kodaNamena"
            name="kodaNamena"
            placeholder="Npr.: OTHR"
            bind:value={$form.kodaNamena}
            on:input={handleChange}
            on:blur={handleChange}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
        {#if $errors.kodaNamena}
            <p class="text-red-500 text-xs italic mt-1">
                {$errors.kodaNamena}
            </p>
        {/if}
    </div>
    <div class="mt-4">
        <label placeholder="Npr.: Plačilo storitev" for="namenPlacila">
            Namen plačila
        </label>
        <input
            type="text"
            id="namenPlacila"
            name="namenPlacila"
            placeholder="Npr.: Plačilo storitev"
            bind:value={$form.namenPlacila}
            on:input={handleChange}
            on:blur={handleChange}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
        {#if $errors.namenPlacila}
            <p class="text-red-500 text-xs italic mt-1">
                {$errors.namenPlacila}
            </p>
        {/if}
    </div>
    <div class="mt-4">
        <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            for="rokPlacila"
        >
            Rok plačila
        </label>
        <input
            type="text"
            id="rokPlacila"
            name="rokPlacila"
            placeholder="Npr.: SI56 1234 5678 9123 456"
            bind:value={$form.trr}
            on:input={handleChange}
            on:blur={handleChange}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
        {#if $errors.rokPlacila}
            <p class="text-red-500 text-xs italic mt-1">
                {$errors.rokPlacila}
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
            placeholder="Npr.: SI56 1234 5678 9123 456"
            bind:value={$form.trr}
            on:input={handleChange}
            on:blur={handleChange}
            id="trr"
            name="trr"
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
        >
        </label>
        <input
            type="text"
            id="referenca"
            name="referenca"
            placeholder="Npr.: SI00 123456"
            bind:value={$form.referenca}
            on:input={handleChange}
            on:blur={handleChange}
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
            bind:value={$form.prejemnik}
            on:input={handleChange}
            on:blur={handleChange}
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
        />
        {#if $errors.prejemnik}
            <p class="text-red-500 text-xs italic mt-1">
                {$errors.prejemnik}
            </p>
        {/if}
    </div>
    <div class="mt-4 flex items-center justify-center">
        <Button type="submit" color="primary">Shrani</Button>
    </div>
</form>
