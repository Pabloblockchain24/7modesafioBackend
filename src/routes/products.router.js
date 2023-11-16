

import { Router } from "express";
const router = Router()


import productModel from "../models/product.model.js"

// obtengo todos los productos en endpoint "/api/products, puedo ordenar y filtran segun paginate"
router.get("/", async(req,res) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 3
    const sortDirection = req.query.sortDirection || ''
    const category = req.query.category || ""
    const availability = req.query.availability || ""

    const sortOptions = {};
    if (sortDirection === 'asc') {
        sortOptions.precio = 1;
    } else if (sortDirection === 'des') {
        sortOptions.precio = -1;
    }

    const filterOptions = {};
    if (category) {
        filterOptions.category = category;
    }
    if (availability) {
        filterOptions.availability = availability;
    }
    productModel.paginate(filterOptions, { page, limit, sort: sortOptions }, (err, result) => {
        if (err) {
            return res.status(500).json({ result: 'error', payload: null });
        }
        const prevPage = result.page > 1 ? result.page - 1 : null;
        const nextPage = result.page < result.totalPages ? result.page + 1 : null;

        res.render("products.hbs", {
            url:req.originalUrl,
            productos: result.docs,
            totalPage: result.totalPages,
            prevPage,
            nextPage,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevPage ? `/products?page=${prevPage}&limit=${limit}&sortDirection=${sortDirection}&category=${category}&availability=${availability}` : null,
            nextLink: nextPage ? `/products?page=${nextPage}&limit=${limit}&sortDirection=${sortDirection}&category=${category}&availability=${availability}` : null,
        },);
    })
})

// obtengo el producto solicitado en endpoint "/api/products/:pid"
router.get("/:pid", async(req,res) => {
    const productId = req.params.pid
    const producto = await productModel.findById(productId)
    try{
        if(producto){
            res.send({result: "success", payload: producto})
        }else{
            res.status(404).send({ status: "error", message: "Producto no encontrado" });
        }
    }catch(error){
        console.log(error)
    }
})

// posteo un nuevo producto en endpoint "/api/products"
router.post("/", async(req,res)=>{
    let {nombre, descripcion, category, precio, availability} = req.body
    try{
        if(!nombre || !descripcion || !category || !precio || !availability){
            return res.send({status:"error", error:"faltan datos"})
        }
        let result = await productModel.create({nombre, descripcion, category, precio, availability})
        res.send({result: "success", payload: result })
    }catch(error){
        console.log(error)
    }
})

// actualizo un producto en endpoint "/api/products/:pid"
router.put("/:pid", async(req,res)=>{
    let {pid} =  req.params
    let productToReplace = req.body
    if(!productToReplace.nombre || !productToReplace.descripcion || !productToReplace.precio || !productToReplace.category || !productToReplace.availability){
        res.send({status: "error", error:"no hay datos en parametros"})
    }
    let result = await productModel.updateOne({_id: pid}, productToReplace)
    res.send({result: "success", payload: result })
})

// borro un producto en endpoint "/api/products/:pid"
router.delete("/:pid", async(req,res)=>{
    let {pid} = req.params
    let result = await productModel.deleteOne({_id: pid})
    res.send({result: "success", payload: result})
})

export default router