import { Router } from "express";
import productSchm from "../models/productSchm";
import role from "../models/roleSchm";
import usersSchm from "../models/usersSchm";

const router = Router();

// Ruta inicial

router.get("/", (req, res) => {
    res.render("index");
});

// register

router.get("/register", (req, res) => {
    res.render("login-register");
});

// login

router.get("/login", (req,res) => {
    res.render("login");
});

router.get("/services", (req, res) => {
    res.render("services");
});

// <=========== Products ===========> //

// all products

router.get("/products", async (req, res) => {
    const productsToDisplay = await productSchm.find({});
    res.render("index-products", { productsToDisplay });
});

// each product

router.get("/products/:name", async (req, res) => {
    const findProduct = await productSchm.find({
        "name": req.params.name
    });
});

// add a product, get type

router.get("/addproducts", async(req, res) => {
    res.render("add-products");
});

// save product

router.post("/products/saveproducts", async (req, res) => {
    const productData = productSchm(req.body);
    console.log(req.file)
    let errorProducts = [];
    const productNameQuery = await productSchm.find({
        "name": productData.name
    });

    // Si el producto ya existe por nombre, se deniga el nuevo producto, por que ya existe
    if (productData.name === productNameQuery) {
        errorProducts.push({text: `El producto ya existe por que el nombre es el mismo que: ${productData.name}`})
    };

    // Si hay errores se muetran esos errores por pantalla
    if(errorProducts.length > 0) {
        res.render("add-products", {errorProducts});
    } else {
        await productData.save();
        res.redirect("/products");
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
        },
        {
            "_id": 0,
            "name": 1
        }
    );
    
    // Consulta en la base de datos si el email ya esta en uso
    const userEmailQuery = await usersSchm.findOne(
        {
            "email": userRegisterFetched.email
        },
        {
            "_id": 0,
            "email": 1
        }
    );

    // Si la contraseña no cumple con los requisitos
    if(userRegisterFetchedToDataBase.password.length <= 0) {
        errorClient.push({text: "La contraseña no puede estar vacia!"});
    } else if(userRegisterFetchedToDataBase.password.length < 8) {
        errorClient.push({text: "La contraseña debe de tener una longitud de 8 caracteres como minimo!"});
    };

    // Convertimos los datos del req.body a json para que puedans er validados

    const user_Register_Name_To_JSON = JSON.stringify(userRegisterFetched.name);
    const user_Register_Email_To_JSON = JSON.stringify(userRegisterFetched.email);
    const user_Email_Query_To_JSON = JSON.stringify(userEmailQuery);
    const user_Name_Query_To_JSON = JSON.stringify(userNameQuery);

    // SI los datos ya existen en la base de datos, se deniega el registro
    if(user_Register_Name_To_JSON === user_Name_Query_To_JSON) {
        errorClient.push({text: "El nombre ya esta en uso, elige otro nombre!"});
    } else if(user_Register_Email_To_JSON === user_Email_Query_To_JSON) {
        errorClient.push({text: "El email ingresado ya esta en uso, usa otra cuenta de correo o inicia sesion si la cuenta es tuya"});
    };

    // Si la contraseña y la contraseña repetida no coinciden
    if(userRegisterFetched.repeat_password !== userRegisterFetched.password) {
        errorClient.push({text: "La contraseña repetida no coincide con la original, vuelve a intentarlo"});
    } else if(userRegisterFetched.password !== userRegisterFetched.repeat_password) {
        errorClient.push({text: "La contraseña original no coincide con al contraseña repetida, vuelve a intentarlo"});
    };

    console.log(user_Email_Query_To_JSON);

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
            res.redirect(req.params._id);
        }, 1777);
    };
});

// User profile

router.get("/user/:_id", async (req,res) => {
    
});

export default router;