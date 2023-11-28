import User from "../dao/classes/user.dao.js"
import Cart from "../dao/classes/cart.dao.js"
import bcrypt from "bcrypt"
import createAccessToken from "../utils.js"
import jwt from "jsonwebtoken"

const usersService = new User()
const cartsService = new Cart()

export const logout = async (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0)
    })
    res.redirect("/api/users")
    return
}

export const register = async(req,res) =>{
        const { first_name, last_name, email, age, password, role } = req.body
        try {
            const userFound = await usersService.getByEmail(email)
            if (userFound) return res.status(400).json(["El email ya esta registrado"])

            const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            const newUser = await usersService.createUser({ first_name, last_name, email, age, password: hash, role })
            newUser.cart = await cartsService.postCart()
            let resultado = await newUser.save();
            res.json({
                id: newUser._id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                age: newUser.age,
                cart: newUser.cart,
                role: newUser.role
            })
        } catch (error) {
            console.log(error)
        }
}

export const login = async (req,res)=>{
        const { email, password } = req.body
        const userFound = await usersService.getByEmail(email)
        if (!userFound) return res.status(401).json({ message: "Usuario no encontrado" })
    
        const isMatch = await bcrypt.compareSync(password, userFound.password)
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" })
    
        const token = await createAccessToken({ id: userFound._id })
        res.cookie("token", token)
    
        const aux = await cartsService.getCartById(userFound.cart)
        console.log(aux)
        const cartFound = await cartsService.getCartById(userFound.cart)
    
            res.render("profile.hbs", {
                first_name: userFound.first_name,
                last_name: userFound.last_name,
                email: userFound.email,
                age: userFound.age,
                cart: cartFound.products,
                role: userFound.role,
            })
}

export const home = async(req,res) =>{
        const { token } = req.cookies
        if (!token) {
            return res.render("home.hbs", {
                title: "Vista login"
            })
        }
        jwt.verify(token, "CODER_TOKEN", async (err, user) => {
            if (err) return res.status(403).json({ message: "Token invalido" })
            const userFound = await usersService.getById(user.id)
            const cartFound = await cartsService.getCartById(userFound.cart)
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