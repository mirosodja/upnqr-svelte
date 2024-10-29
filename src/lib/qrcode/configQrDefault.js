
export default {
  size: 770, // velikost QR koda, zaradi zahteve UPN QR standarda 600 dpi, kar sicer znese 770x770
  color: "#000000",
  backgroundColor: "#FFFFFF",
  output: "svg",
  sizeInUnits: "32.6mm", // zahteva UPN QR standarda
  QR: {
    version: 15, // matrika 77x77
    correction: "M",
  },
};