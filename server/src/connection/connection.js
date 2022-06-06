import mongoose from "mongoose";

const forraje_host = process.env.FORRAJE_HOST
const forraje_database = process.env.FORRAJE_DATABASE
const mongo_URI = `mongodb://${forraje_host}/${forraje_database}`;

// * Creamos una funcion asincrona que se encarge de conectar a la base de datos
async function mongoConnection() {
    await mongoose.connect(mongo_URI);
    console.log("Connected to database");
};

// * Ahora intentamos ejecutar esa funcion
// * Si la funcion no se ejecuta, se devuelve el log/mensage/codigo de error
try {
    mongoConnection();
} catch (error) {
    console.log("Something was bad attemping connectto database :( \n:", error);
};