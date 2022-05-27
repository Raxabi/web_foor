import { Router } from "express";
import passport from "passport";
//import multer from "multer";

// Import controllers
//import { register, login, renderRegister, renderEachUser } from "../controllers/users.controllers";
import { newProduct, renderEachProduct, renderNewProduct, renderProducts } from "../controllers/products.controller";

const router = Router();
/* const upload = multer({
    dest: "data/images/"
}); */

// Initial route

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

// En caso de fallas al momento de iniciar sesión
router.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        setTimeout(() => {
            res.redirect("/");
        }, 1500);
    }
);

// <=========== Productos ===========> //

// Todos los prodcutos
router.get("/products", renderProducts);

// Pagina de cada producto
router.get("/products/:name", renderEachProduct);

// Pagina para añadir un nuevo producto
router.get("/addproducts", renderNewProduct);

// Ruta para guardar un nuevo producto
router.post("/products/saveproducts", newProduct);

export default router;

/*

    ESTA SECCION DE COMENTARIOS SE RECOMIENDA SER IGNORADA, YA QUE POR AHORA NO APORTA NADA
    ANTIGUAS RUTAS O RUTAS QUE SERA USADAS MAS ADELANTE

    // Pagina de registo
    router.get("/register", renderRegister);

    // User Register
    router.post("/register", register);

    // Pagina de inicio de sesion
    router.get("/login", renderLogin)

    // Inicio de sesion local
    router.post("/login-succesfully", login);

    // Página por cada usuario
    router.get("/user/:user", renderEachUser);

*/