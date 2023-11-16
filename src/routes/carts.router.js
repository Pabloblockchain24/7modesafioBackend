
import { Router } from "express";
const router = Router()

import cartModel from "../models/cart.model.js"
import productModel from "../models/product.model.js"



// obtengo todos los carritos en endpoint "/api/carts"
router.get("/", async (req, res) => {
    try {
        const carritos = await cartModel.find({})
        res.send({ status: "success", payload: carritos })
    } catch (error) {
        console.log(error)
    }
})

// Creo nuevos carritos vacios en "/api/carts"
router.post("/", async (req, res) => {
    try {
        let result = await cartModel.create({})
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.log(error)
    }
})

// Posteo nuevos productos al carrito en en "/api/carts/:cid/products/:pid"
router.post("/:cid/products/:pid", async (req, res) => {
    let { cid, pid } = req.params
    try {
        const carrito = await cartModel.findById(cid)
        if (!carrito) {
            return res.send({ message: "carrito no encontrado" })
        }
        const producto = await productModel.findById(pid)
        if (!producto) {
            return res.send({ message: "producto no encontrado" })
        }
        const productoEnCarrito = carrito.products.find((prod) => prod.product.equals(producto._id))
        if (!productoEnCarrito) {
            const nuevoProduct = { product: producto._id, quantity: 1 }
            carrito.products.push(nuevoProduct)
        } else {
            productoEnCarrito.quantity++
        }
        let result = await carrito.save();
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.log(error)
    }
})
//edito carrito pasado por params en endpoint "/api/carts/:cid"
router.put("/:cid", async (req, res) => {
    let cid = req.params.cid
    try {
        const carrito = await cartModel.findById(cid)
        if (!carrito) {
            return res.send({ message: "carrito no encontrado" })
        }
        carrito.products = [{
            product: "654a239b02e55dcb17b58278",
            quantity: 1
        },
        {
            product: "654a23a902e55dcb17b5827a",
            quantity: 2
        },
        ]
        let result = await carrito.save()
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.log(error)
    }
})

//edito productos del carrito pasado por params en endpoint "/api/carts/:cid/products/:pid"
router.put("/:cid/products/:pid", async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let cantidadNueva = req.body.quantity
    try {
        const carrito = await cartModel.findById(cid)
        if (!carrito) return res.send({ message: "carrito no encontrado" })
        const producto = carrito.products.findIndex(producto => producto.product.equals(pid))
        if (producto === -1) {
            return res.send({ message: "producto no encontrado" })
        }
        carrito.products[producto].quantity = cantidadNueva
        let result = await carrito.save()
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.log(error)
    }
})

//elimino productos del carrito pasado por params en endpoint "/api/carts/:cid/products/:pid"
router.delete("/:cid/products/:pid", async (req, res) => {
    let { cid, pid } = req.params
    try {
        const carrito = await cartModel.findById(cid)
        if (!carrito) return res.send({ message: "carrito no encontrado" })

        const producto = carrito.products.findIndex(producto => producto.product.equals(pid))
        if (producto === -1) return res.send({ message: "producto no encontrado" })

        carrito.products.splice(producto, 1)
        let result = await carrito.save()
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.log(error)
    }
})

//vacio carrito pasado por params en endpoint "api/carts/:cid"
router.delete("/:cid", async (req, res) => {
    let cid = req.params.cid
    try {
        const carrito = await cartModel.findById(cid)
        if (!carrito) {
            return res.send({ message: "carrito no encontrado" })
        }
        carrito.products = []
        let result = await carrito.save()
        res.send({ result: "success", payload: result })

    } catch (error) {
        console.log(error)
    }
})

export default router