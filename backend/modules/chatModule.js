const mongoose=require("mongoose");

const chatModule=new mongoose.Schema({
    chatName:{
        type:String,
        trime:true,
    },
    isGroupChat:{
      type: Boolean,
      required: false,
    },
    users:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
    },],
    latestMessage:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Message",
    },
    groupAdmin:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
    }
    },
    {
        timestamps:true,
    }
);



const Chat = mongoose.model("Chat", chatModule);
  
module.exports = { Chat };  

// module.exports=mongoose.model("ToDo",ToDoSchema, "SignUp",SignUpSchema, "Login",LogInSchema);