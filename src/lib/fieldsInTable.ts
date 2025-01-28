// definira polja v tabeli
interface Field {
    value: string;
    name: string;
}

export const fieldsInTable: Field[] = [
    { value: 'placnik', name: 'Plačnik' },
    { value: 'skupina', name: 'Skupina' },
    { value: 'znesek', name: 'Znesek' },
    { value: 'koda_namena', name: 'Koda namena' },
    { value: 'namen_placila', name: 'Namen plačila' },
    { value: 'rok_placila', name: 'Rok plačila' },
    { value: 'trr', name: 'TRR' },
    { value: 'referenca', name: 'Referenca' },
    { value: 'prejemnik', name: 'Prejemnik' }
];