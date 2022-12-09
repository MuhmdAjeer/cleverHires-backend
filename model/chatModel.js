const { default: mongoose } = require('mongoose')
const schema = require('mongoose').Schema

const ChatModel = new schema(
    {
        members: {
            type: Array,
            required: true,
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model('Chat', ChatModel)
