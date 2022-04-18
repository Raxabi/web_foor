import express from "express";
import path from "path";
import multer from "multer";
import "dotenv/config";
import "./connection/connection";
import router from "./routes/index.routes";
import multerConfig from "./multer.config";

const app = express();

// Configuracion de express (archivos estaticos, etc...)

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));
app.use(router);

// multer config

app.use(multer({
    dest: "data/",
}));

// Configuracion del gestor de plantillas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views/pages");

export default app;