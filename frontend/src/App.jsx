import { useEffect, useState } from 'react'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.log(error))
  }, [])

  return (
    <div>
      <h1>Smart Campus Management</h1>
      <p>{message}</p>
    </div>
  )
}

export default App