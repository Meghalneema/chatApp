const express= require("express");
// const { chats } = require("./data/data");
const dotenv=require("dotenv").config();
const cors= require('cors');
const mongoose=require("mongoose");
const connectDB = require("./config/db");
const {notFound, errorHandler}=require('./middleware/errorMiddleware')
port= process.env.port || 5000;
const { UserRouter } = require("./routes/userRoutes");
const { chatRouter } = require("./routes/chatRoutes");
const { messageRouter } = require("./routes/messageRoutes");
// --------------------------deployment------------------------------

const path = require("path");
const __dirname1 = path.resolve();
// --------------------------deployment------------------------------


connectDB();
const app= express();

app.use(express.json()); 
app.use(cors());

app.use(UserRouter);
app.use(chatRouter);
app.use(messageRouter);

// --------------------------deployment------------------------------


if (process.env.NODE_ENV === "production") {
  // app.use(express.static(path.join(__dirname1, "/frontend/build")));
  app.use(express.static(path.join(__dirname1, "/frontend")));
  app.get("*", (req, res) =>
    // res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    res.join(path.resolve(__dirname1, "frontend", "index.html"))

  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------







app.use(notFound)
app.use(errorHandler)


const server= app.listen(port,(req,res)=>{
    console.log(`Server started on port ${port}`);
})


const io=require("socket.io")(server,{
  pingTimeout: 60000,
  cors: {
    // origin: "http://localhost:5173",
    origin: "https://dazzling-fairy-320c62.netlify.app",
    credentials: true,
  },
})


io.on("connection", (socket)=>{
    console.log("connected to sockect.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit("connected");
  });

  socket.on("join chat", (room) => {
        socket.join(room);
        console.log("user joined room "+ room);
        
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    console.log("chat",chat)
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

   socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});



// --------------------------deployment------------------------------

// const __dirname1 = path.resolve();

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/frontend/build")));

//   app.get("*", (req, res) =>
//     res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
//   );
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running..");
//   });
// }

// --------------------------deployment------------------------------
