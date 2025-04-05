const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerName: String,
  customerEmail: String,
  bookingDate: Date,
  bookingType: { type: String, enum: ["Full Day", "Half Day", "Custom"] },
  bookingSlot: { type: String, enum: ["First Half", "Second Half"], required: false },
  fromTime: { type: String, required: false },
  toTime: { type: String, required: false },
});

module.exports = mongoose.model("Booking", bookingSchema);
