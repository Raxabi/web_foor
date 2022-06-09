import { request } from "express";
import net from "node:net";

request.prototype.getIP = function(version) {
    if (typeof version !== "string") {
        throw TypeError("The argument 'version' must be a string");
    };
    if (!version) {
        throw TypeError("The getIP method require a function!")
    }
    if (version == ""){
        null
    }
}