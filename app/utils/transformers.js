const R = require("ramda")

const airtableBookingTransformer = rawAirtableBooking => ({
    rowId: rawAirtableBooking["Row ID"],
    leadStatus: rawAirtableBooking["Lead Status"],
    suburb: rawAirtableBooking.Suburb,
    state: rawAirtableBooking.State,
    eventDate: rawAirtableBooking["Event Date"],
    eventTime: rawAirtableBooking["To be ready by"],
    mobileNumber: R.head(rawAirtableBooking.Mobile),
    firstName: R.head(rawAirtableBooking["First Name"]),
    email: rawAirtableBooking["Email (for Zapier)"],
    cost: Number(rawAirtableBooking.Cost),
    supplierPayment: Number(rawAirtableBooking.SupplierPayment),
    numberOfPeople: Number(rawAirtableBooking["Number of People"])
})

module.exports = {
    airtableBookingTransformer
}