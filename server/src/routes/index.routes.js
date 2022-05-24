import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import multer from "multer";

// Import Files
import productSchm from "../models/productSchm";
import usersSchm from "../models/usersSchm";

const router = Router();
const upload = multer({
    dest: "data/images/"
});

// Initial route

router.get("/", (req, res) => {
    res.render("index");
    console.log("Cookies:", req.cookies);
    console.log("Signed Cookies:", req.signedCookies);
});

// Iniciar sesion con Google

// register

router.get("/register", (req, res) => {
    res.render("login-register");
});

// login, render a page to sing in / log in with google

router.get("/login/federated/google", passport.authenticate('google'));

// services pages, render a page

router.get("/services", (req, res) => {
    res.render("services");
});

// <=========== Products ===========> //

// all products

router.get("/products", async (req, res) => {
    const productsToDisplay = await productSchm.find({});
    res.render("index-products", { productsToDisplay });
});

// each product, render a page per each product

/*
    NOTA IMPORTANTE DE RECORDATORIO osbre la siguiente ruta (empezando en lai linea 60 y acabando en la 65)
    
    la ruta dinamica :name hace referencia a una variable del mismo nombre
    por lo que creamos dicha variable (constante en este caso)
    que haga una consulta a la base de datos
    donde el valor del campo URLName sea la peticion que realizado el cliente (req.params.name)
*/
router.get("/products/:name", async (req, res) => {
    const name = await productSchm.find({
        "URLName": req.params.name
    });
    res.render("product", { name });
});

// add a product, render a page

router.get("/addproducts", (req, res) => {
    res.render("add-products");
});

// save product, save data

router.post("/products/saveproducts", upload.single("image"), async (req, res) => {
    const productData = productSchm(req.body);

    console.log(productData.image)

    let errorProducts = [];

    let productNameQuery = await productSchm.find({
        "name": productData.name
    }, {
        "_id": 0,
        "name": 1
    });

    // Recorremos el array que contiene el objeto de la consulta buscando el nombre
    // ese nombre sera el parametro key, por lo que igualaremos el nombre al parametro
    // para que tenga su valor
    productNameQuery.map(key => {
        productNameQuery = key;
    });
    
    Object.keys(productData).map(() => {
        productData.URLName = productData.URLName.replace(/ /g,'');
    });

    // Si el producto ya existe por nombre, se deniga el nuevo producto, por que ya existe
    if (productData.name === productNameQuery.name) {
        errorProducts.push({text: `El producto ya existe por que el nombre es el mismo que el del producto: ${productData.name}`});
        console.log("El producto ya existe");
    };

    if (productData.price < 0) {
        errorProducts.push({text: "El producto no puede tener un valor menor a 0, esto podria ocasionar fallos en la base de datos"});
        console.log("La cantidad del precio no puede estar or debajo de 0");
    };

    // Si los datos estan vacios, se devolvera un error

    // Si hay errores se muetran esos errores por pantalla
    if (errorProducts.length > 0) {
        res.render("add-products", {errorProducts});
    } else {
        await productData.save();
        console.log("new product saved:", productData.name);
        setTimeout(_ => {
            res.redirect("/products");
        }, 1500);
    };
});

// <=========== User Register ===========> //

