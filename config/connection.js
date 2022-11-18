const mongoose = require('mongoose')

const URL = process.env.DB_URI

const { DB_NAME } = require('./constants')

module.exports = {
    connection: () => {
        mongoose
            .connect(URL, {
                dbName: DB_NAME,
            })
            .then(() => console.log('DB connected'))
            .catch((err) => console.log(err, 'DB error'))
    },
}
