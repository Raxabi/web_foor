/* const objeto = {
    "llave": "Valor del valor",
    "grifo": "Valor del grifo"
};

Object.keys(objeto).map(value => {
    console.log("Primer console.log (", value, ":", objeto[value], ")");
    objeto.llave = "Hola a todos gente de youtube";
    console.log("Console.log despues de la conversion (", value, ":", objeto[value], ")");
}); */

let array = {
    "name": "i5 9700",
};

//console.log(array.flat())



/* array.forEach(key => {
    console.log(key)
}) */

//console.log(array)

class Persona {
    constructor(name) {
        this.name = name
    };

    saludar() {
        console.log(this.name, "dice Hola!")
    };
};

const pedro = new Persona("Pedro");

console.log(pedro.saludar());