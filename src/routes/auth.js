const express = require("express");
const { signupController, loginController, logoutController } = require("../controllers/auth");

const authRouter = express.Router();

authRouter.post("/signup", signupController);
authRouter.post("/login", loginController);
authRouter.get("/logout", logoutController);

module.exports = authRouter;