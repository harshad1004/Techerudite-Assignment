const express = require("express");
const router = express.Router();
const { createBooking, getBookings } = require("../controllers/bookings.controller");
const authMiddleware = require("../middlleware/authMiddleware");

router.post("/create", authMiddleware, createBooking);
router.get("/", authMiddleware, getBookings);

module.exports = router;