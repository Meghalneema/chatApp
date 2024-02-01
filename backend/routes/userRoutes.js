const { Router } = require('express');
const { registerUser,authUser,allUsers}= require("../controllers/userControllers");
const { protect}= require("../middleware/authMiddleware");
const UserRouter = Router();


UserRouter.route("/registerUser").post(registerUser).get(protect,allUsers);
UserRouter.route("/login").post(authUser);

module.exports = { UserRouter };