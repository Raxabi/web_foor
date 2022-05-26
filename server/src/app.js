// Modules import
import express, { urlencoded } from "express";
import path from "path";
import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import winston from "winston"
import "dotenv/config";
import helmet from "helmet";
import morgan from "morgan";

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

// Configuracion del gestor de plantillas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views/pages");

export default app;