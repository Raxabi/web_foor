import productSchm from "../models/productSchm";
import bcrypt from "bcrypt";

/* <=========== Rutas Get ===========> */

// la ruta "eachProduct" apunta hacia /product/:name, se realiza una busqueda del nombre del producto por su URLName, ya que en la URL del navegador
// se buscara al produdcto por esta llave del objeto
export const renderEachProduct = async (req, res) => {
    const name = await productSchm.find({
        "URLName": req.params.name
    });
    res.render("single_Product", { name });
};

export const renderNewProduct = (req, res) => {
    res.render("add_Products");
}

export const renderProducts = async (req, res) => {
    const productsToDisplay = await productSchm.find({});
    res.render("index_products", { productsToDisplay });
}

/* <=========== Rutas Post ===========> */

/*  Nuevo producto  */

export const newProduct = async (req, res) => {
    const productData = productSchm(req.body);

    let errorProducts = [];

    const productNameQuery = await productSchm.find({
        "name": productData.name
    }, {
        "_id": 0,
        "name": 1
    });

    const productURLQuery = await productSchm.find({
        "URLName": productData.URLName
    }, {
        "_id": 0,
        "URLName": 1
    });

    // Recorremos el array que nos devuelve la consulta a la base de datos, y los convertimos a un objeto
    // esto por que el parametro key, es el objeto ya independiente del array, asi nuestra consulta
    // ahora es el objeto que estaba contenido en el array
    productNameQuery.map(key => {
        productNameQuery = key;
    });
    
    // Convertimos el valor de URLName a minusculas y seguidamente volvemos a cambiar el valor del URLName haciendo que los huecos en blanco
    // queden reemplazados por una barrabaja en su lugar
    Object.keys(productData).map(() => {
        productData.URLName = productData.URLName.toLowerCase();
        productData.URLName = productData.URLName.replace(/ /g,'_');
    });

    // Si el producto ya existe por nombre, se deniga el nuevo producto, por que ya existe
    if (productData.name === productNameQuery.name) {
        errorProducts.push({text: `El producto ya existe por que el nombre es el mismo que el del producto: <a href="">${productData.name}</a>`});
        console.log("El producto ya existe");
    };

    // Si el precio del producto es menor de 0 se deniega la creacion del producto, en ocasiones puede que los productos esten a 0 por algun 
    if (productData.price < 0) {
        errorProducts.push({text: "El producto no puede tener un valor menor a 0, esto podria ocasionar fallos en la base de datos"});
    };

    // Si los datos estan vacios, se devolvera un error

    if (!productData) {
        errorProducts.push({text: "Los campos no pueden estar vacios, ¡Debe de existir un producto!"})
    }

    // Si hay errores se muestran esos errores por pantalla
    if (errorProducts.length > 0) {
        res.render("add_Products", {errorProducts, productURLQuery});
    } else {
        await productData.save();
        console.log("new product saved:", productData.name);
        setTimeout(_ => {
            res.redirect("/products");
        }, 1500);
    };
}