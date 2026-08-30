
import { useState } from "react";
import "./App.css";

function App() {
  const [campus, setCampus] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const getCampus = async () => {
    const response = await fetch("http://localhost:5000/api/campus");
    const data = await response.json();
    setCampus(data);
  };

  const student = {
    name: "Malini",
    studentId: "ST101",
    department: "CSE",
    attendance: "85%",
    status: "Active"
  };

  return (
    <div className="container">
      <h1>Smart Campus Management</h1>

      <button onClick={getCampus}>
        Get Campus Data
      </button>

      {campus && (
        <div className="card">
          <h2>Campus Data</h2>
          <p>College: {campus.college}</p>
          <p>Students: {campus.students}</p>
          <p>Faculty: {campus.faculty}</p>
          <p>Departments: {campus.departments}</p>
        </div>
      )}

      <hr />

      <div className="card">
        <h2>Student Details</h2>

        <p>Name: {student.name}</p>
        <p>Student ID: {student.studentId}</p>
        <p>Department: {student.department}</p>
        <p>Attendance: {student.attendance}</p>
        <p>Status: {student.status}</p>

        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {showDetails && (
        <div className="card">
          <h2>Subjects</h2>

          <ul>
            <li>Python - Completed</li>
            <li>Java - In Progress</li>
            <li>Database Management - Completed</li>
            <li>Web Development - In Progress</li>
          </ul>

          <h2>Assignments</h2>

          <p>Python Assignment: Submitted</p>
          <p>Java Assignment: Pending</p>
          <p>Web Development Assignment: Submitted</p>
        </div>
      )}
    </div>
  );
}

export default App;
