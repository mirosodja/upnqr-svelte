 // izracun kontrolne številke po modulu 11

 function calcControlNumber11(referenca: string): string {
    let i = 0;
    let sestevek = 0;
    let ponder = 2;
    let stevka = 0;
    let s: string;
    if (referenca.length <= 12) {
      s = referenca.substring(5, referenca.length);
    } else {
      s = referenca.substring(5, 17);
    }
    let controlSum = null;
    for (i = s.length; i >= 1; i--) {
      stevka = Number(s.substr(i - 1, 1));
      if (0 <= stevka && stevka <= 9 && sestevek >= 0) {
        sestevek = sestevek + ponder * stevka;
        ponder = ponder + 1;
      }
    }
    controlSum = 11 - (sestevek % 11);

    if (controlSum === 11) {
      controlSum = 0;
    }

    if (controlSum === 10) {
      controlSum = 0;
    }
    referenca = 'SI12 ' + insertZeros(s) + controlSum.toString();
    return referenca;
  }

  // vstavi nule, default size=12
  function insertZeros(input: string, size?: number) {
    const zero = (size ? size : 12) - input.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + input;
  }