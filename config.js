module.exports = {
    production: {
        db: process.env.MONGODB_URI,
        port: process.env.PORT
    },
    development: {
        db: process.env.MONGODB_URI,
        port: process.env.PORT,
        SECRET_TOKEN: process.env.SECRET_TOKEN,
        SECRET_REFRESH_TOKEN: process.env.SECRET_REFRESH_TOKEN
    }
}