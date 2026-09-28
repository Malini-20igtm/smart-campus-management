import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import Student from "./models/Student.js";
import Attendance from "./models/Attendance.js";

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


// ==============================
// MongoDB
// ==============================

mongoose
  .connect("mongodb://127.0.0.1:27017/smartCampus")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB Error:", error);
  });


// ==============================
// HOME
// ==============================

app.get("/", (req, res) => {
  res.send("Smart Campus Backend Running");
});


// ==============================
// STUDENTS - GET
// ==============================

app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    console.log("Students:", students);

    res.status(200).json(students);

  } catch (error) {

    console.log("GET STUDENTS ERROR:");
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});


// ==============================
// STUDENTS - POST
// ==============================

app.post("/api/students", async (req, res) => {
  try {
    console.log("Student data received:", req.body);

    const newStudent = new Student({
      name: req.body.name,
      email: req.body.email,
      rollNumber: req.body.rollNumber,
      department: req.body.department,
      year: req.body.year,
    });

    const savedStudent = await newStudent.save();

    console.log("Student saved:", savedStudent);

    res.status(201).json(savedStudent);

  } catch (error) {
    console.log("ADD STUDENT ERROR:");
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});


// ==============================
// STUDENTS - UPDATE
// ==============================

app.put("/api/students/:id", async (req, res) => {
  try {

    const updatedStudent =
      await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.status(200).json(updatedStudent);

  } catch (error) {

    console.log("UPDATE STUDENT ERROR:");
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});


// ==============================
// STUDENTS - DELETE
// ==============================

app.delete("/api/students/:id", async (req, res) => {
  try {

    await Student.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Student deleted successfully",
    });

  } catch (error) {

    console.log("DELETE STUDENT ERROR:");
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});


// ==============================
// ATTENDANCE - GET
// ==============================

app.get("/api/attendance", async (req, res) => {
  try {

    const attendance =
      await Attendance.find();

    console.log(
      "Attendance:",
      attendance
    );

    res.status(200).json(attendance);

  } catch (error) {

    console.log("GET ATTENDANCE ERROR:");
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});


// ==============================
// ATTENDANCE - POST
// ==============================

app.post("/api/attendance", async (req, res) => {
  try {

    const {
      studentId,
      status,
    } = req.body;

    const student =
      await Student.findById(
        studentId
      );

    if (!student) {

      return res.status(404).json({
        error: "Student not found",
      });

    }

    const newAttendance =
      new Attendance({
        studentId: student._id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        status: status,
        date: new Date(),
      });

    const savedAttendance =
      await newAttendance.save();

    res.status(201).json(
      savedAttendance
    );

  } catch (error) {

    console.log("ADD ATTENDANCE ERROR:");
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});


// ==============================
// SERVER
// ==============================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});