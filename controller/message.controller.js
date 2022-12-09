const { default: messageModel } = require('../model/messageModel');
const MessageModel = require('../model/messageModel');


exports.addMessage = async(req,res)=>{
    const {chatId,senderId,text} = req.body;
    if(!chatId || !senderId || !text){
        return res.status(400).json({message : 'Provide full details'})
    }

    try {
        const result = await MessageModel.create({
            chatId,senderId,text
        })
        res.status(200).json(result)
    } catch (error) 
    {
        res.status(500).json({error:error.message})
    }
}

exports.getMessages = async(req,res)=>{
    const {chatId} = req.params;
    try {
        const messages = await MessageModel.find({chatId});
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}