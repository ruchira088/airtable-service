const R = require("ramda")

const stylistAirtableBookingTransformer = rawAirtableBooking => ({
    rowId: rawAirtableBooking["Row ID"],
    suburb: rawAirtableBooking.Suburb,
    state: rawAirtableBooking.State,
    eventDate: rawAirtableBooking["Event Date"],
    eventTime: rawAirtableBooking["To be ready by"],
    supplierPayment: Number(rawAirtableBooking.SupplierPayment),
    numberOfPeople: Number(rawAirtableBooking["Number of People"])
})

const airtableBookingTransformer = rawAirtableBooking =>
    Object.assign(
        {},
        stylistAirtableBookingTransformer(rawAirtableBooking),
        {
            leadStatus: rawAirtableBooking["Lead Status"],
            mobileNumber: R.head(rawAirtableBooking.Mobile || ["undefined"]),
            firstName: R.head(rawAirtableBooking["First Name"] || ["undefined"]),
            email: rawAirtableBooking["Email (for Zapier)"],
            cost: Number(rawAirtableBooking.Cost)
        }
    )

module.exports = {
    stylistAirtableBookingTransformer,
    airtableBookingTransformer
}