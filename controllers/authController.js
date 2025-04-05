const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const user = new User({ firstName, lastName, email, password: hashedPassword, isVerified: true, verificationToken: null    });
    await user.save();

    // // Send verification email
    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // const url = `http://localhost:3000/verify/${verificationToken}`;
    // await transporter.sendMail({
    //   to: email,
    //   subject: "Verify Email",
    //   html: `<a href='${url}'>Click to verify email</a>`
    // });

    res.status(201).json({ msg: "User registered. Please verify your email." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return res.status(400).json({ msg: "Invalid token" });
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();
    res.status(200).json({ msg: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Invalid or expired token" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    if (!user.isVerified) return res.status(401).json({ msg: "Please verify your email before logging in" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { firstName: user.firstName, lastName: user.lastName, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { registerUser, loginUser, verifyEmail };