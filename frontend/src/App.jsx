import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // ==============================
  // STUDENT STATE
  // ==============================

  const [student, setStudent] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    year: "",
  });

  const [students, setStudents] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [search, setSearch] = useState("");

  // ==============================
  // ATTENDANCE STATE
  // ==============================

  const [attendanceStudent, setAttendanceStudent] = useState("");

  const [attendanceStatus, setAttendanceStatus] = useState("Present");

  const [attendanceList, setAttendanceList] = useState([]);

  // ==============================
  // GET STUDENTS
  // ==============================

  const getStudents = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/students"
      );

      const data = await response.json();

      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // ==============================
  // GET ATTENDANCE
  // ==============================

  const getAttendance = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/attendance"
      );

      const data = await response.json();

      if (data.success) {
        setAttendanceList(data.attendance);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  // ==============================
  // LOAD DATA
  // ==============================

  useEffect(() => {
    getStudents();
    getAttendance();
  }, []);

  // ==============================
  // HANDLE INPUT
  // ==============================

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // ADD / UPDATE STUDENT
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingId) {
        response = await fetch(
          `http://localhost:5000/api/students/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(student),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:5000/api/students",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(student),
          }
        );
      }

      const data = await response.json();

      if (data.success) {
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

        getStudents();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  // ==============================
  // EDIT STUDENT
  // ==============================

  const editStudent = (studentData) => {
    setStudent({
      name: studentData.name,
      email: studentData.email,
      rollNumber: studentData.rollNumber,
      department: studentData.department,
      year: studentData.year,
    });

    setEditingId(studentData._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==============================
  // DELETE STUDENT
  // ==============================

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Student deleted successfully");

        getStudents();

        if (selectedStudent?._id === id) {
          setSelectedStudent(null);
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // ==============================
  // VIEW DETAILS
  // ==============================

  const viewDetails = (studentData) => {
    setSelectedStudent(studentData);
  };

  // ==============================
  // CLOSE DETAILS
  // ==============================

  const closeDetails = () => {
    setSelectedStudent(null);
  };

  // ==============================
  // MARK ATTENDANCE
  // ==============================

  const markAttendance = async (e) => {
    e.preventDefault();

    if (!attendanceStudent) {
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
          body: JSON.stringify({
            studentId: attendanceStudent,
            status: attendanceStatus,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Attendance marked successfully");

        setAttendanceStudent("");
        setAttendanceStatus("Present");

        getAttendance();
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  // ==============================
  // SEARCH STUDENTS
  // ==============================

  const filteredStudents = students.filter((s) => {
    const searchText = search.toLowerCase();

    return (
      s.name?.toLowerCase().includes(searchText) ||
      s.email?.toLowerCase().includes(searchText) ||
      s.rollNumber?.toString().toLowerCase().includes(searchText) ||
      s.department?.toLowerCase().includes(searchText)
    );
  });

  // ==============================
  // UI
  // ==============================

  return (
    <div className="container">

      <h1>Smart Campus Management</h1>

      {/* ==============================
          ADD / EDIT STUDENT
      ============================== */}

      <div className="card">

        <h2>
          {editingId ? "Edit Student" : "Add Student"}
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={student.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={student.email}
            onChange={handleChange}
          />

          <input
            type="text"
            name="rollNumber"
            placeholder="Roll Number"
            value={student.rollNumber}
            onChange={handleChange}
          />

          <input
            type="text"
            name="department"
            placeholder="Department"
            value={student.department}
            onChange={handleChange}
          />

          <input
            type="text"
            name="year"
            placeholder="Year"
            value={student.year}
            onChange={handleChange}
          />

          <button type="submit">
            {editingId ? "Update Student" : "Add Student"}
          </button>

        </form>
      </div>

      {/* ==============================
          STUDENT SEARCH & LIST
      ============================== */}

      <div className="card">

        <h2>Students</h2>

        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredStudents.length === 0 ? (
          <p>No students found.</p>
        ) : (
          filteredStudents.map((s) => (
            <div className="student-card" key={s._id}>

              <h3>{s.name}</h3>

              <p>
                <strong>Email:</strong> {s.email}
              </p>

              <p>
                <strong>Roll Number:</strong> {s.rollNumber}
              </p>

              <p>
                <strong>Department:</strong> {s.department}
              </p>

              <p>
                <strong>Year:</strong> {s.year}
              </p>

              <button onClick={() => viewDetails(s)}>
                View Details
              </button>

              <button onClick={() => editStudent(s)}>
                Edit
              </button>

              <button onClick={() => deleteStudent(s._id)}>
                Delete
              </button>

            </div>
          ))
        )}

      </div>

      {/* ==============================
          STUDENT DETAILS
      ============================== */}

      {selectedStudent && (
        <div className="card">

          <h2>Student Details</h2>

          <p>
            <strong>Name:</strong>{" "}
            {selectedStudent.name}
          </p>

          <p>
            <strong>Email:</strong>{" "}
            {selectedStudent.email}
          </p>

          <p>
            <strong>Roll Number:</strong>{" "}
            {selectedStudent.rollNumber}
          </p>

          <p>
            <strong>Department:</strong>{" "}
            {selectedStudent.department}
          </p>

          <p>
            <strong>Year:</strong>{" "}
            {selectedStudent.year}
          </p>

          <button onClick={closeDetails}>
            Close
          </button>

        </div>
      )}

      {/* ==============================
          DAY 16 - MARK ATTENDANCE
      ============================== */}

      <div className="card">

        <h2>Mark Attendance</h2>

        <form onSubmit={markAttendance}>

          <select
            value={attendanceStudent}
            onChange={(e) =>
              setAttendanceStudent(e.target.value)
            }
          >

            <option value="">
              Select Student
            </option>

            {students.map((s) => (
              <option
                key={s._id}
                value={s._id}
              >
                {s.name} - {s.rollNumber}
              </option>
            ))}

          </select>

          <select
            value={attendanceStatus}
            onChange={(e) =>
              setAttendanceStatus(e.target.value)
            }
          >

            <option value="Present">
              Present
            </option>

            <option value="Absent">
              Absent
            </option>

          </select>

          <button type="submit">
            Mark Attendance
          </button>

        </form>

      </div>

      {/* ==============================
          ATTENDANCE RECORDS
      ============================== */}

      <div className="card">

        <h2>Attendance Records</h2>

        {attendanceList.length === 0 ? (
          <p>No attendance records found.</p>
        ) : (
          attendanceList.map((record) => (
            <div
              className="student-card"
              key={record._id}
            >

              <h3>
                {record.studentId?.name ||
                  "Unknown Student"}
              </h3>

              <p>
                <strong>Roll Number:</strong>{" "}
                {record.studentId?.rollNumber ||
                  "N/A"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {record.status}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(
                  record.date
                ).toLocaleDateString()}
              </p>

            </div>
          ))
        )}

      </div>

    </div>
  );
}

export default App;