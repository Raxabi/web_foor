import { connect } from "mongoose";

async function mongoConnection(host, database) {
    await connect(`mongodb://${host}/${database}`);
    console.log("Connected to database");
};

// * Ahora intentamos ejecutar esa funcion
// * Si la funcion no se ejecuta, se devuelve el log/mensage/codigo de error
try {
    mongoConnection(process.env.FORRAJE_HOST, process.env.FORRAJE_DATABASE);
} catch (error) {
    console.log(
        "Something was bad attemping connect to database :( \nFor more information lookup the error: \n" , error
    );
};