import { Schema, model } from "mongoose";

const role = new Schema({
    name: {
        type: String,
        required: true
    }
}, 
    {
        versionKey: false
    }
);

export default ("role", role)