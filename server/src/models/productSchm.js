import { Schema, model } from "mongoose";

const product = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 35
    },
    URLName: {
        type: String,
        required: true,
        maxlength: 10,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    shortDescription: {
        type: String,
        required: true,
        maxlength: 60
    },
    price: {
        type: Number,
        required: true
    },
    vendor: {
        type: String,
        required: true
    }
},
    {
        timestamps: true,
        versionKey: false
    },
);

export default model("product", product);