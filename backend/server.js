const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Student = require("./models/student");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/smartCampus")
  .then(() => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.log("Database Connection Error:", error);
  });

// Campus API
app.get("/api/campus", (req, res) => {
  res.json({
    college: "Smart Campus College",
    students: 500,
    faculty: 50,
    departments: 8,
  });
});

// Home API
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Smart Campus Management",
    status: "success",
  });
});

// Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Add student
app.post("/api/students", async (req, res) => {
  try {
    const { name, email, rollNumber, department, year } = req.body;

    if (!name || !email || !rollNumber || !department || !year) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const student = new Student({
      name,
      email,
      rollNumber,
      department,
      year,
    });

    const savedStudent = await student.save();

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      student: savedStudent,
    });
  } catch (error) {
    console.error("POST STUDENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
app.delete("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
