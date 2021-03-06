import { Router } from "express";
import passport from "passport";
import multer from "multer";

// Importing routes controllers
import { newProduct, renderEachProduct, renderNewProduct, renderProducts } from "../controllers/products.controller";
import { register, login, renderRegister, renderEachUser } from "../controllers/users.controllers";
import { renderPayPalLogin, renderPayPalPayment, renderPayPalCancelPayment } from "../controllers/paypal.contollers";

const storage = multer.diskStorage({
    destination: "src/public/images/",
    filename: function(req, file, callback) {
        file.originalname = file.originalname.toLowerCase() && file.originalname.replace(/ /g,("-"));
        callback(null, file.originalname + "-" + Date.now() + ".jpg");
    }
});

const upload = multer({ storage: storage });

const router = Router();

// ruta inicial o ruta Raiz / Root

router.get("/", (req, res) => {
    res.render("index");
});

// Página de servicios
router.get("/services", (req, res) => {
    res.render("index_Services");
});

// <=========== Usuarios ===========> //

// Página de inicio de sesión con google
router.get("/login/federated/google", passport.authenticate("google", { scope: ["profile"] }));

// En caso de fallas al momento de iniciar sesión se redirigira a la raiz
router.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        setTimeout(() => {
            res.redirect("/");
        }, 1500);
    }
);

// <=========== Productos ===========> //

// * Todos los prodcutos
router.get("/products", renderProducts);

// * Pagina de cada producto
router.get("/products/:name", renderEachProduct);

// * Pagina para añadir un nuevo producto
router.get("/addproducts", renderNewProduct);

// * Ruta para guardar un nuevo producto
router.post("/products/saveproducts", upload.single("image"), newProduct);


// * Tests
/* 
router.get("/register", renderRegister);

router.post("/register", register);

router.get("/login", renderLogin);

router.post("/login-succesfully", login); */

export default router;

/*
    ! Seccion deprecada y sin uso por el momento
    * ESTA SECCION DE COMENTARIOS SE RECOMIENDA SER IGNORADA, YA QUE POR AHORA NO APORTA NADA, SON
    * ANTIGUAS RUTAS QUE SERAN USADAS MAS ADELANTE

    ! Pagina de registo
    //

    ! User Register
    //

    ! Pagina de inicio de sesion
    //

    ! Inicio de sesion local
    //

    ! Página por cada usuario
    //router.get("/user/:user", renderEachUser);
*/