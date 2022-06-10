import http from "http";
import Call from "./call.js";

export class Halley {
    constructor() {

    }

    /**
     * Ready method is the function that start your application when your api going to be ready
     * 
     * An example is something like this:
     * 
     * 
     * 
     * 
     * @param {Number} port The port is needed to indicate the server where to need listen reqeusts
     * @param {} callback 
     */

    ready(port, callback) {
        new Promise((resolve, reject) => {
            resolve(
                http.createServer().on().listen(port),
                console.log(message)
            );
            reject()
        })
    }
}