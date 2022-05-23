const objeto = {
    "llave": "Valor del valor",
    "grifo": "Valor del grifo"
};

Object.keys(objeto).map(value => {
    console.log("Primer console.log (", value, ":", objeto[value], ")");
    objeto.llave = "Hola a todos gente de youtube";
    console.log("Console.log despues de la conversion (", value, ":", objeto[value], ")");
});