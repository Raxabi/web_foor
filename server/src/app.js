// Modules import
import express from "express";
import { urlencoded } from "express";
import path from "path";
import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import winston from "winston"
import "dotenv/config";

// Import Config Files
import "./connection/connection";
import router from "./routes/index.routes";

// winston logger config

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    defaultMeta: { service : "user-service" },
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error"}),
        new winston.transports.File({ filename: "combined.log" })
    ],
});

if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
};

const app = express();

// Configuracion de express (archivos estaticos, etc...)

app.use(express.static(path.join(__dirname, "public")));
app.use(urlencoded({ extended: true }));
app.use(router);

// Configuracion del gestor de plantillas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views/pages");

export default app;