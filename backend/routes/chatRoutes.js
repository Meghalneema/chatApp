const { Router } = require('express');
const chatRouter = Router();
const { protect}= require("../middleware/authMiddleware");
const { accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup}= require("../controllers/chatControllers");

chatRouter.route("/").post(protect,accessChat);
chatRouter.route("/").get(protect,fetchChats);
chatRouter.route("/group").post(protect,createGroupChat);
chatRouter.route("/rename").put(protect,renameGroup);
chatRouter.route("/removeGroup").put(protect,removeFromGroup);
chatRouter.route("/groupAdd").put(protect,addToGroup);

module.exports = { chatRouter };