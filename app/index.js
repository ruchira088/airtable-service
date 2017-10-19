const express = require("express")
const bodyParser = require("body-parser")
const http = require("http")
const { DEFAULT_HTTP_PORT } = require("./config")
const { infoRouter } = require("./routers/infoRouter")
const { createQueryRouter } = require("./routers/queryRouter")

const PORT = process.env.HTTP_PORT || DEFAULT_HTTP_PORT

const app = express()

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

Promise.all([createQueryRouter()])
    .then(([ queryRouter ]) =>
    {
        // routes
        app.use("/info", infoRouter)
        app.use("/query", queryRouter)

        http.createServer(app).listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}...`)
        })
    })
    .catch(console.error)