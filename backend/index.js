const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Load .env explicitly from backend folder
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Debug: check if Mongo URI is loaded
console.log("MONGO_URI =", process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");    // Authentication routes
const userRoutes = require("./routes/user");    // User-related routes
const compltRoutes = require("./routes/complaint"); // Complaint-related routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/complaints", compltRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
