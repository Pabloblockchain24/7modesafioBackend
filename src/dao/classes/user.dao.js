import userModel from "../models/user.model.js"
import cartModel from "../models/cart.model.js"

export default class User {
    getByEmail = async (email) => {
        try {
            let user = await userModel.findOne({email: email})
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }


    createUser = async(user) =>{
        try{
            let result = await userModel.create(user)
            return result
        }catch(error){
            console.log(error)
            return null
        }
    }

    createCart = async() =>{
        try{
            let result = await cartModel.create({})
            return result
        }catch(error){
            console.log(error)
            return null
        }
    }

    getCarrito = async(id) =>{
        try{
            let result = await cartModel.findOne({_id: id})
            return result
        }catch(error){
            console.log(error)
            return null
        }
    }

}