const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/auth"); // ✅ Import auth middleware
// // In complaint route
// console.log("Authorization header:", req.headers.authorization);
// console.log("req.user:", req.user);

// ------------------- CREATE a complaint -------------------
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newComplaint = new Complaint({
      userId: req.user._id, // Comes from auth middleware
      title,
      description,
    });
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------- GET all complaints -------------------
router.get("/", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("userId", "name email");
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------- GET complaint by ID -------------------
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("userId", "name email");
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------- UPDATE complaint status -------------------
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    complaint.status = status || complaint.status;
    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------- DELETE complaint -------------------
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    await complaint.remove();
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
