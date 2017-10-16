const convertToFormula = query => {
    const formula = Object.keys(query)
        .reduce((formula, key) => formula.concat(`${key} = "${query[key]}"`), [])
        .join(", ")

    return `AND(${formula})`
}

const findItems = table => query => new Promise((resolve, reject) => {
    let results = []

    table.select({
        filterByFormula: convertToFormula(query)
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

module.exports = {
    findItems
}