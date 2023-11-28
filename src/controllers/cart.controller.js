import Cart from "../dao/classes/cart.dao.js"
import Product from "../dao/classes/product.dao.js"

const productService = new Product()
const cartsService = new Cart()

export const deleteCart = async (req, res) => {
    let cid = req.params.cid
    const carrito = await cartsService.getCartById(cid)
    if (!carrito) {
        return res.send({ message: "carrito no encontrado" })
    }
    carrito.products = []
    let result = await carrito.save()
    res.send({ result: "success", payload: result })
}

export const deleteProductInCart = async (req, res) => {
    let { cid, pid } = req.params
    const carrito = await cartsService.getCartById(cid)
    if (!carrito) return res.send({ message: "carrito no encontrado" })

    try {
        const producto = carrito.products.findIndex(producto => producto.product.equals(pid))
        if (producto === -1) return res.send({ message: "producto no encontrado" })
        carrito.products.splice(producto, 1)
        let result = await carrito.save()
        res.send({ result: "success", payload: result })
    } catch (error) {
        console.log(error)
    }
}

export const updateProductInCart = async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let cantidadNueva = req.body.quantity

    const carrito = await cartsService.getCartById(cid)
    if (!carrito) return res.send({ message: "carrito no encontrado" })

    try {
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
}

export const updateCart = async (req, res) => {
    let cid = req.params.cid
    const carrito = await cartsService.getCartById(cid)
    if (!carrito) return res.send({ message: "carrito no encontrado" })

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
}

export const postProductInCart = async (req,res) => {
    let { cid, pid } = req.params

    const carrito = await cartsService.getCartById(cid)
    if (!carrito) return res.send({ message: "carrito no encontrado" })

    const producto = await productService.getProductById(pid)
    if (!producto) return res.send({ message: "producto no encontrado" })
    
    try {
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
}

export const postCart = async (req,res) =>{
        let result = await cartsService.createCart()
        res.send({ result: "success", payload: result })
}

export const getAllCarts = async (req,res) => {
    let result = await cartsService.getAllCarts()
    res.send({ result: "success", payload: result })
}