router.post("/register-succesfully", async (req, res) => {
    const userRegisterFetchedToDataBase = usersSchm(req.body); // its dont parse the "repeat password" field to database
    const userRegisterFetched = req.body // its dont parse the "repeat password" but its used as a comparation with the first password field

    let errorClient = [];

    // Consulta en la base de datos si un nombre existe
    const userNameQuery = await usersSchm.findOne(
    {
        "name": userRegisterFetched.name
    }, {
        "_id": 0,
        "name": 1
    });
    
    // Consulta en la base de datos si el email ya esta en uso
    const userEmailQuery = await usersSchm.findOne(
    {
        "email": userRegisterFetched.email
    }, {
        "_id": 0,
        "email": 1
    });

    // <=========== Password Validation before be saved on MongoDB ===========> //
    // Si la contraseña no cumple con los requisitos
    if (userRegisterFetchedToDataBase.password.length <= 0) {
        errorClient.push({text: "La contraseña no puede estar vacia!"});
    } else if (userRegisterFetchedToDataBase.password.length < 8) {
        errorClient.push({text: "La contraseña debe de tener una longitud de 8 caracteres como minimo!"});
    };

    // <=========== Data to JSON conversion ===========> //
    // Convertimos los datos del objeto req.body a json para que los datos puedan ser validados
    /*
        NOTA IMPORTANTE:
        Este metodo es provisional, ya que posteriormente se validaRa directamente el valor del objeto
    */
    const user_Register_Name_To_JSON = JSON.stringify(userRegisterFetched.name);
    const user_Register_Email_To_JSON = JSON.stringify(userRegisterFetched.email);
    const user_Email_Query_To_JSON = JSON.stringify(userEmailQuery);
    const user_Name_Query_To_JSON = JSON.stringify(userNameQuery);

    // SI los datos ya existen en la base de datos, se deniega el registro
    if (user_Register_Name_To_JSON === user_Name_Query_To_JSON) {
        errorClient.push({text: "El nombre ya esta en uso, elige otro nombre!"});
    } else if (user_Register_Email_To_JSON === user_Email_Query_To_JSON) {
        errorClient.push({text: "El email ingresado ya esta en uso, usa otra cuenta de correo o inicia sesion si la cuenta es tuya"});
    };

    // Si la contraseña y la contraseña repetida no coinciden
    if (userRegisterFetched.repeat_password !== userRegisterFetched.password) {
        errorClient.push({text: "La contraseña repetida no coincide con la original, vuelve a intentarlo"});
    } else if (userRegisterFetched.password !== userRegisterFetched.repeat_password) {
        errorClient.push({text: "La contraseña original no coincide con al contraseña repetida, vuelve a intentarlo"});
    };

    const hashedPassword = bcrypt.hashSync(userRegisterFetchedToDataBase.password, 777);

    // Cambiamos el valor de la propiedad password en el objeto req.body
    Object.keys(userRegisterFetchedToDataBase).map(() => {
        userRegisterFetchedToDataBase.password = hashedPassword
    });

    // Si existen errores en el array se devuelven estos errores
    if(errorClient.length > 0) {
        res.render("login-register", { errorClient });
    } else {
        await userRegisterFetchedToDataBase.save();
        console.log("New user Saved");
        setTimeout(_ => {
            res.redirect("/");
        }, 1500);
    };
});

// <=========== User Login ===========> //

router.post("/login-succesfully", async (req, res) => {
    const userLoginData = req.body;

    let loginError = [];

    // Obtenemos el id para redireccionar a la pagina del mismo
    const userID = await usersSchm.findOne(
        {
            "name": userLoginData.name
        },
        {
            "_id": 1
        }
    );

    // validamos por el nombre, contraseña y email
    const userAlreadyRegisteredData = await usersSchm.findOne(
        {
            "name": userLoginData.name,
            "password": userLoginData.password,
            "email": userLoginData.email
        },
        {
            _id: 0,
            name: 1,
            password: 1,
            email: 1,
        }
    );

    // Convertimos los objetos a objetos json para poder compararlos
    
    const user_Login_Data = JSON.stringify(userLoginData);
    const user_Already_Registered_Data_To_Json = JSON.stringify(userAlreadyRegisteredData);
    
    if(user_Login_Data !== user_Already_Registered_Data_To_Json) {
        loginError.push({error: "Los datos introducidos no son correctos o no estan registrados en la web, revisa de nuevo!"});
    };
    if (loginError.length > 0) {
        res.render("login", { loginError });
    } else {
        setTimeout(_ => {
            res.redirect("/user/:_id");
        }, 1777);
    };
});

// User profile

/* router.get("/user/:_id", async (req, res) => {
    let userID = await usersSchm.findOne({});

    userID = req.params._;

    res.render("")
}); */

export default router;