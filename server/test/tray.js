const objeto = {
    "llave": "Valor del valor"
};

Object.keys(objeto).forEach(function(value){
    console.log(objeto[value]);
    let newValue = "nuevo valor del valor"
    delete objeto[value];
    objeto[value] = newValue
});

console.log(objeto);