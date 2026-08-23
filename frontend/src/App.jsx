import { useState } from "react";
function App() {
  const [campus, setCampus] = useState(null);
  const getCampus = async () => {
  const response = await fetch("http://localhost:5000/api/campus");
  const data = await response.json();
  setCampus(data);
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
    </div>
  );
}

export default App;