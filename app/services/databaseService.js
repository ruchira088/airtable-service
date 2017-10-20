const { MongoClient } = require("mongodb")

const connectToDb = MongoClient.connect

const insert = db => collectionName => items =>
    db.collection(collectionName).insertMany([].concat(items))

const isNonEmpty = db => async collectionName => {
    const count = await db.collection(collectionName).count()

    return count !== 0
}

const find = db => collectionName => async query => 
    db.collection(collectionName).find(query).toArray()

module.exports = {
    connectToDb,
    insert,
    isNonEmpty,
    find
}