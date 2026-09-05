
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    rollNumber: "",
    department: "",
    year: "",
  });

  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Selected student for View Details
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Get students from backend
  const getStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students");
      const data = await response.json();

      console.log("Students:", data);

      if (data.success) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  // Load students when page opens
  useEffect(() => {
    getStudents();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // Add or Update student
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (editingId) {
        // Update student
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
        // Add student
        response = await fetch("http://localhost:5000/api/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student),
        });
      }

      const data = await response.json();

      console.log("Backend Response:", data);

      if (data.success) {
        alert(
          editingId
            ? "Student updated successfully!"
            : "Student added successfully!"
        );

        // Clear form
        setStudent({
          name: "",
          email: "",
          rollNumber: "",
          department: "",
          year: "",
        });

        // Exit edit mode
        setEditingId(null);

        // Refresh students
        getStudents();
      } else {
        alert(data.error || data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error");
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setStudent({
      name: student.name,
      email: student.email,
      rollNumber: student.rollNumber,
      department: student.department,
      year: student.year,
    });

    setEditingId(student._id);
  };

  // Delete student
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      console.log("Delete Response:", data);

      if (data.success) {
        alert("Student deleted successfully!");

        // Refresh students
        getStudents();
      } else {
        alert(data.error || "Failed to delete student");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server error");
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setStudent({
      name: "",
      email: "",
      rollNumber: "",
      department: "",
      year: "",
    });

    setEditingId(null);
  };

  // View student details
  const handleView = (student) => {
    console.log("Selected student:", student);
    setSelectedStudent(student);
  };

  // Close student details
  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="container">
      <h1>Smart Campus Management</h1>

      <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={student.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="rollNumber"
          placeholder="Roll Number"
          value={student.rollNumber}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={student.department}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="year"
          placeholder="Year"
          value={student.year}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Student" : "Add Student"}
        </button>

        {editingId && (
          <button type="button" onClick={handleCancel}>
            Cancel
          </button>
        )}
      </form>

      <h2>Student List</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div>
          {students.map((s) => (
            <div className="student-card" key={s._id}>
              <p>
                <strong>Name:</strong> {s.name}
              </p>

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

              <button onClick={() => handleView(s)}>
                View Details
              </button>

              <button onClick={() => handleEdit(s)}>
                Edit
              </button>

              <button onClick={() => handleDelete(s._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* View Student Details */}
      {selectedStudent && (
        <div className="student-details">
          <h2>Student Details</h2>

          <p>
            <strong>Name:</strong> {selectedStudent.name}
          </p>

          <p>
            <strong>Email:</strong> {selectedStudent.email}
          </p>

          <p>
            <strong>Roll Number:</strong> {selectedStudent.rollNumber}
          </p>

          <p>
            <strong>Department:</strong> {selectedStudent.department}
          </p>

          <p>
            <strong>Year:</strong> {selectedStudent.year}
          </p>

          <button onClick={handleCloseDetails}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default App;