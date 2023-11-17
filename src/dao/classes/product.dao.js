import productModel from "../models/product.model.js"

export default class Product {
    getById = async (email) => {
        try {
            let user = await userModel.findOne({email: email})
            return user
        } catch (error) {
            console.log(error)
            return null
        }
    }

    deleteProductById = async(pid) =>{
        try {
            let result = await productModel.deleteOne({ _id: pid })
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }
}
