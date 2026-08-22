import { useState } from "react";
function App() {
  const [message, setMessage] = useState("");
  const getMessage = async () => {
    const response = await fetch("http://localhost:5000/");
    const data = await response.json();
    setMessage(data.message);

  };

  return (
    <div>
      <h1>Smart Campus Management</h1>

      <button onClick={getMessage}>
        Connect to Backend
      </button>
      <p>{message}</p>
    </div>
  );
}

export default App;