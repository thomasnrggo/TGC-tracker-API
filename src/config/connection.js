const username = encodeURIComponent(process.env.MONGO_USER)
const password = encodeURIComponent(process.env.MONGO_PASSWORD)
const cluster = process.env.MONGO_CLUSTER
const uri = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority`

module.exports = { uri }
