const express = require("express")
const Airtable = require("airtable")
const { getEnvValue } = require("../utils/configUtils")
const { STYLIST_TABLE_NAME } = require("../config")
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = require("../constants/envNames")

const createFindRouter = async () =>
{
    const findRouter = express.Router()

    const apiKey = await getEnvValue(AIRTABLE_API_KEY)
    const baseId = await getEnvValue(AIRTABLE_BASE_ID)

    const stylistTable = new Airtable({ apiKey }).base(baseId)(STYLIST_TABLE_NAME)

    findRouter.all("/", (request, response) => {
        console.log("finding...")
        stylistTable.select({
            filterByFormula: `AND(Mobile = "427372430")`
        }).eachPage(
            (records, fetchNextPage) => {
                console.log(records.map(value => value.fields))
                fetchNextPage()
            },
            error => {
                response.json({ result: "done" })
                if (error) {
                    console.error(error)
                } else {
                    console.log("DONE")
                }
            }
        )
    })

    return findRouter
}

module.exports = {
    createFindRouter
}