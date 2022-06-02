import { Schema, model } from "mongoose";

const user = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        required: true
    },
    
    email:{
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    date: {
        type: String,
        required: true
    },
    userAddress: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    nacionality: {
        type: String,
        uppercase: true,
        required: true
    },
    userPhoneNumber: {
        type: String,
        required: true,
        trim: true
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("user", user);