import { Router } from "express";
import multer from "multer";
import productSchm from "../models/productSchm";
import role from "../models/roleSchm";
import usersSchm from "../models/usersSchm";

const router = Router();
const upload = multer({dest: "upload/"})

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
    let errorProducts = [];
    const productNameQuery = await productSchm.find({
        "name": productData.name
    });

    // Si el producto ya existe por nombre, se deniga el nuevo producto, por que ya existe
    if (productData.name === productNameQuery) {
        errorProducts.push({text: `El producto ya existe por que el nombre es el mismo que: ${productData.name}`})
    }

    // Si hay errores se muetran esos errores por pantalla
    if(errorProducts.length > 0) {
        res.render("add-products", {errorProducts});
    } else {
        await productData.save();
        res.redirect("/products");
    }
});

// <=========== User  ===========> //

// user save register

router.post("/register-succesfully", async (req, res) => {
    const userRegisterFetchedToDataBase = usersSchm(req.body);
    const userRegisterFetched = req.body
    const errorClient = [];

    const userNameQuery = await usersSchm.find({"name": userRegisterFetched.name});

    const userEmailQuery = await usersSchm.find({"email": userRegisterFetched.email});

    // Si la contraseña no cumple con los requisitos
    if(userRegisterFetchedToDataBase.password.length <= 0) {
        errorClient.push({text: "La contraseña no puede estar vacia!"});
    } else if(userRegisterFetchedToDataBase.password.length < 8) {
        errorClient.push({text: "La contraseña debe de tener una longitud de 8 caracteres como minimo!"});
    };

    // SI los datos ya existen en la base de datos, se deniega el registro
    if(userRegisterFetchedToDataBase.name === userNameQuery) {
        errorClient.push({text: "El nombre ya esta en uso, elige otro nombre!"})
    } else if(userRegisterFetchedToDataBase.email === userEmailQuery) {
        errorClient.push({text: "El email ingresado ya esta en uso, usa otra cuenta de correo o inicia sesion si la cuenta es tuya"})
    }

    // Si la contraseña y la contraseña repetida no coinciden
    if(userRegisterFetched.repeat_password !== userRegisterFetched.password) {
        errorClient.push({text: "La contraseña repetida no coincide con la original, vuelve a intentarlo"});
    } else if(userRegisterFetched.password !== userRegisterFetched.repeat_password) {
        errorClient.push({text: "La contraseña original no coincide con al contraseña repetida, vuelve a intentarlo"});
    };

   // Si existen errores en el array se devuelven estos errores
   console.log(errorClient);
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

// user save login

router.post("/login-succesfully", async (req, res) => {
    const userLoginData = usersSchm(req.body);

    let loginError = [];

    const userLoggedData = await usersSchm.findOne({
        "name": userLoginData.name,
        "password": userLoginData.password,
        "email": userLoginData.email
    });
    
    if(userLoginData !== userLoggedData) {
        loginError.push({error: "Los datos introducidos no estan registrados en la web! El usuario no esta creado"});
    };

    console.log(loginError);
    console.log(userLoggedData);
    if (loginError.length > 0) {
        res.render("login", { loginError });
    } else {
        setTimeout(_ => {
            res.redirect("/");
        }, 1777);
    };
});

// User profile

router.get("/user/:_id", (req,res) => {
    res.render(req.param._id);
});
export default router;