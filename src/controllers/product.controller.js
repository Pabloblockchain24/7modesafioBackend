import Product from "../dao/classes/product.dao.js"
const productsService = new Product()


export const deleteProduct = async (req,res) =>{
    let {pid} = req.params
    let result = await productsService.deleteProductById(pid)
    res.send({result: "success", payload: result})
}
