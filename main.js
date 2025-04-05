// File: backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("../backend/routes/authRoutes");
const bookingRoutes = require("../backend/routes/bookingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/techeruditeDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

