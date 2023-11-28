import productModel from "../models/product.model.js"

export default class Product {
    getProductById = async (pid) => {
        try {
            let productFound = await productModel.findOne({_id: pid})
            return productFound
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

    updateProductById = async(pid, productToReplace) =>{
        try {
            let result = await productModel.updateOne({_id: pid}, productToReplace)
            return result
        }catch (error) {
            console.log(error)
            return null
        }
    }

    postProduct = async(newProduct) =>{
        try {
            let result = await productModel.create(newProduct)
            return result
        } catch (error) {
            console.log(error)
            return null
        }
    }

}
