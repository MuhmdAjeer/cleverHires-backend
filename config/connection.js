const {MongoClient} = require('mongodb')
const URL = process.env.DB_URI

const {DB_NAME} = require('./constants')
const state = {
    db : null
}
module.exports = {

    connect : async()=>{
        
        try {
            const connection = await MongoClient.connect(URL);
            state.db = connection.db(DB_NAME);
            console.log('DB connected');
        } catch (error) {
            console.log(error);
        }
    },

    get : ()=>{
        return state.db
    }
}