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

  // Store the ID of the student being edited
  const [editId, setEditId] = useState(null);

  // Get students from backend
  const getStudents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/students");
      const data = await response.json();

      console.log("Students:", data);

      setStudents(data.students);
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

  // Add student
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Student Data:", student);

    try {
      const response = await fetch(
        "http://localhost:5000/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student),
        }
      );

      const data = await response.json();

      console.log("Backend Response:", data);

      if (data.success) {
        alert("Student added successfully!");

        // Clear form
        setStudent({
          name: "",
          email: "",
          rollNumber: "",
          department: "",
          year: "",
        });

        // Refresh student list
        getStudents();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Delete student
  const deleteStudent = async (id) => {
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

        // Remove student from screen
        setStudents(
          students.filter((student) => student._id !== id)
        );
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  // Edit student
  const editStudent = (item) => {
    setStudent({
      name: item.name,
      email: item.email,
      rollNumber: item.rollNumber,
      department: item.department,
      year: item.year,
    });

    setEditId(item._id);
  };

  // Update student
  const updateStudent = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${editId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(student),
        }
      );

      const data = await response.json();

      console.log("Update Response:", data);

      if (data.success) {
        alert("Student updated successfully!");

        // Clear form
        setStudent({
          name: "",
          email: "",
          rollNumber: "",
          department: "",
          year: "",
        });

        // Exit edit mode
        setEditId(null);

        // Refresh student list
        getStudents();
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  return (
    <div className="container">
      <h1>Smart Campus Management</h1>

      {/* Add / Update Student */}
      <h2>{editId ? "Edit Student" : "Add Student"}</h2>

      <form onSubmit={editId ? updateStudent : handleSubmit}>
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
          {editId ? "Update Student" : "Add Student"}
        </button>

        {/* Cancel Edit */}
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setStudent({
                name: "",
                email: "",
                rollNumber: "",
                department: "",
                year: "",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Student List */}
      <h2>Student List</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <div className="student-list">
          {students.map((item) => (
            <div className="student-card" key={item._id}>
              <h3>{item.name}</h3>

              <p>
                <strong>Email:</strong> {item.email}
              </p>

              <p>
                <strong>Roll Number:</strong> {item.rollNumber}
              </p>

              <p>
                <strong>Department:</strong> {item.department}
              </p>

              <p>
                <strong>Year:</strong> {item.year}
              </p>

              {/* Edit Button */}
              <button onClick={() => editStudent(item)}>
                Edit
              </button>

              {/* Delete Button */}
              <button onClick={() => deleteStudent(item._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;