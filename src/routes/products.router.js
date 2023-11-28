import { Router } from "express";
const router = Router()
import { deleteProduct, updateProduct, postProduct, getProduct, getAllProducts} from "../controllers/product.controller.js"

// obtengo todos los productos en endpoint "/api/products, puedo ordenar y filtran segun paginate"
router.get("/", getAllProducts)

// obtengo el producto solicitado en endpoint "/api/products/:pid"
router.get("/:pid", getProduct)

// posteo un nuevo producto en endpoint "/api/products"
router.post("/", postProduct)

// actualizo un producto en endpoint "/api/products/:pid"
router.put("/:pid", updateProduct)

// borro un producto en endpoint "/api/products/:pid"
router.delete("/:pid", deleteProduct)

export default router