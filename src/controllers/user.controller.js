import User from "../dao/classes/user.dao.js"

import userService from "../dao/models/user.model.js"
import bcrypt from "bcrypt"
import cartModel from "../models/cart.model.js"
import createAccessToken from "../utils.js"


const usersService = new User()




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
            const userFound = await userService.findOne({ email })
            if (userFound) return res.status(400).json(["El email ya esta registrado"])
            const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10))
            const newUser = await userService.create({ first_name, last_name, email, age, password: hash, role })
    
            newUser.cart = await cartModel.create({})
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
        const userFound = await userService.findOne({ email })
        if (!userFound) return res.status(401).json({ message: "Usuario no encontrado" })
    
        const isMatch = await bcrypt.compareSync(password, userFound.password)
        if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" })
    
        const token = await createAccessToken({ id: userFound._id })
        res.cookie("token", token)
    
        const cartFound = await cartModel.findOne({ _id: userFound.cart }).populate("products.product")
    
            res.render("profile.hbs", {
                first_name: userFound.first_name,
                last_name: userFound.last_name,
                email: userFound.email,
                age: userFound.age,
                cart: cartFound.products,
                role: userFound.role,
            })
    
    
}


export const getUsers = async (req, res) => {
    let result = await usersService.getUsers()
    res.send({ status: "success", result: result })
}

export const getUserById = async (req, res) => {
    const { uid } = req.params
    let user = await usersService.getUserById(uid)
    res.send({ status: "success", result: user })
}

export const saveUser = async (req, res) => {
    const user = req.body
    let result = await usersService.saveUser(user)
    res.send({ status: "success", result: result })
}