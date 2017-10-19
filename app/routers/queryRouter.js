const express = require("express")
const Airtable = require("airtable")
const R = require("ramda")
const { INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_GATEWAY } = require("http-status-codes")
const { getEnvValue } = require("../utils/configUtils")
const { findItems } = require("../utils/airTableApiUtils")
const { airtableBookingTransformer } = require("../utils/transformers")
const { STYLIST_TABLE_NAME, QUOTE_TABLE_NAME } = require("../config")
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = require("../constants/envNames")

const createQueryRouter = async () =>
{
    const queryRouter = express.Router()

    const apiKey = await getEnvValue(AIRTABLE_API_KEY)
    const baseId = await getEnvValue(AIRTABLE_BASE_ID)

    const base = new Airtable({ apiKey }).base(baseId)

    const findInStylistTable = findItems(base(STYLIST_TABLE_NAME))
    const findInQuoteTable = findItems(base(QUOTE_TABLE_NAME))

    queryRouter.post("/stylist", async (request, response) => {
        const { mobileNumber } = request.body

        try {
            const stylists = await findInStylistTable({ Mobile: mobileNumber })

            if (stylists.length === 0) {
                response.status(NOT_FOUND).json({ error: "Stylist NOT found." })
            } else {
                const stylist = R.head(stylists)

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

    queryRouter.get("/:stylist/bookings", async (request, response) => {
        const { stylist } = request.params

        const bookings = await findInQuoteTable({ Vendor: stylist })

        const transformedBookings = bookings.map(airtableBookingTransformer)

        response.json(transformedBookings)
    })

    return queryRouter
}

module.exports = {
    createQueryRouter
}