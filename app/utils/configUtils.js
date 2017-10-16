const getEnvValue = envName => new Promise((resolve, reject) => {
    const value = process.env[envName]

    if(value != null) {
        resolve(value)
    } else {
        reject(new Error(`Unable to find value for "${envName}" in environment`))
    }
})

module.exports = {
    getEnvValue
}