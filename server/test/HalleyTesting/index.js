import http from "node:http"
import { Router } from "express"

function Punto2D(x, y) {
    this.x = x
    this.y = y
}

Punto2D.prototype.mover = function(dx, dy){
    this.x += dx
    this.y += dy
}

let p1 = new Punto2D(1, 2)

p1.mover(3, 4)

console.log(p1.x)
console.log(p1.y)

class Punto20D {
    constructor(a, b) {
        this.a = a
        this.b = b
    }

    movimiento(da, db) {
        this.a += da
        this.b += db
    }
}

let p2 = new Punto20D(3, 4)

p2.movimiento(6, 8)

console.log(p2.a)

console.log(p2.b)