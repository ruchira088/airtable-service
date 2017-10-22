const Airtable = require("airtable")
const { insert, isNonEmpty } = require("../services/databaseService")

const getAirtableBase = async ({ apiKey, baseId }) => new Airtable({ apiKey }).base(baseId)

const convertToFormula = query => {
    const formula = Object.keys(query)
        .reduce((formula, key) => formula.concat(`${key} = "${query[key]}"`), [])
        .join(", ")

    return `AND(${formula})`
}

const findItems = table => query => new Promise((resolve, reject) => {
    let results = []

    const parsedQuery = query !== null ? convertToFormula(query) : ""

    table.select({
        filterByFormula: parsedQuery
    }).eachPage(
        (records, fetchNextPage) => {
            results = results.concat(records.map(({ fields }) => fields))
            fetchNextPage()
        },
        error => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        }
    )
})

const fetchAllItems = table => findItems(table)(null)

const saveAirtableItems = (db, base) => async (collectionName, airtableName) =>
{
    const nonEmpty = await isNonEmpty(db)(collectionName)

    if (nonEmpty) {
        console.log(`"${collectionName}" collection is NOT empty`)
        return
    } else {
        console.log(`"${collectionName}" collection is empty`)

        console.log("Fetching items from Airtable")
        const items = await fetchAllItems(base(airtableName))
        console.log("Successfully fetched items from Airtable")

        return insert(db)(collectionName)(items)
    }
}

module.exports = {
    getAirtableBase,
    findItems,
    saveAirtableItems
}