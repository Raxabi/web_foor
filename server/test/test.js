import { Schema, model } from "mongoose";

const Role = new Schema({
    rol: [
        {
            type: Schema.Types.ObjectId,
            ref: "Role"
        }
    ]
})

export default model("roles", Role)