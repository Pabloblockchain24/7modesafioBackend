import express from "express"
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import cookieParser from "cookie-parser";
import {engine} from "express-handlebars"

import productRouter from "./routes/products.router.js"
import cartRouter from "./routes/carts.router.js"
import userRouter from "./routes/users.router.js"
import sessionRouter from "./routes/sessions.router.js"
import config from "./config/config.js"




const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
 


app.listen(config.port, () => {
    console.log(`Servidor corriendo en puerto ${config.port}`)
})


mongoose.connect(config.MONGO_URL)
    .then(() => {
        console.log("Conectado a la base de datos")
    })
    .catch(error => {
        console.error("Error al conectarse a la base de datos", error);
    })

app.use("/api/sessions", sessionRouter)
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
    