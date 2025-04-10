import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import "dotenv/config"
import routes from "./routes/rutas.js"

const PORT = process.env.PORT ?? 3000

const app= express()

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extend: false}));
app.use(morgan("dev"));
app.use("/", routes)

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})