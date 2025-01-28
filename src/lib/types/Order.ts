export type Order = {
    id: number;
    placnik: string;
    skupina: string;
    znesek: string; // znesek je bil prej string ali number?
    koda_namena: string;
    namen_placila: string;
    rok_placila: string;
    trr: string;
    referenca: string;
    prejemnik: string;
}

export interface OrderWithPngString extends Order {
    pngString: string;
}


export interface PngTable {
    id: number;
    pngString: string;
}
