const { default: mongoose } = require('mongoose');
const userModel = require('./userModel');

const schema = require('mongoose').Schema
const {ObjectId} = mongoose.Schema.Types


const PostModel = new schema({
    user : {
        type : ObjectId,
        ref : 'users'
    },
    imageUrl : {
        type : String
    },
    description : {
        type : String
    },
    comments : [
        {
            comment : {
                type : String
            },
            user : {
                type : ObjectId,
                ref : "users"
            },
            commentedAt : {
                type : Date,
                default : Date.now()
            }
        }
    ],
    likes : {
        type : Array,
        default : []
    }
},{timestamps : true})

// const user = mongoose.model('user',userModel)

module.exports = mongoose.model('post', PostModel);