import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [student, setStudent] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    year: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [attendanceForm, setAttendanceForm] = useState({
    studentId: "",
    status: "Present",
  });

  // =========================
  // FETCH STUDENTS
  // =========================

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/students"
      );

      const data = await response.json();

      console.log("Students:", data);

      if (response.ok && Array.isArray(data)) {
        setStudents(data);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.log("Student fetch error:", error);
      setStudents([]);
    }
  };

  // =========================
  // FETCH ATTENDANCE
  // =========================

  const fetchAttendance = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/attendance"
      );

      const data = await response.json();

      console.log("Attendance:", data);

      if (response.ok && Array.isArray(data)) {
        setAttendance(data);
      } else {
        setAttendance([]);
      }
    } catch (error) {
      console.log("Attendance fetch error:", error);
      setAttendance([]);
    }
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, []);

  // =========================
  // STUDENT INPUT
  // =========================

  const handleStudentChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ADD / UPDATE STUDENT
  // =========================

  const handleStudentSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingId
        ? `http://localhost:5000/api/students/${editingId}`
        : "http://localhost:5000/api/students";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(student),
      });

      const data = await response.json();

      console.log("Student response:", data);

      if (!response.ok) {
        alert(data.error || "Failed to save student");
        return;
      }

      alert(
        editingId
          ? "Student updated successfully"
          : "Student added successfully"
      );

      setStudent({
        name: "",
        email: "",
        rollNumber: "",
        department: "",
        year: "",
      });

      setEditingId(null);

      fetchStudents();
    } catch (error) {
      console.log("Student submit error:", error);
      alert("Backend error");
    }
  };

  // =========================
  // EDIT STUDENT
  // =========================

  const editStudent = (item) => {
    setStudent({
      name: item.name,
      email: item.email,
      rollNumber: item.rollNumber,
      department: item.department,
      year: item.year,
    });

    setEditingId(item._id);
  };

  // =========================
  // DELETE STUDENT
  // =========================

  const deleteStudent = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      console.log(data);

      fetchStudents();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // =========================
  // VIEW STUDENT
  // =========================

  const viewStudent = (item) => {
    setSelectedStudent(item);
  };

  // =========================
  // ATTENDANCE INPUT
  // =========================

  const handleAttendanceChange = (e) => {
    setAttendanceForm({
      ...attendanceForm,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // ADD ATTENDANCE
  // =========================

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();

    if (!attendanceForm.studentId) {
      alert("Please select a student");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/attendance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendanceForm),
        }
      );

      const data = await response.json();

      console.log("Attendance response:", data);

      if (!response.ok) {
        alert(data.error || "Failed to add attendance");
        return;
      }

      alert("Attendance added successfully");

      setAttendanceForm({
        studentId: "",
        status: "Present",
      });

      fetchAttendance();
    } catch (error) {
      console.log("Attendance error:", error);
    }
  };

  // =========================
  // DASHBOARD
  // =========================

  const totalStudents = students.length;

  const totalAttendance = attendance.length;

  const presentCount = attendance.filter(
    (item) => item.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "Absent"
  ).length;

  // =========================
  // UI
  // =========================

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Smart Campus Management System</h1>

      {/* DASHBOARD */}

      <h2>Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div>
          <h3>Total Students</h3>
          <h2>{totalStudents}</h2>
        </div>

        <div>
          <h3>Total Attendance</h3>
          <h2>{totalAttendance}</h2>
        </div>

        <div>
          <h3>Present</h3>
          <h2>{presentCount}</h2>
        </div>

        <div>
          <h3>Absent</h3>
          <h2>{absentCount}</h2>
        </div>
      </div>

      {/* ADD STUDENT */}

      <h2>
        {editingId ? "Edit Student" : "Add Student"}
      </h2>

      <form onSubmit={handleStudentSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={student.name}
          onChange={handleStudentChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleStudentChange}
          required
        />

        <input
          type="text"
          name="rollNumber"
          placeholder="Roll Number"
          value={student.rollNumber}
          onChange={handleStudentChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={student.department}
          onChange={handleStudentChange}
          required
        />

        <input
          type="text"
          name="year"
          placeholder="Year"
          value={student.year}
          onChange={handleStudentChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Student" : "Add Student"}
        </button>
      </form>

      {/* STUDENTS */}

      <h2>Students</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roll Number</th>
              <th>Department</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.rollNumber}</td>
                <td>{item.department}</td>
                <td>{item.year}</td>

                <td>
                  <button onClick={() => viewStudent(item)}>
                    View
                  </button>

                  <button onClick={() => editStudent(item)}>
                    Edit
                  </button>

                  <button
                    onClick={() => deleteStudent(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* STUDENT DETAILS */}

      {selectedStudent && (
        <div>
          <h2>Student Details</h2>

          <p>Name: {selectedStudent.name}</p>
          <p>Email: {selectedStudent.email}</p>
          <p>Roll Number: {selectedStudent.rollNumber}</p>
          <p>Department: {selectedStudent.department}</p>
          <p>Year: {selectedStudent.year}</p>

          <button
            onClick={() => setSelectedStudent(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* ATTENDANCE */}

      <h2>Attendance</h2>

      <form onSubmit={handleAttendanceSubmit}>
        <select
          name="studentId"
          value={attendanceForm.studentId}
          onChange={handleAttendanceChange}
          required
        >
          <option value="">
            Select Student
          </option>

          {students.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item.name} - {item.rollNumber}
            </option>
          ))}
        </select>

        <select
          name="status"
          value={attendanceForm.status}
          onChange={handleAttendanceChange}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>

        <button type="submit">
          Add Attendance
        </button>
      </form>

      {/* ATTENDANCE RECORDS */}

      <h2>Attendance Records</h2>

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
            {attendance.map((record) => {
              const date = record.date
                ? new Date(record.date)
                : null;

              const validDate =
                date && !isNaN(date.getTime());

              return (
                <tr key={record._id}>
                  <td>
                    {record.studentName || "Unknown"}
                  </td>

                  <td>
                    {record.rollNumber || "-"}
                  </td>

                  <td>{record.status}</td>

                  <td>
                    {validDate
                      ? date.toLocaleDateString()
                      : "No Date"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

