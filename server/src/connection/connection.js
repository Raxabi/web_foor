import mongoose from "mongoose";

const forraje_host = process.env.FORRAJE_HOST
const forraje_database = process.env.FORRAJE_DATABASE
const mongo_URI = `mongodb://${forraje_host}/${forraje_database}`;

async function mongoConnection() {
    await mongoose.connect(mongo_URI);
    console.log("Connected to database");
}

try {
    mongoConnection();
} catch (error) {
    console.log("Something was bad attemping connectto database :( \n:", error);
}