import { jsPDF } from "jspdf";

const data = [
    {
        "ID": 11,
        "PLAČNIK": "Tavželj Jakob, Srednja vas v Bohinju 2a, 4267 Srednja vas v Bohinju",
        "SKUPINA": "U9-email",
        "ZNESEK": "50,00",
        "KODA NAMENA": "OTHR",
        "NAMEN PLAČILA": "Vadnina 05,06/23-rok.pl.20.6.23",
        "TRR": "SI56 0433 1000 2902 064",
        "REFERENCA": "SI00 23050601",
        "PREJEMNIK": "NK Bohinj, Majhnova 9, 4264 Bohinjska Bistrica"
    },
    {
        "ID": 12,
        "PLAČNIK": "Urbanc Val, Brod 4, 4264 Bohinjska Bistrica",
        "SKUPINA": "U9-email",
        "ZNESEK": "50,00",
        "KODA NAMENA": "OTHR",
        "NAMEN PLAČILA": "Vadnina 05,06/23-rok.pl.20.6.23",
        "TRR": "SI56 0433 1000 2902 064",
        "REFERENCA": "SI00 23050601",
        "PREJEMNIK": "NK Bohinj, Majhnova 9, 4264 Bohinjska Bistrica"
    },
    {
        "ID": 13,
        "PLAČNIK": "Vesel Žan, Triglavska cesta 27, 4264 Bohinjska Bistrica",
        "SKUPINA": "U9-email",
        "ZNESEK": "50,00",
        "KODA NAMENA": "OTHR",
        "NAMEN PLAČILA": "Vadnina 05,06/23-rok.pl.20.6.23",
        "TRR": "SI56 0433 1000 2902 064",
        "REFERENCA": "SI00 23050601",
        "PREJEMNIK": "NK Bohinj, Majhnova 9, 4264 Bohinjska Bistrica"
    },
    {
        "ID": 16,
        "PLAČNIK": "Dulič Aleks, Koprivnik v Bohinju 45J, 4264 Bohinjska Bistrica",
        "SKUPINA": "U9-nič",
        "ZNESEK": "0,00",
        "KODA NAMENA": "OTHR",
        "NAMEN PLAČILA": "Vadnina 05,06/23-rok.pl.20.6.23",
        "TRR": "SI56 0433 1000 2902 064",
        "REFERENCA": "SI00 23050601",
        "PREJEMNIK": "NK Bohinj, Majhnova 9, 4264 Bohinjska Bistrica"
    }
];

// create function to generate pdf from data
export const createPdf = (/** @type {any[]} */data) => {
    const doc = new jsPDF();
    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf");
};

// const createPdf = (/** @type {any[]} */ data) => {
//     // create pdf
//     const pdf = new jsPDF();
//     // set font size
//     pdf.setFontSize(12);
//     // set text
//     pdf.text(20, 20, 'ID');
//     pdf.text(40, 20, 'PLAČNIK');
//     pdf.text(80, 20, 'SKUPINA');
//     pdf.text(120, 20, 'ZNESEK');
//     pdf.text(160, 20, 'KODA NAMENA');
//     pdf.text(200, 20, 'NAMEN PLAČILA');
//     pdf.text(240, 20, 'TRR');
//     pdf.text(280, 20, 'REFERENCA');
//     pdf.text(320, 20, 'PREJEMNIK');
//     // set text position
//     let y = 30;
//     // loop through data
//     data.forEach((item) => {
//         // set text
//         pdf.text(20, y, item.ID.toString());
//         pdf.text(40, y, item.PLAČNIK);
//         pdf.text(80, y, item.SKUPINA);
//         pdf.text(120, y, item.ZNESEK);
//         pdf.text(160, y, item['KODA NAMENA']);
//         pdf.text(200, y, item['NAMEN PLAČILA']);
//         pdf.text(240, y, item.TRR);
//         pdf.text(280, y, item.REFERENCA);
//         pdf.text(320, y, item.PREJEMNIK);
//         // increment y position
//         y += 10;
//     });
//     // save pdf
//     pdf.save('data.pdf');
// }