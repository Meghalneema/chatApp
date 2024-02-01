// const { chats } = require("../data/data");
const asyncHandler=require("express-async-handler");
const { Chat } = require("../modules/chatModule");
const { User } = require("../modules/userModule");
const { Message } = require("../modules/messageModule");

const sendMessage = asyncHandler( async (req,res) => {
    const {content,chatId }=req.body
    if(!content || !chatId){
        res.status(400);
        throw new Error("please enter all the details")
    }

    try {
        const newMessage= {sender:req.user._id,content:content,chat:chatId };
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        res.json(message);
    } catch (error) {
        console.log('Error in sendMessage ', error);
        res.status(500).send('Internal server Error occurred');
    }
});

const allMessages = asyncHandler( async (req,res) => {
    try {
        console.log("id----------------",req.params.chatId )
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat");
        res.json(messages);
    } catch (error) {
        console.log('Error in allMessages', error);
        res.status(500).send('Internal server Error occurred');
    }
});

module.exports={sendMessage,allMessages}
