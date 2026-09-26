import { useEffect, useState } from "react";

function App() {
  const [attendance, setAttendance] = useState([]);

  // Get attendance
  const getAttendance = () => {
    fetch("http://localhost:5000/api/attendance")
      .then((response) => response.json())
      .then((data) => {
        setAttendance(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  useEffect(() => {
    getAttendance();
  }, []);

  // Add attendance
  const addAttendance = () => {
    fetch("http://localhost:5000/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentName: "Thor",
        rollNumber: "56",
        status: "Present",
        date: "9/26/2026",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Attendance added:", data);

        // Get updated attendance
        getAttendance();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div>
      <h1>Smart Campus Management System</h1>

      <h2>Attendance Records</h2>

      <button onClick={addAttendance}>
        Add Attendance
      </button>

      <br />
      <br />

      {attendance.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll Number</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((record) => (
              <tr key={record._id}>
                <td>{record.studentName}</td>
                <td>{record.rollNumber}</td>
                <td>{record.status}</td>
                <td>{record.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;