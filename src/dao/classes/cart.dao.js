import cartModel from "../models/cart.model.js"

export default class Cart {

    getCartById = async(cid) =>{
        try {
            let cartFound = await cartModel.findOne({_id: cid}).populate("products.product")
            return cartFound
        } catch (error) {
            console.log(error)
            return null
        }
    }

    postCart = async() =>{
        try {
            let newCart = await cartModel.create({})
            return newCart
        } catch (error) {
            console.log(error)
            return null
        }
    }

    getAllCart = async() =>{
        try {
            let carritos = await cartModel.find({})
            return carritos
        } catch (error) {
            console.log(error)
            return null
        }
    }
 
}
