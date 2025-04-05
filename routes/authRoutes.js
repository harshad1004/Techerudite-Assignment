const express = require("express");
const router = express.Router();
const { registerUser, loginUser, verifyEmail } = require("../controllers/authController");

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);

module.exports = router;