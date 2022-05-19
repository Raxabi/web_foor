const objeto = {
    "llave": "Valor del valor",
    "grifo": "Valor del grifo"
};

for (const data in objeto) {
    //console.log(`Uso del for ... in en JavaScript: '${data}: ${objeto[data]}'`);
    delete objeto[data]
    objeto.llave[data] = "Segundas llaves"
}

console.log("Despues de eliminar la llave 'llave':", objeto);

/* console.log("Keys:", Object.keys(objeto));
console.log("Valores:", Object.values(objeto)); */

//console.log(objeto);