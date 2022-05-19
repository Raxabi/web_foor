import mongoose from "mongoose";

const forraje_host = process.env.FORRAJE_HOST
const forraje_database = process.env.FORRAJE_DATABASE
const mongo_URI = `mongodb://${forraje_host}/${forraje_database}`;

try {
    async function mongoConnection() {
        await mongoose.connect(mongo_URI);
        console.log("Connected to database");
    }
    mongoConnection();
} catch (error) {
    console.log(error);
}