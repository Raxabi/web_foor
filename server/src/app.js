// Modules import
import express, { urlencoded } from "express";
import path from "path";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20/lib/strategy";
import winston from "winston";
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";
import { arePermitted } from "./middlewares/authorization"

// Import Config Files
import "./connection/connection";
import router from "./routes/index.routes";

// winston logger config

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.File({ filename: "data/logs/errorLogs/error.log", level: "error" }),
        new winston.transports.File({ filename: "data/logs/fullLogs/combined.log" })
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
};

const app = express();

// Configuracion de express (archivos estaticos, etc...) / Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(urlencoded({ extended: true }));
app.use(router);
app.use(morgan("dev"));
app.use(helmet.referrerPolicy({
    policy: "no-referrer",
}));
app.use(arePermitted);

// Configuracion de inicio de sesion con Google
/* passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIEND_ID,
    clientSecret: process.env.GOOGLE_SECURE_CLIENT_ID,
    callbackURL: "http://www.example.com/auth/google/callback"
}, function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleid: profile.id }, function(err, user) {
        return cb(err, user);
    });
})); */

//! Tareas pendentes hasta el momento
/**
 * TODO: Eliminar la constante userRegisterFetched sin el esquema, se usara mas adelante la contiene el esquema como
 * TODO: parametro aceptando el req.body

 * TODO: Terminar de agregar inicio de sesion con google

 * TODO: Completar REST API PayPal con sus controladores

 * TODO: Terminar de completar algunas validaciones antes de guardar un producto

 * TODO: Poner de forma aleatoria productos existentes en la pagina principal

 * TODO: Eliminar la conversion de objeto a JSON para comparar los datos
 * TODO: del nuevo usuario con el metodo JSON.stringify en los controladores
 */


// Configuracion del gestor de plantillas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views/pages");

export default app;