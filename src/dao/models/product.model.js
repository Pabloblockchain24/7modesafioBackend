import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = mongoose.Schema({
    nombre: String,
    descripcion: String,
    category: String,
    precio: Number,
    availability: String
})

productSchema.plugin(mongoosePaginate)

const Product = mongoose.model("Product",productSchema)

export default Product