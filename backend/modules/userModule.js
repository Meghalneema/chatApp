const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userModule=new mongoose.Schema({
    name:{ type:String, required:true},
    email:{ type:String, required:true, unique:true},
    password:{ type:String, required:true},
    pic:{
        type:String,
        default:" ",
    },
    isAdmin: {type: Boolean, required: true, default: false, }, },
    {
        timestamps:true,
    },
);

userModule.pre('save',async function(next){
  if(!this.isModified){
    next()
  }
  const salt =await bcrypt.genSalt(10)
  this.password= await bcrypt.hash(this.password,salt);
})

userModule.methods.matchPassword=async function(enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}


const User = mongoose.model("User", userModule);
  
module.exports = { User };  




 // default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",