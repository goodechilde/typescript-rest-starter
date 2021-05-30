import express, { Application } from "express"
import fs from "fs"
import path from "path"
import morgan from "morgan"
import router from "./routes"
import swaggerUi from "swagger-ui-express"

const SERVER_PORT = process.env.SERVER_PORT || 3333
const SERVER_HOST = process.env.SERVER_HOST || "localhost"

const app: Application = express()
const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' })

app.use(express.json())
app.use(morgan(
    ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length]', 
    { stream: accessLogStream }
    ))
app.use(express.static("public"))

app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "openapi.yaml"
        }
    })
)
app.use(router)

app.listen(SERVER_PORT, () => {
    console.log(`Server is running on ${SERVER_HOST}:${SERVER_PORT}` )
})