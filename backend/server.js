import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import Student from "./models/Student.js";
import Attendance from "./models/Attendance.js";

dotenv.config();

const app = express();
const PORT = 5000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// ===============================
// MONGODB URL
// ===============================

const MONGO_URL =
  process.env.MONGO || "mongodb://127.0.0.1:27017/contactDB";

// ===============================
// CONNECT MONGODB
// ===============================

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error);
  });

// ===============================
// HOME API
// ===============================

app.get("/", (req, res) => {
  res.send("Smart Campus Backend is Running");
});

// ===============================
// CAMPUS API
// ===============================

app.get("/api/campus", (req, res) => {
  res.json({
    success: true,
    college: "Smart Campus College",
    students: 500,
    faculty: 50,
    departments: 8,
  });
});

// ===============================
// STUDENT APIs
// ===============================

// GET ALL STUDENTS

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// ===============================
// ADD STUDENT
// ===============================

app.post("/api/students", async (req, res) => {
  try {
    const { name, email, rollNumber, department, year } = req.body;

    if (!name || !email || !rollNumber || !department || !year) {
      return res.status(400).json({
        success: false,
        error: "All fields are required.",
      });
    }

    const student = new Student({
      name,
      email,
      rollNumber,
      department,
      year,
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      student,
    });
  } catch (error) {
    console.error("Error adding student:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// ===============================
// UPDATE STUDENT
// ===============================

app.put("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, rollNumber, department, year } = req.body;

    const student = await Student.findByIdAndUpdate(
      id,
      {
        name,
        email,
        rollNumber,
        department,
        year,
      },
      {
        new: true,
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student updated successfully",
      student,
    });
  } catch (error) {
    console.error("Error updating student:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// ===============================
// DELETE STUDENT
// ===============================

app.delete("/api/students/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// ===============================
// DAY 16 - ATTENDANCE APIs
// ===============================

// MARK ATTENDANCE

app.post("/api/attendance", async (req, res) => {
  try {
    const { studentId, status } = req.body;

    if (!studentId || !status) {
      return res.status(400).json({
        success: false,
        error: "Student and attendance status are required.",
      });
    }

    const attendance = new Attendance({
      studentId,
      status,
    });

    await attendance.save();

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// ===============================
// GET ALL ATTENDANCE
// ===============================

app.get("/api/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("studentId")
      .sort({ date: -1 });

    res.json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// ===============================
// DAY 17
// GET ATTENDANCE FOR A SPECIFIC STUDENT
// ===============================

app.get("/api/attendance/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const attendance = await Attendance.find({ studentId })
      .populate("studentId")
      .sort({ date: -1 });

    res.json({
      success: true,
      attendance,
    });
  } catch (error) {
    console.error("Error fetching student attendance:", error);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});