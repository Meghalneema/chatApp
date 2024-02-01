// const { chats } = require("../data/data");
const asyncHandler=require("express-async-handler");
const { User } = require("../modules/userModule");
const { generateToken } = require('../config/generateTokens');

const registerUser = asyncHandler( async (req,res) => {
    try {
        const {name,email,password,pic }=req.body
        if(!name || !email || !password){
            res.status(400);
            throw new Error("please enter all the details")
        }
        const userExist=await User.findOne({email}) ;
        if(userExist){
            res.status(400);
            throw new Error("user Already Exist")
        }

        const newUser= await User.create({name,email,password,pic, });
        if(newUser){
            res.status(201).json({_id:newUser._id, name: newUser.name, email:newUser.email, pic: newUser.pic,token: generateToken(newUser._id),});
        }else{
            res.status(400);
            res.send("failed to create the user")
        }
    } catch (error) {
        console.log('Error in register user', error);
        res.status(500).send('Internal server Error occurred');
    }
});

const authUser = asyncHandler( async (req,res) => {
    try {
        const {email,password}=req.body
        const userExist=await User.findOne({email}) ;
        if(userExist && (await userExist.matchPassword(password))){
            res.status(201).json({
                _id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                pic: userExist.pic,
                token: generateToken(userExist._id), // Fix here
            });
        }
        else{
             res.status(401);
            res.send("Invalid email or password")
        }

        
    } catch (error) {
        console.log('Error in login user', error);
        res.status(500).send('Internal server Error occurred');
    }
});


const allUsers = asyncHandler( async (req,res) => {
    try {
        const keyword=req.query.search ?{
            $or:[
                {name: {$regex: req.query.search ,$options :"i" }},
                {email: {$regex: req.query.search ,$options :"i"}},
            ],
        }:{};
        const users= await User.find(keyword).find({ _id: { $ne: req.user._id } });
        console.log("allUser user", users);  
        res.send(users)
    } catch (error) {
        console.log('Error in login user', error);
        res.status(500).send('Internal server Error occurred');
    }
});

module.exports={registerUser,authUser,allUsers}