import User from "../dao/classes/user.dao.js"
import Cart from "../dao/classes/cart.dao.js"
import jwt from "jsonwebtoken"

const usersService = new User()
const cartsService = new Cart()

export const autenticar = async (req,res) =>{
    const { token } = req.cookies
    if (!token) {
        return res.json({ message: "NO EXISTE USUARIO AUTENTICADO" })
    }
    jwt.verify(token, "CODER_TOKEN", async (err, user) => {
        if (err) return res.status(403).json({ message: "Token invalido" })
        const userFound = await usersService.getById(user.id)
        const cartFound = await cartsService.getCartById(userFound.cart).populate("products.product")

        res.render("profile.hbs", {
            first_name: userFound.first_name,
            last_name: userFound.last_name,
            email: userFound.email,
            age: userFound.age,
            cart: cartFound.products,
            role: userFound.role,
        })

    })
}