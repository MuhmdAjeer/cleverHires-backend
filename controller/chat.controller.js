const { isValidObjectId } = require("mongoose");
const chatModel = require("../model/chatModel");

exports.createChat =  async(req,res)=>{
    const {senderId,receiverId} = req.body;
    if(!senderId || !receiverId) return res.status(400).json({message : "SenderId or receiverId missing!"})



    try {
        const result = await chatModel.create({
            members : [senderId,receiverId]
        })
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

exports.userChats = async(req,res)=>{
    const {userId} = req.params;
    if(!isValidObjectId(userId)) return res.status(400).json({message : 'Invalid UserId'})

    try {
        const chats = await chatModel.find({
            members : {$in : [userId]}
        })

        res.status(200).json(chats)
    } catch (error) {
        console.log(error);
        res.status(500).json({error : error.message})
    }
}

exports.findChat = async(req,res)=>{
    const {firstId,secondId} = req.params
    try {
        const chat = await chatModel.findOne({
            members : {$all  : [firstId,secondId]}
        })

        if(!chat){
            return res.status(404).json({message : 'No chat found!'})
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}