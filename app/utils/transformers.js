const R = require("ramda")

const stylistTransformer = rawAirtableStylist => ({
    rowId: rawAirtableStylist.RowID,
    firstName: rawAirtableStylist.FirstName,
    fullName: rawAirtableStylist["Full Name"],
    mobileNumber: rawAirtableStylist.Mobile,
    email: rawAirtableStylist.Email,
    profileHandler: rawAirtableStylist["Profile Handle"],
    suburb: rawAirtableStylist.Suburb,
    state: rawAirtableStylist.State,
    status: rawAirtableStylist.Status
})

const airtableBookingTransformer = rawAirtableBooking => ({
    rowId: rawAirtableBooking["Row ID"],
    suburb: rawAirtableBooking.Suburb,
    state: rawAirtableBooking.State,
    eventDate: rawAirtableBooking["Event Date"],
    eventTime: rawAirtableBooking["To be ready by"],
    supplierPayment: Number(rawAirtableBooking.SupplierPayment),
    leadStatus: rawAirtableBooking["Lead Status"],
    numberOfPeople: Number(rawAirtableBooking["Number of People"]),
    mobileNumber: R.head(rawAirtableBooking.Mobile || ["undefined"]),
    firstName: R.head(rawAirtableBooking["First Name"] || ["undefined"]),
    email: rawAirtableBooking["Email (for Zapier)"],
    cost: Number(rawAirtableBooking.Cost)
})


module.exports = {
    airtableBookingTransformer,
    stylistTransformer
}