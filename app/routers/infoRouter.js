const express = require("express")
const packageJson = require("../../package.json")

const infoRouter = express.Router()

infoRouter.get("/", (request, response) => {
    const { name, version, description } = packageJson

    response.json({ name, version, description })
})

module.exports = {
    infoRouter
}