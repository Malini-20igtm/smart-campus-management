import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// MongoDB Connection
// ===============================

mongoose
  .connect("mongodb://127.0.0.1:27017/smartCampus")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// ===============================
// Student Schema
// ===============================

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  rollNumber: String,
  department: String,
  year: String,
});

const Student = mongoose.model("Student", studentSchema);

// ===============================
// Attendance Schema
// ===============================

const attendanceSchema = new mongoose.Schema({
  studentName: String,
  rollNumber: String,
  status: String,
  date: String,
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

// ===============================
// Home API
// ===============================

app.get("/", (req, res) => {
  res.send("Smart Campus Backend is Running");
});

// ===============================
// Students API
// ===============================

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json(students);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ===============================
// Get Attendance
// ===============================

app.get("/api/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ===============================
// Add Attendance
// ===============================

app.post("/api/attendance", async (req, res) => {
  try {
    const attendance = new Attendance({
      studentName: req.body.studentName,
      rollNumber: req.body.rollNumber,
      status: req.body.status,
      date: req.body.date,
    });

    const savedAttendance = await attendance.save();

    res.status(201).json(savedAttendance);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// ===============================
// Start Server
// ===============================

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});