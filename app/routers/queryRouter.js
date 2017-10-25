const express = require("express")
const R = require("ramda")
const { INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_GATEWAY } = require("http-status-codes")
const { getEnvValue } = require("../utils/configUtils")
const { getAirtableBase, findItems, saveAirtableItems } = require("../services/airtableService")
const { airtableBookingTransformer, stylistAirtableBookingTransformer, stylistTransformer } = require("../utils/transformers")
const { connectToDb, find } = require("../services/databaseService")
const { STYLIST_AIRTABLE_NAME, QUOTE_AIRTABLE_NAME, STYLIST_COLLECTION_NAME } = require("../config")
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID, MONGO_URI } = require("../constants/envNames")

const createQueryRouter = async () =>
{
    const queryRouter = express.Router()

    const apiKey = await getEnvValue(AIRTABLE_API_KEY)
    const baseId = await getEnvValue(AIRTABLE_BASE_ID)
    const mongoDbUrl = await getEnvValue(MONGO_URI)

    const db = await connectToDb(mongoDbUrl)
    const base = await getAirtableBase({ apiKey, baseId })
    
    await saveAirtableItems(db, base)(STYLIST_COLLECTION_NAME, STYLIST_AIRTABLE_NAME)

    const findInStylistTable = findItems(base(STYLIST_AIRTABLE_NAME))
    const findInQuoteTable = findItems(base(QUOTE_AIRTABLE_NAME))

    queryRouter.post("/stylist", async (request, response) => {
        const { mobileNumber } = request.body

        const findStylist = async query =>
        {
            const cachedStylists = await find(db)(STYLIST_COLLECTION_NAME)(query)

            if (cachedStylists.length === 0) {
                console.log(`Unable to find cached stylist(s).`)
                console.log("Querying Airtable...")
                return findInStylistTable(query)
            } else {
                console.log(`${cachedStylists.length} cached stylist(s) found.`)
                return cachedStylists
            }
        }

        try {
            const stylists = await findStylist({ Mobile: mobileNumber })

            if (stylists.length === 0) {
                response.status(NOT_FOUND).json({ error: "Stylist NOT found." })
            } else {
                const stylist = stylistTransformer(R.head(stylists))

                if (stylists.length > 1) {
                    response.status(BAD_GATEWAY).json(stylist)
                } else {
                    response.json(stylist)
                }
            }
        } catch (error) {
            response.status(INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    })

    const queryQuotesTable = response => async (params, transformer) =>
    {
        try {
            const items = await findInQuoteTable(params)
            const transformedItems = items.map(transformer)

            response.json(transformedItems)
        } catch (exception) {
            response.status(INTERNAL_SERVER_ERROR).json(exception)
        }
    }

    queryRouter.get("/:stylist/bookings", (request, response) => {
        const { stylist } = request.params

        queryQuotesTable(response)({ Vendor: stylist }, airtableBookingTransformer)
    })
    
    queryRouter.get("/gigs/:gigId", async (request, response) => {
        const { gigId } = request.params

        queryQuotesTable(response)({ "Row ID": gigId }, stylistAirtableBookingTransformer)
    })

    return queryRouter
}

module.exports = {
    createQueryRouter
}