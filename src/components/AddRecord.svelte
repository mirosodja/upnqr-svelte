<script>
    // form validation: https://joyofcode.xyz/working-with-forms-in-sveltekit#form-validation-in-sveltekit
    // form validator YUP:
    // https://github.com/jquense/yup
    // https://github.com/tjinauyeung/svelte-forms-lib?tab=readme-ov-file IN https://svelte-forms-lib-sapper-docs.vercel.app/field

    import { Button, Modal } from "flowbite-svelte";
    import { createForm } from "svelte-forms-lib";
    import * as yup from "yup";

    export let clickToOpenAddRecord = false;

    const { form, errors, state, handleChange, handleSubmit } = createForm({
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
            placnik: yup.string().matches(/^[^,;]{1,32},[^,;]{0,32},[^,;]{0,32}$/, "Plačnik je obvezen podatek v formatu: Ime Priimek(min.: 1, max.:32 znak), Naslov(max.:32), Pošta(max.:32)"),
            // required("Plačnik je obvezen podatek."),
            skupina: yup.string().required("Skupina je obvezen podatek."),
            znesek: yup.string().required("Znesek je obvezen podatek."),
            kodaNamena: yup
                .string()
                .required("Koda namena je obvezen podatek."),
            namenPlacila: yup
                .string()
                .required("Namen plačila je obvezen podatek."),
            rokPlacila: yup
                .string()
                .required("Rok plačila je obvezen podatek."),
            trr: yup.string().required("TRR je obvezen podatek."),
            referenca: yup.string().required("Referenca je obvezen podatek."),
            prejemnik: yup.string().required("Prejemnik je obvezen podatek."),
        }),
        onSubmit: (values) => {
            console.log("Shrani is clicked");
            alert(JSON.stringify(values));
        },
    });


    // create variables for input fields for adding new record
    // let placnik = "",
    //     skupina,
    //     znesek,
    //     kodaNamena,
    //     namenPlacila,
    //     rokPlacila,
    //     trr,
    //     referenca,
    //     prejemnik;

    // create function to save new record
    const handleAddRecord = () => {
        console.log("handleAddRecord is clicked");
        clickToOpenAddRecord = false;
    };
</script>

<Modal
    title="Dodajanje zapisa"
    bind:open={clickToOpenAddRecord}
    autoclose={false}
>
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
                on:change={handleChange}
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
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
        </div>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="znesek"
            >
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
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
        </div>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="namenPlacila"
            >
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
                placeholder="Npr.: 13.12.2009"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
        </div>
        <div class="mt-4">
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="trr"
            >
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
            <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                for="referenca"
            >
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
                class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
        </div>
        <div class="mt-4 flex items-center justify-center">
            <Button color="primary" on:click={handleAddRecord}>Shrani</Button>
        </div>
    </form>
</Modal>
