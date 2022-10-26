const {MongoClient} = require('mongodb')
const URL = process.env.DB_URI

const {DB_NAME} = require('./constants')
const state = {
    db : null
}
module.exports = {

    connect : ()=>{
        MongoClient.connect(URL).then(connection => {
            console.log('DB connected');
            state.db = connection.db(DB_NAME)
        })
        .catch(err => console.log(err))
    },

    get : ()=>{
        return state.db
    }
}