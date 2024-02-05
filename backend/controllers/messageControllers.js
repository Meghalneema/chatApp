// const { chats } = require("../data/data");
const asyncHandler=require("express-async-handler");
const { Chat } = require("../modules/chatModule");
const { User } = require("../modules/userModule");
const { Message } = require("../modules/messageModule");

const OpenAI =require("openai");

const openai = new OpenAI({
    apiKey: process.env.API_KEY,
});

const chatGpt_Message = async (content, chatId,chatGptUserId) => {
    try {
        const messages = await Message.find({ chat: chatId }).populate("sender", "name pic email").populate("chat")
        .sort({ createdAt: -1 }) 
        .limit(10);    //want only last 10 messages of this chat 

        const formattedMessages = [];
        
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            const senderName = message.sender.name;
            const messageContent = message.content;
            let role = 'user'; // Default role is user
            if (senderName === 'chatGpt') {
                role = 'assistant'; // Set role to 'assistant' for messages from the AI
            } else {
                role = 'user'; // Set role to 'user' for messages from other users
            }
            const formattedMessage = { role: role, content: messageContent };
            
            formattedMessages.push(formattedMessage);
        }
        // console.log("message------------",formattedMessages)

        const response = await openai.chat.completions.create({
            messages: [
                ...formattedMessages, 
                { 
                    role: "user", 
                    content: content // Add the new user message
                },
                { role: "system", content: "please give answer in 2 or 3 sentences and be polite and user friendly and behave like a human" },
            ],
            model: "gpt-3.5-turbo",
        });

        ans=response.choices[0].message.content

        // const newMessage= {sender:"65bc6cf363200d016473604c",content:ans,chat:chatId };
        const newMessage= {sender:chatGptUserId,content:ans,chat:chatId };

        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
        path: "chat.users",
        select: "name pic email",
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
                
        return ans;
        
    } catch (error) {
       console.log('Error in sending Message or getting answer from chatgpt', error);
    }
};

const findChatGptUserId = async () => {
    try {
        const chatGptUser = await User.findOne({ name: "chatGpt" });
        if (chatGptUser) {
            return chatGptUser._id;
        } else {
            console.log("User with name 'chatGpt' not found.");
            return null;
        }
    } catch (error) {
        console.log('Error in finding user with name "chatGpt"', error);
        throw new Error("Internal server error occurred");
    }
};


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

        if (content.includes("@chatGpt")  )  // && if chatGpt is also a user of this chat
        {
             var chatGptUserId = await findChatGptUserId();
            const chat = await Chat.findById(chatId);
            // const isChatGptMember = chat.users.some(user => user.equals("65bc6cf363200d016473604c")); 
            const isChatGptMember = chat.users.some(user => user.equals(chatGptUserId)); 


            if (isChatGptMember) {
                var ans = await chatGpt_Message(content, chatId,chatGptUserId);
            }
            else{console.log("chatGpt is not a member of this chat");}
        }
        res.json(message);
    } catch (error) {
        console.log('Error in sendMessage ', error);
        res.status(500).send('Internal server Error occurred');
    }
});

const allMessages = asyncHandler( async (req,res) => {
    try {
        // console.log("id----------------",req.params.chatId )
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat");
        res.json(messages);
    } catch (error) {
        console.log('Error in allMessages', error);
        res.status(500).send('Internal server Error occurred');
    }
});

module.exports={sendMessage,allMessages}