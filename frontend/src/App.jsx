import { useEffect, useState } from "react";

function App() {
  const [attendance, setAttendance] = useState([]);

  const [studentName, setStudentName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [status, setStatus] = useState("Present");

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
    // Validation
    if (studentName === "" || rollNumber === "") {
      alert("Please enter Student Name and Roll Number");
      return;
    }

    fetch("http://localhost:5000/api/attendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentName: studentName,
        rollNumber: rollNumber,
        status: status,
        date: new Date().toLocaleDateString(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Attendance added:", data);

        // Clear form
        setStudentName("");
        setRollNumber("");
        setStatus("Present");

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

      {/* Student Name */}
      <input
        type="text"
        placeholder="Student Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />

      <br />
      <br />

      {/* Roll Number */}
      <input
        type="text"
        placeholder="Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
      />

      <br />
      <br />

      {/* Status */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
      </select>

      <br />
      <br />

      {/* Add Attendance Button */}
      <button onClick={addAttendance}>
        Add Attendance
      </button>

      <br />
      <br />

      {/* Attendance Table */}
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