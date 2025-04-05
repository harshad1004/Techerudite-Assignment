const Booking = require("../models/bookings");

const isTimeOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

const createBooking = async (req, res) => {
  try {
    const { customerName, customerEmail, bookingDate, bookingType, bookingSlot, fromTime, toTime } = req.body;
    const bookings = await Booking.find({ bookingDate });

    for (let booking of bookings) {
      if (booking.bookingType === "Full Day" || bookingType === "Full Day") {
        return res.status(400).json({ msg: "Full day already booked" });
      }
      if (booking.bookingType === "Half Day" && booking.bookingSlot === bookingSlot) {
        return res.status(400).json({ msg: "Half day slot already booked" });
      }
      if (booking.bookingType === "Custom") {
        if (isTimeOverlap(booking.fromTime, booking.toTime, fromTime, toTime)) {
          return res.status(400).json({ msg: "Custom time overlaps with existing booking" });
        }
      }
    }

    const newBooking = new Booking({ customerName, customerEmail, bookingDate, bookingType, bookingSlot, fromTime, toTime });
    await newBooking.save();
    res.status(201).json({ msg: "Booking created successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = { createBooking, getBookings };
// // Check time overlaps
// const isTimeOverlap = (start1, end1, start2, end2) => {
//     return start1 < end2 && start2 < end1;
//   };
  
//   // Logic inside booking controller
//   // Fetch all bookings for that day
//   const bookings = await Booking.find({ bookingDate });
  
//   // Check if any conflict with existing bookings
//   for (let booking of bookings) {
//     if (booking.bookingType === "Full Day" || newBookingType === "Full Day") {
//       return res.status(400).json({ msg: "Booking conflict with full day" });
//     }
  
//     if (booking.bookingType === "Half Day" && booking.bookingSlot === newSlot) {
//       return res.status(400).json({ msg: "Booking conflict with half day slot" });
//     }
  
//     if (booking.bookingType === "Custom") {
//       if (isTimeOverlap(booking.fromTime, booking.toTime, fromTime, toTime)) {
//         return res.status(400).json({ msg: "Custom time booking conflict" });
//       }
//     }
//   }
  