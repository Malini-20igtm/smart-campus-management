import { useState } from "react";

function App() {
  const [campus, setCampus] = useState(null);

  const getCampus = async () => {
    const response = await fetch("http://localhost:5000/api/campus");
    const data = await response.json();
    setCampus(data);
  };

  const student = {
    name: "Malini",
    studentId: "ST101",
    department: "CSE",
    attendance: "85%"
  };

  return (
    <div>
      <h1>Smart Campus Management</h1>

      <button onClick={getCampus}>
        Get Campus Data
      </button>

      {campus && (
        <div>
          <p>College: {campus.college}</p>
          <p>Students: {campus.students}</p>
          <p>Faculty: {campus.faculty}</p>
          <p>Departments: {campus.departments}</p>
        </div>
      )}

      <hr />

      <h2>Student Details</h2>

      <p>Name: {student.name}</p>
      <p>Student ID: {student.studentId}</p>
      <p>Department: {student.department}</p>
      <p>Attendance: {student.attendance}</p>
    </div>
  );
}

export default App;