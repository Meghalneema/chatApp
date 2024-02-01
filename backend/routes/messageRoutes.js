const { Router } = require('express');
const messageRouter = Router();
const { protect}= require("../middleware/authMiddleware");
const { sendMessage,allMessages}= require("../controllers/messageControllers");

messageRouter.route("/sendMessage").post(protect,sendMessage);
messageRouter.route("/allMessages/:chatId").get(protect,allMessages);
// messageRouter.route('/:chatId').get(protect, allMessages);


module.exports = { messageRouter };