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
        maxlength: 20,
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
    avaible: {
        type: Number,
        required: true
        // Importante para saber cuanto productos se pueden llegar a vender
    },
    vendor: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
        versionKey: false
    },
);

export default model("product", product);